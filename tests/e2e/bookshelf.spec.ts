import { expect, test } from "@playwright/test";
import { devLogin } from "./utils";

test.describe("bookshelf public", () => {
  test("anonymous user can view the bookshelf landing page", async ({ page }) => {
    await page.goto("/bookshelf");
    await expect(page.locator("h1")).toContainText("Bookshelf");
  });

  test("user can navigate from landing page to a category browse page", async ({ page }) => {
    await page.goto("/bookshelf");
    await expect(page.locator("h1")).toContainText("Bookshelf");

    // Locate the first category card link
    const firstCategoryLink = page.locator(".category-card-link").first();
    await expect(firstCategoryLink).toBeVisible();

    // Get the name of the category from the card text to verify it matches the heading on page load
    const cardText = await firstCategoryLink.innerText();
    const expectedTitle = cardText.split("\n")[0].trim();

    // Click it and verify navigation
    await Promise.all([page.waitForURL(/\/bookshelf\/[^/]+$/), firstCategoryLink.click()]);

    // Verify the category page heading contains the selected category name
    await expect(page.locator("h1")).toContainText(expectedTitle);
  });

  test("returns 404 for an unknown category", async ({ page }) => {
    const response = await page.goto("/bookshelf/this-category-does-not-exist");
    expect(response?.status()).toBe(404);
  });

  test("user can open a resource detail page", async ({ page }) => {
    await page.goto("/bookshelf");

    // 1. Go to first category
    const firstCategoryLink = page.locator(".category-card-link").first();
    await expect(firstCategoryLink).toBeVisible();
    await Promise.all([page.waitForURL(/\/bookshelf\/[^/]+$/), firstCategoryLink.click()]);

    // 2. Click the first resource card details link
    const firstResourceLink = page
      .locator(".resource-grid .resource-card h2 a, .resource-grid .resource-card a")
      .first();
    await expect(firstResourceLink).toBeVisible();

    const expectedTitle = await firstResourceLink.innerText();

    await Promise.all([
      page.waitForURL(/\/bookshelf\/resource\/[^/]+$/),
      firstResourceLink.click(),
    ]);

    // 3. Verify h1 contains the title of the resource
    await expect(page.locator("h1")).toContainText(expectedTitle);
  });

  test("returns 404 for an unknown resource", async ({ page }) => {
    const response = await page.goto("/bookshelf/resource/this-resource-id-does-not-exist");
    expect(response?.status()).toBe(404);
  });

  test("admin can manage categories and resources", async ({ page }) => {
    // 1. Login as admin
    await devLogin(page, "admin");

    // 2. Go to category management page
    await page.goto("/admin/bookshelf/categories");
    await expect(page.locator("h1")).toContainText("Category management");

    // 3. Create a new category
    const catName = "E2E Test Category";
    const catSlug = "e2e-test-category";
    await page.fill('input[name="name"]', catName);
    await page.fill('input[name="slug"]', catSlug);
    await page.click('button[type="submit"]:has-text("Create Category")');

    // 4. Verify category created successfully
    await expect(page.locator(".form-message")).toContainText("Category successfully created!");
    await expect(page.locator(".application-row", { hasText: catName })).toBeVisible();

    // 5. Go to add resource page
    await page.goto("/admin/bookshelf/new");
    await expect(page.locator("h1")).toContainText("Add learning resource");

    // 6. Fill resource form
    await page.fill('input[name="title"]', "E2E Test Resource Book");
    await page.fill('input[name="author"]', "E2E Test Author");
    await page.selectOption('select[name="type"]', "BOOK");
    await page.selectOption('select[name="categoryId"]', { label: catName });
    await page.fill('textarea[name="recommendationReason"]', "This is an E2E test recommendation");
    await page.fill('input[name="imageUrl"]', "https://example.com/cover.jpg");
    await page.click('button[type="submit"]:has-text("Save Resource")');

    // 7. Verify resource created successfully
    await page.waitForURL("**/admin/bookshelf?success=resource-created");
    await expect(page.locator(".form-message")).toContainText("Resource successfully created!");
    await expect(
      page.locator(".application-row", { hasText: "E2E Test Resource Book" }),
    ).toBeVisible();

    // 8. Go to public bookshelf page and verify resource is listed
    await page.goto("/bookshelf");
    await expect(
      page.locator(".resource-card", { hasText: "E2E Test Resource Book" }),
    ).toBeVisible();

    // 9. Go to resource detail page
    await page.click('a:has-text("E2E Test Resource Book")');
    await expect(page.locator("h1")).toContainText("E2E Test Resource Book");

    // 10. Delete the resource (with confirm dialog confirmation)
    await page.goto("/admin/bookshelf");
    page.once("dialog", async (dialog) => {
      expect(dialog.message()).toContain("Are you sure you want to delete this resource?");
      await dialog.accept();
    });
    const resourceRow = page.locator(".application-row", { hasText: "E2E Test Resource Book" });
    await resourceRow.getByRole("button", { name: "Delete" }).click();

    // Verify deletion message
    await expect(page.locator(".form-message")).toContainText("Resource successfully deleted");

    // 11. Delete the category (with confirm dialog confirmation)
    await page.goto("/admin/bookshelf/categories");
    page.once("dialog", async (dialog) => {
      expect(dialog.message()).toContain(
        'Are you sure you want to delete category "E2E Test Category"?',
      );
      await dialog.accept();
    });
    const categoryRow = page.locator(".application-row", { hasText: catName });
    await categoryRow.getByRole("button", { name: "Delete" }).click();

    // Verify category deletion message
    await expect(page.locator(".form-message")).toContainText("Category successfully deleted");
  });
});
