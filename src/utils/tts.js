let voceItaliana = null
let caricato = false

function cercaVoci() {
  if (!('speechSynthesis' in window)) return false
  const voci = window.speechSynthesis.getVoices()
  if (voci.length === 0) return false

  voceItaliana = voci.find(v => v.lang.startsWith('it')) || null

  if (!voceItaliana) {
    const google = voci.find(v =>
      v.name.toLowerCase().includes('google') &&
      !v.name.toLowerCase().includes('english')
    )
    if (google) voceItaliana = google
  }

  caricato = true
  return true
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.addEventListener('voiceschanged', cercaVoci)
  cercaVoci()
  if (!caricato) {
    const id = setInterval(() => {
      if (cercaVoci()) clearInterval(id)
    }, 200)
    setTimeout(() => { clearInterval(id); caricato = true }, 5000)
  }
}

export function inizializzaTTS() {
  if (typeof window.__ttsReady !== 'undefined') return
  window.__ttsReady = true
  if (!('speechSynthesis' in window)) return
  try {
    const u = new SpeechSynthesisUtterance('')
    u.volume = 0
    window.speechSynthesis.speak(u)
    window.speechSynthesis.cancel()
  } catch { /* empty */ }
}

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

export function parla(testo) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()

  const u = new SpeechSynthesisUtterance(testo)
  u.lang = 'it'
  u.rate = 0.9

  if (voceItaliana) {
    u.voice = voceItaliana
  }

  u.onerror = () => {
    const fallback = new SpeechSynthesisUtterance(testo)
    fallback.lang = 'it'
    fallback.rate = 0.9
    window.speechSynthesis.speak(fallback)
  }

  window.speechSynthesis.speak(u)
}
