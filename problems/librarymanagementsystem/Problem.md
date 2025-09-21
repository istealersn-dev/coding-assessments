Instructions
Your task is to implement some UI features of a library management system. All operations that should be supported are listed below.

Solving this task consists of several levels. Subsequent levels are opened when the current level is correctly solved. You always have access to the data for the current and all previous levels.

Notes:

Please use the provided templates, as tests will access elements by using CSS selectors. If you change the structure of the DOM elements, tests will fail.
However, keep in mind that templates are given in HTML, and you might need to convert them to your framework's template syntax.
All tests except sample.test.js are read-only. Please use sample.test.js for logging and debugging.
The application installs all required dependencies and starts automatically when you open the question, but make sure to click the refresh iconwhen the application starts, to see the preview.
Requirements
Your task is to implement some UI features of a library management system. Plan your design according to the level specifications below (the current level is in bold):

Level 1: The library management system should show the list of books in the catalog.
Level 2: The library management system should support adding new books to the catalog via form.
Level 3: The library management system should support rendering the list of books from a different source via API.
Level 4: The library management system should support grouping books by specific constraints.
To move to the next level, you need to pass all the tests at this level when submitting the solution.

Level 1
Your task is to render the catalog from JSON objects containing metadata about the books. Specifically, the list should consist of cards, with each card representing a single book. The cards should be grouped into sections by the first letter of the author's last name. Within each section, the authors should be ordered by last name. The resulting page should look as follows:



This is the HTML template for the metadata of a single book card:

<section class="group">
  <h3 class="group__label">A</h3>
  <div class="books-container">
    <div class="book">
      <h3 class="book__title">Tau Zero</h3>
      <p class="book__author">Author: Poul Anderson</p>
      <p class="book__year">Year: 1976</p>
    </div>
    ...
  </div>
</section>
Acceptance Criteria
Scenario: Displaying all relevant information about books in a list by author's last name
   Given A JSON object (called "bookData", imported in App.jsx from bookData.json) containing metadata about books
    When Page is rendered
    Then A section is created for the first letter of each author's last name
     And All books are displayed in the correct sections, ordered by the author's last name


Level 2
The system should allow users to add new books to the catalog. For this level, implement functionality to support adding books via an Add Book form. 'Title', 'Author First Name', and 'Author Last Name' are required fields. The following video shows the expected behavior of this form:
https://codesignal.s3.amazonaws.com/uploads/1663278585084/example2.mp4

Note: If you are not able to view the video properly, please use this link to access it.

This is the HTML template for the Add book form:

<form class="add-book-form">
  <input name="title" placeholder="Title*" />
  <input name="authorFirst" placeholder="Author First Name*" />
  <input name="authorLast" placeholder="Author Last Name*" />
  <input name="year" type="number" placeholder="Year" />
  <input type="submit" value="Add new book" />
</form>
Note: In order to generate a unique ID, the uuid library has been pre-installed. You may use it by importing it as follows: import { v4 as uuidv4 } from 'uuid'. Alternatively, you can use any unique randomly-generated string.

Acceptance Criteria
Scenario: Displaying the "Add book" form
   When Page is rendered
   Then The "Add book" form is displayed based on the given template at the top of the page
Scenario: Submitting the "Add book" form
   Given Mandatory fields "Title", "Author First Name", and "Author Last Name" are filled
    When "Add new book" button is clicked
    Then Form is submitted successfully
     And New book is added to the catalog
     And All form fields are cleared
Scenario: Submitting the "Add book" form with empty mandatory field
   Given Mandatory field "Title", "Author First Name" or "Author Last Name" is empty
    When "Add new book" button is clicked
    Then Form is not submitted
     And No new books are added
     And Form fields are not cleared

Level 3
For this level, instead of rendering the page using hardcoded data, implement functionality to support using APIs to retrieve data for books and their authors. You are given 2 APIs:

Books API: GET https://api-regional.codesignalcontent.com:443/library-management-system-1/books

Books API response example
Authors API: GET https://api-regional.codesignalcontent.com:443/library-management-system-1/authors/{authorId}

Authors API response example
This endpoint may return a 404 response code indicating that the specified author does not exist
You are not expected to optimize data retrieval. You should just request items one by one.
The Books API returns the IDs of book authors in the "authorId" field. Some authors may be deleted - if so, their books should not be displayed. In addition, some books may not have publication years. In this case, the year field should not be displayed. When displaying the books, within each group the books should be ordered by the author's last name.

After completing this level, the rendered catalog should look as follows:
https://codesignal.s3.amazonaws.com/uploads/1663278585689/example3.mp4

Note: If you are not able to view the video properly, please use this link to access it.

Notes:

Feel free to use the fetch() method or any other HTTP client library to complete the task. Any desired library can be added to the package.json file and imported into your code.
The axios and superagent libraries are already in the package.json and may be used with an import statement such as import axios from 'axios'
Acceptance Criteria
Scenario: Using the Books API
   Given Books API returns a JSON with metadata about books
    When Catalog is rendered
    Then All books are displayed
Scenario: Display book authors
   Given A book with the "authorId" field
     And Authors API returns a 200 response with author information
    When Book card is rendered
    Then Book card contains the author name in this format: `Author: ${firstName} ${lastName}`
Scenario: Do not display book author when Authors API returns 404
   Given A book with the "authorId" field
     And Authors API returns a 404 response
    Then The Book card placed in the Unknown author grouping
Scenario: Do not display publication year when Book API doesn't contain this data
   Given A book without the "year" field
    When Book card is rendered
    Then Year field in the book card is not displayed

Level 4
Users should be able to change the way books are grouped, choosing between the existing grouping by author and grouping by year. The year groups should be in ascending order and any books without year data should be grouped together as None and placed at the end of the list.

After completing this level, the rendered catalog should look as follows:
https://codesignal.s3.amazonaws.com/uploads/1663278586675/example4.mp4

Note: If you are not able to view the video properly, please use this link to access it.

This is the HTML template for the grouping toggle:

<div>
  <p>Group books by year:</p>
  <label className="switch">
      <input type="checkbox" name="sortByYear"/>
      <span className="slide"></span>
  </label>
</div>
Acceptance Criteria
Scenario: Rendering grouping toggle
   Given Books API returned a JSON with books data
    When Page is rendered
    Then A slider is displayed beneath the Add Book form
Scenario: Changing the grouping of books from author to year
   Given A listing of books grouped by author
    When The slider is toggled
    Then All books should be displayed grouped by year in ascending order
     And All books in each group are ordered by author's last name
     And All books without a year are grouped together in a final category labeled None
Scenario: Changing the grouping of books from year to author
   Given A listing of books grouped by year
    When The slider is toggled
    Then All books should be displayed grouped by author, ordered by author's last name