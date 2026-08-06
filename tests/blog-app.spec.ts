// tests/blog-app.spec.ts
import { test, expect } from "@playwright/test"
import { resetDatabase, createUser, loginUser, createBlog } from "./helpers"

test.describe("Blog Application", () => {
  test.beforeEach(async () => {
    await resetDatabase()
  })

  test.describe("Authentication", () => {
    test("user can register", async ({ page }) => {
      await page.goto("/register")

      await page.getByLabel("Name", { exact: true }).fill("Test User")
      await page.getByLabel("Username", { exact: true }).fill("testuser")
      await page.getByLabel("Password", { exact: true }).fill("testpass123")
      await page.getByLabel("Confirm Password", { exact: true }).fill("testpass123")

      await page.getByTestId("register-button").click()

      await expect(page).toHaveURL("/login")
    })

    test("registration fails with short username", async ({ page }) => {
      await page.goto("/register")

      await page.getByLabel("Name", { exact: true }).fill("Test User")
      await page.getByLabel("Username", { exact: true }).fill("usr")
      await page.getByLabel("Password", { exact: true }).fill("testpass123")
      await page.getByLabel("Confirm Password", { exact: true }).fill("testpass123")

      await page.getByTestId("register-button").click()

      await expect(page.getByTestId("username-error")).toBeVisible()
    })

    test("registration fails with mismatched passwords", async ({ page }) => {
      await page.goto("/register")

      await page.getByLabel("Name", { exact: true }).fill("Test User")
      await page.getByLabel("Username", { exact: true }).fill("testuser")
      await page.getByLabel("Password", { exact: true }).fill("testpass123")
      await page.getByLabel("Confirm Password", { exact: true }).fill("differentpass")

      await page.getByTestId("register-button").click()

      await expect(page.getByTestId("passwordConfirm-error")).toBeVisible()
    })

    test("user can login", async ({ page }) => {
      await createUser("testuser", "Test User", "testpass123")

      await page.goto("/login")
      await page.getByLabel("Username", { exact: true }).fill("testuser")
      await page.getByLabel("Password", { exact: true }).fill("testpass123")
      await page.getByTestId("login-button").click()

      await expect(page).toHaveURL("/")
      await expect(page.getByTestId("notification")).toBeVisible()
    })

    test("login fails with wrong credentials", async ({ page }) => {
      await createUser("testuser", "Test User", "testpass123")

      await page.goto("/login")
      await page.getByLabel("Username", { exact: true }).fill("testuser")
      await page.getByLabel("Password", { exact: true }).fill("wrongpassword")
      await page.getByTestId("login-button").click()

      await expect(page.getByTestId("error-message")).toBeVisible()
    })

    test("logged in user can see their info", async ({ page }) => {
      await createUser("testuser", "Test User", "testpass123")
      await loginUser(page, "testuser", "testpass123")

      await page.goto("/me")

      await expect(page.getByTestId("user-username")).toBeVisible()
    })

    test("user can logout", async ({ page }) => {
      await createUser("testuser", "Test User", "testpass123")
      await loginUser(page, "testuser", "testpass123")

      await page.goto("/blogs")

      await page.getByRole("button", { name: /logout/i }).click()

      await expect(page.getByRole("link", { name: "Login", exact: true })).toBeVisible()
    })
  })

  test.describe("Navigation", () => {
    test("home page can be opened", async ({ page }) => {
      await page.goto("/")
      await expect(page).toHaveURL("/")
    })

    test("navigation links are visible for non-logged in user", async ({ page }) => {
      await page.goto("/")

      await expect(page.getByRole("link", { name: "Login", exact: true })).toBeVisible()
      await expect(page.getByRole("link", { name: "Register", exact: true })).toBeVisible()
    })

    test("navigation links change after login", async ({ page }) => {
      await createUser("testuser", "Test User", "testpass123")
      await loginUser(page, "testuser", "testpass123")

      await page.goto("/")

      await expect(page.getByRole("link", { name: "Login", exact: true })).not.toBeVisible()
      await expect(page.getByRole("link", { name: "Register", exact: true })).not.toBeVisible()
      await expect(page.getByRole("link", { name: "My Profile", exact: true })).toBeVisible()
    })

    test("user can navigate to blogs page", async ({ page }) => {
      await page.goto("/")
      await page.getByRole("link", { name: "Blogs", exact: true }).click()
      await expect(page).toHaveURL("/blogs")
    })

    test("logged in user can navigate to create blog page", async ({ page }) => {
      await createUser("testuser", "Test User", "testpass123")
      await loginUser(page, "testuser", "testpass123")

      await page.goto("/blogs/new")
      await expect(page).toHaveURL("/blogs/new")
    })

    test("user can navigate to users page", async ({ page }) => {
      await page.goto("/")
      await page.getByRole("link", { name: "Users", exact: true }).click()
      await expect(page).toHaveURL("/users")
    })
  })

  test.describe("Blogs", () => {
    test.beforeEach(async () => {
      await createUser("testuser", "Test User", "testpass123")
    })

    test("logged in user can create a blog", async ({ page }) => {
      await loginUser(page, "testuser", "testpass123")

      await page.goto("/blogs/new")
      await page.getByLabel("Title", { exact: true }).fill("Test Blog")
      await page.getByLabel("Author", { exact: true }).fill("Test Author")
      await page.getByLabel("URL", { exact: true }).fill("https://testblog.com")
      await page.getByTestId("create-blog-button").click()

      await expect(page).toHaveURL("/blogs")
      await expect(page.getByTestId("notification")).toBeVisible()
      await expect(page.getByTestId("blogs-list")).toContainText("Test Blog")
    })

    test("blogs are displayed on blogs page", async ({ page }) => {
      await loginUser(page, "testuser", "testpass123")

      await createBlog(page, "First Blog", "Author One", "https://blog1.com")
      await createBlog(page, "Second Blog", "Author Two", "https://blog2.com")

      await page.goto("/blogs")

      const blogsList = page.getByTestId("blogs-list")
      await expect(blogsList).toContainText("First Blog")
      await expect(blogsList).toContainText("Second Blog")
    })

    test("blog can be viewed individually", async ({ page }) => {
      await loginUser(page, "testuser", "testpass123")
      await createBlog(page, "Test Blog", "Test Author", "https://testblog.com")

      await page.goto("/blogs")

      await page.getByRole("link", { name: "Test Blog" }).click()

      await expect(page).toHaveURL(/\/blogs\/[a-f0-9-]+/)
      await expect(page.getByTestId("blog-title")).toContainText("Test Blog")
      await expect(page.getByTestId("blog-author")).toContainText("Test Author")
    })

    test("blog shows like count", async ({ page }) => {
      await loginUser(page, "testuser", "testpass123")
      await createBlog(page, "Test Blog", "Test Author", "https://testblog.com")

      await page.goto("/blogs")
      await expect(page.getByTestId("blogs-list")).toContainText("0 likes")
    })
  })

  test.describe("Me Page", () => {
    test.beforeEach(async () => {
      await createUser("testuser", "Test User", "testpass123")
    })

    test("redirects to login if not authenticated", async ({ page }) => {
      await page.goto("/me")
      await expect(page).toHaveURL("/login")
    })

    test("shows user profile information", async ({ page }) => {
      await loginUser(page, "testuser", "testpass123")
      await page.goto("/me")

      await expect(page.getByTestId("user-profile")).toBeVisible()
      await expect(page.getByTestId("user-name")).toContainText("Test User")
      await expect(page.getByTestId("user-username")).toContainText("testuser")
    })

    test("shows empty reading list message", async ({ page }) => {
      await loginUser(page, "testuser", "testpass123")
      await page.goto("/me")

      await expect(page.getByTestId("reading-list-section")).toBeVisible()
      await expect(page.getByTestId("empty-reading-list")).toBeVisible()
    })

    test("shows API token section", async ({ page }) => {
      await loginUser(page, "testuser", "testpass123")
      await page.goto("/me")

      await expect(page.getByTestId("api-token-section")).toBeVisible()
      await expect(page.getByTestId("no-token-message")).toBeVisible()
      await expect(page.getByTestId("generate-token-button")).toBeVisible()
    })

    test("can generate API token", async ({ page }) => {
      await loginUser(page, "testuser", "testpass123")
      await page.goto("/me")

      await page.getByTestId("generate-token-button").click()

      await expect(page.getByTestId("token-display")).toBeVisible()
      const token = await page.getByTestId("api-token").textContent()
      expect(token).toBeTruthy()
      expect(token!.length).toBeGreaterThan(10)
    })
  })
})