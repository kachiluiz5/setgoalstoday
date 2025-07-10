export function getCurrentMonth(): string {
  const date = new Date()
  return String(date.getMonth() + 1).padStart(2, "0")
}

export function getMonthName(month: number): string {
  const date = new Date()
  date.setMonth(month - 1)
  return date.toLocaleString("default", { month: "long" })
}

export function getMonthOptions(): { value: string; label: string }[] {
  return Array.from({ length: 12 }, (_, i) => {
    const month = String(i + 1).padStart(2, "0")
    return {
      value: month,
      label: getMonthName(i + 1),
    }
  })
}

export function getYearOptions(
  startYear: number = new Date().getFullYear(),
  count = 5,
): { value: number; label: string }[] {
  return Array.from({ length: count }, (_, i) => {
    const year = startYear + i
    return {
      value: year,
      label: String(year),
    }
  })
}
