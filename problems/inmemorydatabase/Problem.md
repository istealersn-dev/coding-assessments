# Description
Your task is to implement a simplified version of an in-memory database. All operations that should be supported by this database are described below. Solving this task consists of several levels. Subsequent levels are opened when the current level is correctly solved. You always have access to the data for the current and all previous levels.

You can execute a single test case by running the following command in the terminal: 
```bash
bash run_single_test.sh "<test_case_name>"

# Requirements
Your task is to implement a simplified version of an in-memory database. Plan your design according to the level specifications below:

* **Level 1**: In-memory database should support basic operations to manipulate records, fields, and values within fields.
* **Level 2**: In-memory database should support displaying a specific record's fields based on a filter.
* **Level 3**: In-memory database should support TTL (Time-To-Live) configurations on database records.
* **Level 4**: In-memory database should support backup and restore functionality.

To move to the next level, you need to pass all the tests at this level when submitting the solution.

## Level 2
The database should support displaying data based on filters. Introduce an operation to support printing some fields of a record.

* `List<String> scan(String key)` — should return a list of strings representing the fields of a record associated with key. The returned list should be in the following format `["<field1>(<value1>)", "<field2>(<value2>)", ...]`, where fields are sorted lexicographically. If the specified record does not exist, returns an empty list.
* `List<String> scanByPrefix(String key, String prefix)` — should return a list of strings representing some fields of a record associated with key. Specifically, only fields that start with prefix should be included. The returned list should be in the same format as in the scan operation with fields sorted in lexicographical order.

# Examples
The example below shows how these operations should work (the section is scrollable to the right):

```plaintext
set("A", "BC", "E")
set("A", "BD", "F")
set("A", "C", "G")
scanByPrefix("A", "B")
scan("A")
scanByPrefix("B", "B")

database state: {"A": {"BC": "E"}}
database state: {"A": {"BC": "E", "BD": "F"}}
database state: {"A": {"BC": "E", "BD": "F", "C": "G"}}
returns ["BC(E)", "BD(F)"]
returns ["BC(E)", "BD(F)", "C(G)"]
returns []