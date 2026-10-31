"""Regression tests for the CI comparator itself (no VORO dependencies needed)."""
import importlib.util
import os
from pathlib import Path
import tempfile
import unittest


SCRIPT = Path(__file__).with_name("voro_ci_compare.py")
os.environ.setdefault("RUNNER_TEMP", tempfile.gettempdir())
spec = importlib.util.spec_from_file_location("voro_ci_compare", SCRIPT)
ci = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ci)


def state(status, *diagnostics):
    return {"status": status, "diagnostics": list(diagnostics)}


class CompareTests(unittest.TestCase):
    def test_safe_log_filename_even_for_nested_source_path(self):
        path = ci.log_file("base", "parse:webs/src/pages/Calculators.jsx")
        self.assertEqual(path.parent, ci.LOGS)
        self.assertNotIn("/", path.name)
        self.assertNotIn("..", path.name)
        self.assertTrue(path.name.endswith(".log"))

    def test_log_ids_do_not_collide_when_separators_differ(self):
        a = ci.log_file("base", "parse:a/b")
        b = ci.log_file("base", "parse:a:b")
        self.assertNotEqual(a, b)

    def test_run_actually_writes_a_flat_log(self):
        old_base, old_logs = ci.BASE, ci.LOGS
        try:
            with tempfile.TemporaryDirectory() as t:
                ci.BASE = Path(t)
                (ci.BASE / "webs").mkdir()
                ci.LOGS = ci.BASE / "logs"
                ci.LOGS.mkdir()
                code, output = ci.run(
                    "base", "parse:webs/src/pages/Calculators.jsx",
                    ["python3", "-c", "print('comparison test')"])
                self.assertEqual(code, 0)
                self.assertIn("comparison test", output)
                self.assertTrue(
                    ci.log_file("base", "parse:webs/src/pages/Calculators.jsx").is_file())
                self.assertEqual(len(list(ci.LOGS.rglob("*.log"))), 1)
        finally:
            ci.BASE, ci.LOGS = old_base, old_logs

    def test_fail_to_pass_is_improvement(self):
        self.assertEqual(ci.classify(state("fail", "e1"), state("pass"))[0],
                         "improvement")

    def test_pass_to_fail_blocks(self):
        self.assertEqual(ci.classify(state("pass"), state("fail", "e1"))[0],
                         "regression")

    def test_new_diagnostic_blocks_even_if_old_failure_remains(self):
        self.assertEqual(ci.classify(
            state("fail", "e1"), state("fail", "e1", "e2"))[0], "regression")

    def test_unchanged_old_failure_is_tolerated_unaffected(self):
        self.assertEqual(ci.classify(
            state("fail", "e1"), state("fail", "e1"), False)[0], "pass")

    def test_unchanged_old_failure_on_impacted_test_needs_review(self):
        self.assertEqual(ci.classify(
            state("fail", "e1"), state("fail", "e1"), True)[0], "review")

    def test_fewer_diagnostics_on_affected_failing_test_requires_review(self):
        self.assertEqual(ci.classify(
            state("fail", "e1", "e2"),
            state("fail", "e1"), True)[0], "review")

    def test_fewer_diagnostics_on_unaffected_test_is_improvement(self):
        self.assertEqual(ci.classify(
            state("fail", "e1", "e2"),
            state("fail", "e1"), False)[0], "improvement")

    def test_removed_check_blocks(self):
        self.assertEqual(ci.classify(
            state("pass"), state("missing"))[0], "regression")

    def test_new_failing_check_blocks(self):
        self.assertEqual(ci.classify(
            state("missing"), state("fail", "e1"))[0], "regression")

    def test_new_passing_check_allowed(self):
        self.assertEqual(ci.classify(
            state("missing"), state("pass"))[0], "pass")

    def test_diagnostic_extractor_ignores_failure_totals(self):
        observed = ci.fingerprints(
            "❌ Missing hook import in Calculators.jsx: useCallback\n"
            "❌ VERIFICATION FAILED: 2 failure(s) detected.", Path("/tmp/base"))
        self.assertEqual(observed,
                         ["❌ Missing hook import in Calculators.jsx: useCallback"])


if __name__ == "__main__":
    unittest.main()
