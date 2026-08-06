// tests/blog-app.spec.ts
import { test, expect } from '@playwright/test'
import { resetDatabase } from './helpers'

test.describe('Blog Application', () => {
  test.beforeEach(async () => {
    await resetDatabase()
  })

  test.describe('Authentication - UI', () => {
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

      // ✅ 2 символа - невалидно
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

    test('login shows error with wrong credentials', async ({ page }) => {
      // ✅ Генерируем уникальный username для каждого запуска
      const uniqueUsername = `user_${Date.now()}`

      // Регистрируем пользователя через UI
      await page.goto('/register')
      await page.getByLabel('Name', { exact: true }).fill('Test User')
      await page.getByLabel('Username', { exact: true }).fill(uniqueUsername)
      await page.getByLabel('Password', { exact: true }).fill('testpass123')
      await page
        .getByLabel('Confirm Password', { exact: true })
        .fill('testpass123')
      await page.getByTestId('register-button').click()

      // ✅ Ждем редирект на /login
      await page.waitForURL('/login', { timeout: 10000 })
      await expect(page).toHaveURL('/login')

      // Пробуем залогиниться с неправильным паролем
      await page.goto('/login')
      await page.getByLabel('Username', { exact: true }).fill(uniqueUsername)
      await page.getByLabel('Password', { exact: true }).fill('wrongpassword')
      await page.getByTestId('login-button').click()

      await expect(page.getByTestId('error-message')).toBeVisible({
        timeout: 5000,
      })
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

    test('user can navigate to blogs page', async ({ page }) => {
      await page.goto('/')
      await page.getByRole('link', { name: 'Blogs', exact: true }).click()
      await expect(page).toHaveURL('/blogs')
    })

    test('user can navigate to users page', async ({ page }) => {
      await page.goto('/')
      await page.getByRole('link', { name: 'Users', exact: true }).click()
      await expect(page).toHaveURL('/users')
    })
  })
})
