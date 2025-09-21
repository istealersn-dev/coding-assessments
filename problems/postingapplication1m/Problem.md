Instructions
Your task is to implement some UI features of a simplified microblogging platform. All operations that should be supported are listed below.

Solving this task consists of several levels. Subsequent levels are opened when the current level is correctly solved. You always have access to the data for the current and all previous levels.

Notes:

Please use the provided templates, as the tests will access elements by using CSS selectors. If you change the structure of the DOM elements, the tests will fail.
However, keep in mind that templates are given in HTML, and you might need to convert them to your framework's template syntax.
All tests except sample.test.js are read-only. Please use sample.test.js for logging and debugging.
The application installs all required dependencies and starts automatically when you open the question, but make sure to click the refresh iconwhen the application starts, to see the preview.
Requirements
Your task is to implement some UI features of a simplified microblogging platform. Plan your design according to the level specifications below (the current level is in bold):

Level 1: The microblogging platform should show the list of blog posts.
Level 2: The microblogging platform should support adding new posts to the blog via form.
Level 3: The microblogging platform should support rendering the list of posts from a different source via API.
Level 4: The microblogging platform should support rendering "Like" and "Delete" buttons and support the functionality.
To move to the next level, you need to pass all the tests at this level when submitting the solution.

Level 1
Your task is to render the post feed from JSON objects containing data on blog posts. The result should look as follows:
https://codesignal-assets.s3.amazonaws.com/uploads/1687197675544/level1.png?raw=true

This is the HTML template for a single post (note that it's pure HTML, and you might need to convert it to your framework's template syntax):

<article class="post">
  <header>
    <p class="post__author">John Doe</p>
  </header>
  <p class="post__text">Hello there</p>
</article>
Acceptance Criteria
Scenario: Displaying posts
  Given A JSON object (called "postsData", imported from posts.json in posts.service.ts) containing posts data
   When Page is rendered
   Then All posts are displayed based on the given template in a post feed

Level 2
The system should allow the user to add new posts to the feed. For this level, implement functionality to support such user input via an Create post form. The following video shows the expected behavior of this form:

https://codesignal-assets.s3.amazonaws.com/uploads/1687197675828/level2.mp4
Note: If you are not able to view the video properly, please use direct link to access it.

This is the HTML template for the Create post form:

<form class="create-post-form">
  <textarea placeholder="Your new post*"></textarea>
  <input type="submit" value="Publish post" />
</form>
Note: In order to generate a unique ID, the uuid library has been pre-installed. You may use it by importing it as follows: import { v4 as uuidv4 } from 'uuid'. Alternatively, you can use any unique randomly-generated string.

Acceptance Criteria
Scenario: Displaying "Create post" form
   When Page is rendered
   Then "Create post" form is displayed based on the given template
Scenario: Submitting a non-empty form
  Given Text field contains some message
   When "Publish post" button is clicked
   Then New post is added to the top of the post feed
    And Author name for the new post is "You"
    And Text field is cleared
Scenario: Submitting an empty form
  Given Text field is empty
   When "Publish post" button is clicked
   Then Form is not submitted
    And Post is not added to the feed

Level 3
For this level, instead of using hardcoded data, implement functionality to support using APIs to retrieve data for posts and users. You are given 2 APIs:

Posts API:

GET https://api-regional.codesignalcontent.com/posting-application-2/posts
Users API:

GET https://api-regional.codesignalcontent.com/posting-application-2/users/{userId}
GET https://api-regional.codesignalcontent.com/posting-application-2/users/me
You are not expected to optimize data retrieval. You should just request items one by one.

The Posts API returns the IDs of post authors in the "authorId" fields. Some users may be deleted, so their names should not be displayed (i.e., when the comment card is rendered, leave the corresponding <div> element of the "post__author" class empty). The current user's name should be displayed as "You".

After completing this level, the page should look as follows:

https://codesignal-assets.s3.amazonaws.com/uploads/1687197676165/level3.mp4
Note: If you are not able to view the video properly, please use direct link to access it.

Acceptance Criteria
Scenario: Using the Posts API
  Given Posts API returns a JSON with posts data
   When Page is rendered
   Then All posts are displayed in a post feed
Scenario: Display post author
  Given A post with the "authorId" field
    And Users API returns a 200 response with user information
   When Post card is rendered
   Then Post card contains the user name in this format: `${firstName} ${lastName}`
Scenario: Display "You" when post was published by active user
  Given A post with the "authorId" field
    And Users API "/me" returns a response with "id" equal to "authorId"
   When Post card is rendered
   Then Post card contains the user name "You"
Scenario: Do not display post author when Users API returns 404
  Given A post with the "authorId" field
    And Users API returns a 404 response
   When Post card is rendered
   Then Post card does not contain the user name field

Level 4
The microblogging platform should support user engagement. For this level, your task is to add the following buttons to all posts:

"Like" button, and sort posts by the number of likes (as shown in the example video below), or in case of a tie, by the order in which they reached the number of likes
"Delete" button that will only delete posts published by the active user

https://codesignal-assets.s3.amazonaws.com/uploads/1687197676237/level4.mp4

Note: If you are not able to view the video properly, please use direct link to access it.

This is the updated HTML template for a single post with a "Like" button, a likes counter, and a "Delete" button:

<article class="post">
  <header>
    <p class="post__author">
      John Doe
    </p>
  </header>
  <p class="post__text">Your new post*</p>
  <div class="post__footer">
    <div class="like-button">
      <span class="like-button__icon"></span>
      <span class="like-button__likes-number">1</span>
    </div>
    <!-- div below is optional and should only be displayed for posts published by you -->
    <div class="delete-button">
      <span class="delete-button__icon"></span>
    </div>
  </div>
</article>
Acceptance Criteria
Scenario: Displaying posts
  Given Posts API returns a JSON with posts data
   When Page is rendered
   Then All posts are displayed based on the updated template in a post feed
    And All posts have a "Like" button
    And All posts published by you have "Delete" button
    And All posts are sorted by number of likes in descending order
Scenario: Clicking the "Like" button
  Given Post cards within a post feed
   When "Like" button on one post is clicked
   Then Increment likes counter for this post by one
    And Move post up the feed (if necessary) so all posts are sorted by number of likes in descending order
    And If multiple posts have equal number of likes, the ones which reached this number earlier should be displayed at the top
Scenario: Adding a new post
  Given Text field contains some message
   When "Publish post" button is clicked
   Then New post is added to the bottom of the feed
    And New post initially has 0 likes
Scenario: Clicking the "Delete" button
  Given Post cards within a post feed
   When "Delete" button on a post published by "You" is clicked
   Then Post is deleted from the feed