class CloudStorage {
    constructor() {
        this.files = {}; // Object to store files and their metadata
        this.users = {}; // Object to store users and their capacities
    }

    // Add a new user to the system
    addUser(userId, capacity) {
        if (this.users[userId] !== undefined) {
            return false; // User already exists
        }
        this.users[userId] = { capacity, used: 0 };
        return true;
    }

    // Add a new file owned by a specific user
    addFileBy(userId, name, size) {
        if (this.files[name] !== undefined) {
            return null; // File already exists
        }
        if (this.users[userId] === undefined) {
            return null; // User does not exist
        }
        if (this.users[userId].used + size > this.users[userId].capacity) {
            return null; // Exceeds user's capacity
        }
        this.files[name] = { size, userId };
        this.users[userId].used += size;
        return this.users[userId].capacity - this.users[userId].used;
    }

    // Add a new file (default to "admin" user with unlimited capacity)
    addFile(name, size) {
        return this.addFileBy("admin", name, size);
    }

    // Copy a file from one location to another
    copyFile(nameFrom, nameTo) {
        if (this.files[nameFrom] === undefined || this.files[nameTo] !== undefined) {
            return false; // Source doesn't exist or destination already exists
        }
        const { size, userId } = this.files[nameFrom];
        if (this.users[userId].used + size > this.users[userId].capacity && userId !== "admin") {
            return false; // Exceeds user's capacity (except for "admin")
        }
        this.files[nameTo] = { size, userId };
        this.users[userId].used += size;
        return true;
    }

    // Get the size of a file
    getFileSize(name) {
        if (this.files[name] === undefined) {
            return null; // File doesn't exist
        }
        return this.files[name].size;
    }

    // Find files matching a prefix and suffix
    findFile(prefix, suffix) {
        const matchingFiles = [];

        // Iterate through all files and filter those matching the prefix and suffix
        for (const [name, file] of Object.entries(this.files)) {
            if (name.startsWith(prefix) && name.endsWith(suffix)) {
                matchingFiles.push({ name, size: file.size });
            }
        }

        // Sort the matching files by size (descending) and then by name (lexicographically)
        matchingFiles.sort((a, b) => {
            if (b.size !== a.size) {
                return b.size - a.size; // Sort by size (descending)
            } else {
                return a.name.localeCompare(b.name); // Sort by name (lexicographically)
            }
        });

        // Format the results as "<name>(<size>)"
        return matchingFiles.map(file => `${file.name}(${file.size})`);
    }

    // Update a user's storage capacity
    updateCapacity(userId, capacity) {
        if (this.users[userId] === undefined) {
            return null; // User does not exist
        }

        const user = this.users[userId];
        user.capacity = capacity;

        // If the user's used storage exceeds the new capacity, remove files
        if (user.used > capacity) {
            const filesToRemove = [];
            for (const [name, file] of Object.entries(this.files)) {
                if (file.userId === userId) {
                    filesToRemove.push({ name, size: file.size });
                }
            }

            // Sort files by size (descending) and then by name (lexicographically)
            filesToRemove.sort((a, b) => {
                if (b.size !== a.size) {
                    return b.size - a.size;
                } else {
                    return a.name.localeCompare(b.name);
                }
            });

            let removedCount = 0;
            while (user.used > capacity && filesToRemove.length > 0) {
                const file = filesToRemove.shift();
                delete this.files[file.name];
                user.used -= file.size;
                removedCount++;
            }

            return removedCount;
        }

        return 0; // No files were removed
    }
}

// Example usage:
const storage = new CloudStorage();
console.log(storage.addUser("user1", 125)); // true
console.log(storage.addUser("user1", 100)); // false
console.log(storage.addUser("user2", 100)); // true
console.log(storage.addFileBy("user1", "/dir/file.big", 50)); // 75
console.log(storage.addFileBy("user1", "/file.med", 30)); // 45
console.log(storage.addFileBy("user2", "/file.med", 40)); // null (file already exists)
console.log(storage.copyFile("/file.med", "/dir/another/file.med")); // true
console.log(storage.copyFile("/file.med", "/dir/another/another/file.med")); // false (exceeds capacity)
console.log(storage.addFileBy("user1", "/dir/file.small", 10)); // 5
console.log(storage.addFile("/dir/admin_file", 200)); // true (admin has unlimited capacity)
console.log(storage.addFileBy("user1", "/dir/file.small", 5)); // null (file already exists)
console.log(storage.addFileBy("user1", "/my_folder/file.huge", 100)); // null (exceeds capacity)
console.log(storage.addFileBy("user3", "/my_folder/file.huge", 100)); // null (user does not exist)
console.log(storage.updateCapacity("user1", 300)); // 0
console.log(storage.updateCapacity("user1", 50)); // 2
console.log(storage.updateCapacity("user2", 1000)); // null (user does not exist)