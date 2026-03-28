
export function safeParseJson(input: string) {
  try {
    let cleaned = input.trim()

    // 🔥 eliminar markdown blocks
    cleaned = cleaned.replace(/```json/gi, "")
    cleaned = cleaned.replace(/```/g, "")

    // 🔥 eliminar texto antes del JSON
    const firstBrace = cleaned.indexOf("{")
    const lastBrace = cleaned.lastIndexOf("}")

    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error("No JSON boundaries found")
    }

    cleaned = cleaned.substring(firstBrace, lastBrace + 1)

    // 🔥 remover caracteres invisibles raros
    cleaned = cleaned.replace(/[\u0000-\u001F]+/g, "")

    return JSON.parse(cleaned)
  } catch (error) {
    console.error("❌ FAILED TO PARSE AI RESPONSE")
    console.error("👇 RAW RESPONSE:")
    console.error(input)

    throw new Error("Invalid JSON returned from AI")
  }
}