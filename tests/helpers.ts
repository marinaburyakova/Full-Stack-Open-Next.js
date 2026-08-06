const baseUrl = "http://localhost:3000"

export const resetDatabase = async () => {
  const response = await fetch(`${baseUrl}/api/testing/reset`, {
    method: "DELETE",
  })
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `Failed to reset database: ${response.status} ${response.statusText} - ${errorText}`,
    )
  }
  await new Promise(resolve => setTimeout(resolve, 500))
}

export const createUser = async (
  username: string,
  name: string,
  password: string,
) => {
  const response = await fetch(`${baseUrl}/api/testing/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, name, password }),
  })
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `Failed to create user: ${response.status} ${response.statusText} - ${errorText}`,
    )
  }
  return response.json()
}