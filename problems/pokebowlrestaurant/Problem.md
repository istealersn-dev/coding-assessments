Instructions
Your task is to implement some UI features of a simple restaurant ordering system. All operations that should be supported are listed below.

Solving this task consists of several levels. Subsequent levels are opened when the current level is correctly solved. You always have access to the data for the current and all previous levels.

Notes:

Please use the provided templates, as tests will access elements by using CSS selectors. If you change the structure of the DOM elements, tests will fail.
However, keep in mind that templates are given in HTML, and you might need to convert them to your framework's template syntax.
All tests except sample.test.js are read-only. Please use sample.test.js for logging and debugging.
The application installs all required dependencies and starts automatically when you open the question, but make sure to click the refresh iconwhen the application starts, to see the preview.
Requirements
Your task is to implement some UI features of a simple restaurant ordering system. Plan your design according to the level specifications below (the current level is in bold):

Level 1: The restaurant ordering system should show the list of orders in the order list.
Level 2: The restaurant ordering system should support adding new orders to the order list via form.
Level 3: The restaurant ordering system should support rendering the list of orers from a different source via API.
Level 4: The restaurant ordering system should support additional functionality for the orders.
To move to the next level, you need to pass all the tests at this level when submitting the solution.

Level 1
Your task is to render the list of orders from JSON objects containing order data. The result should look as follows:

https://codesignal-assets.s3.amazonaws.com/uploads/1687286414631/level1.png?raw=true

You are given the HTML template for a single order (note that it's pure HTML, and you might need to convert it to your framework's template syntax):


<div class="order">
  <span class="order__label">Base:</span>
  <span class="order__base">Brown rice</span>
  <span class="order__label">Protein:</span>
  <span class="order__protein">Salmon</span>
  <span class="order__label">Dressings:</span>
  <span class="order__dressings">Sweet chilli, Wasabi aioli</span>
</div>
Acceptance Criteria
Scenario: Displaying list of orders
  Given An array (called "orderData", imported in orderService, exposed as orderService.orders) containing orders data
   When Page is rendered
   Then All orders are displayed based on the given template


Level 2
The system should allow waiters to add new orders to the list. For this level, implement functionality to support such user input via a Create order form. The following video shows the expected behavior of this form:


Note: If you are not able to view the video properly, please use this link to access it.

You are given the HTML template for the Create order form:

<form class="create-order-form">
  <label for="base">Base:</label>
  <select id="base" name="base">
    <option value="1e286a0c-4890-4a98-ac25-87b4736daf6b">Brown rice</option>
    <option value="205993c0-2ae1-4b39-949e-176f939d5a6a">Jasmine rice</option>
    <option value="33352337-34c0-4c41-ab6d-3ae0259f6e2e">White sushi rice</option>
  </select>

  <label for="protein">Protein:</label>
  <select id="protein" name="protein">
    <option value="2c8f9ddf-50f6-4e5f-956b-3a3382589a72">Salmon</option>
    <option value="71aa45a0-4894-40b5-b701-fa28c8200b99">Mushrooms 🌱</option>
    <option value="e181188f-f881-4a5b-9b52-b42185be3b46">Tofu 🌱</option>
  </select>

  <fieldset>
    <legend>Dressings:</legend>

    <input id="9ac7495a-bd4b-4525-80d3-f6013c428b04" type="checkbox" name="dressings" value="9ac7495a-bd4b-4525-80d3-f6013c428b04"/>
    <label for="9ac7495a-bd4b-4525-80d3-f6013c428b04">Wasabi aioli</label>

    <input id="5101b3cb-1a2d-41ae-aecc-f31506d74417" type="checkbox" name="dressings" value="5101b3cb-1a2d-41ae-aecc-f31506d74417"/>
    <label for="5101b3cb-1a2d-41ae-aecc-f31506d74417">Sweet chilli</label>

    <input id="f8c9e2c6-2f44-45a9-950b-b44c17ecf215" type="checkbox" name="dressings" value="f8c9e2c6-2f44-45a9-950b-b44c17ecf215"/>
    <label for="f8c9e2c6-2f44-45a9-950b-b44c17ecf215">Teriyaki</label>
  </fieldset>

  <input class="button" type="submit" value="Create order"/>
</form>
All data required for rendering is named optionData and is imported in option.service.ts from optionData.json.

Note: In order to generate a unique ID, the uuid library has been pre-installed. You may use it by importing it as follows: import { v4 as uuidv4 } from 'uuid'. Alternatively, you can use any unique randomly-generated string.

Acceptance Criteria
Scenario: Displaying the "Create order" form
   When Page is rendered
   Then The "Create order" form is displayed based on the given template
Scenario: Submitting a form with at least one dressing selected
  Given Base, protein and at least 1 dressing are selected
   When "Create order" button is clicked
   Then New order is added to the top of the orders list
    And Form selects are returned to their initial state
Scenario: Submitting a form when none of the dressings is selected
  Given None of the dressings is selected
   When "Create order" button is clicked
   Then Form is not being submitted
    And No new orders are added
    And Form selects do not change their state


Level 3
For this level, instead of using hardcoded data, implement functionality to support using APIs to retrieve data for orders and available ingredients. You are given 2 APIs:

Orders API:

GET https://api-regional.codesignalcontent.com/poke-bowl-restaurant-1/orders

Orders API response example
Menu API:

GET https://api-regional.codesignalcontent.com/poke-bowl-restaurant-1/menu

Menu API response example
GET https://api-regional.codesignalcontent.com/poke-bowl-restaurant-1/menu/{menuItemId}

Menu Items API response example
This endpoint may return a 404 response code indicating that the specified menu item does not exist
You are not expected to optimize data retrieval. You should just request items one by one.
The Orders API and Menu API return the IDs of menu items in their fields.

After completing this level, the rendered orders list should look as follows:
https://codesignal-assets.s3.amazonaws.com/uploads/1687286415078/level3.mp4

Note: If you are not able to view the video properly, please use this link to access it.

Acceptance Criteria
Scenario: Using the Orders API and Menu Items API
  Given Orders API returns an array of orders and their ingredients
    And Menu Items API returns data for every single ingredient
   When Orders list is rendered
   Then All orders are displayed with their ingredients
Scenario: Display "Create order" form
  Given Menu API returns all available ingredients
    And Menu Items API returns data for every single ingredient and its availability
   When "Create order" form is rendered
   Then "Base" select displays all available ingredients
   Then "Protein" select displays all available ingredients
   Then "Dressings" select displays all available dressings


Level 4
For this level, your task is to enable the waiters to create "To-Go" orders and to delete orders by clicking the "Complete order" button. The following video shows the expected behavior of the updated "Create order" form and of the "Complete order" button:


Note: If you are not able to view the video properly, please use this link to access it.

You are given an updated HTML template for a single order with the "Complete order" button and "To Go" label:

<div class="order">
  <span class="order__label">Base:</span>
  <span class="order__base">Brown rice</span>

  <span class="order__label">Protein:</span>
  <span class="order__protein">Salmon</span>

  <span class="order__label">Dressings:</span>
  <span class="order__dressings">Sweet chilli, Wasabi aioli</span>

  <span class="order__label">To go 🥡</span> <!-- This line is optional -->

  <button class="order__complete-btn">Complete order</button>
</div>
You are given an updated HTML template for the "Create order" form:

<form class="create-order-form">
  <label for="base">Base:</label>
  <select id="base" name="base">
    <option value="1e286a0c-4890-4a98-ac25-87b4736daf6b">Brown rice</option>
    <option value="205993c0-2ae1-4b39-949e-176f939d5a6a">Jasmine rice</option>
    <option value="33352337-34c0-4c41-ab6d-3ae0259f6e2e">White sushi rice</option>
  </select>

  <label for="protein">Protein:</label>
  <select id="protein" name="protein">
    <option value="2c8f9ddf-50f6-4e5f-956b-3a3382589a72">Salmon</option>
    <option value="71aa45a0-4894-40b5-b701-fa28c8200b99">Mushrooms 🌱</option>
    <option value="e181188f-f881-4a5b-9b52-b42185be3b46">Tofu 🌱</option>
  </select>

  <fieldset>
    <legend>Dressings:</legend>

    <input id="9ac7495a-bd4b-4525-80d3-f6013c428b04" type="checkbox" name="dressings" value="9ac7495a-bd4b-4525-80d3-f6013c428b04"/>
    <label for="9ac7495a-bd4b-4525-80d3-f6013c428b04">Wasabi aioli</label>

    <input id="5101b3cb-1a2d-41ae-aecc-f31506d74417" type="checkbox" name="dressings" value="5101b3cb-1a2d-41ae-aecc-f31506d74417"/>
    <label for="5101b3cb-1a2d-41ae-aecc-f31506d74417">Sweet chilli</label>

    <input id="f8c9e2c6-2f44-45a9-950b-b44c17ecf215" type="checkbox" name="dressings" value="f8c9e2c6-2f44-45a9-950b-b44c17ecf215"/>
    <label for="f8c9e2c6-2f44-45a9-950b-b44c17ecf215">Teriyaki</label>
  </fieldset>

  <!-- This is the new To-Go checkbox -->
  <div class="to-go-checkbox">
    <input id="to-go" name="toGo" type="checkbox"/>
    <label for="to-go">To go</label>
  </div>

  <input class="button" type="submit" value="Create order"/>
</form>
Acceptance Criteria
Scenario: Displaying "Complete order" buttons
   When Orders list is rendered
   Then All orders have "Complete order" button
Scenario: Clicking "Complete order" button
  Given An order with the "Complete order" button
   When "Complete order" button is clicked
   Then Order is removed from the list
Scenario: Displaying "To Go" checkbox in the "Create order" form
   When "Create order" form is rendered
   Then It has "To Go" checkbox
Scenario: Creating a "To Go" order
  Given Base, protein and at least 1 dressing are selected
    And "To Go" checkbox is checked
   When "Create order" button is clicked
   Then New order is added to the top of the orders list
    And It has "To go 🥡" label
    And Form selects are returned to their initial state