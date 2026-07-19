let audioCorrente: HTMLAudioElement | null = null
let audioEnabled = true

export function setAudioEnabled(enabled: boolean): void {
  audioEnabled = enabled
  if (!enabled) stopAudio()
}

export function playMp3(path: string): void {
  if (!audioEnabled) return
  if (audioCorrente) {
    audioCorrente.pause()
    audioCorrente.currentTime = 0
    audioCorrente = null
  }

  const audio = new Audio(path)
  audioCorrente = audio
  audio.play().catch(() => {})
}

export function stopAudio(): void {
  if (audioCorrente) {
    audioCorrente.pause()
    audioCorrente.currentTime = 0
    audioCorrente = null
  }
}

export function speak(testo: string, lingua = 'it-IT'): void {
  if (!audioEnabled || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(testo)
  utterance.lang = lingua
  utterance.rate = 0.9
  window.speechSynthesis.speak(utterance)
}

export function playStarSound(): void {
  if (!audioEnabled) return
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new AudioContextClass()
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
