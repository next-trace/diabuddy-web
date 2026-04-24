import { CSSProperties } from 'react';
import { DESIGN_TOKENS } from '../ui/design-tokens';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface FeatureSectionProps {
  features: Feature[];
  variant?: 'turquoise' | 'dark';
}

export function FeatureSection({ features, variant = 'dark' }: FeatureSectionProps) {
  return (
    <div style={containerStyles}>
      <div style={gridStyles}>
        {features.map((feature, index) => (
          <article key={index} style={getCardStyles(variant)}>
            <div style={iconContainerStyles}>
              <span style={iconStyles}>{feature.icon}</span>
            </div>
            <h3 style={titleStyles}>{feature.title}</h3>
            <p style={descriptionStyles}>{feature.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

const containerStyles: CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: DESIGN_TOKENS.spacing.xl,
};

const gridStyles: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: DESIGN_TOKENS.spacing.lg,
};

function getCardStyles(variant: 'turquoise' | 'dark'): CSSProperties {
  const base: CSSProperties = {
    borderRadius: DESIGN_TOKENS.borderRadius.lg,
    padding: DESIGN_TOKENS.spacing.xl,
    transition: DESIGN_TOKENS.transitions.slow,
    cursor: 'pointer',
  };

  if (variant === 'turquoise') {
    return {
      ...base,
      background: 'linear-gradient(135deg, rgba(77, 186, 186, 0.2) 0%, rgba(77, 186, 186, 0.05) 100%)',
      border: `1px solid ${DESIGN_TOKENS.colors.borderTurquoise}`,
    };
  }

  return {
    ...base,
    background: DESIGN_TOKENS.colors.bgCard,
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };
}

const iconContainerStyles: CSSProperties = {
  width: '56px',
  height: '56px',
  background: 'rgba(77, 186, 186, 0.2)',
  borderRadius: DESIGN_TOKENS.borderRadius.md,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: DESIGN_TOKENS.spacing.lg,
};

const iconStyles: CSSProperties = {
  fontSize: '28px',
};

const titleStyles: CSSProperties = {
  fontSize: DESIGN_TOKENS.fontSize['2xl'],
  fontWeight: DESIGN_TOKENS.fontWeight.bold,
  color: DESIGN_TOKENS.colors.textPrimary,
  margin: 0,
  marginBottom: DESIGN_TOKENS.spacing.md,
};

const descriptionStyles: CSSProperties = {
  fontSize: DESIGN_TOKENS.fontSize.base,
  lineHeight: 1.6,
  color: DESIGN_TOKENS.colors.textSecondary,
  margin: 0,
};
