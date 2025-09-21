Instructions
Your task is to implement a simplified version of a program registering the working hours of contract workers at a facility. All operations that should be supported by this program are described below.

Solving this task consists of several levels. Subsequent levels are opened when the current level is correctly solved. You always have access to the data for the current and all previous levels.

You can execute a single test case by running the following command in the terminal: bash run_single_test.sh "<test_case_name>".

Requirements
Your task is to implement a simplified version of a program registering the working hours of contract workers at a facility. Plan your design according to the level specifications below:

Level 1: The working hours register program should support adding workers to the system, registering the time when workers enter or leave the office and retrieving information about the time spent in the office.
Level 2: The working hours register program should support retrieving statistics about the amount of time that workers spent in the office.
Level 3: The working hours register program should support promoting workers, assigning them new positions and new compensation. The program should also support calculating a worker's salary for a given period.
Level 4: The working hours register program should support setting time periods to be double-paid.
To move to the next level, you need to pass all the tests at this level when submitting the solution.

Level 1
Introduce operations for adding workers, registering their entering or leaving the office and retrieving information about the amount of time that they have worked.

addWorker(workerId, position, compensation) — should add the workerId to the system and save additional information about them: their position and compensation. If the workerId already exists, nothing happens and this operation should return false. If the workerId was successfully added, return true. workerId and position are guaranteed to contain only English letters and spaces.

register(workerId, timestamp) — should register the time when the workerId entered or left the office. The time is represented by the timestamp. Note that register operation calls are given in the increasing order of the timestamp parameter. If the workerId doesn't exist within the system, nothing happens and this operation should return "invalid_request". If the workerId is not in the office, this operation registers the time when the workerId entered the office. If the workerId is already in the office, this operation registers the time when the workerId left the office. If the workerId's entering or leaving time was successfully registered, return "registered".

get(workerId) — should return the total calculated amount of time that the workerId spent in the office. The amount of time is calculated using finished working sessions only. It means that if the worker has entered the office but hasn't left yet, this visit is not considered in the calculation. If the workerId doesn't exist within the system, return null.

Examples
The example below shows how these operations should work (the section is scrollable to the right):

Queries	Explanations
addWorker("Ashley", "Middle Developer", 150)
addWorker("Ashley", "Junior Developer", 100)
register("Ashley", 10)
register("Ashley", 25)
get("Ashley")
register("Ashley", 40)
register("Ashley", 67)
register("Ashley", 100)
get("Ashley")
get("Walter")
register("Walter", 120)
returns true
returns false; the same workerId already exists within the system
returns "registered"; "Ashley" entered the office at timestamp 10
returns "registered"; "Ashley" left the office at timestamp 25
returns 15; "Ashley" spent 25 - 10 = 15 time units in the office
returns "registered"
returns "registered"
returns "registered"
returns 42; "Ashley" spent (25 - 10) + (67 - 40) = 42 time units in the office
returns null; id "Walter" was never added to the system
returns "invalid_request"; "Walter" was never added to the system

Level 2
Introduce an operation to retrieve ordered statistics about the workers.

topNWorkers(n, position) — should return the list of strings representing ids of the top n workers with the given position sorted in descending order by the total time spent in the office. The amount of time is calculated using finished working sessions only. In the case of a tie, workers must be sorted in alphabetical order of their ids. The returned list should be in the following format: ["workerId1(timeSpentInOffice1)", "workerId2(timeSpentInOffice2)", ..., "workerIdN(timeSpentInOfficeN)"]. If less than n workers with the given position exist within the system, then return all ids in the described format. If there are no workers with the given position within the system, return an empty list. Note that if a worker exists within the system and doesn't have any finished periods of being in the office, their time spent in the office is considered to be 0.
Examples
The example below shows how this operation should work (the section is scrollable to the right):

Queries	Explanations
addWorker("John", "Junior Developer", 120)
addWorker("Jason", "Junior Developer", 120)
addWorker("Ashley", "Junior Developer", 120)
register("John", 100)
register("John", 150)
register("Jason", 200)
register("Jason", 250)
register("Jason", 275)
topNWorkers(5, "Junior Developer")
topNWorkers(1, "Junior Developer")
register("Ashley", 400)
register("Ashley", 500)
register("Jason", 575)
topNWorkers(3, "Junior Developer")
topNWorkers(3, "Middle Developer")
returns true
returns true
returns true
returns "registered"
returns "registered"; now "John" has 50 time units spent in the office
returns "registered"
returns "registered"; now "Jason" has 50 time units spent in the office
returns "registered"; "Jason" entered the office at timestamp 275
returns ["Jason(50)", "John(50)", "Ashley(0)"]; "Jason" goes before "John" alphabetically
returns ["Jason(50)"];
returns "registered"
returns "registered"; now "Ashley" has 100 time units spent in the office
returns "registered"; "Jason" left the office and now has 50 + (575 - 275) = 350 time units spent in the office
returns ["Jason(350)", "Ashley(100)", "John(50)"];
returns []; there are no workers with position "Middle Developer"

Level 3
Introduce operations for worker promotion and salary calculation.

promote(workerId, newPosition, newCompensation, startTimestamp) — should register a new position and new compensation for the workerId. newPosition is guaranteed to be different from the current worker's position. New position and new compensation are active from the moment of the first entering the office after or at startTimestamp. In other words, the first time period of being in office for the newPosition is the first time period that starts after or at startTimestamp. startTimestamp is guaranteed to be greater than timestamp parameter of the last register call for any worker. If the promote operation is called repeatedly for the same workerId before they entered the office with the newPosition, nothing happens, and this operation should return "invalid_request". If workerId doesn't exist within the system, nothing happens, and this operation should return "invalid_request". If the worker's promotion was successfully registered, return "success".

Note: topNWorkers operation should take only the worker's current position into account. get operation should return the total amount of time across all the worker's past and current positions.

calcSalary(workerId, startTimestamp, endTimestamp) — should calculate net salary that workerId has earned for the time period between startTimestamp and endTimestamp. No restrictions are applied to startTimestamp and endTimestamp, except that it is guaranteed that endTimestamp > startTimestamp >= 0. Note that workers are only paid for the time they were present in the office. The amount of time is calculated using finished working sessions only. For any finished working session [sessionStartTimestamp, sessionEndTimestamp] salary is calculated as salary = (sessionEndTimestamp - sessionStartTimestamp) * compensationDuringPeriod. Note, that compensationDuringPeriod may differ for different periods, because workers may be promoted. If workerId doesn't exist within the system, nothing happens and this operation should return null

Examples
The example below shows how these operations should work (the section is scrollable to the right):

Queries	Explanations
addWorker("John", "Middle Developer", 200)
register("John", 100)
register("John", 125)
promote("John", "Senior Developer", 500, 200)
register("John", 150)
promote("John", "Senior Developer", 350, 250)
register("John", 300)
register("John", 325)

calcSalary("John", 0, 500)


topNWorkers(3, "Senior Developer")
register("John", 400)
get("John")
topNWorkers(10, "Senior Developer")
topNWorkers(10, "Middle Developer")
calcSalary("John", 110, 350)


calcSalary("John", 900, 1400)
returns true
returns "registered"
returns "registered"; now "John" has 25 time units spent in the office
returns "success"; at timestamp 200 new position and new compensation will be granted to "John"
returns "registered"; "John" enters the office
returns "invalid_request"; "John" has an active new position registered, which is not applied yet
returns "registered"; "John" leaves the office. Now this worker has 25 + (300 - 150) = 175 time units spent in the office
returns "registered"; "John" enters the office at timestamp 325. It is greater than the new position's starting timestamp 200,
        so the new position and new compensation are assigned.
returns 35000; during the period [0, 500], there were two time periods when "John" was in the office:
        [100, 125], [150, 300] as "Middle Developer" with compensation = 200.
        Salary is calculated as (125 - 100) * 200 + (300 - 150) * 200 = 35000.
returns ["John(0)"]; since new position was assigned for "John" but they didn't finish their working session, they have `0` time units spent.
returns "registered"; "John" now has 175 time units in the office as "Middle Developer" and 400 - 325 = 75 time units in the office as "Senior Developer"
returns 250; time units "John" spent in the office across all the positions is 75 + 175 = 250
returns ["John(75)"];
returns []; Since topNWorkers operation takes into account only the current positions, "John" is not counted.
returns 45500; During the period [110, 350], there were three time periods when "John" was in the office:
        [110, 125] and [150, 300] as "Middle Developer" with compensation = 200, and [325, 350] as "Senior Developer" with compensation = 500.
        Salary is calculated as (125 - 110) * 200 + (300 - 150) * 200 + (350 - 325) * 500 = 45500
returns 0

Level 4
Introduce an operation for setting double-paid periods.

void SetDoublePaid(int startTimestamp, int endTimestamp) — should set the time period between startTimestamp and endTimestamp to be a double-paid period. No restrictions are applied to startTimestamp and endTimestamp, except that it is guaranteed that endTimestamp > startTimestamp >= 0. Multiple double-paid periods can be set. Double-paid periods may overlap but they still will be double-paid only.

Note: CalcSalary operation should take double-paid periods into account.

Examples
The example below shows how these operations should work (the section is scrollable to the right):

Queries	Explanations
AddWorker("John", "Middle Developer", 100)
Register("John", 100)
Register("John", 200)
Register("John", 500)
Register("John", 600)
Register("John", 900)
Register("John", 1000)
SetDoublePaid(50, 170)
SetDoublePaid(530, 650)
SetDoublePaid(580, 900)



CalcSalary("John", 0, 250)



CalcSalary("John", 0, 1500)

returns true
returns "registered"
returns "registered"; now "John" has 100 time units spent in the office: [100, 200]
returns "registered"
returns "registered"; now "John" has 200 time units spent in the office: [100, 200], [500, 600]
returns "registered"
returns "registered"; now "John" has 300 time units spent in the office: [100, 200], [500, 600], [900, 1000]
returns null; now there is one double-paid period, which is [50, 170]
returns null; now there are two double-paid periods: [50, 170] and [530, 650]
returns null; now there are three double-paid periods: [50, 170], [530, 650], and [580, 900].
There are two overlapping double-paid periods: [530, 650], [580, 900].
As overlapping doesn't affect the amount to be paid, we may think of it as a single double-paid period [530, 900].
Thus, we will consider two double-paid periods: [50, 170], [530, 900].
returns 17000; During the period [0, 250], there was one period of time when "John" was in the office: [100, 200].
There is one double-paid period affecting this period of time: [50, 170].
So, time period [100, 170] is double paid and time period [170, 200] is not.
Salary is calculated as (170 - 100) * 100 * 2 + (200 - 170) * 100 = 17000
returns 44000; Following the same logic as in the previous operation,
salary is calculated as (170 - 100) * 100 * 2 + (200 - 170) * 100 + (530 - 500) * 100 + (600 - 530) * 100 * 2 + (1000 - 900) * 100 = 44000