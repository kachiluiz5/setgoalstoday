import type { Goal } from "@/types/goal"
import { getMonthName } from "@/lib/date-utils"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"

// Function to export goal as text
export function exportGoalAsText(goal: Goal): string {
  const completedSteps = goal.roadmap.filter((step) => step.completed).length

  let text = `GOAL: ${goal.title}\n`
  text += `===========================================\n\n`
  text += `Month: ${getMonthName(Number(goal.month))} ${goal.year}\n`
  text += `Progress: ${goal.progress}% (${completedSteps}/${goal.roadmap.length} steps completed)\n`

  if (goal.description) {
    text += `\nDescription: ${goal.description}\n`
  }

  text += `\nROADMAP:\n`
  text += `===========================================\n\n`

  goal.roadmap.forEach((step, index) => {
    text += `STEP ${index + 1}: ${step.title} ${step.completed ? "[COMPLETED]" : "[PENDING]"}\n\n`
    if (step.description) {
      text += `${step.description}\n\n`
    }
  })

  text += `===========================================\n`
  text += `Created: ${new Date(goal.createdAt).toLocaleDateString()}\n`
  text += `Last Updated: ${new Date(goal.updatedAt).toLocaleDateString()}\n`

  return text
}

// Function to download goal as text file
export function downloadGoalAsText(goal: Goal) {
  const text = exportGoalAsText(goal)
  const blob = new Blob([text], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `goal-${goal.title.toLowerCase().replace(/\s+/g, "-")}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Function to download goal as PDF
export async function downloadGoalAsPDF(goal: Goal, elementRef: HTMLElement | null) {
  try {
    // Create PDF document
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    // Add title
    pdf.setFontSize(20)
    pdf.text(`Goal: ${goal.title}`, 20, 20)

    // Add metadata
    pdf.setFontSize(12)
    pdf.text(`Month: ${getMonthName(Number(goal.month))} ${goal.year}`, 20, 30)
    pdf.text(`Progress: ${goal.progress}%`, 20, 35)

    // Add description if available
    if (goal.description) {
      pdf.text("Description:", 20, 45)
      const descriptionLines = pdf.splitTextToSize(goal.description, 170)
      pdf.text(descriptionLines, 20, 50)
    }

    // Add roadmap
    let yPosition = goal.description ? 60 + pdf.splitTextToSize(goal.description, 170).length * 5 : 50

    pdf.setFontSize(16)
    pdf.text("Roadmap:", 20, yPosition)
    yPosition += 10

    // Add each step
    for (let i = 0; i < goal.roadmap.length; i++) {
      const step = goal.roadmap[i]

      // Check if we need a new page
      if (yPosition > 270) {
        pdf.addPage()
        yPosition = 20
      }

      pdf.setFontSize(14)
      pdf.text(`Step ${i + 1}: ${step.title} ${step.completed ? "✓" : "○"}`, 20, yPosition)
      yPosition += 7

      if (step.description) {
        pdf.setFontSize(10)
        const stepLines = pdf.splitTextToSize(step.description, 170)
        pdf.text(stepLines, 20, yPosition)
        yPosition += stepLines.length * 5 + 5
      }
    }

    // If there's a visual element to capture
    if (elementRef) {
      try {
        const canvas = await html2canvas(elementRef, {
          scale: 2,
          backgroundColor: null,
        })

        // Check if we need a new page for the chart
        if (yPosition > 150) {
          pdf.addPage()
          yPosition = 20
        } else {
          yPosition += 10
        }

        const imgData = canvas.toDataURL("image/png")
        pdf.text("Progress Visualization:", 20, yPosition)
        yPosition += 10
        pdf.addImage(imgData, "PNG", 20, yPosition, 170, 80)
      } catch (err) {
        console.error("Error capturing chart:", err)
      }
    }

    // Save the PDF
    pdf.save(`goal-${goal.title.toLowerCase().replace(/\s+/g, "-")}.pdf`)
  } catch (error) {
    console.error("Error generating PDF:", error)
    throw error
  }
}
