const dita = {
  id: 'dita',
  nome: 'Dita',
  icona: '🖐️',
  colore: '#FF6B9D',
  descrizione: 'Impara i nomi delle dita della mano e del piede',
  domande: [
    {
      id: 'dita-mano',
      titolo: 'Dita della Mano',
      testo: 'Posiziona il nome di ogni dito della mano sul posto giusto',
      tasselli: [
        { nome: 'pollice', posizione: { x: 10, y: 20 } },
        { nome: 'indice', posizione: { x: 30, y: 10 } },
        { nome: 'medio', posizione: { x: 50, y: 5 } },
        { nome: 'anulare', posizione: { x: 70, y: 10 } },
        { nome: 'mignolo', posizione: { x: 90, y: 20 } },
      ],
      preInseriti: 0,
      tipo: 'mano',
    },
    {
      id: 'dita-piede',
      titolo: 'Dita del Piede',
      testo: 'Posiziona il nome di ogni dito del piede sul posto giusto',
      tasselli: [
        { nome: 'Alluce', posizione: { x: 15, y: 20 } },
        { nome: 'Illice', posizione: { x: 32, y: 10 } },
        { nome: 'Trillice', posizione: { x: 50, y: 5 } },
        { nome: 'Pondulo', posizione: { x: 68, y: 10 } },
        { nome: 'Minolo', posizione: { x: 85, y: 20 } },
      ],
      preInseriti: 0,
      tipo: 'piede',
    },
  ],
}

export default dita
