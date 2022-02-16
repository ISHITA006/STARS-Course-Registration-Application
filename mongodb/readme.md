1. Installation
https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/#install-mongodb-community-edition
/etc/mongod.conf <- change ip address, virtual box network adapter set to bridged connection, ifconfig find ip, best to set dhcp reserved address

2. Reference
https://docs.mongodb.com/manual/reference/limits/
https://stackoverflow.com/questions/4667597/understanding-mongodb-bson-document-size-limit
https://docs.mongodb.com/guides/server/import/
https://www.mongodb.com/community/forums/t/mongodb-import-object-with-numbers-as-keys-results-in-array/13508/11

I'm trying to figure out how the fuck mongodb works, specifically how is each "document"/"object" stored and how we can search for them.
Will update again when I figure out how. <-- got it

I think I can use the current method where each course is stored as 1 document which has the file size limit of 16MB, do not think that it will be an issue.
Should explore how it works in a file called angular-client.js like python-client.py <-- got it

Full course list is full_mods.json, too big to import directly. Need to split them up and import. If imported using CLI, every mod is in 1 object which is not good.
Relevant course list for this project is ce_mods.json
If you do not need student details, work with this first.
If you need student details, wait till I generate fake students.

I found a bug while implementing indexSwap with mongodb. When you try to push a "dictionary" where the key is an integer, it is pushed as an array instead. This doesn't happen when you import via the CLI, only through Compass. This obviously introduce a new problem where 1 JSON file is imported as 1 mongodb object which is not what we designed our code to do.
