import { CSSProperties } from 'react';
import { DESIGN_TOKENS } from '../ui/design-tokens';

interface CTASectionProps {
  title: string;
  description: string;
  primaryCTA: { text: string; href: string };
  secondaryCTA?: { text: string; href: string };
}

export function CTASection({ title, description, primaryCTA, secondaryCTA }: CTASectionProps) {
  return (
    <div style={containerStyles}>
      <div style={ctaContainerStyles}>
        <h2 style={titleStyles}>{title}</h2>
        <p style={descriptionStyles}>{description}</p>
        <div style={buttonGroupStyles}>
          <a href={primaryCTA.href} style={primaryButtonStyles}>
            {primaryCTA.text}
          </a>
          {secondaryCTA && (
            <a href={secondaryCTA.href} style={secondaryButtonStyles}>
              {secondaryCTA.text}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

const containerStyles: CSSProperties = {
  maxWidth: '1200px',
  margin: '60px auto',
  padding: DESIGN_TOKENS.spacing['3xl'],
};

const ctaContainerStyles: CSSProperties = {
  textAlign: 'center',
  background: 'linear-gradient(135deg, rgba(77, 186, 186, 0.1) 0%, rgba(77, 186, 186, 0.05) 100%)',
  borderRadius: DESIGN_TOKENS.borderRadius.xl,
  border: `1px solid ${DESIGN_TOKENS.colors.borderTurquoise}`,
  padding: `${DESIGN_TOKENS.spacing['3xl']} ${DESIGN_TOKENS.spacing.lg}`,
};

const titleStyles: CSSProperties = {
  fontSize: DESIGN_TOKENS.fontSize['4xl'],
  fontWeight: DESIGN_TOKENS.fontWeight.extrabold,
  color: DESIGN_TOKENS.colors.textPrimary,
  margin: 0,
  marginBottom: DESIGN_TOKENS.spacing.md,
};

const descriptionStyles: CSSProperties = {
  fontSize: DESIGN_TOKENS.fontSize.lg,
  color: DESIGN_TOKENS.colors.textSecondary,
  marginBottom: DESIGN_TOKENS.spacing.xl,
};

const buttonGroupStyles: CSSProperties = {
  display: 'flex',
  gap: DESIGN_TOKENS.spacing.md,
  justifyContent: 'center',
  flexWrap: 'wrap' as const,
};

const primaryButtonStyles: CSSProperties = {
  background: DESIGN_TOKENS.colors.turquoise,
  color: DESIGN_TOKENS.colors.bgDark,
  padding: `18px 48px`,
  borderRadius: DESIGN_TOKENS.borderRadius.md,
  fontSize: DESIGN_TOKENS.fontSize.lg,
  fontWeight: DESIGN_TOKENS.fontWeight.bold,
  textDecoration: 'none',
  display: 'inline-block',
  boxShadow: '0 4px 20px rgba(77, 186, 186, 0.4)',
  transition: DESIGN_TOKENS.transitions.base,
};

const secondaryButtonStyles: CSSProperties = {
  background: 'transparent',
  color: DESIGN_TOKENS.colors.turquoise,
  padding: `18px 48px`,
  borderRadius: DESIGN_TOKENS.borderRadius.md,
  fontSize: DESIGN_TOKENS.fontSize.lg,
  fontWeight: DESIGN_TOKENS.fontWeight.bold,
  textDecoration: 'none',
  display: 'inline-block',
  border: `2px solid ${DESIGN_TOKENS.colors.turquoise}`,
  transition: DESIGN_TOKENS.transitions.base,
};
