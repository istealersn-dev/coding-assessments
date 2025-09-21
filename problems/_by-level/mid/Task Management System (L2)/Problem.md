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

Level 1: The task management system should show the list of tasks in the backlog.
Level 2: The task management system should support adding new tasks to the backlog via form.
Level 3: The task management system should support rendering the list of tasks from a different source via API.
Level 4: The task management system should support removing tasks and adding priorities.
To move to the next level, you need to pass all the tests at this level when submitting the solution.

Level 1
First, the system should display a backlog with tasks organized into 4 sections: Won't haves, Could haves, and Must haves. Implement functionality to render the backlog from JSON objects containing tasks data. The result should look as follows:



You are given the HTML template for a single task (note that it's pure HTML, and you might need to convert it to your framework's template syntax):

<div class="card">
  <h3 class="card__title">Fix CSS</h3>
  <p class="card__description">Homepage footer uses an inline style — should use a class</p>
</div>
Acceptance Criteria
Scenario: Displaying tasks in the appropriate section on the backlog
  Given A JSON object (called "priorities", imported in App.jsx from prioritiesData.json) containing tasks data
   When Backlog is rendered
   Then All tasks are displayed in the appropriate section based on the given template


Level 2
The system should allow the user to add new tasks to the backlog. Implement functionality to support such user input via an Create task form. The following video shows the expected behavior of this form:

https://codesignal.s3.amazonaws.com/uploads/1668811533199/l2.mp4

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
    And New task is added to the \"Won't haves\" section
    And All form fields are cleared
Scenario: Submitting a form with empty mandatory fields
  Given An empty mandatory field, either `Title` or `Description`
   When "Add new task" button is clicked
   Then Form is not submitted
    And New task is not added to the backlog
    And Form fields are not cleared


Level 3
Instead of using hardcoded data, implement functionality to support using APIs to retrieve data for tasks and their priorities. You are given 2 APIs:

Backlog API: GET https://api-regional.codesignalcontent.com:443/task-management-system-2/backlog

Backlog API response example
Tasks API: GET https://api-regional.codesignalcontent.com:443/task-management-system-2/tasks/{taskId}

Tasks API response example
This endpoint may return a 404 response code indicating that the specified task does not exist
After completing this level, the backlog should look as follows:

https://codesignal.s3.amazonaws.com/uploads/1668811533783/l3.mp4
Note: If you are not able to see the video, use this link to access it.

Notes:

Feel free to use the fetch() method or any other HTTP client library to complete the task. Any desired library can be added to the package.json file and imported into your code.
The axios and superagent are already in the package.json and may be used with an import statement such as import axios from 'axios'.
Acceptance Criteria
Scenario: Using the Backlog API and Tasks API
  Given Backlog API returns a JSON with priorities and identifiers of the tasks belonging to them
    And Tasks API returns a JSON with data for a single task
   When Backlog is rendered
   Then All sections and tasks belonging to them are displayed in the corresponding sections
Scenario: Tasks API returns 404 response
  Given Tasks API returns 404 response for a particular task identifier
   When Backlog is rendered
   Then Corresponding task card should not be displayed


Level 4

Implement functionality to enable the user to delete arbitrary tasks and select the priority for the tasks which are being created. The following video shows the expected behavior of this feature:


Note: If you are not able to see the video, use this link to access it.

You are provided with the updated HTML template for a single task:

<div class="card">
  <button class="card__delete-btn"></button>
  <h3 class="card__title">Fix CSS</h3>
  <p class="card__description">Homepage footer uses an inline style — should use a class</p>
</div>
You are also given an updated HTML template for the Create task form:

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
    <select name="priority">
      <!-- Feel free to choose different "value" attributes -->
      <option value="1">Won't haves</option>
      <option value="2">Could haves</option>
      <option value="3">Must haves</option>
    </select>
    <input type="submit" value="Add new task" />
  </form>
</div>
Acceptance Criteria
Scenario: Rendering "Delete" buttons
  Given Backlog API and Tasks API
   When Backlog is rendered
   Then All tasks are displayed based on the updated template
    And All tasks contain a "Delete" button
Scenario: Deleting the task
  Given A task card with "Delete" button
   When "Delete" button is clicked
   Then Task card is removed from the backlog
Scenario: Displaying the dropdown for selecting the task priority
  Given Backlog API returns a JSON with priorities
   When "Add task" form is rendered
   Then It contains the dropdown for selecting the task priority
    And Dropdown options are displayed in the same order as in the API
    And First (and lowest) priority is selected by default
Scenario: Submitting a form
  Given `Title` and `Description` fields are filled and some priority is selected
   When "Add new task" button is clicked
   Then Form is submitted successfully
    And New task is added to the corresponding priority section
    And All inputs are assigned their initial values