Instructions
Your task is to implement a simplified version of a banking system. All operations that should be supported are listed below.

Solving this task consists of several levels. Subsequent levels are opened when the current level is correctly solved. You always have access to the data for the current and all previous levels.

You can execute a single test case by running the following command in the terminal: bash run_single_test.sh "<test_case_name>".

Requirements
Your task is to implement a simplified version of a banking system. Plan your design according to the level specifications below:

Level 1: The banking system should support creating new accounts and depositing money into and withdrawing/paying money from accounts.
Level 2: The banking system should support ranking accounts based on the total value of transactions.
Level 3: The banking system should support scheduling transfers and checking the scheduled transfer status.
Level 4: The banking system should support merging two accounts while retaining the balances and transaction histories of the original accounts.
To move to the next level, you should pass all the tests at the current level.

Note

All queries will have a timestamp parameter — a stringified timestamp in milliseconds. It is guaranteed that all timestamps are unique and are in a range from 1 to 109. Queries will be given in the order of strictly increasing timestamps.

Level 1
The banking system should support creating new accounts and depositing money into and withdrawing/paying money from accounts.

boolean createAccount(int timestamp, String accountId) — should create a new account with the given accountId if it doesn't already exist. Returns true if the account was successfully created or false if an account with accountId already exists.

Optional<Integer> deposit(int timestamp, String accountId, int amount) — should deposit the given amount of money to the specified account accountId. Returns the total amount of money in the account (balance) after processing the query. If the specified account does not exist, should return Optional.empty().

Optional<Integer> pay(int timestamp, String accountId, int amount) — should withdraw the given amount of money from the specified account. Returns the amount of money in the account (balance) after processing the query. If the specified account does not exist, or if the account has insufficient funds to perform the withdrawal, should return Optional.empty().

Examples
The example below shows how these operations should work (the section is scrollable to the right):

Queries	Explanations
createAccount(1, "account1")
createAccount(2, "account1")
createAccount(3, "account2")
deposit(4, "non-existing", 2700)
deposit(5, "account1", 2700)
pay(6, "non-existing", 2700)
pay(7, "account1", 2701)
pay(8, "account1", 200)
returns true
returns false; an account with this identifier already exists
returns true
returns Optional.empty(); an account with this identifier does not exist
returns 2700
returns Optional.empty(); an account with this identifier does not exist
returns Optional.empty(); this account has insufficient funds
returns 2500

Level 2
The banking system should support ranking accounts based on the total value of transactions.

List<String> topActivity(int timestamp, int n) — should return the top n accounts with the highest total value of transactions sorted in descending order (in case of ties, sorted alphabetically by accountId in ascending order). The returned value should be a list of strings representing an array of accounts and transaction values in this format ["<accountId1>(<transactionsValue1>)", "<accountId2>(<transactionsValue2>)", ..., "<accountIdN>(<transactionsValueN>)"].
Total value of transactions is defined as the sum of all transactions for an account (regardless of how the transaction affects account balance), including the amount of money deposited, withdrawn, and/or successfully transferred (transfers will be introduced on level 3, so you can ignore them for now).
If less than n accounts exist in the system, return all active accounts (in the described format).
Examples
The example below shows how these operations should work (the section is scrollable to the right):

Queries	Explanations
createAccount(1, "account1")
createAccount(2, "account2")
createAccount(3, "account3")
deposit(4, "account1", 2000)
deposit(5, "account2", 3000)
deposit(6, "account3", 4000)
topActivity(7, 3)
pay(8, "account1", 1500)
pay(9, "account2", 250)
deposit(10, "account3", 250)
topActivity(11, 3)
returns true
returns true
returns true
returns 2000
returns 3000
returns 4000
returns ["account3(4000)", "account2(3000)", "account1(2000)"]
returns 500
returns 2750
returns 4250
returns ["account3(4250)", "account1(3500)", "account2(3250)"]


Level 3
The banking system should allow scheduling payments and checking the status of scheduled payments.

Optional<String> transfer(int timestamp, String sourceAccountId, String targetAccountId, int amount) — should initiate a transfer between accounts. The given amount of money should be withdrawn from the source account sourceAccountId and held until the transfer is accepted by the target account targetAccountId, or until the transfer expires. The withheld money is added back to the source account's balance if the transfer expires. After the query is processed:

Returns Optional.empty() if sourceAccountId is equal to targetAccountId.
Returns Optional.empty() if sourceAccountId or targetAccountId doesn't exist.
Returns Optional.empty() if the source account sourceAccountId has insufficient funds to perform the transfer.
The expiration period is 24 hours, which is equal to 24 · 60 · 60 · 1000 = 86400000 milliseconds. A transfer expires at the beginning of the next millisecond after the expiration period ends.
A valid transfer should return a string containing a unique transfer ID in the following format "transfer[ordinal number of the transfer]", e.g., "transfer1", "transfer2", etc.
For transfers, transaction history for source and target accounts is only updated when the transfer is accepted.
Transfers count toward the total value of transactions of both source and target accounts.
boolean acceptTransfer(int timestamp, String accountId, String transferId) — should accept the transfer with the given transferId.

Returns true if the transfer was successfully accepted or false otherwise.
Returns false if a transfer with transferId does not exist, was already accepted, or has expired.
Returns false if the given accountId was not the target account for the transfer.
Examples
The examples below show how these operations should work (the section is scrollable to the right):

Queries	Explanations
createAccount(1, "account1")
createAccount(2, "account2")
deposit(3, "account1", 2000)
deposit(4, "account2", 3000)
transfer(5, "account1", "account2", 5000)
transfer(16, "account1", "account2", 1000)
acceptTransfer(20, "account1", "transfer1")
acceptTransfer(21, "non-existing", "transfer1")
acceptTransfer(22, "account1", "transfer2")
acceptTransfer(25, "account2", "transfer1")
acceptTransfer(30, "account2", "transfer1")
transfer(40, "account1", "account2", 1000)
acceptTransfer(45 + MILLISECONDS_IN_1_DAY, "account2", "transfer2")
transfer(50 + MILLISECONDS_IN_1_DAY, "account1", "account1", 1000)
returns true
returns true
returns 2000
returns 3000
returns Optional.empty(); "account1" has insufficient funds
returns "transfer1"
returns false; "account1" is not the target account for this transfer
returns false; this account does not exist
returns false; this transfer does not exist
returns true
returns false; the transfer was already accepted
returns "transfer2"
returns false; the transfer has expired
returns Optional.empty(); the source account is equal to the target account

Level 4
The banking system should support merging two accounts while retaining the original accounts' balances and transaction histories.

bool MergeAccounts(int timestamp, string accountId1, string accountId2) — should merge accountId2 into accountId1.

Returns true if accounts are merged successfully, and false otherwise.
Returns false if accountId1 is equal to accountId2.
Returns false if either accountId1 or accountId2 doesn't exist.
All outgoing transfers from accountId2 are canceled (the same state as expired).
All outgoing transfers from accountId1 to accountId2 are canceled (the same state as expired). Any other incoming transfers to accountId2 should be redirected to accountId1.
The balance of accountId1 should be increased by the balance of accountId2.
The total value of transactions for the merged account equals the sum of all transactions for both accountId1 and accountId2.
accountId2 should be removed from the system.
int? GetBalance(int timestamp, string accountId, int timeAt) — should return the total amount of money in accountId (balance) at the given timestamp timeAt. If the specified account did not exist at timeAt, should return null.

Note that If a query has been processed at timeAt, GetBalance must reflect the account balance after the query has been processed.

Examples
The examples below show how these operations should work (the section is scrollable to the right):

Queries	Explanations
CreateAccount(1, "account1")
CreateAccount(2, "account2")
CreateAccount(3, "account3")
Deposit(4, "account1", 2000)
Deposit(5, "account2", 2000)
Deposit(6, "account3", 2000)
Transfer(7, "account1", "account3", 300)
Transfer(8, "account1", "account2", 500)
Transfer(9, "account2", "account3", 500)
MergeAccounts(10, "account1", "account2")
Pay(11, "account1", 1000)
Pay(12, "account2", 10)
AcceptTransfer(13, "account3", "transfer1")
AcceptTransfer(14, "account2", "transfer2")
AcceptTransfer(15, "account3", "transfer3")
TopActivity(16, 3)
GetBalance(17, "account2", 1)
GetBalance(18, "account2", 10)
GetBalance(19, "account1", 4)
GetBalance(20, "account1", 12)
returns true
returns true
returns true
returns 2000
returns 2000
returns 2000
returns "transfer1"
returns "transfer2"
returns "transfer3"
returns true
returns 2700
returns null; this account does not exist anymore
returns true
returns false; this account does not exist anymore
returns false; all outgoing transfers from "account2" should have been cancelled
returns ["account1(5300)", "account3(2300)"]
returns null; "account2" was not created yet
returns null; "account2" was already merged and does not exist anymore
returns 2000
returns 2700