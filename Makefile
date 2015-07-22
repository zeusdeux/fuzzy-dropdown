BIN=./node_modules/.bin

minify:
		$(BIN)/browserify src/fuzzy-dropdown.js -u jquery -o dist/fuzzy-dropdown.standalone.js && $(BIN)/uglifyjs dist/fuzzy-dropdown.standalone.js --source-map dist/fuzzy-dropdown.min.map -o dist/fuzzy-dropdown.min.js --comments -p 5 -c -m --stats
.PHONY: minify
