Instructions
Your task is to implement a simple cloud storage system. All operations that should be supported are listed below.

Solving this task consists of several levels. Subsequent levels are opened when the current level is correctly solved. You always have access to the data for the current and all previous levels.

You can execute a single test case by running the following command in the terminal: bash run_single_test.sh "<test_case_name>".

Requirements
Your task is to implement a simple cloud storage system that maps objects (files) to their metainformation. Specifically, the storage should maintain files and information about them (name, size, etc.). Note that this system should be in-memory: you don't need to work with the real filesystem.

Plan your design according to the level specifications below:

Level 1: The cloud storage system should support adding a new file and retrieving and deleting files.
Level 2: The cloud storage system should support displaying the largest files.
Level 3: The cloud storage system should support adding users with limited capacities and merging two users.
Level 4: The cloud storage system should support backing up and restoring a user's files.
To move to the next level, you need to pass all the tests at this level when submitting the solution.

Note

It is guaranteed that the given queries will never call operations that result in collisions between file and directory names.

Level 1
The cloud storage system should support file manipulation.

addFile(name, size) — should add a new file name to the storage. size is the amount of memory required in bytes. The current operation fails if a file with the same name already exists. Returns true if the file was added successfully or false otherwise.

getFileSize(name) — should return the size of the file name if it exists, or null otherwise.

deleteFile(name) — should delete the file name. Returns the deleted file size if the deletion was successful or null if the file does not exist.

Examples
The example below shows how these operations should work (the section is scrollable to the right):

Queries	Explanations
addFile("/dir1/dir2/file.txt", 10)
addFile("/dir1/dir2/file.txt", 5)
getFileSize("/dir1/dir2/file.txt")
deleteFile("/non-existing.file")
deleteFile("/dir1/dir2/file.txt")
getFileSize("/not-existing.file")
returns true; adds file "/dir1/dir2/file.txt" of 10 bytes
returns false; the file "/dir1/dir2/file.txt" already exists
returns 10
returns null; the file "/not-existing.file" does not exist
returns 10
returns null; the file "/not-existing.file" does not exist

Level 2
Implement an operation for retrieving some statistics about files with a specific prefix.

getNLargest(prefix, n) — should return the list of strings representing the names of the top n largest files with names starting with prefix in the following format: ["<name1>(<size1>)", ..., "<nameN>(<sizeN>)"]. Returned files should be sorted by size in descending order, or in case of a tie, sorted in lexicographical order of the names. If there are no such files, return an empty list. If the number of such files is less than n, all of them should be returned in the specified format.
Examples
The example below shows how these operations should work (the section is scrollable to the right):

Queries	Explanations
addFile("/dir/file1.txt", 5)
addFile("/dir/file2", 20)
addFile("/dir/deeper/file3.mov", 9)
getNLargest("/dir", 2)
getNLargest("/dir/file", 3)
getNLargest("/another_dir", "file.txt")
addFile("/big_file.mp4", 20)
getNLargest("/", 2)
returns true
returns true
returns true
returns ["/dir/file2(20)", "/dir/deeper/file3.mov(9)"]
returns ["/dir/file2(20)", "/dir/file1.txt(5)"]
returns null; there are no files with the prefix "/another_dir"
returns true
returns ["/big_file.mp4(20)", "/dir/file2(20)"]; sizes of files are equal, 



Level 3
Implement support for queries from different users. All users share a common filesystem in the cloud storage system, but each user is assigned a storage capacity limit.

addUser(userId, capacity) — should add a new user in the system, with capacity as their storage limit in bytes. The total size of all files owned by userId cannot exceed capacity. The operation fails if a user with userId already exists. Returns true if a user with userId is successfully created, or false otherwise.

addFileBy(userId, name, size) — should behave in the same way as the addFile from Level 1, but the added file should be owned by the user with userId. A new file cannot be added to the storage if doing so will exceed the user's capacity limit. Returns the remaining capacity of the user if the file is added successfully, or null otherwise.

Note that all queries calling the addFile operation implemented during Level 1 are run by the user with userId = "admin", who has unlimited storage capacity.

mergeUser(userId1, userId2) — should merge the account of userId2 with the userId1. Ownership of all of userId2's files is transferred to userId1, and any remaining storage capacity is also added to userId1's limit. userId2 is deleted if the merge is successful. Returns the remaining capacity of userId1 after merging, or null if one of the users does not exist or userId1 is equal to userId2. It is guaranteed that neither userId1 nor userId2 equals "admin".
Examples
The example below shows how these operations should work (the section is scrollable to the right):

Queries	Explanations
addUser("user1", 200)
addUser("user1", 100)
addFileBy("user1", "/dir/file.med", 50)
addFileBy("user1", "/file.big", 140)
addFileBy("user1", "/dir/file.small", 20)
addFile("/dir/admin_file", 300)
addUser("user2", 110)
addFileBy("user2", "/dir/file.med", 45)
addFileBy("user2", "/new_file", 50)
mergeUser("user1", "user2")
returns true; creates user "user1" with 200 bytes capacity limit
returns false; "user1" already exists
returns 150
returns 10
returns null; "user1" does not have enough storage capacity to add this file
returns true; this operation is done by "admin" with the unlimited storage capacity
returns true
returns null; file named "/dir/file.med" already exists and owned by "user1"
returns 60
returns 70; transfers ownership of "/new_file" to "user1"

Level 4
Implement support to allow users to back up their files.

backupUser(userId) — should back up the current state of all files owned by userId - i.e., file names and sizes. The backup is stored on a separate storage system and is not affected by any new file manipulation queries. Overwrites any backups for the same user if previous backups exist. Returns the number of backed-up files, or null if userId does not exist.

restoreUser(userId) — should restore the state of userId's files to the latest backup. If there was no backup, all of userId's files are deleted. If a file can't be restored because another user added another file with the same name, it is ignored. Returns the number of the files that are successfully restored or null if userId does not exist.

Note that mergeUser does not affect userId1's backup, and userId2 is deleted along with its backup.
Note that the restoreUser operation does not affect the user's capacity.

Examples
The example below shows how these operations should work (the section is scrollable to the right):

Queries	Explanations
addUser("user", 100)
addFileBy("user", "/dir/file1", 50)
addFileBy("user", "/file2.txt", 30)
restoreUser("user")
addFileBy("user", "/file3.mp4", 60)
addFileBy("user", "/file4.txt", 10)
backupUser("user")
deleteFile("/file3.mp4")
deleteFile("/file4.txt")
addFile("/file3.mp4", 140)
addFileBy("user", "/dir/file5.new", 20)
restoreUser("user")
returns true; creates "user" with 100 bytes capacity limit
returns 50
returns 20
returns 0; removes all of "user"'s files
returns 40
returns 30
returns 2; backs up all of "user"'s files
returns 60
returns 10
returns true
returns 80
returns 1; restores "/file4.txt" and deletes "/dir/file5.new"