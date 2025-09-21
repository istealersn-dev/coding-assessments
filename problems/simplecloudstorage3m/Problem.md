Description
Instructions
Your task is to implement a simple cloud storage system. All operations that should be supported are listed below.

Solving this task consists of several levels. Subsequent levels are opened when the current level is correctly solved. You always have access to the data for the current and all previous levels.

You can execute a single test case by running the following command in the terminal: bash run_single_test.sh "<test_case_name>".

Requirements
Your task is to implement a simple cloud storage system that maps objects (files) to their metainformation. Specifically, the storage system should maintain files along with some information about them (name, size, etc.). Note that this system should be in-memory, you do not need to work with the real filesystem.

Plan your design according to the level specifications below:

Level 1: The cloud storage system should support adding new files, retrieving, and copying files.
Level 2: The cloud storage system should support finding files by matching prefixes and suffixes.
Level 3: The cloud storage system should support adding users with various capacity limits.
Level 4: The cloud storage system should support compressing and decompressing files.
To move to the next level, you need to pass all the tests at this level when submitting the solution.

Note

It is guaranteed that the given queries will never call operations that result in collisions between file and directory names.

Level 1
The cloud storage system should support operations to add files, copy files, and get files stored on the system.

addFile(name, size) — should add a new file name to the storage. size is the amount of memory required in bytes. The current operation fails if a file with the same name already exists. Returns true if the file was added successfully or false otherwise.

copyFile(nameFrom, nameTo) — should copy the file at nameFrom to nameTo. The operation fails if nameFrom points to a file that does not exist or points to a directory. The operation fails if the specified file already exists at nameTo. Returns true if the file was copied successfully or false otherwise.

getFileSize(name) — should return the size of the file name if it exists, or null otherwise.

Examples
The example below shows how these operations should work (the section is scrollable to the right):

Queries	Explanations
addFile("/dir1/dir2/file.txt", 10)
copyFile("/not-existing.file", "/dir1/file.txt")
copyFile("/dir1/dir2/file.txt", "/dir1/file.txt")
addFile("/dir1/file.txt", 15)
copyFile("/dir1/file.txt", "/dir1/dir2/file.txt")
getFileSize("/dir1/file.txt")
getFileSize("/not-existing.file")
returns true; adds file "/dir1/dir2/file.txt" of 10 bytes
returns false; the file "/not-existing.file" does not exist
returns true; adds file "/dir1/file.txt" of 10 bytes
returns false; the file "/dir1/file.txt" exists already
returns false; the file "/dir1/dir2/file.txt" exists already
returns 10
returns null; the file "/not-existing.file" does not exist


Level 2
Implement support for retrieving file names by searching directories via prefixes and suffixes.

findFile(prefix, suffix) — should search for files with names starting with prefix and ending with suffix. Returns a list of strings representing all matching files in this format: ["<name1>(<size1>)", "<name2>(<size2>)", ...]. The output should be sorted in descending order of file sizes or, in the case of ties, lexicographically. If no files match the required properties, should return an empty list.
Examples
The example below shows how these operations should work (the section is scrollable to the right):

Queries	Explanations
addFile("/root/dir/another_dir/file.mp3", 10)
addFile("/root/file.mp3", 5)
addFile("/root/music/file.mp3", 7)
copyFile("/root/music/file.mp3", "/root/dir/file.mp3")
findFile("/root", ".mp3")
findFile("/root", "file.txt")
findFile("/dir", "file.mp3")
returns true
returns true
returns true
returns true
returns ["/root/dir/another_dir/file.mp3(10)", "/root/dir/file.mp3(7)", "/root/music/file.mp3(7)", "/root/file.mp3(5)"]
returns []; there is no file with the prefix "/root" and suffix "file.txt"
returns []; there is no file with the prefix "/dir" and suffix "file.mp3"


Level 3
Implement support for different users sending queries to the system. All users share a common filesystem in the cloud storage, but each user is assigned an individual storage capacity limit.

addUser(userId, capacity) — should add a new user to the system, with capacity as their storage limit in bytes. The total size of all files owned by userId cannot exceed capacity. The operation fails if a user with userId already exists. Returns true if a user with userId is successfully created, or false otherwise.

addFileBy(userId, name, size) — should behave in the same way as the addFile from Level 1, but the added file should be owned by the user with userId. A new file cannot be added to the storage if doing so will exceed the user's capacity limit. Returns the remaining storage capacity for userId if the file is successfully added or null otherwise.

Note that all queries calling the addFile operation implemented during Level 1 are run by the user with userId = "admin", who has unlimited storage capacity. Also, assume that the copyFile operation preserves the ownership of the original file.

updateCapacity(userId, capacity) — should change the maximum storage capacity for the user with userId. If the total size of all user's files exceeds the new capacity, the largest files (sorted lexicographically in case of a tie) should be removed from the storage until the total size of all remaining files will no longer exceed the new capacity. Returns the number of removed files, or null if a user with userId does not exist.
Examples
The example below shows how these operations should work (the section is scrollable to the right):

Queries	Explanations
addUser("user1", 125)
addUser("user1", 100)
addUser("user2", 100)
addFileBy("user1", "/dir/file.big", 50)
addFileBy("user1", "/file.med", 30)
addFileBy("user2", "/file.med", 40)
copyFile("/file.med", "/dir/another/file.med")
copyFile("/file.med", "/dir/another/another/file.med")
addFileBy("user1", "/dir/file.small", 10)
addFile("/dir/admin_file", 200)
addFileBy("user1", "/dir/file.small", 5)
addFileBy("user1", "/my_folder/file.huge", 100)
addFileBy("user3", "/my_folder/file.huge", 100)
updateCapacity("user1", 300)
updateCapacity("user1", 50)


updateCapacity("user2", 1000)
returns true; creates user "user1" with 125 bytes capacity
returns false; "user1" already exists
returns true; creates user "user2" with 100 bytes capacity
returns 75
returns 45
returns null; file named "/file.med" already exists and owned by "user1"
returns true; copying preserves the file owner. After copying, "user1" has 15 capacity left
returns false; "user1" does not have enough storage capacity left to perform copying operation
returns 5
returns true; this operation is done by "admin" with unlimited capacity
returns null; the file "/dir/file.small" already exists
returns null; "user1" does not have enough storage capacity left to add this file
returns null; "user3" doesn't exist
returns 0; all files owned by "user1" can fit into the new capacity of 300 bytes
returns 2; the files "/dir/file.big" and "/dir/another/file.med"
             should be deleted so the remaining files owned by "user1"
             can fit into the new capacity of 50 bytes
returns null; "user2" doesn't exist


Level 4
Implement support for file compression.

int? CompressFile(string userId, string name) — should compress the file name if it belongs to userId. The compressed file should be replaced with a new file named <name>.COMPRESSED. The size of the newly created file should be equal to the half of the original file. The size of all files is guaranteed to be even, so there should be no fractional calculations. It is also guaranteed that name for this operation never points to a compressed file - i.e., it never ends with .COMPRESSED. Compressed files should be owned by userId — the owner of the original file. Returns the remaining storage capacity for userId if the file was compressed successfully or null otherwise.
Note that because file names can only contain lowercase letters, compressed files cannot be added via AddFile.
It is guaranteed that all CopyFile operations will preserve the suffix .COMPRESSED.

int? DecompressFile(string userId, string name) — should revert the compression of the file name if it belongs to userId. It is guaranteed that name for this operation always ends with .COMPRESSED. If decompression results in the userId exceeding their storage capacity limit or a decompressed version of the file with the given name already exists, the operation fails. Returns the remaining capacity of userId if the file was decompressed successfully or null otherwise.
Examples
The example below shows how these operations should work (the section is scrollable to the right):

Queries	Explanations
AddUser("user1", 1000)
AddUser("user2", 5000)
AddFileBy("user1", "/dir/file.mp4", 500)
CompressFile("user2", "/dir/file.mp4")
CompressFile("user3", "/dir/file.mp4")
CompressFile("user1", "/folder/non_existing_file")
CompressFile("user1", "/dir/file.mp4")
GetFileSize("/dir/file.mp4.COMPRESSED")
GetFileSize("/dir/file.mp4")
CopyFile("/dir/file.mp4.COMPRESSED", "/file.mp4.COMPRESSED")
AddFileBy("user1", "/dir/file.mp4", 500)
DecompressFile("user1", "/dir/file.mp4.COMPRESSED")
UpdateCapacity("user1", 2000)
DecompressFile("user2", "/dir/file.mp4.COMPRESSED")
DecompressFile("user3", "/dir/file.mp4.COMPRESSED")
DecompressFile("user1", "/dir/file.mp4.COMPRESSED")
DecompressFile("user1", "/file.mp4.COMPRESSED")
returns true
returns true
returns 500
returns null; the file "/dir/file.mp4" is owned by "user1"
returns null; "user3" doesn't exist
returns null; the file "/folder/non_existing_file" doesn't exist
returns 750; the file "/dir/file.mp4" is compressed to size = 500 / 2 = 250 bytes
returns 250
returns null
returns true
returns 0
returns null; "user1" does not have enough storage capacity to decompress the file
returns 0
returns null; the file "/dir/file.mp4.COMPRESSED" is owned by "user1"
returns null; "user3" doesn't exist
returns null; the file "/dir/file.mp4" exists already
returns 750