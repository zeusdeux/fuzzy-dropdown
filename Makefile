minify:
		uglifyjs fuzzyDropdown.js --source-map fuzzyDropdown.min.map -o fuzzyDropdown.min.js --comments --stats
.PHONY: minify