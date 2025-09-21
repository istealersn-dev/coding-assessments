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

    // Compress a file
    compressFile(userId, name) {
        if (this.files[name] === undefined || this.files[name].userId !== userId) {
            return null; // File doesn't exist or doesn't belong to the user
        }
        if (name.endsWith(".COMPRESSED")) {
            return null; // File is already compressed
        }

        const { size } = this.files[name];
        const compressedSize = size / 2; // Size is guaranteed to be even
        const compressedName = `${name}.COMPRESSED`;

        if (this.files[compressedName] !== undefined) {
            return null; // Compressed file already exists
        }

        // Check if the user has enough capacity for the compressed file
        if (this.users[userId].used - size + compressedSize > this.users[userId].capacity) {
            return null; // Exceeds user's capacity
        }

        // Remove the original file and add the compressed file
        delete this.files[name];
        this.files[compressedName] = { size: compressedSize, userId };
        this.users[userId].used -= size;
        this.users[userId].used += compressedSize;

        return this.users[userId].capacity - this.users[userId].used;
    }

    // Decompress a file
    decompressFile(userId, name) {
        if (!name.endsWith(".COMPRESSED")) {
            return null; // File is not compressed
        }
        if (this.files[name] === undefined || this.files[name].userId !== userId) {
            return null; // File doesn't exist or doesn't belong to the user
        }

        const { size } = this.files[name];
        const originalSize = size * 2;
        const originalName = name.slice(0, -11); // Remove ".COMPRESSED" suffix

        if (this.files[originalName] !== undefined) {
            return null; // Original file already exists
        }

        // Check if the user has enough capacity for the decompressed file
        if (this.users[userId].used - size + originalSize > this.users[userId].capacity) {
            return null; // Exceeds user's capacity
        }

        // Remove the compressed file and add the original file
        delete this.files[name];
        this.files[originalName] = { size: originalSize, userId };
        this.users[userId].used -= size;
        this.users[userId].used += originalSize;

        return this.users[userId].capacity - this.users[userId].used;
    }
}

// Example usage:
const storage = new CloudStorage();
console.log(storage.addUser("user1", 1000)); // true
console.log(storage.addUser("user2", 5000)); // true
console.log(storage.addFileBy("user1", "/dir/file.mp4", 500)); // 500
console.log(storage.compressFile("user2", "/dir/file.mp4")); // null (file owned by user1)
console.log(storage.compressFile("user3", "/dir/file.mp4")); // null (user3 doesn't exist)
console.log(storage.compressFile("user1", "/folder/non_existing_file")); // null (file doesn't exist)
console.log(storage.compressFile("user1", "/dir/file.mp4")); // 750
console.log(storage.getFileSize("/dir/file.mp4.COMPRESSED")); // 250
console.log(storage.getFileSize("/dir/file.mp4")); // null (file no longer exists)
console.log(storage.copyFile("/dir/file.mp4.COMPRESSED", "/file.mp4.COMPRESSED")); // true
console.log(storage.addFileBy("user1", "/dir/file.mp4", 500)); // null (file already exists)
console.log(storage.decompressFile("user1", "/dir/file.mp4.COMPRESSED")); // 0
console.log(storage.updateCapacity("user1", 2000)); // 0
console.log(storage.decompressFile("user2", "/dir/file.mp4.COMPRESSED")); // null (file owned by user1)
console.log(storage.decompressFile("user3", "/dir/file.mp4.COMPRESSED")); // null (user3 doesn't exist)
console.log(storage.decompressFile("user1", "/dir/file.mp4.COMPRESSED")); // null (original file already exists)
console.log(storage.decompressFile("user1", "/file.mp4.COMPRESSED")); // 750