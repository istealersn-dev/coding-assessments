class CloudStorage {
    constructor() {
        this.files = {}; // Object to store files and their sizes
    }

    // Add a new file to the storage
    addFile(name, size) {
        if (this.files[name] !== undefined) {
            return false; // File already exists
        }
        this.files[name] = { size: size };
        return true;
    }

    // Copy a file from one location to another
    copyFile(nameFrom, nameTo) {
        if (this.files[nameFrom] === undefined || this.files[nameTo] !== undefined) {
            return false; // Source doesn't exist or destination already exists
        }
        this.files[nameTo] = { size: this.files[nameFrom].size };
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
}

// Example usage:
const storage = new CloudStorage();
console.log(storage.addFile("/root/dir/another_dir/file.mp3", 10)); // true
console.log(storage.addFile("/root/file.mp3", 5)); // true
console.log(storage.addFile("/root/music/file.mp3", 7)); // true
console.log(storage.copyFile("/root/music/file.mp3", "/root/dir/file.mp3")); // true
console.log(storage.findFile("/root", ".mp3")); // ["/root/dir/another_dir/file.mp3(10)", "/root/dir/file.mp3(7)", "/root/music/file.mp3(7)", "/root/file.mp3(5)"]
console.log(storage.findFile("/root", "file.txt")); // []
console.log(storage.findFile("/dir", "file.mp3")); // []