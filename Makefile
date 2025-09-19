TESTS = test/index.html
REPORTER = dot

build:
	@npm run build
	@echo ""

test:
	@npm run test
	@echo ""

test-browser:
	@npm run test:wtr
	@echo ""

test-server:
	@npm run test:server
	@echo ""

test-ci:
	@npm run test-ci
	@echo ""

.PHONY: test test-ci
