"use client"

import { useState, useEffect } from "react"

interface TypeAnimationProps {
  phrases: string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseTime?: number
}

export function TypeAnimation({
  phrases,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseTime = 1500,
}: TypeAnimationProps) {
  const [text, setText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [delta, setDelta] = useState(typingSpeed)

  useEffect(() => {
    const ticker = setTimeout(() => {
      tick()
    }, delta)

    return () => clearTimeout(ticker)
  }, [text, isDeleting, phraseIndex])

  const tick = () => {
    const currentPhrase = phrases[phraseIndex]
    const updatedText = isDeleting
      ? currentPhrase.substring(0, text.length - 1)
      : currentPhrase.substring(0, text.length + 1)

    setText(updatedText)

    if (isDeleting) {
      setDelta(deletingSpeed)
    } else {
      setDelta(typingSpeed)
    }

    if (!isDeleting && updatedText === currentPhrase) {
      setIsDeleting(true)
      setDelta(pauseTime)
    } else if (isDeleting && updatedText === "") {
      setIsDeleting(false)
      setPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length)
    }
  }

  return <span className="inline-block min-h-[1.5em]">{text || "\u00A0"}</span>
}
