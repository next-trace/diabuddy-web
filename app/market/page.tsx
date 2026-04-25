import { Icon } from '../components/icons';
import { PageHeader, Card, CardHeader, CardBody, Button } from '@next-trace/nexdoz-design-system/react';

const competitors = [
  {
    name: 'mySugr',
    model: 'Freemium + PRO subscription',
    angle: 'Strong logging UX and coaching orientation',
    url: 'https://support.mysugr.com/hc/en-us/articles/20143331655452-mySugr-PRO-price-change-for-new-subscription-activations'
  },
  {
    name: 'Dexcom Clarity',
    model: 'Companion app listed free',
    angle: 'CGM reporting and clinical trend visibility',
    url: 'https://apps.apple.com/us/app/dexcom-clarity/id1019225730'
  },
  {
    name: 'FreeStyle LibreLink',
    model: 'Companion app listed free',
    angle: 'Sensor ecosystem lock-in and cloud connectivity',
    url: 'https://apps.apple.com/us/app/freestyle-librelink-us/id1325992472'
  },
  {
    name: 'Glooko',
    model: 'Patient app + provider/enterprise channels',
    angle: 'Broad device integration and B2B workflows',
    url: 'https://glooko.com/'
  },
  {
    name: 'Diabetes:M',
    model: 'Freemium + premium in-app purchases',
    angle: 'Feature-rich self-management and reports',
    url: 'https://apps.apple.com/us/app/diabetes-m/id1196733537'
  },
  {
    name: 'OneTouch Reveal',
    model: 'Device ecosystem companion',
    angle: 'Meter sync and provider sharing',
    url: 'https://professional.onetouch.com/software-and-apps/reveal-app'
  }
];

export default function MarketPage() {
  return (
    <section className="shell" data-theme="dbui-light">
      <PageHeader
        icon={<Icon name="market" />}
        eyebrow={<><Icon name="market" /> Go-to-Market</>}
        title="Market Intelligence"
        subtitle="Diabetes app competition is real. Nexdoz differentiation is not generic logging — it is explainable recommendations plus clinician-ready escalation workflow."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {competitors.map((item) => (
          <Card key={item.name}>
            <CardHeader title={item.name} />
            <CardBody>
              <p><strong>Monetization:</strong> {item.model}</p>
              <p className="dbui-muted">{item.angle}</p>
              <a href={item.url} target="_blank" rel="noreferrer">
                <Button variant="ghost" size="sm"><Icon name="market" /> Source</Button>
              </a>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader title="Nexdoz Positioning" />
        <CardBody>
          <div className="stack">
            <p><strong>Primary wedge:</strong> Decision cockpit that closes the care loop (track, explain, recommend, follow-up, measure).</p>
            <p><strong>Commercial motion:</strong> B2C acquisition with free + Plus, B2B expansion with Clinician Pro and Enterprise.</p>
            <p><strong>Reference date:</strong> competitor scan last updated April 20, 2026.</p>
          </div>
        </CardBody>
      </Card>
    </section>
  );
}
