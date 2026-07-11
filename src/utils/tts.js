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

export function speak(testo, lingua = 'it-IT') {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(testo)
  utterance.lang = lingua
  utterance.rate = 0.9
  window.speechSynthesis.speak(utterance)
}

export function playStarSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.type = 'sine'
    osc.frequency.setValueAtTime(1047, ctx.currentTime)
    osc.frequency.setValueAtTime(1319, ctx.currentTime + 0.08)
    osc.frequency.setValueAtTime(1568, ctx.currentTime + 0.16)

    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.4)
  } catch {
    // audio context not available
  }
}
