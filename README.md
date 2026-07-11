# Filina — Impara l'Italiano

Un'app React interattiva per imparare il vocabolario e la grammatica italiana in modo divertente, con **orologi SVG**, **emoji** e **pronuncia vocale**.

## Caratteristiche

### Giochi - Vocabolario
- **7 categorie tematiche**: Animali, Colori, Numeri, Cibo, Vestiti, Corpo e Famiglia
- **Due modalita di gioco** che si alternano ogni 5 domande:
  - *Parola → Emoji*: leggi la parola e scegli l'emoji corrispondente
  - *Emoji → Parola*: guarda l'emoji e scegli la parola giusta
- **Vocabolario completo** con articoli determinativi per ogni parola

### Giochi - Calendario e Orologio
- **Giorni della settimana**: ordina i giorni sulla griglia
- **Mesi dell'anno**: ordina i mesi sulla griglia
- **Stagioni**: ordina le stagioni sulla griglia
- **Zodiaco**: abbina i simboli ai nomi dei segni
- **Orologio**: abbrevia ogni orologio SVG al suo orario (formato 12h)
  - Orologi SVG generati inline con lancette ore e minuti corrette
  - Supporta quarti d'ora (:15, :30, :45)
  - Descrizione vocalizzata in italiano (es. "le due e mezza")

### Storie
- **Brevi storie** da leggere e ascoltare in italiano
- Audio registrato da madrelingua

### Grammatica
- **Articoli**: impara gli articoli determinativi (il, lo, l', la) e indeterminativi (un, uno, un', una)
- **Preposizioni Semplici**: completa le frasi con la preposizione giusta (di, a, da, in, con, su, per, tra, fra)
- **Preposizioni Articolate**: completa le frasi con la forma articolata corretta (al, del, nel, sul, dalla, negli...)
- **Congiunzioni**: impara le congiunzioni (e, ma, perche, se, mentre, pero, che...)
- **Verbi al Presente**: coniuga i verbi al presente (-are, -ere, -ire)
- **Aggettivi**: accorda gli aggettivi con nome e genere
- **Pronomi**: pronomi diretti e indiretti (mi, ti, lo, la, gli, le...)
- **Possessivi**: aggettivi possessivi (mio, tuo, suo, nostro, vostro)
- **Avverbi di Frequenza**: sempre, mai, spesso, qualche volta...
- **Passato Prossimo**: passato prossimo con essere e avere
- **Preposizioni Tempo e Luogo**: preposizioni di tempo e luogo

### Comuni
- **Pronuncia automatica** con file audio MP3 registrati da madrelingua
- **Feedback immediato** con spiegazione della risposta corretta
- **Sistema di stelle**: guadagna stelle completando gli esercizi (salvate in localStorage)
- **Modalita stelle**: visualizza e resetta le stelle guadagnate

## Tecnologie

- [React 19](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [GitHub Pages](https://pages.github.com/) per il deploy

## Installazione

```bash
npm install
npm run dev
```

Apri `http://localhost:5173` nel browser.

## Build per produzione

```bash
npm run build
npm run preview
```

## Deploy

Il deploy su GitHub Pages avviene automaticamente tramite GitHub Actions a ogni push sul branch `main`.

GitHub Pages del progetto [Filina](https://roblon.github.io/filina)
