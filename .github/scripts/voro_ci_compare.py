#!/usr/bin/env python3
"""Compare the same Node verification inventory on main and a disposable PR merge.

A failed verification process is NOT an exact number of bugs. Diagnostics are
best-effort observations; hidden errors behind the first failed assertion cannot
be counted. Fail closed when evidence is missing, unstable or impacted/ambiguous.
"""
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import time

WORK = Path(os.environ["RUNNER_TEMP"]) / "voro"
BASE = WORK / "base"
CANDIDATE = WORK / "candidate"
LOGS = WORK / "logs"
LOGS.mkdir(parents=True, exist_ok=True)
DEADLINE = time.monotonic() + 26 * 60
EXTS = (".js", ".cjs", ".mjs")
ANSI = re.compile(r"\x1b\[[0-9;]*m")
ERROR = re.compile(
    r"^(?:[A-Za-z_$]*Error(?:\s*\[[^]]+\])?|AssertionError|FAIL(?:ED)?|not ok)\s*[:\- ]",
    flags=re.I,
)


def log_file(stage, name):
    """Convert a logical check ID to a flat, collision-resistant file path."""
    safe = re.sub(r"[^A-Za-z0-9_-]+", "_", name)[:90] or "check"
    digest = hashlib.sha256(name.encode("utf-8")).hexdigest()[:12]
    return LOGS / f"{stage}-{safe}-{digest}.log"


def classify(before, after, impacted=False):
    """Return (decision, reason), not an estimated software defect count."""
    bs, cs = before["status"], after["status"]
    if bs == "missing":
        return ("pass", "new check passes") if cs == "pass" else (
            "regression", "new check does not pass")
    if cs == "missing":
        return "regression", "existing check removed"
    if bs == "pass" and cs != "pass":
        return "regression", "previously passing check now fails"
    if bs == "fail" and cs == "pass":
        return "improvement", "previously failing check now passes"
    if bs == "fail" and cs == "fail":
        old = set(before["diagnostics"])
        new = set(after["diagnostics"])
        if not new.issubset(old):
            return "regression", "new or changed diagnostic"
        if impacted:
            return "review", "affected check still fails; later assertions may be hidden"
        if new < old:
            return "improvement", "fewer observed diagnostic messages"
    return "pass", "no detected regression"


def run(stage, name, args, timeout=35):
    if time.monotonic() >= DEADLINE:
        raise RuntimeError("CI comparison exceeded its time budget")
    folder = BASE if stage == "base" else CANDIDATE
    seconds = min(timeout, max(1, int(DEADLINE - time.monotonic())))
    try:
        result = subprocess.run(
            args, cwd=folder / "webs", capture_output=True,
            text=True, errors="replace", timeout=seconds,
            env={**os.environ, "CI": "true", "FORCE_COLOR": "0"},
        )
        code = result.returncode
        output = result.stdout + "\n" + result.stderr
    except subprocess.TimeoutExpired:
        code, output = 124, "TIMEOUT"
    except OSError as exc:
        raise RuntimeError(f"{name} cannot be started: {exc}") from exc

    # Logical check IDs may contain slashes; never use them as log paths.
    log_file(stage, name).write_text(output[:1_000_000], encoding="utf-8")
    if code == 124:
        raise RuntimeError(f"{stage}: {name} timed out; no automatic merge allowed")
    return code, output


def fingerprints(output, directory):
    # Count distinct observed diagnostic messages, not estimated software bugs.
    output = ANSI.sub("", output).replace(str(directory), "<checkout>")
    observed = set()
    for line in output.splitlines():
        line = line.strip()
        if line.startswith(("❌", "✕ FAIL:", "✗ FAIL:", "× FAIL:")) or ERROR.match(line):
            # Ignore changing summary totals; compare individual diagnostics.
            if not re.match(r"^❌\s*(?:VERIFICATION FAILED|SOME CHECKS FAILED)", line, re.I):
                observed.add(re.sub(r"\s+", " ", line)[:500])
    if observed:
        return sorted(observed)
    # Unknown failure output: conservative exact-content fingerprint.
    cleaned = [line.strip() for line in output.splitlines()
               if line.strip() and not line.lstrip().startswith("at ")]
    payload = "\n".join(cleaned[-40:])
    return ["UNCLASSIFIED:" + hashlib.sha256(payload.encode()).hexdigest()]


def inventory():
    scripts = set()
    for stage in (BASE, CANDIDATE):
        scripts.update(p.name for p in (stage / "webs").glob("verify_*")
                       if p.is_file() and p.suffix in EXTS
                       and not p.name.endswith(".bundled.js"))
    if not scripts or len(scripts) > 400:
        raise RuntimeError("Verification inventory unexpectedly missing or too large")
    return sorted(scripts)


def changed_source_paths():
    names = subprocess.check_output(
        ["git", "diff", "--cached", "--name-only"], cwd=CANDIDATE, text=True
    ).splitlines()
    return [p for p in names if p.startswith("webs/src/") and
            p.endswith((".js", ".jsx", ".mjs", ".cjs"))]


def directly_covers(test_name, changed):
    test = BASE / "webs" / test_name
    if not test.is_file():
        return False
    source = test.read_text(encoding="utf-8", errors="replace")
    return any(p.removeprefix("webs/") in source or Path(p).name in source
               for p in changed)


def evaluate(stage, scripts, changed):
    root = BASE if stage == "base" else CANDIDATE
    install_code, _ = run(stage, "install", ["npm", "ci", "--no-audit", "--no-fund"], 180)
    if install_code != 0:
        raise RuntimeError(f"{stage}: dependency installation failed (infrastructure failure)")
    # Parse every changed JS/JSX module independently, even if Vite already
    # fails in a completely different module.
    parser = (
        "import fs from 'node:fs'; "
        "import { transform } from 'esbuild'; "
        "const p=process.argv[1]; "
        "await transform(fs.readFileSync(p,'utf8'), "
        "{loader:p.endsWith('.jsx')?'jsx':'js',sourcefile:p});"
    )
    tasks = [("build", ["npm", "run", "build"])] + [
        (name, ["node", name]) for name in scripts
    ] + [
        ("parse:" + name, ["node", "--input-type=module", "-e", parser,
                            name.removeprefix("webs/")])
        for name in changed
    ]
    findings = {}
    for name, command in tasks:
        target = (name.removeprefix("parse:") if name.startswith("parse:")
                  else "webs/" + name)
        if name != "build" and not (root / target).is_file():
            findings[name] = {"status": "missing", "diagnostics": []}
            continue
        code, output = run(stage, name, command, 180 if name == "build" else 35)
        findings[name] = {
            "status": "pass" if code == 0 else "fail",
            "diagnostics": [] if code == 0 else fingerprints(output, root),
        }
        print(f"{stage}: {name}: {'OK' if code == 0 else 'FAIL'}", flush=True)
    return findings


def main():
    scripts = inventory()
    changed = changed_source_paths()
    print(f"Running build plus {len(scripts)} Node verification scripts on EACH snapshot.")
    print(f"Source files modified: {len(changed)}", flush=True)
    base = evaluate("base", scripts, changed)
    candidate = evaluate("candidate", scripts, changed)

    # If an old test was modified, rerun the ORIGINAL trusted test against
    # the new code. This prevents a PR from gaining approval merely by
    # weakening or deleting checks in its own test implementation.
    changed_tests = [
        name for name in scripts
        if (BASE / "webs" / name).is_file()
        and (CANDIDATE / "webs" / name).is_file()
        and (BASE / "webs" / name).read_bytes() !=
            (CANDIDATE / "webs" / name).read_bytes()
    ]
    legacy = {}
    for name in changed_tests:
        old = (BASE / "webs" / name).read_bytes()
        target = CANDIDATE / "webs" / name
        current = target.read_bytes()
        try:
            target.write_bytes(old)
            code, output = run("candidate", "legacy-" + name, ["node", name])
            legacy[name] = {
                "status": "pass" if code == 0 else "fail",
                "diagnostics": [] if code == 0 else fingerprints(output, CANDIDATE),
            }
        finally:
            target.write_bytes(current)

    regressions, improvements, ambiguous = [], [], []
    checks = ["build", *scripts, *("parse:" + path for path in changed)]
    for name in checks:
        impacted = name.startswith("parse:") or (
            name != "build" and directly_covers(name, changed))
        decision, reason = classify(base[name], candidate[name], impacted)
        if decision == "regression":
            regressions.append(f"{name}: {reason}")
        elif decision == "review":
            ambiguous.append(f"{name}: {reason}")
        elif decision == "improvement":
            improvements.append(f"{name}: {reason}")

    for name in changed_tests:
        old, before, after = base[name], legacy[name], candidate[name]
        if after["status"] != "pass":
            ambiguous.append(name + ": modified test does not pass in the PR")
        if old["status"] == "pass" and before["status"] != "pass":
            regressions.append(name + ": original trusted test now fails")
        if old["status"] == "fail" and before["status"] == "fail":
            if not set(before["diagnostics"]).issubset(set(old["diagnostics"])):
                regressions.append(name + ": original trusted test gained a new failure")
            elif directly_covers(name, changed):
                ambiguous.append(name + ": original trusted test still fails on changed source")

    def count_failures(items):
        return sum(1 for x in items.values() if x["status"] == "fail")

    before_count = count_failures(base)
    after_count = count_failures(candidate)
    before_diag = sum(len(x["diagnostics"]) for x in base.values())
    after_diag = sum(len(x["diagnostics"]) for x in candidate.values())
    summary = {
        "scripts_executed_per_snapshot": len(scripts),
        "existing_test_scripts_rechecked_unchanged": len(changed_tests),
        "checks_including_build_and_syntax": len(checks),
        "failed_checks_before": before_count,
        "failed_checks_candidate": after_count,
        "observed_diagnostics_before": before_diag,
        "observed_diagnostics_candidate": after_diag,
        "improvements": improvements,
        "regressions": regressions,
        "requires_review": ambiguous,
    }
    (WORK / "comparison.json").write_text(json.dumps(
        summary, ensure_ascii=False, indent=2), encoding="utf-8")

    with open(os.environ["GITHUB_STEP_SUMMARY"], "a", encoding="utf-8") as report:
        report.write("## VORO baseline-aware regression gate\n\n")
        report.write("| Metric | main | main + PR |\n|---|---:|---:|\n")
        report.write(f"| Failed checks (not bug count) | {before_count} | {after_count} |\n")
        report.write(f"| Observed diagnostic messages | {before_diag} | {after_diag} |\n")
        report.write(f"\nNode verification scripts per snapshot: **{len(scripts)}**.\n")
        report.write(f"Changed source files individually parsed: **{len(changed)}**.\n")
        report.write(f"Modified original test files rerun unchanged: **{len(changed_tests)}**.\n")
        for title, values in (("Improvements", improvements),
                              ("New regressions", regressions),
                              ("Manual review required", ambiguous)):
            report.write(f"\n### {title} ({len(values)})\n")
            report.write("\n".join("- " + value for value in values[:40]) or "- None")
            report.write("\n")
        report.write(
            "\nThese numbers are detected failing checks/diagnostics, NOT the "
            "total number of defects in the application.\n"
        )

    if regressions or ambiguous:
        print("Automatic merge blocked:", json.dumps(
            {"regressions": regressions, "manual_review": ambiguous},
            ensure_ascii=False), file=sys.stderr)
        sys.exit(1)
    print("No new regressions found in executed checks.", flush=True)


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        sys.exit("CI blocked: " + str(exc))
