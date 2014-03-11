TESTS = test/index.html
REPORTER = dot

build:
	@./node_modules/.bin/grunt

test:
	@./node_modules/.bin/grunt test
	@echo ""

.PHONY: test
