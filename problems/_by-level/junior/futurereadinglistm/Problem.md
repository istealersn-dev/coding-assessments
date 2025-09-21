# Instructions

Your task is to implement some UI features of a digital reading list. All operations that should be supported are listed below.

Solving this task consists of several levels. Subsequent levels are opened when the current level is correctly solved. You always have access to the data for the current and all previous levels.

Notes:

Please use the provided templates, as tests will access elements by using CSS selectors. If you change the structure of the DOM elements, tests will fail.
However, keep in mind that templates are given in HTML, and you might need to convert them to your framework's template syntax.
All tests except sample.test.js are read-only. Please use sample.test.js for logging and debugging.
The application installs all required dependencies and starts automatically when you open the question, but make sure to click the refresh iconwhen the application starts, to see the preview.
Requirements
Your task is to implement some UI features of a digital reading list. Plan your design according to the level specifications below (the current level is in bold):

Level 1: The digital reading list should show the books in the reading list.
Level 2: The digital reading list should support adding new books to the reading list via form.
Level 3: The digital reading list should support rendering the list of books from a different source via API.
Level 4: The digital reading list should support changing the order of the books.
To move to the next level, you need to pass all the tests at this level when submitting the solution.

Level 1
Your task is to render the reading list from JSON objects containing metadata about books. Specifically, the list should consist of multiple cards, with each card representing a single book. The resulting page should look as follows:

<https://codesignal-assets.s3.amazonaws.com/uploads/1687202947155/level1.png?raw=true>

This is the HTML template for the metadata of a single book card (note that it's pure HTML, and you might need to convert it to your framework's template syntax):

<article class="book">
  <header>
    <h4 class="book__title">Clean Code: A Handbook of Agile Software Craftsmanship</h4>
    <span class="book__author">Author: Robert C. Martin</span>
    <span class="book__year">Year: 2008</span>
  </header>
  <p class="book__notes">I feel like this book is a must-have for every Software Engineer</p>
</article>
Acceptance Criteria
Scenario: Displaying all relevant information about books in a list
  Given A JSON object (called "bookData", imported in bookService from bookData.json) containing metadata about books
   When Page is rendered
   Then All books are displayed based on the given template

Level 2
The system should allow users to add new books to the list. For this level, implement functionality to support such user input via an Add book form. The following video shows the expected behavior of this form:

<https://codesignal-assets.s3.amazonaws.com/uploads/1687202947759/level2.mp4>

Note: If you are not able to view the video properly, please use this link to access it.

This is the HTML template for the Add book form:

<form class="add-book-form">
  <input name="title" placeholder="Title*" />
  <input name="author" placeholder="Author" />
  <input name="year" type="number" placeholder="Year" />
  <textarea name="personalNotes" placeholder="Your personal notes"></textarea>
  <input type="submit" value="Add new book" />
</form>
Note: In order to generate a unique ID, import the uuid library and use the uuidv4() function. Alternatively, you can use any unique randomly generated string.

Acceptance Criteria
Scenario: Displaying the "Add book" form
   When Page is rendered
   Then The "Add book" form is displayed based on the given template at the top of the page
Scenario: Submitting the "Add book" form
  Given Mandatory "Title" field is filled
   When "Add new book" button is clicked
   Then Form is submitted successfully
    And New book is added to the bottom of the reading list
    And All form fields are cleared
Scenario: Submitting the "Add book" form with empty mandatory field
  Given Mandatory field "Title" is empty
   When "Add new book" button is clicked
   Then Form is not submitted
    And No new books are added
    And Form fields are not cleared

Level 3
For this level, instead of rendering the page using hardcoded data, implement functionality to support using APIs to retrieve data for books and their authors. You are given 2 APIs:

Books API: GET <https://api-regional.codesignalcontent.com/future-reading-list/books>

Books API response example
Authors API: GET <https://api-regional.codesignalcontent.com/future-reading-list/authors/{authorId}>

Authors API response example
This endpoint may return a 404 response code indicating that the specified author does not exist
You are not expected to optimize data retrieval. You should just request items one by one.
The Books API returns the IDs of book authors in the "authorId" fields. Some authors may be deleted, so their names should not be displayed.

After completing this level, the rendered reading list should look as follows:
<https://codesignal-assets.s3.amazonaws.com/uploads/1687202947672/level3.mp4>

Note: If you are not able to view the video properly, please use this link to access it.

Acceptance Criteria
Scenario: Using the Books API
  Given Books API returns a JSON with metadata about books
   When Reading list is rendered
   Then All books are displayed
Scenario: Display book authors
  Given A book with the "authorId" field
    And Authors API returns a 200 response with author information
   When Book card is rendered
   Then Book card contains the author name in this format: `Author: ${fullName}`
Scenario: Do not display book author when Authors API returns 404
  Given A book with the "authorId" field
    And Authors API returns a 404 response
   When Book card is rendered
   Then Author name field in book card contains an empty string
Scenario: Do not display publication year when Book API doesn't contain this data
  Given A book without the "year" field
   When Book card is rendered
   Then Year field in book card contains an empty string

Level 4
Users should be able to change the order of books in their list. For this level, implement functionality to rearrange the list by adding "Up" and "Down" buttons to every single book card. The following video shows the expected behavior of these buttons:

<https://codesignal-assets.s3.amazonaws.com/uploads/1687202947540/level4.mp4>

Note: If you are not able to see view video properly, please use this link to access it.

This is the updated HTML template for a single book card with "Up" and "Down" buttons:

<article class="book">
  <header>
    <h4 class="book__title">Clean Code: A Handbook of Agile Software Craftsmanship</h4>
    <span class="book__author">Author: Robert C. Martin</span>
    <span class="book__year">Year: 2008</span>
  </header>
  <p class="book__notes">I feel like this book is a must-have for every Software Engineer</p>
  <div class="book__buttons">
    <button aria-label="button up" class="book__button book__button--up" type="button"></button>
    <button aria-label="button down" class="book__button book__button--down" type="button"></button>
  </div>
</article>
Acceptance Criteria
Scenario: Rendering "Up" and "Down" buttons conditionally
  Given Books API returned a JSON with books data
   When Page is rendered
   Then All books are displayed based on the given template
    And Book card at the top of the list only has "Down" button
    And Book cards in the middle of the list have both "Up" and "Down" buttons
    And Book card at the bottom of the list only has "Up" button
Scenario: Changing the order of books
  Given A book card with the "Up" and/or "Down" buttons
   When "Up" or "Down" button is clicked
   Then Book card is moved up or down the list accordingly
