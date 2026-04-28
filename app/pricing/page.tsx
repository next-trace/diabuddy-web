'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Icon } from '../components/icons';
import { PageHeader, Tabs, Button } from '@next-trace/nexdoz-design-system/react';

type Billing = 'monthly' | 'yearly';
type PlanKey = 'core' | 'plus' | 'clinician' | 'enterprise';

type Plan = {
  key: PlanKey;
  name: string;
  monthly: number;
  yearly: number;
  description: string;
  features: string[];
  cta: string;
};

type ComparisonRow = {
  label: string;
  values: Record<PlanKey, string>;
};

const planOrder: PlanKey[] = ['core', 'plus', 'clinician', 'enterprise'];

const plans: Plan[] = [
  {
    key: 'core',
    name: 'Core',
    monthly: 2.99,
    yearly: 24.99,
    description: 'For motivated patients who need structured daily control without clinician tools.',
    features: ['Event logging + timeline', 'Meal and activity capture', 'Baseline insights', 'Single patient profile'],
    cta: 'Start 14-day Trial'
  },
  {
    key: 'plus',
    name: 'Personal Plus',
    monthly: 7.99,
    yearly: 79.99,
    description: 'For high-engagement patients who want explainable recommendations and action plans.',
    features: ['Everything in Core', 'Explainable AI recommendations', 'Action plan engine', 'Advanced trend insights'],
    cta: 'Upgrade to Plus'
  },
  {
    key: 'clinician',
    name: 'Clinician Pro',
    monthly: 89,
    yearly: 890,
    description: 'For clinicians and coaches managing patient panels with escalation workflows.',
    features: ['Everything in Personal Plus', 'Clinician summary workspace', 'Escalation queue', 'Up to 50 patient seats'],
    cta: 'Start Team Trial'
  },
  {
    key: 'enterprise',
    name: 'Enterprise',
    monthly: 349,
    yearly: 3490,
    description: 'For hospitals and care programs requiring contracts, controls, and integration support.',
    features: ['Everything in Clinician Pro', 'Tenant controls + audit support', 'Priority support + SLA', 'Custom integration'],
    cta: 'Contact Sales'
  }
];

const comparisonRows: ComparisonRow[] = [
  {
    label: 'Event logging + timeline',
    values: { core: 'Included', plus: 'Included', clinician: 'Included', enterprise: 'Included' }
  },
  {
    label: 'AI recommendations',
    values: { core: 'Basic', plus: 'Advanced', clinician: 'Advanced', enterprise: 'Advanced + policy controls' }
  },
  {
    label: 'Action plans',
    values: { core: 'Not included', plus: 'Included', clinician: 'Included', enterprise: 'Included' }
  },
  {
    label: 'Connected profiles',
    values: { core: '1', plus: 'Up to 3', clinician: 'Up to 50 patients', enterprise: 'Unlimited (contract)' }
  },
  {
    label: 'Clinician summary workspace',
    values: { core: 'Not included', plus: 'Not included', clinician: 'Included', enterprise: 'Included' }
  },
  {
    label: 'Escalation queue + routing',
    values: { core: 'Not included', plus: 'Not included', clinician: 'Included', enterprise: 'Included + SLA routing' }
  },
  {
    label: 'Reports + exports',
    values: { core: 'CSV export', plus: 'CSV + PDF', clinician: 'Team reporting', enterprise: 'Custom + API export' }
  },
  {
    label: 'Device/data integrations',
    values: { core: 'Standard', plus: 'Standard', clinician: 'Expanded', enterprise: 'Custom connectors' }
  },
  {
    label: 'Admin controls',
    values: { core: 'Not included', plus: 'Not included', clinician: 'Basic', enterprise: 'Advanced tenant controls' }
  },
  {
    label: 'Support',
    values: { core: 'Email', plus: 'Priority email', clinician: 'Priority support', enterprise: 'SLA support + dedicated manager' }
  },
  {
    label: 'Compliance package',
    values: { core: 'Standard', plus: 'Standard', clinician: 'Clinical-ready', enterprise: 'Contract + audit package' }
  },
  {
    label: 'Onboarding',
    values: { core: 'Self-serve', plus: 'Guided setup', clinician: 'Team onboarding', enterprise: 'Managed onboarding' }
  }
];

function formatPrice(value: number): string {
  const hasDecimal = Math.abs(value - Math.trunc(value)) > 0;
  return hasDecimal ? value.toFixed(2) : `${value}`;
}

export default function PricingPage() {
  const [billing, setBilling] = useState<Billing>('monthly');

  const discountText = useMemo(() => {
    if (billing === 'monthly') return 'Billed monthly';
    return 'Billed yearly (approx 16% saving)';
  }, [billing]);

  return (
    <section className="shell" data-theme="dbui-light">
      <PageHeader
        icon={<Icon name="pricing" />}
        eyebrow={<><Icon name="pricing" /> Commercial Model</>}
        title="Subscription Plans"
        subtitle="Built for consumer, clinician, and enterprise growth with clear upgrade paths and recurring revenue. No free plan, only a time-boxed trial to protect conversion quality."
        actions={
          <>
            <Link href="/market"><Button variant="secondary" size="md"><Icon name="market" /> View Market Scan</Button></Link>
            <Link href="/dashboard"><Button variant="primary" size="md"><Icon name="dashboard" /> Open Product</Button></Link>
          </>
        }
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <Tabs
          ariaLabel="Billing period"
          value={billing}
          onChange={(id) => setBilling(id as Billing)}
          items={[
            { id: 'monthly', label: 'Monthly' },
            { id: 'yearly',  label: 'Yearly' },
          ]}
        />
        <p className="dbui-muted" style={{ margin: 0 }}>{discountText}. Localized checkout: USD in the US, EUR in Eurozone (VAT included where required).</p>
      </div>

      <section className="cards pricingGrid">
        {plans.map((plan) => {
          const price = billing === 'monthly' ? plan.monthly : plan.yearly;
          const suffix = billing === 'monthly' ? '/mo' : '/yr';
          return (
            <article className={`card pricingCard ${plan.name === 'Personal Plus' ? 'planFeatured' : ''}`} key={plan.name}>
              <h3>{plan.name}</h3>
              <p className="muted">{plan.description}</p>
              <p className="priceTag">${formatPrice(price)}{suffix}</p>
              <div className="stack">
                {plan.features.map((f) => (
                  <p key={f}>• {f}</p>
                ))}
              </div>
              <div className="ctaRow">
                <button className="linkButton">{plan.cta}</button>
                <button className="linkButton secondary">Contact Sales</button>
              </div>
            </article>
          );
        })}
      </section>

      <section className="card">
        <h3>Full Plan Comparison</h3>
        <div className="comparisonTableWrap">
          <table className="comparisonTable">
            <thead>
              <tr>
                <th>Capability</th>
                {plans.map((plan) => (
                  <th key={plan.name}>{plan.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.label}>
                  <td>{row.label}</td>
                  {planOrder.map((planKey) => (
                    <td key={`${row.label}-${planKey}`}>{row.values[planKey]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="cards pricingNotes">
        <article className="card">
          <h3>Revenue Plan</h3>
          <p className="muted">Target mix: 62% Core, 24% Personal Plus, 11% Clinician Pro, 3% Enterprise.</p>
          <p className="muted">Annual billing goal: 58% of closed deals to improve retention and cash flow predictability.</p>
        </article>
        <article className="card">
          <h3>Competitive Position</h3>
          <p className="muted">Yes, we have competitors: mySugr, Dexcom Clarity, LibreLink, Glooko, Diabetes:M, OneTouch Reveal.</p>
          <p className="muted">Positioning advantage: explainable recommendations plus clinician-ready escalation workflows.</p>
        </article>
        <article className="card">
          <h3>Go-To-Market Sequence</h3>
          <p className="muted">Land with Core/Plus trials, expand to Clinician Pro in practices, then convert programs to Enterprise contracts.</p>
        </article>
      </section>
    </section>
  );
}
