const orologio = {
  id: 'orologio',
  nome: 'Orologio',
  icona: '⏰',
  colore: '#0984E3',
  descrizione: 'Impara a leggere l\'orologio',
  domande: [
    {
      id: 'orari-12h',
      titolo: 'Orologi e Orari',
      testo: 'Abbina ogni orologio al suo orario',
      tasselli: [
        { nome: '01:15', ore: 1, minuti: 15, descrizione: "l'una e un quarto" },
        { nome: '02:30', ore: 2, minuti: 30, descrizione: 'le due e mezza' },
        { nome: '03:45', ore: 3, minuti: 45, descrizione: 'le tre e tre quarti' },
        { nome: '04:30', ore: 4, minuti: 30, descrizione: 'le quattro e mezza' },
        { nome: '05:15', ore: 5, minuti: 15, descrizione: 'le cinque e un quarto' },
        { nome: '06:30', ore: 6, minuti: 30, descrizione: 'le sei e mezza' },
        { nome: '07:45', ore: 7, minuti: 45, descrizione: 'le sette e tre quarti' },
        { nome: '08:30', ore: 8, minuti: 30, descrizione: 'le otto e mezza' },
        { nome: '09:15', ore: 9, minuti: 15, descrizione: 'le nove e un quarto' },
        { nome: '10:45', ore: 10, minuti: 45, descrizione: 'le dieci e tre quarti' },
        { nome: '11:00', ore: 11, minuti: 0, descrizione: "l'undici" },
        { nome: '12:30', ore: 12, minuti: 30, descrizione: 'mezzogiorno e mezzo' },
      ],
      preInseriti: 2,
      tipo: 'abbinamento',
    },
  ],
}

export default orologio
