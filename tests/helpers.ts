// tests/helpers.ts
const baseUrl = 'http://localhost:3000'

export const resetDatabase = async () => {
  try {
    await fetch(`${baseUrl}/api/testing/reset`, { method: 'DELETE' })
  } catch {
    // Игнорируем ошибки
  }
  await new Promise((resolve) => setTimeout(resolve, 500))
}
