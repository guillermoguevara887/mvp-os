export function safeParseJSON(text: string) {
  try {
    return JSON.parse(text)
  } catch (error) {
    console.error("Error parsing JSON:", error)
    return null
  }
}