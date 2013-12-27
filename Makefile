TESTS = test/index.html
REPORTER = dot
CDN = https://d37gvrvc0wt4s1.cloudfront.net

lint:
	@echo "Linting javascript files"
	@./node_modules/.bin/jshint src/rollbar.js src/plugins/jquery.js || exit 1
	@echo ""

build:
	@./node_modules/.bin/uglifyjs src/rollbar.js --source-map dist/rollbar.min.map --source-map-url ${CDN}/static/js/rollbar.min.map --output dist/rollbar.min.js -m
	@./node_modules/.bin/uglifyjs src/plugins/jquery.js --output dist/plugins/jquery.min.js -m

test:
	./node_modules/.bin/mocha-phantomjs -p ./node_modules/phantomjs/bin/phantomjs -R dot test/*.html
	@echo ""

test-dist:
	./node_modules/.bin/mocha-phantomjs -p ./node_modules/phantomjs/bin/phantomjs -R dot test/index.dist.html
	@echo ""

.PHONY: test
