/**
 * Centralised localStorage keys + event names for nexdoz-web. All keys use
 * the `nexdoz-` prefix; the one-shot `migrateLegacyKeys()` copies over any
 * pre-rename `diabuddy-*` values and removes the old keys exactly once.
 */
export const StorageKeys = {
  AVATAR: 'nexdoz-avatar-dataurl',
  DISPLAY_NAME: 'nexdoz-display-name',
  BIRTH_DATE: 'nexdoz-birth-date',
  PHONE: 'nexdoz-phone',
  EMERGENCY_CONTACT: 'nexdoz-emergency-contact',
  THEME: 'nexdoz-theme',
  LANG: 'nexdoz-lang',
  UI_EFFECTS: 'nexdoz-ui-effects',
  MIGRATION_FLAG: 'nexdoz-storage-migration-v1',
} as const;

export const StorageEvents = {
  AVATAR: 'nexdoz-avatar-updated',
  UI_EFFECTS: 'nexdoz-ui-effects-updated',
} as const;

const LEGACY_KEY_MAP: Record<string, string> = {
  'diabuddy-avatar-dataurl':     StorageKeys.AVATAR,
  'diabuddy-display-name':       StorageKeys.DISPLAY_NAME,
  'diabuddy-birth-date':         StorageKeys.BIRTH_DATE,
  'diabuddy-phone':              StorageKeys.PHONE,
  'diabuddy-emergency-contact':  StorageKeys.EMERGENCY_CONTACT,
  'diabuddy-theme':              StorageKeys.THEME,
  'diabuddy-lang':               StorageKeys.LANG,
  'diabuddy-ui-effects':         StorageKeys.UI_EFFECTS,
};

export function migrateLegacyKeys(): void {
  if (typeof window === 'undefined') return;
  try {
    if (window.localStorage.getItem(StorageKeys.MIGRATION_FLAG) === '1') return;
    for (const [legacy, next] of Object.entries(LEGACY_KEY_MAP)) {
      const v = window.localStorage.getItem(legacy);
      if (v != null && window.localStorage.getItem(next) == null) {
        window.localStorage.setItem(next, v);
      }
      window.localStorage.removeItem(legacy);
    }
    window.localStorage.setItem(StorageKeys.MIGRATION_FLAG, '1');
  } catch {
    /* swallow — quota / privacy mode shouldn't break the app */
  }
}
