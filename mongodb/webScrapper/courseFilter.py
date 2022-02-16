import json
import os

f = open('ntu_mods.json', "r")
mod_json = json.loads(f.read())

filtered_dict = {}
count = 0
for course in mod_json['COURSES']:
    if "CE" in course['COURSE']:
        filtered_dict = course
        count += 1
        path = os.path.abspath("./courses/" + course['COURSE'] + ".json")
        with open(path, "w") as outfile:
            json.dump(filtered_dict, outfile)
            outfile.close()
            filtered_dict = {}

print("Number of CE courses filtered:",count)
