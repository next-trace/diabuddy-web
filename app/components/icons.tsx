import type { SVGProps } from 'react';

type IconName =
  | 'home'
  | 'login'
  | 'dashboard'
  | 'logging'
  | 'timeline'
  | 'palette'
  | 'menu'
  | 'panel'
  | 'users'
  | 'logout'
  | 'spark'
  | 'meal'
  | 'insights'
  | 'shield'
  | 'stethoscope'
  | 'pricing'
  | 'market'
  | 'settings';

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
}

export function Icon({ name, ...props }: IconProps) {
  const base = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true
  };

  if (name === 'home') {
    return (
      <svg {...base} {...props}>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
      </svg>
    );
  }

  if (name === 'login') {
    return (
      <svg {...base} {...props}>
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
        <path d="M10 17 15 12 10 7" />
        <path d="M15 12H3" />
      </svg>
    );
  }

  if (name === 'dashboard') {
    return (
      <svg {...base} {...props}>
        <rect x="3" y="3" width="8" height="8" rx="1.5" />
        <rect x="13" y="3" width="8" height="5" rx="1.5" />
        <rect x="13" y="10" width="8" height="11" rx="1.5" />
        <rect x="3" y="13" width="8" height="8" rx="1.5" />
      </svg>
    );
  }

  if (name === 'logging') {
    return (
      <svg {...base} {...props}>
        <rect x="5" y="4" width="14" height="16" rx="2" />
        <path d="M9 9h6" />
        <path d="M9 13h6" />
        <path d="M9 17h4" />
      </svg>
    );
  }

  if (name === 'timeline') {
    return (
      <svg {...base} {...props}>
        <path d="M4 6h16" />
        <path d="M4 12h16" />
        <path d="M4 18h16" />
        <circle cx="7" cy="6" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="15" cy="12" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="10" cy="18" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (name === 'menu') {
    return (
      <svg {...base} {...props}>
        <path d="M4 7h16" />
        <path d="M4 12h16" />
        <path d="M4 17h16" />
      </svg>
    );
  }

  if (name === 'panel') {
    return (
      <svg {...base} {...props}>
        <rect x="3.5" y="4" width="17" height="16" rx="3" />
        <path d="M9 4v16" />
      </svg>
    );
  }

  if (name === 'palette') {
    return (
      <svg {...base} {...props}>
        <path d="M12 3a9 9 0 1 0 0 18h1.2a2.3 2.3 0 0 0 0-4.6h-1.4a1.7 1.7 0 0 1 0-3.4H15a6 6 0 0 0 0-12h-3z" />
        <circle cx="7.5" cy="9.5" r="1" fill="currentColor" stroke="none" />
        <circle cx="9.5" cy="6.8" r="1" fill="currentColor" stroke="none" />
        <circle cx="13.5" cy="6.7" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (name === 'users') {
    return (
      <svg {...base} {...props}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.9" />
        <path d="M16 3.1a4 4 0 0 1 0 7.8" />
      </svg>
    );
  }

  if (name === 'logout') {
    return (
      <svg {...base} {...props}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="M16 17 21 12 16 7" />
        <path d="M21 12H9" />
      </svg>
    );
  }

  if (name === 'shield') {
    return (
      <svg {...base} {...props}>
        <path d="M12 2.5 4 5.5v5c0 6 3.5 10.5 8 12 4.5-1.5 8-6 8-12v-5l-8-3z" />
        <path d="M9 12l2 2 4-4" strokeWidth="2.2" />
      </svg>
    );
  }

  if (name === 'stethoscope') {
    return (
      <svg {...base} {...props}>
        <path d="M4.8 2.3A.3.3 0 0 0 4.5 2H4c-.3 0-.5.2-.5.4V6c0 2.1 1.7 3.8 3.8 3.8h.7c1.2 0 2.3.6 3 1.5 1-1 2.3-1.5 3.5-1.5h.7c2.1 0 3.8-1.7 3.8-3.8V2.4c0-.2-.2-.4-.5-.4h-.5c-.2 0-.3.1-.3.3" />
        <circle cx="19" cy="13" r="2" />
        <path d="M19 15v4a4 4 0 0 1-8 0v-2" />
      </svg>
    );
  }

  if (name === 'spark') {
    return (
      <svg {...base} {...props}>
        <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" fill="none" />
        <path d="M19 15l.8 2.4L22 18l-2.2.6L19 21l-.8-2.4L16 18l2.2-.6z" fill="none" />
        <path d="M5 18l.6 1.8L7.5 20l-1.9.2L5 22l-.6-1.8L2.5 20l1.9-.2z" fill="none" />
      </svg>
    );
  }

  if (name === 'meal') {
    return (
      <svg {...base} {...props}>
        <path d="M4.5 14h12a4.5 4.5 0 1 1 0 9h-12a4.5 4.5 0 1 1 0-9z" />
        <path d="M8 14a4 4 0 0 1 8 0" />
        <path d="M3 3v6" />
        <path d="M5.5 3v6" />
        <path d="M8 3v6" />
        <path d="M15 3v8" />
      </svg>
    );
  }

  if (name === 'insights') {
    return (
      <svg {...base} {...props}>
        <path d="M4 19.5h16" />
        <path d="M6 16.5 10.5 12l3 2.5L19 9" />
        <circle cx="6" cy="16.5" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="10.5" cy="12" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="13.5" cy="14.5" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="19" cy="9" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (name === 'pricing') {
    return (
      <svg {...base} {...props}>
        <path d="M12 2v20" />
        <path d="M17 6.5c0-1.9-2.2-3.5-5-3.5s-5 1.6-5 3.5 2.2 3.5 5 3.5 5 1.6 5 3.5-2.2 3.5-5 3.5-5-1.6-5-3.5" />
      </svg>
    );
  }

  if (name === 'market') {
    return (
      <svg {...base} {...props}>
        <path d="M4 20h16" />
        <path d="M7 20V9" />
        <path d="M12 20V5" />
        <path d="M17 20v-8" />
        <path d="m4 11 4-4 4 2 8-5" />
      </svg>
    );
  }

  if (name === 'settings') {
    return (
      <svg {...base} {...props}>
        <circle cx="12" cy="12" r="3.2" />
        <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a1.7 1.7 0 0 1-2.4 2.4l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a1.7 1.7 0 0 1-3.4 0v-.1a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a1.7 1.7 0 0 1-2.4-2.4l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a1.7 1.7 0 0 1 0-3.4h.1a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a1.7 1.7 0 0 1 2.4-2.4l.1.1a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.9V4a1.7 1.7 0 0 1 3.4 0v.1a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a1.7 1.7 0 0 1 2.4 2.4l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6H20a1.7 1.7 0 0 1 0 3.4h-.1a1 1 0 0 0-.9.6z" />
      </svg>
    );
  }

  return (
    <svg {...base} {...props}>
      <path d="m12 3 2.4 4.8 5.3.8-3.8 3.7.9 5.2L12 15l-4.8 2.5.9-5.2L4.3 8.6l5.3-.8L12 3z" />
    </svg>
  );
}
