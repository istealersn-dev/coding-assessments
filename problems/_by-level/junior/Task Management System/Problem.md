Instructions
Your task is to implement some UI features of a simple task management system. All operations that should be supported are listed below.

Solving this task consists of several levels. Subsequent levels are opened when the current level is correctly solved. You always have access to the data for the current and all previous levels.

Notes:

Please use the provided templates, as tests will access elements by using CSS selectors. If you change the structure of the DOM elements, tests will fail.
However, keep in mind that templates are given in HTML, and you might need to convert them to your framework's template syntax.
All tests except sample.test.js are read-only. Please use sample.test.js for logging and debugging.
The application installs all required dependencies and starts automatically when you open the question, but make sure to click the refresh iconwhen the application starts, to see the preview.
Requirements
Your task is to implement some UI features of a task management system. Plan your design according to the level specifications below (the current level is in bold):

Level 1: The task management system should show the list of tasks in the dashboard.
Level 2: The task management system should support creating new tasks to the dashboard via form.
Level 3: The task management system should support rendering the list of tasks from a different source via API.
Level 4: The task management system should support updating status of the tasks.
To move to the next level, you need to pass all the tests at this level when submitting the solution.

Level 1
First, the system should display a dashboard with tasks organized into 3 columns: To Do, In Progress, and Done. For this level, implement functionality to render the dashboard from JSON objects containing tasks data. The result should look as follows:

https://codesignal-assets.s3.amazonaws.com/uploads/1687285984267/level1.png?raw=true

You are given the HTML template for a single task (note that it's pure HTML, and you might need to convert it to your framework's template syntax):

<div class="card">
  <h3 class="card__title">Fix CSS</h3>
  <p class="card__description">Homepage footer uses an inline style — should use a class</p>
</div>
Acceptance Criteria
Scenario: Displaying tasks in the appropriate column on the dashboard
  Given A JSON object (called "data", imported from taskData.json in App.jsx) containing tasks data
   When Dashboard is rendered
   Then All tasks are displayed in the appropriate column based on the given template

Level 2
The system should allow the user to add new tasks to the dashboard. For this level, implement functionality to support such user input via a Create task form. The following video shows the expected behavior of this form:

https://codesignal-assets.s3.amazonaws.com/uploads/1687285985845/level2.mp4
Note: If you are not able to see the video, use this link to access it.

You are given the HTML template with the Create task form:

<div class="create-task-form">
  <h2 class="create-task-form__title">Create task</h2>
  <form>
    <input
      name="title"
      placeholder="Title*"
    />
    <textarea
      name="description"
      placeholder="Description*"
    ></textarea>
    <input type="submit" value="Add new task" />
  </form>
</div>
Note: In order to generate a unique ID, the uuid library has been pre-installed. You may use it by importing it as follows: import { v4 as uuidv4 } from 'uuid'. Alternatively, you can use any unique randomly-generated string.

Acceptance Criteria
Scenario: Submitting a form
  Given Both `Title` and `Description` fields are not empty
   When "Add new task" button is clicked
   Then Form is submitted successfully
    And New task is added to the "To Do" column
    And All form fields are cleared
Scenario: Submitting a form with empty mandatory fields
  Given An empty mandatory field, either `Title` or `Description`
   When "Add new task" button is clicked
   Then Form is not submitted
    And New task is not added to the dashboard
    And Form fields are not cleared

Level 3
The system should support APIs and allow users to assign tasks to other users. For this level, instead of using hardcoded data, implement functionality to support using APIs to retrieve data for tasks and users. You are given 2 APIs:

Tasks API: GET https://api-regional.codesignalcontent.com:443/task-management-system/tasks

Tasks API response example
Users API: GET https://api-regional.codesignalcontent.com:443/task-management-system/users/{userId}

Users API response example
This endpoint may return a 404 response code indicating that the specified user does not exist
You are not expected to optimize data retrieval. You should just request items one by one.
You are given an updated HTML template for a single task:

<div class="card">
  <h3 class="card__title">Fix CSS</h3>
  <span class="card__owner">Assigned user: Lisa Lake</span> <!-- This line is optional -->
  <p class="card__description">Homepage footer uses an inline style — should use a class</p>
</div>
After completing this level, the dashboard should look as follows:
https://codesignal-assets.s3.amazonaws.com/uploads/1687285985229/level3.mp4

Note: If you are not able to see the video, use this link to access it.

Acceptance Criteria
Scenario: Using the Tasks API
  Given Tasks API returns a JSON with tasks data
   When Dashboard is rendered
   Then All tasks are displayed in the appropriate column based on the given template
Scenario: Display assigned user
  Given A task which contains the "assignedUser" field
    And Users API returns a 200 response with user information
   When Task card is rendered
   Then Task card contains information about assigned user
Scenario: Do not display assigned user when "assignedUser" doesn't exist
  Given A task which doesn't contain the "assignedUser" field
   When Task card is rendered
   Then Task card doesn't contain information about assigned user
Scenario: Do not display assigned user when Users API returns 404
  Given A task which contains the "assignedUser" field
    And Users API returns a 404 response
   When Task card is rendered
   Then Task card doesn't contain information about assigned user

Level 4
For this level, implement functionality to enable the user to move the tasks between columns. The following video shows the expect behavior of this feature:

https://codesignal-assets.s3.amazonaws.com/uploads/1687285984973/level4.mp4
Note: If you are not able to see the video, use this link to access it.

You are given an updated HTML template for a single task:

<div class="card">
  <h3 class="card__title">Fix CSS</h3>
  <span class="card__owner">Assigned user: Lisa Lake</span> <!-- This line is optional -->
  <p class="card__description">Homepage footer uses an inline style — should use a class</p>
  <div class="card__buttons">
    <button class="card__button card__button--left" type="button" /> <!-- This line is optional -->
    <button class="card__button card__button--right" type="button" /> <!-- This line is optional -->
  </div>
</div>
Acceptance Criteria
Scenario: Rendering "Move left" and "Move right" buttons conditionally
  Given Tasks API returned a JSON with tasks data
   When Dashboard is rendered
   Then All tasks are displayed in the appropriate column based on the given template
    And Tasks in the "To Do" column only have the "Move right" button
    And Tasks in the "In Progress" column have the "Move left" and "Move right" buttons
    And Tasks in the "Done" column only have the "Move left" button
Scenario: Moving cards between columns
  Given A task card with the "Move right" and/or "Move left" buttons
   When "Move right" or "Move left" button is clicked
   Then Task card is added to the end of the corresponding column
    And Task card is removed from its original column