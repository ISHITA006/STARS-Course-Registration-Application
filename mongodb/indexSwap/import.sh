#!/bin/bash
find ~/Documents/stars_plus_plus/mongodb/indexSwap/courses/ -name "*.json" -exec mongoimport --db stars_plus_plus --collection indexSwap --type json --file {} \;
