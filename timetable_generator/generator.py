import json
import itertools
import time

f = open('only_ce_mods.json', "r")
mod_json = json.loads(f.read())

# Assume we get course codes as input
input = ['CE2002','CE2005','CE2006','CE2100','CE2101','CE2107'] # Example input, we can test invalid combinations as well next time

# Extract relevant course information from json / From mongodb 
input_dict = {}

def convert_remark_to_weeks(remark):
    if remark == 'None': return list(range(1,14))
    if '-' in remark:
        sep_index = remark.find('-')
        return list(range(int(remark[sep_index-1]),int(remark[sep_index+1:])+1))
    
    str_week = remark.replace('Teaching Wk','').split(',')
    weeks = [int(x) for x in str_week]
    return weeks

# Stores 'COURSE':'INDEX_LIST' as key value pair
for course in mod_json['COURSES']:
    if course['COURSE'] in input:
        for index in course['INDEX_LIST']:
            for timing in index['ACTIVITIES']:
                timing['REMARK'] = convert_remark_to_weeks(timing['REMARK'])
        
        input_dict[course['COURSE']] = course['INDEX_LIST']

def evaluate_combination(combi_list,all=False):
    
    # If there's only 1 index, impossible to clash thus we evaluate to true
    if len(combi_list) == 1: return 1 

    # Compare all index instead of just last one with remainder
    if all:
        for index in combi_list:
            for second_index in combi_list:
                # Skip comparison for same index
                if index == second_index: continue

                for newest_timing in second_index['ACTIVITIES']:
                    for timings in index['ACTIVITIES']:
                        
                        # Check 1: Comparing day
                        if newest_timing['DAY'] != timings['DAY']:
                            continue
                        # Check 2: Comparing weeks, If no overlap in week we skip (NEEDS TESTING)
                        elif not (list(set(newest_timing['REMARK']) & set(timings['REMARK']))):
                            #print("Last timing:",newest_timing['REMARK'])
                            #print("Current timing",timings['REMARK'])
                            continue
                        # Check 3: Comparing time
                        else:
                            newest_start = int(newest_timing['TIME']['START'])
                            newest_end = int(newest_timing['TIME']['END'])
                            index_start = int(timings['TIME']['START'])
                            index_end = int(timings['TIME']['END'])
                            
                            # Case 1: Start same time -> Clash
                            if newest_start == index_start: 
                                return 0
                            
                            # Case 2: New_start between start and end 
                            if newest_start > index_start and newest_start < index_end:
                                return 0
                            
                            # Case 3: New_end between start and end
                            if newest_end > index_start and newest_end <= index_end:
                                return 0

        # If manage to go through all timings without clashing, the combination is valid
        return 1

    else:

        

        # We assume previous modules have no clash, we thus only have to compare LAST ADDED MODULE with the remaining mods
        for index in combi_list[:-1]:
            for newest_timing in combi_list[-1]['ACTIVITIES']:
                for timings in index['ACTIVITIES']:
                    
                    # Check 1: Comparing day
                    if newest_timing['DAY'] != timings['DAY']:
                        continue
                    # Check 2: Comparing weeks, If no overlap in week we skip (NEEDS TESTING)
                    elif not (list(set(newest_timing['REMARK']) & set(timings['REMARK']))):
                        #print("Last timing:",newest_timing['REMARK'])
                        #print("Current timing",timings['REMARK'])
                        continue
                    # Check 3: Comparing time
                    else:
                        newest_start = int(newest_timing['TIME']['START'])
                        newest_end = int(newest_timing['TIME']['END'])
                        index_start = int(timings['TIME']['START'])
                        index_end = int(timings['TIME']['END'])
                        
                        # Case 1: Start same time -> Clash
                        if newest_start == index_start: 
                            return 0
                        
                        # Case 2: New_start between start and end 
                        if newest_start > index_start and newest_start < index_end:
                            return 0
                        
                        # Case 3: New_end between start and end
                        if newest_end > index_start and newest_end <= index_end:
                            return 0

        # If manage to go through all timings without clashing, the combination is valid
        return 1
#print(input_dict)
# Possibly consider generated completed combinations to be stored into database for retrieval so we don't have to repeatedly search

# Based on course inputs we generate possible combinations in indexes 
combinations = [input_dict[course_id] for course_id in input_dict]
print(combinations)
print("Length of combi:",len(combinations))

#for course in input_dict:
#    for index in input_dict[course]:

start = time.time()
final_result = []
count = 0 
for combo in itertools.product(*combinations):
    count+=1
    if evaluate_combination(list(combo),all=True): final_result.append(list(combo))

print("Pre-filter length:",count)
print("Length of final_result:",len(final_result))
print("Time taken:",time.time()-start,"seconds")
#print("Final result:",final_result)

save_index_and_course = []

for valid_combo in final_result:
    just_index = [index_info['INDEX'] for index_info in valid_combo]
    save_index_and_course.append(just_index)

for combo in save_index_and_course:
    print(combo)

    


# Case 1 (Suitable combination found based on mods enquired)


# Case 2 (Only partial combination available) (Consider listing out)
