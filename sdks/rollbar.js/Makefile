TESTS = test/index.html
REPORTER = dot

build:
	@./node_modules/.bin/grunt/grunt build
	@./node_modules/.bin/uglifyjs src/plugins/jquery.js --output dist/plugins/jquery.min.js -m

test:
	@grunt test
	@echo ""

.PHONY: test
