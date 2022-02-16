#!/bin/bash
find ~/Documents/stars_plus_plus/mongodb/indexSwap/students/ -name "*.json" -exec mongoimport --db stars_plus_plus --collection students --type json --file {} \;
