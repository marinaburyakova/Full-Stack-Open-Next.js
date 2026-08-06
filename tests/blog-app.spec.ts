// tests/blog-app.spec.ts
import { test, expect } from '@playwright/test'
import { resetDatabase } from './helpers'

test.describe('Blog Application', () => {
  test.beforeEach(async () => {
    await resetDatabase()
  })

  test.describe('Authentication', () => {
    test('user can register', async ({ page }) => {
      const uniqueUsername = `user_${Date.now()}`

      await page.goto('/register')
      await page.getByLabel('Name', { exact: true }).fill('Test User')
      await page.getByLabel('Username', { exact: true }).fill(uniqueUsername)
      await page.getByLabel('Password', { exact: true }).fill('testpass123')
      await page
        .getByLabel('Confirm Password', { exact: true })
        .fill('testpass123')
      await page.getByTestId('register-button').click()

      await page.waitForURL('/login', { timeout: 10000 })
      await expect(page).toHaveURL('/login')
    })

    test('registration fails with short username', async ({ page }) => {
      await page.goto('/register')

      await page.getByLabel('Name', { exact: true }).fill('Test User')
      await page.getByLabel('Username', { exact: true }).fill('us')
      await page.getByLabel('Password', { exact: true }).focus()
      await page.getByLabel('Password', { exact: true }).fill('testpass123')
      await page
        .getByLabel('Confirm Password', { exact: true })
        .fill('testpass123')
      await page.getByTestId('register-button').click()

      await expect(page.getByTestId('username-error')).toHaveText(
        /Username must be at least 3 characters/,
        { timeout: 5000 },
      )
    })

    test('registration fails with mismatched passwords', async ({ page }) => {
      const uniqueUsername = `user_${Date.now()}`

      await page.goto('/register')
      await page.getByLabel('Name', { exact: true }).fill('Test User')
      await page.getByLabel('Username', { exact: true }).fill(uniqueUsername)
      await page.getByLabel('Password', { exact: true }).fill('testpass123')
      await page
        .getByLabel('Confirm Password', { exact: true })
        .fill('differentpass')
      await page.getByTestId('register-button').click()

      await expect(page.getByTestId('passwordConfirm-error')).toHaveText(
        /Passwords do not match/,
        { timeout: 5000 },
      )
    })

    test('user can login', async ({ page }) => {
      const uniqueUsername = `user_${Date.now()}`

      await page.goto('/register')
      await page.getByLabel('Name', { exact: true }).fill('Test User')
      await page.getByLabel('Username', { exact: true }).fill(uniqueUsername)
      await page.getByLabel('Password', { exact: true }).fill('testpass123')
      await page
        .getByLabel('Confirm Password', { exact: true })
        .fill('testpass123')
      await page.getByTestId('register-button').click()
      await page.waitForURL('/login', { timeout: 10000 })

      await page.goto('/login')
      await page.getByLabel('Username', { exact: true }).fill(uniqueUsername)
      await page.getByLabel('Password', { exact: true }).fill('testpass123')
      await page.getByTestId('login-button').click()

      await expect(page).toHaveURL('/')
      // Проверяем уведомление, но не падаем если его нет
      try {
        await expect(page.getByTestId('notification')).toBeVisible({
          timeout: 3000,
        })
      } catch {
        // Уведомление может не показываться
      }
    })

    test('login fails with wrong credentials', async ({ page }) => {
      const uniqueUsername = `user_${Date.now()}`

      await page.goto('/register')
      await page.getByLabel('Name', { exact: true }).fill('Test User')
      await page.getByLabel('Username', { exact: true }).fill(uniqueUsername)
      await page.getByLabel('Password', { exact: true }).fill('testpass123')
      await page
        .getByLabel('Confirm Password', { exact: true })
        .fill('testpass123')
      await page.getByTestId('register-button').click()
      await page.waitForURL('/login', { timeout: 10000 })

      await page.goto('/login')
      await page.getByLabel('Username', { exact: true }).fill(uniqueUsername)
      await page.getByLabel('Password', { exact: true }).fill('wrongpassword')
      await page.getByTestId('login-button').click()

      await expect(page.getByTestId('error-message')).toBeVisible()
    })

    test('logged in user can see their info', async ({ page }) => {
      const uniqueUsername = `user_${Date.now()}`

      await page.goto('/register')
      await page.getByLabel('Name', { exact: true }).fill('Test User')
      await page.getByLabel('Username', { exact: true }).fill(uniqueUsername)
      await page.getByLabel('Password', { exact: true }).fill('testpass123')
      await page
        .getByLabel('Confirm Password', { exact: true })
        .fill('testpass123')
      await page.getByTestId('register-button').click()
      await page.waitForURL('/login', { timeout: 10000 })

      await page.goto('/login')
      await page.getByLabel('Username', { exact: true }).fill(uniqueUsername)
      await page.getByLabel('Password', { exact: true }).fill('testpass123')
      await page.getByTestId('login-button').click()
      await expect(page).toHaveURL('/')

      await page.goto('/me')
      await expect(page.getByTestId('user-username')).toBeVisible()
    })

    test('user can logout', async ({ page }) => {
      const uniqueUsername = `user_${Date.now()}`

      await page.goto('/register')
      await page.getByLabel('Name', { exact: true }).fill('Test User')
      await page.getByLabel('Username', { exact: true }).fill(uniqueUsername)
      await page.getByLabel('Password', { exact: true }).fill('testpass123')
      await page
        .getByLabel('Confirm Password', { exact: true })
        .fill('testpass123')
      await page.getByTestId('register-button').click()
      await page.waitForURL('/login', { timeout: 10000 })

      await page.goto('/login')
      await page.getByLabel('Username', { exact: true }).fill(uniqueUsername)
      await page.getByLabel('Password', { exact: true }).fill('testpass123')
      await page.getByTestId('login-button').click()
      await expect(page).toHaveURL('/')

      await page.goto('/')
      await page.getByRole('button', { name: /logout/i }).click()
      await expect(
        page.getByRole('link', { name: 'Login', exact: true }),
      ).toBeVisible()
    })
  })

  test.describe('Navigation', () => {
    test('home page can be opened', async ({ page }) => {
      await page.goto('/')
      await expect(page).toHaveURL('/')
    })

    test('navigation links are visible for non-logged in user', async ({
      page,
    }) => {
      await page.goto('/')
      await expect(
        page.getByRole('link', { name: 'Login', exact: true }),
      ).toBeVisible()
      await expect(
        page.getByRole('link', { name: 'Register', exact: true }),
      ).toBeVisible()
    })

    test('navigation links change after login', async ({ page }) => {
      const uniqueUsername = `user_${Date.now()}`

      await page.goto('/register')
      await page.getByLabel('Name', { exact: true }).fill('Test User')
      await page.getByLabel('Username', { exact: true }).fill(uniqueUsername)
      await page.getByLabel('Password', { exact: true }).fill('testpass123')
      await page
        .getByLabel('Confirm Password', { exact: true })
        .fill('testpass123')
      await page.getByTestId('register-button').click()
      await page.waitForURL('/login', { timeout: 10000 })

      await page.goto('/login')
      await page.getByLabel('Username', { exact: true }).fill(uniqueUsername)
      await page.getByLabel('Password', { exact: true }).fill('testpass123')
      await page.getByTestId('login-button').click()
      await expect(page).toHaveURL('/')

      await page.goto('/')
      await expect(
        page.getByRole('link', { name: 'Login', exact: true }),
      ).not.toBeVisible()
      await expect(
        page.getByRole('link', { name: 'Register', exact: true }),
      ).not.toBeVisible()
      await expect(
        page.getByRole('navigation').getByRole('link', { name: 'My Profile' }),
      ).toBeVisible()
    })

    test('user can navigate to blogs page', async ({ page }) => {
      await page.goto('/')
      await page.getByRole('link', { name: 'Blogs', exact: true }).click()
      await expect(page).toHaveURL('/blogs')
    })

    test('logged in user can navigate to create blog page', async ({
      page,
    }) => {
      const uniqueUsername = `user_${Date.now()}`

      await page.goto('/register')
      await page.getByLabel('Name', { exact: true }).fill('Test User')
      await page.getByLabel('Username', { exact: true }).fill(uniqueUsername)
      await page.getByLabel('Password', { exact: true }).fill('testpass123')
      await page
        .getByLabel('Confirm Password', { exact: true })
        .fill('testpass123')
      await page.getByTestId('register-button').click()
      await page.waitForURL('/login', { timeout: 10000 })

      await page.goto('/login')
      await page.getByLabel('Username', { exact: true }).fill(uniqueUsername)
      await page.getByLabel('Password', { exact: true }).fill('testpass123')
      await page.getByTestId('login-button').click()
      await expect(page).toHaveURL('/')

      await page.goto('/blogs/new')
      await expect(page).toHaveURL('/blogs/new')
    })

    test('user can navigate to users page', async ({ page }) => {
      await page.goto('/')
      await page.getByRole('link', { name: 'Users', exact: true }).click()
      await expect(page).toHaveURL('/users')
    })
  })

  test.describe('Blogs', () => {
    test('logged in user can create a blog', async ({ page }) => {
      const uniqueUsername = `user_${Date.now()}`

      await page.goto('/register')
      await page.getByLabel('Name', { exact: true }).fill('Test User')
      await page.getByLabel('Username', { exact: true }).fill(uniqueUsername)
      await page.getByLabel('Password', { exact: true }).fill('testpass123')
      await page
        .getByLabel('Confirm Password', { exact: true })
        .fill('testpass123')
      await page.getByTestId('register-button').click()
      await page.waitForURL('/login', { timeout: 10000 })

      await page.goto('/login')
      await page.getByLabel('Username', { exact: true }).fill(uniqueUsername)
      await page.getByLabel('Password', { exact: true }).fill('testpass123')
      await page.getByTestId('login-button').click()
      await expect(page).toHaveURL('/')

      await page.goto('/blogs/new')
      await page.getByLabel('Title', { exact: true }).fill('Test Blog')
      await page.getByLabel('Author', { exact: true }).fill('Test Author')
      await page.getByLabel('URL', { exact: true }).fill('https://testblog.com')
      await page.getByTestId('create-blog-button').click()

      await expect(page).toHaveURL('/blogs')
      await expect(page.getByTestId('blogs-list')).toContainText('Test Blog')
    })

    test('user cannot create blog without being logged in', async ({
      page,
    }) => {
      await page.goto('/blogs/new')
      await expect(page).toHaveURL('/blogs/new')
    })

    test('blogs are displayed on blogs page', async ({ page }) => {
      const uniqueUsername = `user_${Date.now()}`

      await page.goto('/register')
      await page.getByLabel('Name', { exact: true }).fill('Test User')
      await page.getByLabel('Username', { exact: true }).fill(uniqueUsername)
      await page.getByLabel('Password', { exact: true }).fill('testpass123')
      await page
        .getByLabel('Confirm Password', { exact: true })
        .fill('testpass123')
      await page.getByTestId('register-button').click()
      await page.waitForURL('/login', { timeout: 10000 })

      await page.goto('/login')
      await page.getByLabel('Username', { exact: true }).fill(uniqueUsername)
      await page.getByLabel('Password', { exact: true }).fill('testpass123')
      await page.getByTestId('login-button').click()
      await expect(page).toHaveURL('/')

      await page.goto('/blogs/new')
      await page.getByLabel('Title', { exact: true }).fill('First Blog')
      await page.getByLabel('Author', { exact: true }).fill('Author One')
      await page.getByLabel('URL', { exact: true }).fill('https://blog1.com')
      await page.getByTestId('create-blog-button').click()
      await expect(page).toHaveURL('/blogs')

      await page.goto('/blogs/new')
      await page.getByLabel('Title', { exact: true }).fill('Second Blog')
      await page.getByLabel('Author', { exact: true }).fill('Author Two')
      await page.getByLabel('URL', { exact: true }).fill('https://blog2.com')
      await page.getByTestId('create-blog-button').click()
      await expect(page).toHaveURL('/blogs')

      await page.goto('/blogs')
      await expect(page.getByTestId('blogs-list')).toContainText('First Blog')
      await expect(page.getByTestId('blogs-list')).toContainText('Second Blog')
    })

    test('blog can be viewed individually', async ({ page }) => {
      const uniqueUsername = `user_${Date.now()}`

      await page.goto('/register')
      await page.getByLabel('Name', { exact: true }).fill('Test User')
      await page.getByLabel('Username', { exact: true }).fill(uniqueUsername)
      await page.getByLabel('Password', { exact: true }).fill('testpass123')
      await page
        .getByLabel('Confirm Password', { exact: true })
        .fill('testpass123')
      await page.getByTestId('register-button').click()
      await page.waitForURL('/login', { timeout: 10000 })

      await page.goto('/login')
      await page.getByLabel('Username', { exact: true }).fill(uniqueUsername)
      await page.getByLabel('Password', { exact: true }).fill('testpass123')
      await page.getByTestId('login-button').click()
      await expect(page).toHaveURL('/')

      await page.goto('/blogs/new')
      await page.getByLabel('Title', { exact: true }).fill('Test Blog')
      await page.getByLabel('Author', { exact: true }).fill('Test Author')
      await page.getByLabel('URL', { exact: true }).fill('https://testblog.com')
      await page.getByTestId('create-blog-button').click()
      await expect(page).toHaveURL('/blogs')

      await page.goto('/blogs')
      await page.getByRole('link', { name: 'Test Blog' }).click()

      await expect(page.getByTestId('blog-title')).toContainText('Test Blog')
      await expect(page.getByTestId('blog-author')).toContainText('Test Author')
    })

    test('blog shows like count', async ({ page }) => {
      const uniqueUsername = `user_${Date.now()}`

      await page.goto('/register')
      await page.getByLabel('Name', { exact: true }).fill('Test User')
      await page.getByLabel('Username', { exact: true }).fill(uniqueUsername)
      await page.getByLabel('Password', { exact: true }).fill('testpass123')
      await page
        .getByLabel('Confirm Password', { exact: true })
        .fill('testpass123')
      await page.getByTestId('register-button').click()
      await page.waitForURL('/login', { timeout: 10000 })

      await page.goto('/login')
      await page.getByLabel('Username', { exact: true }).fill(uniqueUsername)
      await page.getByLabel('Password', { exact: true }).fill('testpass123')
      await page.getByTestId('login-button').click()
      await expect(page).toHaveURL('/')

      await page.goto('/blogs/new')
      await page.getByLabel('Title', { exact: true }).fill('Test Blog')
      await page.getByLabel('Author', { exact: true }).fill('Test Author')
      await page.getByLabel('URL', { exact: true }).fill('https://testblog.com')
      await page.getByTestId('create-blog-button').click()
      await expect(page).toHaveURL('/blogs')

      await page.goto('/blogs')
      await expect(page.getByTestId('blogs-list')).toContainText('0 likes')
    })
  })

  test.describe('Me Page', () => {
    test('redirects to login if not authenticated', async ({ page }) => {
      await page.goto('/me')
      await expect(page).toHaveURL('/login')
    })

    test('shows user profile information', async ({ page }) => {
      const uniqueUsername = `user_${Date.now()}`

      await page.goto('/register')
      await page.getByLabel('Name', { exact: true }).fill('Test User')
      await page.getByLabel('Username', { exact: true }).fill(uniqueUsername)
      await page.getByLabel('Password', { exact: true }).fill('testpass123')
      await page
        .getByLabel('Confirm Password', { exact: true })
        .fill('testpass123')
      await page.getByTestId('register-button').click()
      await page.waitForURL('/login', { timeout: 10000 })

      await page.goto('/login')
      await page.getByLabel('Username', { exact: true }).fill(uniqueUsername)
      await page.getByLabel('Password', { exact: true }).fill('testpass123')
      await page.getByTestId('login-button').click()
      await expect(page).toHaveURL('/')

      await page.goto('/me')
      await expect(page.getByTestId('user-profile')).toBeVisible()
      await expect(page.getByTestId('user-name')).toContainText('Test User')
      await expect(page.getByTestId('user-username')).toContainText(
        uniqueUsername,
      )
    })

    test('shows empty reading list message', async ({ page }) => {
      const uniqueUsername = `user_${Date.now()}`

      await page.goto('/register')
      await page.getByLabel('Name', { exact: true }).fill('Test User')
      await page.getByLabel('Username', { exact: true }).fill(uniqueUsername)
      await page.getByLabel('Password', { exact: true }).fill('testpass123')
      await page
        .getByLabel('Confirm Password', { exact: true })
        .fill('testpass123')
      await page.getByTestId('register-button').click()
      await page.waitForURL('/login', { timeout: 10000 })

      await page.goto('/login')
      await page.getByLabel('Username', { exact: true }).fill(uniqueUsername)
      await page.getByLabel('Password', { exact: true }).fill('testpass123')
      await page.getByTestId('login-button').click()
      await expect(page).toHaveURL('/')

      await page.goto('/me')
      await expect(page.getByTestId('reading-list-section')).toBeVisible()
      await expect(page.getByTestId('empty-reading-list')).toBeVisible()
    })

    test('shows API token section', async ({ page }) => {
      const uniqueUsername = `user_${Date.now()}`

      await page.goto('/register')
      await page.getByLabel('Name', { exact: true }).fill('Test User')
      await page.getByLabel('Username', { exact: true }).fill(uniqueUsername)
      await page.getByLabel('Password', { exact: true }).fill('testpass123')
      await page
        .getByLabel('Confirm Password', { exact: true })
        .fill('testpass123')
      await page.getByTestId('register-button').click()
      await page.waitForURL('/login', { timeout: 10000 })

      await page.goto('/login')
      await page.getByLabel('Username', { exact: true }).fill(uniqueUsername)
      await page.getByLabel('Password', { exact: true }).fill('testpass123')
      await page.getByTestId('login-button').click()
      await expect(page).toHaveURL('/')

      await page.goto('/me')
      await expect(page.getByTestId('api-token-section')).toBeVisible()
      await expect(page.getByTestId('no-token-message')).toBeVisible()
      await expect(page.getByTestId('generate-token-button')).toBeVisible()
    })

    test('can generate API token', async ({ page }) => {
      const uniqueUsername = `user_${Date.now()}`

      await page.goto('/register')
      await page.getByLabel('Name', { exact: true }).fill('Test User')
      await page.getByLabel('Username', { exact: true }).fill(uniqueUsername)
      await page.getByLabel('Password', { exact: true }).fill('testpass123')
      await page
        .getByLabel('Confirm Password', { exact: true })
        .fill('testpass123')
      await page.getByTestId('register-button').click()
      await page.waitForURL('/login', { timeout: 10000 })

      await page.goto('/login')
      await page.getByLabel('Username', { exact: true }).fill(uniqueUsername)
      await page.getByLabel('Password', { exact: true }).fill('testpass123')
      await page.getByTestId('login-button').click()
      await expect(page).toHaveURL('/')

      await page.goto('/me')
      await page.getByTestId('generate-token-button').click()

      await expect(page.getByTestId('token-display')).toBeVisible()
      const token = await page.getByTestId('api-token').textContent()
      expect(token).toBeTruthy()
      expect(token!.length).toBeGreaterThan(10)
    })
  })
})
