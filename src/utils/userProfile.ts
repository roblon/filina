import type { UserProfile } from '../types'

const STORAGE_KEY = 'filina_user_profile'

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  avatar: '🧑',
  disableAudio: false,
}

export function getUserProfile(): UserProfile {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return DEFAULT_PROFILE
    return { ...DEFAULT_PROFILE, ...(JSON.parse(data) as Partial<UserProfile>) }
  } catch {
    return DEFAULT_PROFILE
  }
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  } catch {
    // ignore storage errors
  }
}
