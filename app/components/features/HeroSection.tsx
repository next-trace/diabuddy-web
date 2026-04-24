import { CSSProperties } from 'react';
import { DESIGN_TOKENS } from '../ui/design-tokens';

interface HeroSectionProps {
  badge?: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function HeroSection({ badge, title, description, children }: HeroSectionProps) {
  return (
    <div style={containerStyles}>
      <div style={heroContainerStyles}>
        {badge && <div style={badgeStyles}>{badge}</div>}
        <h1 style={titleStyles}>{title}</h1>
        <p style={descriptionStyles}>{description}</p>
        {children && <div style={ctaContainerStyles}>{children}</div>}
      </div>
    </div>
  );
}

const containerStyles: CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: DESIGN_TOKENS.spacing['3xl'],
};

const heroContainerStyles: CSSProperties = {
  textAlign: 'center',
};

const badgeStyles: CSSProperties = {
  display: 'inline-block',
  padding: `${DESIGN_TOKENS.spacing.sm} ${DESIGN_TOKENS.spacing.md}`,
  background: 'rgba(77, 186, 186, 0.1)',
  border: `1px solid ${DESIGN_TOKENS.colors.borderTurquoise}`,
  borderRadius: DESIGN_TOKENS.borderRadius.xl,
  color: DESIGN_TOKENS.colors.turquoise,
  fontSize: DESIGN_TOKENS.fontSize.sm,
  fontWeight: DESIGN_TOKENS.fontWeight.semibold,
  marginBottom: DESIGN_TOKENS.spacing.lg,
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
};

const titleStyles: CSSProperties = {
  fontSize: DESIGN_TOKENS.fontSize['5xl'],
  fontWeight: DESIGN_TOKENS.fontWeight.extrabold,
  lineHeight: 1.1,
  background: 'linear-gradient(135deg, #FFFFFF 0%, #4DBABA 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  margin: 0,
  marginBottom: DESIGN_TOKENS.spacing.lg,
};

const descriptionStyles: CSSProperties = {
  fontSize: DESIGN_TOKENS.fontSize.xl,
  lineHeight: 1.6,
  color: DESIGN_TOKENS.colors.textSecondary,
  maxWidth: '600px',
  margin: `0 auto ${DESIGN_TOKENS.spacing['2xl']}`,
};

const ctaContainerStyles: CSSProperties = {
  display: 'flex',
  gap: DESIGN_TOKENS.spacing.md,
  justifyContent: 'center',
  flexWrap: 'wrap' as const,
};
