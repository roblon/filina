import { useEffect, useState } from 'react'
import styles from './UserMenu.module.css'
import type { UserProfile } from '../types'

interface UserMenuProps {
  profile: UserProfile
  onSave: (profile: UserProfile) => void
  lowered?: boolean
}

const AVATARS = ['🧑', '🐶', '🐱', '🦄', '🐼', '🐸', '🐙', '🐰']

function UserMenu({ profile, onSave, lowered }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(profile.name)
  const [avatar, setAvatar] = useState(profile.avatar || AVATARS[0])
  const [disableAudio, setDisableAudio] = useState(profile.disableAudio ?? false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setName(profile.name)
    setAvatar(profile.avatar || AVATARS[0])
    setDisableAudio(profile.disableAudio ?? false)
  }, [profile])

  useEffect(() => {
    if (!saved) return
    const timeout = window.setTimeout(() => setSaved(false), 1200)
    return () => window.clearTimeout(timeout)
  }, [saved])

  function handleProfileChange(profile: { name: string; avatar: string; disableAudio: boolean }) {
    setName(profile.name)
    setAvatar(profile.avatar)
    setDisableAudio(profile.disableAudio)
    setSaved(true)
    onSave(profile)
  }

  return (
    <div className={`${styles.userMenuWrapper} ${lowered ? styles.userMenuLowered : ''}`}>
      <button className={styles.userButton} onClick={() => setOpen((value) => !value)}>
        <span className={styles.userAvatar}>{avatar}</span>
        <span className={styles.userName}>{name || 'Utente'}</span>
      </button>

      {open && (
        <div className={styles.modalOverlay} onClick={() => setOpen(false)}>
          <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <div className={styles.modalTitle}>Profilo utente</div>
                <div className={styles.modalSubtitle}>Inserisci il tuo nome e scegli un avatar</div>
              </div>
              <button className={styles.closeButton} onClick={() => setOpen(false)}>
                ✕
              </button>
            </div>

            <div className={`${styles.confirmMessage} ${saved ? styles.confirmVisible : ''}`} aria-live="polite">
              Profilo aggiornato!
            </div>

            <label className={styles.fieldLabel} htmlFor="user-name">
              Il tuo nome
            </label>
            <input
              id="user-name"
              className={styles.textInput}
              type="text"
              value={name}
              onChange={(event) => handleProfileChange({ name: event.target.value, avatar })}
              placeholder="Scrivi il tuo nome"
            />

            <div className={styles.avatarSection}>
              <div className={styles.fieldLabel}>Scegli un avatar</div>
              <div className={styles.avatarGrid}>
                {AVATARS.map((item) => (
                  <button
                    key={item}
                    className={`${styles.avatarOption} ${avatar === item ? styles.avatarSelected : ''}`}
                    type="button"
                    onClick={() => handleProfileChange({ name, avatar: item, disableAudio })}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.settingsSection}>
              <div className={styles.sectionTitle}>Impostazioni</div>
              <label className={styles.toggleLabel}>
                <input
                  type="checkbox"
                  checked={disableAudio}
                  onChange={(event) => handleProfileChange({ name, avatar, disableAudio: event.target.checked })}
                />
                Disabilita audio
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserMenu
