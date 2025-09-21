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

Level 1: The task management system should show the task details and comments sections.
Level 2: The task management system should support adding new comments via form.
Level 3: The task management system should support rendering the task details and comments from a different source via API.
Level 4: The task management system should support editing and deleting comments.
To move to the next level, you need to pass all the tests at this level when submitting the solution.

Level 1
First, the system should display a task page with task details and a comments section. For this level, implement functionality to render the comments section from JSON objects containing comments data. The resulting task page should look as follows:

https://codesignal-assets.s3.amazonaws.com/uploads/1670258921810/level1.png

You are given the HTML template for a single comment (note that it's pure HTML, and you might need to convert it to your framework's template syntax):

<div class="comment">
  <div class="comment__user">Author Name</div>
  <div class="comment__text">Comment Text</div>
</div>
Acceptance Criteria
Scenario: Displaying the comments section
  Given A JSON object (called "comments", imported in app.component.ts from commentsData.json) containing comments ordered from oldest to newest
   When Task page is rendered
   Then All comments are displayed based on the given template
    And Comments are displayed in reversed order - from newest to oldest

Level 2
The task page should allow the user to add new comments to the discussion thread. For this level, implement functionality to support user input via an Add comment form. The following video shows the expected behavior of this form:

https://codesignal-assets.s3.amazonaws.com/uploads/1669920049249/level2.mp4

Note: If you are not able to view the video properly, please use this link to access it.

You are given the HTML template for the Add comment form:

<form class="add-comment-form">
  <textarea name="comment" placeholder="Add a comment..." />
  <div class="add-comment-form__controls">
    <input class="btn btn--primary" type="submit" value="Publish" />
  </div>
</form>
Note: In order to generate a unique ID, the uuid library has been pre-installed. You may use it by importing it as follows: import { v4 as uuidv4 } from 'uuid'. Alternatively, you can use any unique randomly-generated string.

Acceptance Criteria
Scenario: Displaying "Add comment" form
   When Page is rendered
   Then The "Add comment" form is displayed based on the given template
Scenario: Submitting a non-empty form
  Given Text field of the form is not empty
   When "Publish" button is clicked
   Then New comment is added to the top of the comments section
    And Author name of the new comment is equal to "You"
    And Text field of the form is cleared
Scenario: Submitting an empty form
  Given Text field of the form is empty
   When "Publish" button is clicked
   Then Form is not submitted
    And No new comments are added

Level 3
The system should support APIs. For this level, instead of using hardcoded data, implement functionality to retrieve task data and user info using APIs. You are given 2 APIs:

Tasks API: GET https://api-regional.codesignalcontent.com:443/task-management-system-3/tasks/{taskId}

Tasks API response example
Users API: GET https://api-regional.codesignalcontent.com:443/task-management-system-3/users/{userId}

Users API response example
This endpoint may return a 404 response code indicating that the specified user does not exist.
You are not expected to optimize data retrieval. You should just request items one by one.
Information about the current user can be retrieved using me alias instead of userId id.
The Tasks API returns the IDs of comment authors in the "authorId" fields. Some users may be deleted, so their names should not be displayed (i.e., when the comment card is rendered, leave the corresponding <div> element of the "comment__user" class empty). The current user's name should be displayed as "You".

The id of the task to request is "3c403558-e579-447a-8b18-4d22e54c0047".

After completing this level, the rendered page should look as follows:
https://codesignal-assets.s3.amazonaws.com/uploads/1669920049337/level3.mp4

Note: If you are not able to view the video properly, please use this link to access it.

Acceptance Criteria
Scenario: Using the Tasks API
  Given Tasks API returns a JSON with task data
   When Task page is rendered
   Then All task data and comments are displayed
Scenario: Display comment author
  Given A comment with the "authorId" field
    And Users API returns a 200 response with user information
   When Comment card is rendered
   Then Comment card contains the user name in this format: `${firstName} ${lastName}`
Scenario: Display "You" when comment was submitted by current user
  Given A comment with the "authorId" field
    And Users API "/me" returns a response with "id" equal to "authorId"
   When Comment card is rendered
   Then Comment card contains the user name "You"
Scenario: Do not display comment author when Users API returns 404
  Given A comment with the "authorId" field
    And Users API returns a 404 response
   When Comment card is rendered
   Then Comment card contains an empty string instead of the user name

Level 4
For this level, implement functionality to enable the current user to edit and delete their comments. The following video shows the expected behavior of this function:

https://codesignal-assets.s3.amazonaws.com/uploads/1669920049730/level4.mp4
Note: If you are not able to view the video properly, please use this link to access it.

You are given an updated HTML template for a single comment:

<div class="comment">
  <div class="comment__user">Author Name</div>
  <div class="comment__text">Comment Text</div>
  <div class="comment__controls"> <!-- this div is only for the current user -->
    <div class="btn comment__edit-btn"></div>
    <div class="btn comment__delete-btn"></div>
  </div>
</div>
This is the HTML template for a comment in the edit view:


<div class="comment--edit">
  <form class="edit-comment-form">
    <textarea name="comment">Comment Text</textarea>
    <div class="edit-comment-form__controls">
      <input class="btn btn--secondary" type="reset" value="Cancel" />
      <input class="btn btn--primary" type="submit" value="Save" />
    </div>
  </form>
</div>
Acceptance Criteria
Scenario: Rendering "Edit comment" and "Delete comment" buttons
  Given Tasks API returned a JSON with tasks data
    And Users API returned information about users
   When Task page is rendered
   Then Comment controls are only rendered for the current user
Scenario: Deleting a comment submitted by the current user
  Given A comment with "Edit comment" and "Delete comment" buttons
   When "Delete" button is clicked
   Then Comment is deleted and not displayed in the section afterwards
Scenario: Switching to comment edit view
  Given A comment card in display view
   When "Edit" button is clicked
   Then Card is now shown in edit view
    And All other cards are shown in display view
Scenario: Clicking "Cancel" button
  Given A comment card in edit view
   When "Cancel" button is clicked
   Then All the changes made to the comment are discarded
    And Card is now shown in display view
Scenario: Clicking "Save" button when text field is filled
  Given A comment card in edit view
    And Some changes were made to the text of the comment
   When "Save" button is clicked
   Then Card is now shown in display view
    And Card has updated data
Scenario: Clicking "Save" button when some mandatory fields are empty
  Given A comment card in edit view
    And Text of the comment is empty
   When "Save" button is clicked
   Then Card remains in edit view