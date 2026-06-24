# 🎮 Filina — Impara l'Italiano

Un'app React interattiva per imparare il vocabolario e la grammatica italiana in modo divertente, con **emoji** e **pronuncia vocale**.

## ✨ Caratteristiche

### 🎯 Giochi
- **7 categorie tematiche**: Animali, Colori, Numeri, Cibo, Vestiti, Corpo e Famiglia
- **Due modalità di gioco** che si alternano ogni 5 domande:
  - *Parola → Emoji*: leggi la parola e scegli l'emoji corrispondente
  - *Emoji → Parola*: guarda l'emoji e scegli la parola giusta
- **Vocabolario completo** con articoli determinativi per ogni parola

### ✍️ Grammatica
- **Articoli**: impara gli articoli determinativi (il, lo, l', la) e indeterminativi (un, uno, un', una)
  - Ogni domanda mostra una parola con emoji e chiede di scegliere l'articolo corretto
  - Modalità mista che alterna articoli determinativi e indeterminativi
- **Preposizioni Semplici**: completa le frasi con la preposizione giusta (di, a, da, in, con, su, per, tra, fra)
- **Preposizioni Articolate**: completa le frasi con la forma articolata corretta (al, del, nel, sul, dalla, negli…)

### Comuni
- **Pronuncia automatica** con file audio MP3 registrati da madrelingua
- **Feedback immediato** con spiegazione della risposta corretta
- **Punteggio e barra di progresso** durante la partita

## 🚀 Tecnologie

- [React 19](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [GitHub Pages](https://pages.github.com/) per il deploy

## 📦 Installazione

```bash
npm install
npm run dev
```

Apri `http://localhost:5173` nel browser.

## 🏗️ Build per produzione

```bash
npm run build
npm run preview
```

Il deploy su GitHub Pages avviene automaticamente tramite GitHub Actions a ogni push sul branch `main`.
