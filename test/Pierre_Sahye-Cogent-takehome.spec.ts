

import { test, expect, request } from '@playwright/test';

const BASE_URL = 'https://practicesoftwaretesting.com';

async function moveSliderToRange(page, steps = 80) {
  const maxSlider = page.getByRole('slider', { name: 'ngx-slider-max' });
  await maxSlider.click();
  for (let i = 0; i < steps; i++) {
    await maxSlider.press('ArrowLeft');
  }
  await expect(page.locator('ngx-slider')).toContainText('1 - 20');
}

async function addProductToCart(page, index = 0) {
  await page.locator('[data-test^="product-"]').nth(index).click();
  await page.locator('[data-test="add-to-cart"]').click();
}

test.describe('Product Filtering and Sorting', () => {
  test('Sort A to Z, Click Hammer and ForgeFlex, and filter products with slider', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('[data-test="sort"]').selectOption('name,desc'); 
    await page.waitForLoadState(); //The buttons may not actually be clicked if this is not present. better than waitForTimeout()? 
    await moveSliderToRange(page);
    await page.getByLabel('Hammer').click();
    await page.getByLabel('ForgeFlex Tools').click();
    await expect(page.getByLabel('Hammer')).toBeChecked();
    await expect(page.getByLabel('ForgeFlex Tools')).toBeChecked();
     await expect(page.locator('ngx-slider')).toContainText('1 - 20');
     await expect(page.locator('[data-test="sort"]')).toHaveValue('name,desc');
  });

  test('Check image hover animation', async ({ page }) => {
    await page.goto(BASE_URL);
    const image = page.locator('.card-img-top').first();
    await page.waitForLoadState(); 
    await expect(image).toBeVisible(); 
    const initialTransform = await image.evaluate(el => getComputedStyle(el).transform);
    await image.hover();
    const hoveredTransform = await image.evaluate(el => getComputedStyle(el).transform);
    expect(hoveredTransform).not.toBe(initialTransform);
  });

  test(' Add product to cart. verify green item added notification', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('[data-test^="product-"]').filter({ hasText: "Thor Hammer" }).filter({ hasText: "$11.14" }).click();
    await page.locator('[data-test="add-to-cart"]').click();
    await expect(page.locator('#toast-container')).toContainText('Product added to shopping cart.');
  });
});

test('Product detail and add to cart verification', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.locator('[data-test^="product-"]').filter({ hasText: "Bolt Cutters" }).filter({ hasText: "$48.41" }).click();
  await expect(page.locator('[data-test="product-description"]')).toBeVisible();
  await expect(page.locator('[data-test="product-name"]')).toContainText('Bolt Cutters');
  await expect(page.locator('app-detail')).toContainText('$48.41');
  await page.locator('[data-test="add-to-cart"]').click();
  await expect(page.locator('#toast-container')).toContainText('Product added to shopping cart.');
});

test('API - GET /products returns 200', async () => {
  const context = await request.newContext();
  const response = await context.get('https://api.practicesoftwaretesting.com/products');
  expect(response.status()).toBe(200);
  const data = await response.json();
  console.log('Response:', data);
  await context.dispose();
});

test('Cart operations and cart value updates', async ({ page }) => {
  await page.goto(BASE_URL);
  await addProductToCart(page, 2);
  await expect(page.locator('[data-test="nav-cart"]')).toContainText('1');

  await page.locator('[data-test="increase-quantity"]').click();
  await page.locator('[data-test="add-to-cart"]').click();
  await expect(page.locator('[data-test="nav-cart"]')).toContainText('3');

  await page.goto(`${BASE_URL}/checkout`);
  const cartTotal = await page.locator('[data-test="cart-total"]').innerText();
  expect(parseFloat(cartTotal.replace('$', ''))).toBeGreaterThan(0);
  //await expect(page.locator('[data-test="cart-total"]')).toContainText('$42.45'); was used in previous version. The current code assumes price vaules may change in the future.

  await page.getByRole('row', { name: 'Combination Pliers\u00a0 Quantity' }).locator('a').click();
  await expect(page.locator('[data-test="cart-total"]')).toContainText('$0.00');
  await expect(page.locator('[data-test="nav-cart"]')).toBeHidden();


  await page.goto(BASE_URL);
  await addProductToCart(page, 2);
  await page.locator('[data-test="increase-quantity"]').click();
  await page.locator('[data-test="add-to-cart"]').click();
  await expect(page.locator('[data-test="nav-cart"]')).toContainText('3'); 
  //mabye move to global fuction as this step is sort of repeated twice.
});

test('Check Sign-in page navigation', async ({ page }) => {
  await page.goto(BASE_URL);
  await addProductToCart(page, 4);
  await page.locator('[data-test="nav-cart"]').click();
  await page.locator('[data-test="proceed-1"]').click();
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  await expect(page.locator('app-login')).toContainText('Email address *');
  await expect(page.locator('app-login')).toContainText('Password *');
});

test('Navigation through dropdown and page routing', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.locator('[data-test="nav-contact"]').click();
  await expect(page).toHaveURL(`${BASE_URL}/contact`);
  await page.locator('[data-test="nav-sign-in"]').click();
  await expect(page).toHaveURL(`${BASE_URL}/auth/login`);
  await page.locator('[data-test="nav-categories"]').click();
  await page.locator('[data-test="nav-rentals"]').click();
  await expect(page).toHaveURL(`${BASE_URL}/rentals`);
});

//Next revision recommondations: Add snapshots to failure cases. 

