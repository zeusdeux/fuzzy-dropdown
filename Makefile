minify:
		uglifyjs src/fuzzyDropdown.js --source-map src/fuzzyDropdown.min.map -o src/fuzzyDropdown.min.js --comments -p 5 -c -m --stats
.PHONY: minify