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

    (LOGS / f"{stage}-{name}.log").write_text(output[:1_000_000], encoding="utf-8")
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

    regressions, improvements, ambiguous = [], [], []
    checks = ["build", *scripts, *("parse:" + path for path in changed)]
    for name in checks:
        before, after = base[name], candidate[name]
        bs, cs = before["status"], after["status"]
        if bs == "missing":
            if cs != "pass":
                regressions.append(f"{name}: new check does not pass ({cs})")
        elif cs == "missing":
            regressions.append(f"{name}: existing check removed")
        elif bs == "pass" and cs != "pass":
            regressions.append(f"{name}: PASS -> FAIL")
        elif bs == "fail" and cs == "pass":
            improvements.append(f"{name}: FAIL -> PASS")
        elif bs == "fail" and cs == "fail":
            old = set(before["diagnostics"])
            new = set(after["diagnostics"])
            if not new.issubset(old):
                regressions.append(f"{name}: new/changed diagnostic")
            elif (name.startswith("parse:") or
                  (name != "build" and directly_covers(name, changed))):
                # The first failing assertion can mask later failures. When
                # the test explicitly covers changed source, this is unsafe.
                if new == old:
                    ambiguous.append(f"{name}: affected test still fails")
                else:
                    improvements.append(f"{name}: fewer observed diagnostics")
            elif new < old:
                improvements.append(f"{name}: fewer observed diagnostics")

    def count_failures(items):
        return sum(1 for x in items.values() if x["status"] == "fail")

    before_count = count_failures(base)
    after_count = count_failures(candidate)
    before_diag = sum(len(x["diagnostics"]) for x in base.values())
    after_diag = sum(len(x["diagnostics"]) for x in candidate.values())
    summary = {
        "scripts_executed_per_snapshot": len(scripts),
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
