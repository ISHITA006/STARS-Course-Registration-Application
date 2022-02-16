#!/bin/bash
find ~/Documents/stars_plus_plus/mongodb/webScrapper/courses/ -name "*.json" -exec mongoimport --db stars_plus_plus --collection courseInfo --type json --file {} \;
