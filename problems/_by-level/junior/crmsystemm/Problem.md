Instructions
Your task is to implement some UI features of a customer relationship management system. All operations that should be supported are listed below.

Solving this task consists of several levels. Subsequent levels are opened when the current level is correctly solved. You always have access to the data for the current and all previous levels.

Notes:

Please use the provided templates, as tests will access elements by using CSS selectors. If you change the structure of the DOM elements, tests will fail.
However, keep in mind that templates are given in HTML, and you might need to convert them to your framework's template syntax.
All tests except sample.test.js are read-only. Please use sample.test.js for logging and debugging.
The application installs all required dependencies and starts automatically when you open the question, but make sure to click the refresh iconwhen the application starts, to see the preview.
Requirements
Your task is to implement some UI features of a customer relationship management system. Plan your design according to the level specifications below (the current level is in bold):

Level 1: The customer relationship management system should show the list of customer cards in the dashboard.
Level 2: The customer relationship management system should support adding new customers to the dashboard via form.
Level 3: The customer relationship management system should support rendering the list of customers from a different source via API.
Level 4: The customer relationship management system should support editing customer information.
To move to the next level, you need to pass all the tests at this level when submitting the solution.

Level 1
First, the system should display a dashboard with customer cards containing their personal data and marketing data. For this level, implement functionality to render the dashboard from JSON objects containing customer data. The result should look as follows:

https://codesignal-assets.s3.amazonaws.com/uploads/1687200132798/level1.mp4

Note: If you are not able to view the video properly, please use this link to access it.

This is the HTML template for a customer card (note that it's pure HTML, and you might need to convert it to your framework's template syntax):

<article class="customer">
  <h3>John Richardson</h3>
  <div class="customer__stats">
    <div class="stats">
      <span class="stats__number">855</span>
      <span class="stats__description">loyalty points</span>
    </div>
    <div class="stats">
      <span class="stats__number">7</span>
      <span class="stats__description">purchases</span>
    </div>
  </div>

  <h4 class="customer__key">Email</h4>
  <span class="customer__value customer__email">johncrichardson@gmail.com</span>

  <h4 class="customer__key">Phone number</h4>
  <span class="customer__value customer__phone-number">501-625-3733</span>

  <h4 class="customer__key">Personal manager</h4>
  <span class="customer__value customer__personal-manager">Alina Gray</span>
</article>
Acceptance Criteria
Scenario: Displaying customer cards on the dashboard
  Given A JSON object (called "customers") containing customer data (imported in customersService, exposed as customersService.customers)
   When Dashboard is rendered
   Then All customer cards are displayed based on the given template
    And Customer cards contain customer names in the following format: `${firstName} ${lastName}`

Level 2
The system should allow the user to add new customers to the dashboard. For this level, implement functionality to support such user input via an Add a new customer form. The following video shows the expected behavior of this form:

https://codesignal-assets.s3.amazonaws.com/uploads/1687730327739/level2.mp4

Note: If you are not able to view the video properly, please use this link to access it.

This is the HTML template for the Add a new customer form:

<form class="add-customer-form">
  <input name="firstName" placeholder="First name*" />
  <input name="lastName" placeholder="Last name*" />
  <input name="email" type="email" placeholder="Email*" />
  <input name="phoneNumber" placeholder="Phone number" />
  <input class="btn btn--primary" type="submit" value="Add" />
</form>
The HTML template for a customer card remains as is except some sections become optional:

<article class="customer">
  <h3>John Richardson</h3>
  <div class="customer__stats">
    <div class="stats">
      <span class="stats__number">855</span>
      <span class="stats__description">loyalty points</span>
    </div>
    <div class="stats">
      <span class="stats__number">7</span>
      <span class="stats__description">purchases</span>
    </div>
  </div>

  <h4 class="customer__key">Email</h4>
  <span class="customer__value customer__email">johncrichardson@gmail.com</span>

  <!-- Display section below only if "phoneNumber" field is not empty -->
  <h4 class="customer__key">Phone number</h4>
  <span class="customer__value customer__phone-number">501-625-3733</span>

  <!-- Display section below only if "personalManager" field is not empty -->
  <h4 class="customer__key">Personal manager</h4>
  <span class="customer__value customer__personal-manager">Alina Gray</span>
</article>
Note: In order to generate a unique ID, the uuid library has been pre-installed. You may use it by importing it as follows: import { v4 as uuidv4 } from 'uuid'. Alternatively, you can use any unique randomly-generated string.

Acceptance Criteria
Scenario: Submitting a filled form
  Given `First name`, `Last name` and `email` fields are not empty
   When "Add" button is clicked
   Then Form is submitted successfully
    And New customer card is added to the bottom of the dashboard
    And Number of purchases on the card is equal to 0
    And Number of loyalty points on the card is equal to 0
    And "Personal manager" field is not displayed
    And Form fields are cleared
Scenario: Submitting a form with empty mandatory fields
  Given An empty mandatory field, either `First name`, `Last name`, or `email`
   When "Add" button is clicked
   Then Form is not submitted
    And New customer card is not added to the dashboard
    And Form fields are not cleared

Level 3
For this level, instead of rendering the page using hardcoded data, implement functionality to support using APIs to retrieve data for customers and their personal managers. You are given 2 APIs:

Customers API: GET https://api-regional.codesignalcontent.com/crm-system-1/customers

Customers API response example
Personal Managers API: GET https://api-regional.codesignalcontent.com/crm-system-1/managers/${personalManagerId}

Personal Managers API response example
This endpoint may return a 404 response code indicating that the specified personal manager does not exist
You are not expected to optimize data retrieval. You should just request items one by one.
The Customers API returns the IDs of personal managers in the "personalManagerId" field. Some customers don't have personal managers or their personal managers may be deleted, in this case the whole personal manager section should not be displayed in the customer card.

After completing this level, the rendered dashboard should look as follows:

https://codesignal-assets.s3.amazonaws.com/uploads/1687200132836/level3.mp4

Note: If you are not able to view the video properly, please use this link to access it.

Acceptance Criteria
Scenario: Using the Customers API
  Given Customers API returns a JSON with customers data
   When Dashboard is rendered
   Then All customers are displayed
Scenario: Displaying personal managers
  Given A customer with non-empty "personalManagerId" field
    And Personal Managers API returns a 200 response with personal manager information
   When Customer card is rendered
   Then Personal manager information is displayed
Scenario: Personal manager not assigned to customer
  Given A customer without "personalManagerId" field
   When Customer card is rendered
   Then Personal manager information is not displayed
Scenario: Personal manager doesn't exist
  Given A customer with non-empty "personalManagerId" field
    And Personal Managers API returns a 404 response for the given ID
   When Customer card is rendered
   Then Personal manager information is not displayed

Level 4
Users should be able to edit the customer's information. For this level, add an "Edit" button to each customer card which allows switching to the customer edit view. The following video shows the expected behavior of this customer edit view:

https://codesignal-assets.s3.amazonaws.com/uploads/1687289228371/level4.mp4

Note: If you are not able to view the video properly, please use this link to access it.

To display all available personal managers in the "Assign personal manager" dropdown you're given a new endpoint:

Personal Managers API: GET https://api-regional.codesignalcontent.com/crm-system-1/managers

Personal Managers API response example
This is the updated HTML template for a customer card with the "Edit" button:

<article class="customer">
  <span class="customer__edit-btn"></span><!-- This is the new "Edit" button -->
  <h3>John Richardson</h3>
  <div class="customer__stats">
    <div class="stats">
      <span class="stats__number">855</span>
      <span class="stats__description">loyalty points</span>
    </div>
    <div class="stats">
      <span class="stats__number">7</span>
      <span class="stats__description">purchases</span>
    </div>
  </div>
  <h4 class="customer__key">Email</h4>
  <span class="customer__value customer__email">johncrichardson@gmail.com</span>

  <!-- Display section below only if "phoneNumber" field is not empty -->
  <h4 class="customer__key">Phone number</h4>
  <span class="customer__value customer__phone-number">501-625-3733</span>

  <!-- Display section below only if "personalManagerId" field is not empty and Personal Managers API returns 200 response -->
  <h4 class="customer__key">Personal manager</h4>
  <span class="customer__value customer__personal-manager">Alina Gray</span>
</article>
This is the HTML template for a customer card edit view:

<article class="customer--edit">
  <form class="customer-edit-form">
    <input name="firstName" placeholder="First name*" value="John" />
    <input name="lastName" placeholder="Last name*" value="Richardson" />
    <input name="email" type="email" placeholder="Email*" value="johncrichardson@gmail.com" />
    <input name="phoneNumber" placeholder="Phone number" value="501-625-3733" />
    <select>
      <option value=""></option>
      <option value="a9f39c40-b073-11ec-b909-0242ac120002">Philip Hilton</option>
      <option value="a5caa712-b073-11ec-b909-0242ac120002">Lynda Olson</option>
      <!-- You can retrieve the rest of the options from the new Personal Managers API gateway -->
    </select>

    <input class="btn btn--secondary" type="reset" value="Cancel" />
    <input class="btn btn--primary" type="submit" value="Save" />
  </form>
</article>
Acceptance Criteria
Scenario: Rendering "Edit" button
  Given Customers API returns a JSON with customers data
   When Dashboard is rendered
   Then All customer cards have an "Edit" button
Scenario: Switching to customer edit view
  Given A customer card in display view
   When "Edit" button is clicked
   Then Card is now shown in edit view
    And All other cards are shown in display view
Scenario: Clicking "Cancel" button
  Given A customer card in edit view
   When "Cancel" button is clicked
   Then All the changes made to customer are discarded
    And Card is now shown in display view
Scenario: Clicking "Save" button when mandatory fields are filled
  Given A customer card in edit view
    And Some changes to customer were made
   When "Save" button is clicked
   Then Card is now shown in display view
    And Card has updated data
Scenario: Clicking "Save" button when some mandatory fields are empty
  Given A customer card in edit view
    And Either `First name`, `Last name`, or `email` field is empty
   When "Save" button is clicked
   Then Card remains in edit view