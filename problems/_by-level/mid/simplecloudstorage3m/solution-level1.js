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
}

// Example usage:
const storage = new CloudStorage();
console.log(storage.addFile("/dir1/dir2/file.txt", 10)); // true
console.log(storage.copyFile("/not-existing.file", "/dir1/file.txt")); // false
console.log(storage.copyFile("/dir1/dir2/file.txt", "/dir1/file.txt")); // true
console.log(storage.addFile("/dir1/file.txt", 15)); // false
console.log(storage.copyFile("/dir1/file.txt", "/dir1/dir2/file.txt")); // false
console.log(storage.getFileSize("/dir1/file.txt")); // 10
console.log(storage.getFileSize("/not-existing.file")); // null