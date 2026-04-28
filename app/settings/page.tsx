'use client';

import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Button, Input, Switch, PageHeader, Card, CardHeader, CardBody } from '@next-trace/nexdoz-design-system/react';
import { Icon } from '../components/icons';
import { StorageKeys, StorageEvents } from '../../lib/storage-keys';

export default function SettingsPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [uiEffectsEnabled, setUiEffectsEnabled] = useState(true);

  useEffect(() => {
    const savedAvatar = localStorage.getItem(StorageKeys.AVATAR) || '';
    const savedName = localStorage.getItem(StorageKeys.DISPLAY_NAME) || '';
    const savedBirthDate = localStorage.getItem(StorageKeys.BIRTH_DATE) || '';
    const savedPhone = localStorage.getItem(StorageKeys.PHONE) || '';
    const savedEmergencyContact = localStorage.getItem(StorageKeys.EMERGENCY_CONTACT) || '';
    const savedUiEffects = localStorage.getItem(StorageKeys.UI_EFFECTS);
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
      localStorage.setItem(StorageKeys.AVATAR, next);
    } else {
      localStorage.removeItem(StorageKeys.AVATAR);
    }
    window.dispatchEvent(new Event(StorageEvents.AVATAR));
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
    localStorage.setItem(StorageKeys.DISPLAY_NAME, name.trim());
    localStorage.setItem(StorageKeys.BIRTH_DATE, birthDate);
    localStorage.setItem(StorageKeys.PHONE, phone);
    localStorage.setItem(StorageKeys.EMERGENCY_CONTACT, emergencyContact);
    localStorage.setItem(StorageKeys.UI_EFFECTS, uiEffectsEnabled ? 'on' : 'off');
    document.documentElement.setAttribute('data-ui-effects', uiEffectsEnabled ? 'on' : 'off');
    window.dispatchEvent(new Event(StorageEvents.UI_EFFECTS));
    window.dispatchEvent(new Event(StorageEvents.AVATAR));
  }

  return (
    <section className="shell" data-theme="dbui-light">
      <PageHeader
        icon={<Icon name="settings" />}
        eyebrow={<><Icon name="settings" /> Account Settings</>}
        title="Profile and Preferences"
        subtitle="Manage your profile photo, name, and local experience settings."
      />

      <Card>
        <CardHeader title="Profile" eyebrow="Personal" />
        <CardBody>
          <p className="dbui-muted">Manage your personal profile details and avatar.</p>
          <div className="settingsAvatarRow">
            <span className="settingsAvatarPreview" aria-hidden>
              {avatarUrl ? <img src={avatarUrl} alt="" className="settingsAvatarImage" /> : (name || 'N').slice(0, 1).toUpperCase()}
            </span>
            <div className="settingsIdentity">
              <strong>{name || 'Your name'}</strong>
              <small>Account Profile</small>
            </div>
            <div className="settingsActions">
              <input ref={fileInputRef} type="file" accept="image/*" onChange={onAvatarSelected} />
              <div className="formActions">
                <Button type="button" variant="secondary" size="md" onClick={() => fileInputRef.current?.click()}>
                  Upload Photo
                </Button>
                <Button type="button" variant="ghost" size="md" onClick={clearAvatar}>
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
            <Button type="button" variant="primary" size="md" onClick={saveName}>
              Save Profile
            </Button>
          </div>
        </CardBody>
      </Card>
    </section>
  );
}
