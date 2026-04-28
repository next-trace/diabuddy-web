'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { BrandLockup } from '@next-trace/nexdoz-design-system/react';
import { Icon } from './icons';
import { ThemeSwitcher } from './theme-switcher';
import { LanguageSwitcher } from './language-switcher';
import { useLanguage } from './language';
import { csrfHeaders } from '../../lib/csrf';
import { StorageKeys, StorageEvents, migrateLegacyKeys } from '../../lib/storage-keys';

// Routes that don't require an authenticated session. AppShell skips the
// 401-redirect for these. Middleware also has its own public allow-list.
const PUBLIC_ROUTES = ['/', '/login', '/pricing', '/market'];
function isPublicRoute(pathname: string): boolean {
  if (pathname === '/' || pathname.startsWith('/login')) return true;
  return PUBLIC_ROUTES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

const navItems = [
  { href: '/', labelKey: 'nav.home', icon: 'home' as const },
  { href: '/dashboard', labelKey: 'nav.dashboard', icon: 'dashboard' as const },
  { href: '/patient/logging', labelKey: 'nav.logging', icon: 'logging' as const },
  { href: '/patient/timeline', labelKey: 'nav.timeline', icon: 'timeline' as const },
  { href: '/patient/meal-ai', labelKey: 'nav.meal_ai', icon: 'meal' as const },
  { href: '/insights', labelKey: 'nav.insights', icon: 'insights' as const },
  { href: '/care-plans', labelKey: 'nav.care_plans', icon: 'users' as const },
  { href: '/clinician', labelKey: 'nav.clinician', icon: 'stethoscope' as const },
  { href: '/settings', labelKey: 'nav.settings', icon: 'settings' as const },
  { href: '/pricing', labelKey: 'nav.pricing', icon: 'pricing' as const },
  { href: '/market', labelKey: 'nav.market', icon: 'market' as const }
];

function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 980px)').matches;
}

function displayNameFromEmail(email: string, fallback: string): string {
  if (!email) return fallback;
  const local = email.split('@')[0] || email;
  return local
    .replace(/[._-]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [displayNameOverride, setDisplayNameOverride] = useState<string>('');
  const profileWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMenuOpen(false);
    setProfileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    // One-shot copy of pre-rename diabuddy-* keys to nexdoz-*.
    migrateLegacyKeys();
  }, []);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        if (!res.ok) {
          // B6: do NOT silently fall back to a fake user on a protected page.
          // Public pages keep rendering anonymously.
          if (mounted) {
            setUserEmail('');
            setUserRole('');
            if (!isPublicRoute(pathname)) {
              router.replace('/login');
            }
          }
          return;
        }
        const payload = await res.json();
        const email = typeof payload?.email === 'string'
          ? payload.email
          : typeof payload?.user?.email === 'string'
            ? payload.user.email
            : '';
        const role = typeof payload?.role === 'string'
          ? payload.role
          : typeof payload?.user?.role === 'string'
            ? payload.user.role
            : typeof payload?.claims?.role === 'string'
              ? payload.claims.role
              : '';
        if (mounted) setUserEmail(email);
        if (mounted) setUserRole(role.toLowerCase());
      } catch {
        if (mounted) {
          setUserEmail('');
          setUserRole('');
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [pathname, router]);

  useEffect(() => {
    const readAvatar = () => {
      if (typeof window === 'undefined') return;
      setAvatarUrl(localStorage.getItem(StorageKeys.AVATAR) || '');
      setDisplayNameOverride(localStorage.getItem(StorageKeys.DISPLAY_NAME) || '');
    };

    readAvatar();
    window.addEventListener(StorageEvents.AVATAR, readAvatar);
    window.addEventListener('storage', readAvatar);

    return () => {
      window.removeEventListener(StorageEvents.AVATAR, readAvatar);
      window.removeEventListener('storage', readAvatar);
    };
  }, []);

  useEffect(() => {
    const syncUiEffects = () => {
      if (typeof window === 'undefined') return;
      const saved = localStorage.getItem(StorageKeys.UI_EFFECTS);
      const enabled = saved !== 'off';
      document.documentElement.setAttribute('data-ui-effects', enabled ? 'on' : 'off');
    };

    syncUiEffects();
    window.addEventListener(StorageEvents.UI_EFFECTS, syncUiEffects);
    window.addEventListener('storage', syncUiEffects);
    return () => {
      window.removeEventListener(StorageEvents.UI_EFFECTS, syncUiEffects);
      window.removeEventListener('storage', syncUiEffects);
    };
  }, []);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!profileMenuOpen) return;
      const target = event.target as Node | null;
      if (!target) return;
      if (profileWrapperRef.current?.contains(target)) return;
      setProfileMenuOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setProfileMenuOpen(false);
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [profileMenuOpen]);

  async function signOut() {
    const res = await fetch('/api/auth/logout', { method: 'POST', headers: csrfHeaders() });
    if (!res.ok) {
      await fetch('/api/auth/logout', { method: 'GET' });
    }
    window.location.href = '/login';
  }

  function toggleMenu() {
    if (isMobileViewport()) {
      setMenuOpen((x) => !x);
      return;
    }
    setNavCollapsed((x) => !x);
  }

  const displayName = useMemo(() => displayNameFromEmail(userEmail, ''), [userEmail]);
  const finalDisplayName = useMemo(
    () => (displayNameOverride.trim() ? displayNameOverride.trim() : displayName),
    [displayNameOverride, displayName]
  );
  const avatarLabel = useMemo(() => (finalDisplayName || 'N').slice(0, 1).toUpperCase(), [finalDisplayName]);
  const showStrategyLinks = userRole === 'admin';

  if (pathname === '/login' || pathname.startsWith('/login/')) {
    return <>{children}</>;
  }

  return (
    <div className={`appFrame ${navCollapsed ? 'navCollapsed' : ''}`}>
      {menuOpen ? <button className="menuBackdrop" aria-label="Close menu" onClick={() => setMenuOpen(false)} /> : null}

      <aside className={`sideNav ${menuOpen ? 'open' : ''}`}>
        <div className="sideTop">
          <button
            type="button"
            className="brandToggle"
            aria-label={navCollapsed ? 'Expand menu' : 'Collapse menu'}
            aria-expanded={!navCollapsed}
            onClick={toggleMenu}
          >
            <BrandLockup />
          </button>
        </div>
        <nav className="navList" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`navLink ${pathname === item.href ? 'active' : ''}`}
              title={t(item.labelKey)}
            >
              <Icon name={item.icon} />
              <span>{t(item.labelKey)}</span>
            </Link>
          ))}
        </nav>
        {showStrategyLinks ? (
          <div className="sideMeta">
            <Link href="/about" className="sideMetaLink">
              <Icon name="shield" /> {t('shell.about')}
            </Link>
            <Link href="/about#brand-principles" className="sideMetaLink">
              <Icon name="spark" /> {t('shell.brand_principles')}
            </Link>
            <Link href="/about#design-strategy" className="sideMetaLink">
              <Icon name="timeline" /> {t('shell.design_strategy')}
            </Link>
          </div>
        ) : null}
        <div className="profileWrapper sideProfile" ref={profileWrapperRef}>
          <button
            type="button"
            className="profileButton"
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            aria-label="User menu"
            aria-expanded={profileMenuOpen}
          >
            <span className="avatarChip" aria-hidden>
              {avatarUrl ? <img src={avatarUrl} alt="" className="avatarImage" /> : avatarLabel}
            </span>
            <span className="profileName">{finalDisplayName}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4 6l4 4 4-4z" />
            </svg>
          </button>
          {profileMenuOpen && (
            <div className="profileMenu">
              <div className="profileMenuHeader">
                <span className="profileMenuAvatar" aria-hidden>
                  {avatarUrl ? <img src={avatarUrl} alt="" className="avatarImage" /> : avatarLabel}
                </span>
                <span className="profileMenuIdentity">
                  <strong>{finalDisplayName}</strong>
                  {userEmail ? <small title={userEmail}>{userEmail}</small> : null}
                </span>
              </div>
              <div className="profileMenuDivider" />
              <div className="profileMenuSection">
                <LanguageSwitcher />
              </div>
              <div className="profileMenuSection">
                <ThemeSwitcher />
              </div>
              <div className="profileMenuDivider" />
              <Link href="/settings" className="profileMenuItem">
                <Icon name="settings" />
                <span>{t('nav.settings')}</span>
              </Link>
              <div className="profileMenuDivider" />
              <button type="button" className="profileMenuItem" onClick={signOut}>
                <Icon name="logout" />
                <span>{t('shell.sign_out')}</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      <div className="appBody">
        <header className="topBar">
          <div className="topBarLead">
            <button
              type="button"
              className="mobileNavButton"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={toggleMenu}
            >
              <Icon name="panel" />
            </button>
          </div>
        </header>
        <div className="pageWrap">{children}</div>
      </div>
    </div>
  );
}
