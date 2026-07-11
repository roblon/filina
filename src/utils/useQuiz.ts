import { useState, useEffect, useRef } from 'react'
import { playMp3, stopAudio } from './tts'
import type { RispostaQuiz } from '../types'

interface UseQuizOptions<T> {
  items: T[]
  getAudioPath: (item: T, indice: number) => string
  onStarEarned?: (key: string) => void
  getStarKey: (item: T, indice: number) => string
}

export default function useQuiz<T>({
  items,
  getAudioPath,
  onStarEarned,
  getStarKey,
}: UseQuizOptions<T>) {
  const [indice, setIndice] = useState(0)
  const [punteggio, setPunteggio] = useState(0)
  const [risposto, setRisposto] = useState(false)
  const [fatto, setFatto] = useState(false)
  const [ultimaRisposta, setUltimaRisposta] = useState<string | null>(null)
  const [risposte, setRisposte] = useState<RispostaQuiz[]>([])

  const item = items[indice]
  const audioPath = item ? getAudioPath(item, indice) : null
  const ultimoIndiceParlato = useRef(-1)

  useEffect(() => {
    if (item && audioPath && ultimoIndiceParlato.current !== indice) {
      playMp3(audioPath)
      ultimoIndiceParlato.current = indice
    }
  }, [indice, item, audioPath])

  useEffect(() => () => stopAudio(), [])

  function rispondi(scelta: string, corretta: string, domandaInfo: Omit<RispostaQuiz, 'corretta'>) {
    if (risposto) return
    setRisposto(true)
    setUltimaRisposta(scelta)
    const giusta = scelta === corretta
    if (giusta) {
      setPunteggio((p) => p + 1)
      onStarEarned?.(getStarKey(item, indice))
    }
    setRisposte((prev) => [...prev, { corretta: giusta, ...domandaInfo }])
    setTimeout(avanza, 700)
  }

  function avanza() {
    if (indice + 1 >= items.length) {
      setFatto(true)
    } else {
      setIndice((i) => i + 1)
      setRisposto(false)
      setUltimaRisposta(null)
    }
  }

  return {
    indice,
    item,
    punteggio,
    risposto,
    fatto,
    ultimaRisposta,
    risposte,
    totale: items.length,
    rispondi,
  }
}
