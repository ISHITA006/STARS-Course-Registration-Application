import requests
from bs4 import BeautifulSoup
import pandas as pd
import json
import math
import json
import numpy as np

class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NpEncoder, self).default(obj)

url = "https://wish.wis.ntu.edu.sg/webexe/owa/AUS_SCHEDULE.main_display1?staff_access=false&acadsem=2021;1&r_subj_code=CE2002&boption=Search&r_search_type=F"
# df = pd.read_html("Full Mod Schedule.html")
df = pd.read_html("course_list_dump.html")

print(df)

def convert_remark_to_weeks(remark):
    if remark == 'None': return list(range(1,14))
    if '-' in remark:
        sep_index = remark.find('-')
        return list(range(int(remark[sep_index-1]),int(remark[sep_index+1:])+1))
    
    str_week = remark.replace('Teaching Wk','').split(',')
    weeks = [int(x) for x in str_week]
    return weeks

def extractInfo(table_header, table_timings):
    course_code = table_header[0][0]
    academic_units = table_header[2][0]
    course_name = table_header[1][0]
    remark = ""
    prerequisite = ""

    if len(table_header) > 1:
        if table_header[0][1] == "Remark:":
            remark = table_header[1][1]
        elif table_header[0][1] == "Prerequisite:":
            prerequisite = table_header[1][1]

        if len(table_header) == 3:
            if table_header[0][2] == "Remark:":
                remark = table_header[2][2]
            elif table_header[0][2] == "Prerequisite:":
                prerequisite = table_header[2][2]

    #if not len(remark) > 0: remark = 'hi'

    print("Course code:", course_code)
    print("Course name:", course_name)
    print("AUs:", academic_units)
    print("Remark:", remark)
    print("Pre-requisites:", prerequisite)
    # Note we might need to consider saving it as a list of course pre-reqs

    index = 0
    course_dict = {}
    index_list = []
    while index < len(table_timings):

        if table_timings["INDEX"][index] > 0:
            tmp_dict = {"INDEX": 0,'REGISTERED':0,'VACANCIES':10,'MAX':10,"ACTIVITIES": []}
            print("Index:", table_timings["INDEX"][index])
            tmp_dict["INDEX"] = table_timings["INDEX"][index]

            while True:  # Python implementation of do while loop
                tmp_activity_dict = {}
                for col in table_timings.columns:

                    if col == "INDEX":
                        continue  # Skips index columns

                    if col == 'TIME': # Used to get start & end time stored separately
                        try:
                            start_time, end_time = table_timings[col][index].split('-')
                        except:
                            start_time, end_time = 0,0 # Assuming no time given we set it as 0

                        tmp_activity_dict[col] = {}
                        tmp_activity_dict[col]['START'] = int(start_time)
                        tmp_activity_dict[col]['END'] = int(end_time)
                        continue

                    if col == 'REMARK':
                        try:
                            if math.isnan(table_timings[col][index]): 
                                tmp_activity_dict[col] = 'None'
                        except:
                            tmp_activity_dict[col] = table_timings[col][index]

                        try:
                            tmp_activity_dict['WEEK'] = convert_remark_to_weeks(tmp_activity_dict[col])
                        except:
                            tmp_activity_dict['WEEK'] = [0]
                            
                        continue

                    tmp_activity_dict[col] = table_timings[col][index]

                # Stores index info into a list labelled with course index
                tmp_dict["ACTIVITIES"].append(tmp_activity_dict)

                index += 1  # Transit to next activity
                try:
                    # Once we check that the next index is >0, we break out of the activity adding loop
                    if table_timings["INDEX"][index] > 0:
                        break
                except:
                    break # In the case where we have a key error, we can exit the while loop as well

        index_list.append(tmp_dict)
        #index += 1  # Increments for transitioning index

    #print("Remark:",remark,"Length of remark:",len(remark),"Type:",type(remark))

    return {
        "COURSE": course_code,
        "AU": academic_units,
        "NAME": course_name,
        "REMARK": remark,
        "PREREQUISITE": prerequisite,
        "INDEX_LIST": index_list,
    }

full_course_dict = {'COURSES':[]}
# Note that the html alternates between header info & index timings
index = 0
while index < len(df):
    info = extractInfo(df[index], df[index + 1])
    full_course_dict['COURSES'].append(info)
    #print(info)
    index += 2  # Increment to next pair

with open("ntu_mods.json", "w") as outfile:
    json.dump(full_course_dict, outfile,cls=NpEncoder)

print("complete")
