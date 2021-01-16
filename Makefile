TESTS = test/index.html
REPORTER = dot

build lint test test-browser test-server test_ci:
	@npm run $@
	@echo ""

.PHONY: build lint test test-browser test-server test_ci
