minify:
		uglifyjs fuzzyDropdown.js --source-map fuzzyDropdown.min.map -o fuzzyDropdown.min.js --comments -p 5 -c -m --stats
.PHONY: minify