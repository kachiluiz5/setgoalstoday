export class TypingAnimator {
  private static readonly TYPING_SPEED = 30 // milliseconds per character
  private static readonly PAUSE_ON_PUNCTUATION = 200 // extra pause after punctuation

  static async animateText(
    text: string,
    onUpdate: (partialText: string) => void,
    onComplete: () => void,
  ): Promise<void> {
    let currentIndex = 0

    const typeNextCharacter = () => {
      if (currentIndex < text.length) {
        currentIndex++
        const partialText = text.substring(0, currentIndex)
        onUpdate(partialText)

        // Add extra pause after punctuation for natural feel
        const currentChar = text[currentIndex - 1]
        const delay = [".", "!", "?", ","].includes(currentChar)
          ? this.TYPING_SPEED + this.PAUSE_ON_PUNCTUATION
          : this.TYPING_SPEED

        setTimeout(typeNextCharacter, delay)
      } else {
        onComplete()
      }
    }

    typeNextCharacter()
  }
}
