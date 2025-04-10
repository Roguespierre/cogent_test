# cogent_test

This test is designed to check the core functionality of the e-commerce site Practicesoftwaretesting.com (Practice Software Testing).

The test are divided into 9 test cases covering the following areas:
<p>
<ul>
<li>Product Filtering and Sorting
<li>Checking and validating product image animation
<li>Adding and removing products to and from the shopping cart
<li>Checking and verifying the animation and confirmation pop up display once products are added to the shopping cart.
<li>Confirming presence of product details on product pages
<li>API response validation for products pages
<li>Cart operations and animations
<li>Validating sign in page and operations
<li>Checking Navigation bar presence and correct functionality 
</ul> 
<p>
<b>All tests are designed to work with Playwright via the VScode Playwright extension. </b>Support for command line operation is possible, but bugs may be present (test running twice, false failures).</b>  Please check back for further updates on this in future revisions. 

<p><b></b>Install dependencies:</p></b>
<p>
  <ul>
   <li> Node.JS https://nodejs.org/en
    <li>VScode https://code.visualstudio.com/
    <li>VScode playwright extention https://playwright.dev/docs/getting-started-vscode
      <li> Playwright https://playwright.dev/
     
  </ul>
</p>
Install Playwright browsers
If this is your first time using Playwright:
<pre>npx playwright install</pre>
<br>Tests are written in TypeScript.

<p><b>CLI run tests:</b>
<br>

<pre>npx playwright test 

  or
  
npx playwright test --headed </pre>

<br>The base URL and other config values can be adjusted in <i><b>playwright.config.ts.</b><i/>

<i>Pierre Sahye 4/2025
