let audioCorrente = null

export function playMp3(path) {
  if (audioCorrente) {
    audioCorrente.pause()
    audioCorrente.currentTime = 0
    audioCorrente = null
  }

  const audio = new Audio(path)
  audioCorrente = audio
  audio.play().catch(() => {})
}

export function stopAudio() {
  if (audioCorrente) {
    audioCorrente.pause()
    audioCorrente.currentTime = 0
    audioCorrente = null
  }
}
