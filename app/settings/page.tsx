'use client';

import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Button, Input, Switch } from '@next-trace/diabuddy-design-system/react';
import { Icon } from '../components/icons';

const AVATAR_STORAGE_KEY = 'diabuddy-avatar-dataurl';
const AVATAR_EVENT = 'diabuddy-avatar-updated';
const UI_EFFECTS_STORAGE_KEY = 'diabuddy-ui-effects';
const UI_EFFECTS_EVENT = 'diabuddy-ui-effects-updated';

export default function SettingsPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [name, setName] = useState('Demo Patient');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [uiEffectsEnabled, setUiEffectsEnabled] = useState(true);

  useEffect(() => {
    const savedAvatar = localStorage.getItem(AVATAR_STORAGE_KEY) || '';
    const savedName = localStorage.getItem('diabuddy-display-name') || 'Demo Patient';
    const savedBirthDate = localStorage.getItem('diabuddy-birth-date') || '';
    const savedPhone = localStorage.getItem('diabuddy-phone') || '';
    const savedEmergencyContact = localStorage.getItem('diabuddy-emergency-contact') || '';
    const savedUiEffects = localStorage.getItem(UI_EFFECTS_STORAGE_KEY);
    setAvatarUrl(savedAvatar);
    setName(savedName);
    setBirthDate(savedBirthDate);
    setPhone(savedPhone);
    setEmergencyContact(savedEmergencyContact);
    setUiEffectsEnabled(savedUiEffects !== 'off');
  }, []);

  function notifyAvatarChanged(next: string) {
    setAvatarUrl(next);
    if (next) {
      localStorage.setItem(AVATAR_STORAGE_KEY, next);
    } else {
      localStorage.removeItem(AVATAR_STORAGE_KEY);
    }
    window.dispatchEvent(new Event(AVATAR_EVENT));
  }

  function onAvatarSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (!result) return;
      notifyAvatarChanged(result);
    };
    reader.readAsDataURL(file);
  }

  function clearAvatar() {
    if (fileInputRef.current) fileInputRef.current.value = '';
    notifyAvatarChanged('');
  }

  function saveName() {
    localStorage.setItem('diabuddy-display-name', name.trim() || 'Demo Patient');
    localStorage.setItem('diabuddy-birth-date', birthDate);
    localStorage.setItem('diabuddy-phone', phone);
    localStorage.setItem('diabuddy-emergency-contact', emergencyContact);
    localStorage.setItem(UI_EFFECTS_STORAGE_KEY, uiEffectsEnabled ? 'on' : 'off');
    document.documentElement.setAttribute('data-ui-effects', uiEffectsEnabled ? 'on' : 'off');
    window.dispatchEvent(new Event(UI_EFFECTS_EVENT));
    window.dispatchEvent(new Event(AVATAR_EVENT));
  }

  return (
    <section className="shell settingsShell">
      <section className="hero settingsHero">
        <p className="eyebrow eyebrowWithIcon"><Icon name="settings" /> ACCOUNT SETTINGS</p>
        <h1>Profile and Preferences</h1>
        <p className="lead">Manage your profile photo, name, and local experience settings.</p>
      </section>

      <section className="cards settingsGrid">
        <article className="card settingsCard">
          <h3>Profile</h3>
          <p className="muted">Manage your personal profile details and avatar.</p>
          <div className="settingsAvatarRow">
            <span className="settingsAvatarPreview" aria-hidden>
              {avatarUrl ? <img src={avatarUrl} alt="" className="settingsAvatarImage" /> : (name || 'D').slice(0, 1).toUpperCase()}
            </span>
            <div className="settingsIdentity">
              <strong>{name || 'Demo Patient'}</strong>
              <small>Account Profile</small>
            </div>
            <div className="settingsActions">
              <input ref={fileInputRef} type="file" accept="image/*" onChange={onAvatarSelected} />
              <div className="formActions">
                <Button type="button" variant="secondary" className="linkButton secondary" onClick={() => fileInputRef.current?.click()}>
                  Upload Photo
                </Button>
                <Button type="button" variant="secondary" className="linkButton secondary" onClick={clearAvatar}>
                  Remove Photo
                </Button>
              </div>
            </div>
          </div>
          <label htmlFor="displayName">Display name</label>
          <Input
            id="displayName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            maxLength={64}
          />
          <label htmlFor="birthDate">Birth date</label>
          <Input
            id="birthDate"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
          <label htmlFor="phone">Phone</label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 ..."
            maxLength={32}
          />
          <label htmlFor="emergencyContact">Emergency contact</label>
          <Input
            id="emergencyContact"
            value={emergencyContact}
            onChange={(e) => setEmergencyContact(e.target.value)}
            placeholder="Name and phone"
            maxLength={120}
          />
          <Switch
            id="uiEffects"
            className="settingsSwitch"
            checked={uiEffectsEnabled}
            onChange={setUiEffectsEnabled}
            label="Enable UI motion and glow effects"
          />
          <div className="formActions">
            <Button type="button" className="linkButton" onClick={saveName}>
              Save Profile
            </Button>
          </div>
        </article>
      </section>
    </section>
  );
}
