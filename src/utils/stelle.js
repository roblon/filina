const STORAGE_KEY = 'filina_stelle'

export function getChiaviGuadagnate() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function salvaChiavi(keys) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keys))
}

export function stellaGiaGuadagnata(key) {
  return getChiaviGuadagnate().includes(key)
}

export function registraStella(key) {
  const keys = getChiaviGuadagnate()
  if (!keys.includes(key)) {
    keys.push(key)
    salvaChiavi(keys)
    return true
  }
  return false
}
