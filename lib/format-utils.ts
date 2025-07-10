// Function to format description text with proper HTML
export function formatDescription(description: string): string {
  if (!description) return ""

  // Replace markdown-style formatting with HTML
  let formatted = description
    // Replace bullet points with proper HTML
    .replace(/\*\s(.*?)(?=\n|$)/g, "<li>$1</li>")
    // Replace bold text
    .replace(/\*\*(.*?)\*\*/g, "<strong class='text-primary font-bold'>$1</strong>")
    // Replace italic text
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    // Replace headers
    .replace(/#{3}\s(.*?)(?=\n|$)/g, "<h3 class='text-lg font-semibold text-primary mt-4 mb-2'>$1</h3>")
    .replace(/#{2}\s(.*?)(?=\n|$)/g, "<h2 class='text-xl font-semibold text-primary mt-4 mb-2'>$1</h2>")
    .replace(/#{1}\s(.*?)(?=\n|$)/g, "<h1 class='text-2xl font-bold text-primary mt-4 mb-2'>$1</h1>")

  // Handle sections with titles that end with a colon
  formatted = formatted.replace(
    /([A-Za-z\s&]+):\s*\n/g,
    "<h3 class='text-lg font-semibold text-primary mt-4 mb-2'>$1:</h3>\n",
  )

  // Split by double newlines to create paragraphs
  const paragraphs = formatted.split(/\n\n+/).map((p) => {
    // If paragraph contains list items, wrap in ul
    if (p.includes("<li>")) {
      return `<ul class="list-disc pl-5 my-3 space-y-1">${p}</ul>`
    }
    return `<p class="mb-3">${p}</p>`
  })

  return paragraphs.join("")
}
