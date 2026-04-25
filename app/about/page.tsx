import { Icon } from '../components/icons';
import { PageHeader, Card, CardHeader, CardBody } from '@next-trace/nexdoz-design-system/react';

export default function AboutPage() {
  return (
    <section className="shell" data-theme="dbui-light">
      <PageHeader
        icon={<Icon name="spark" />}
        eyebrow={<><Icon name="spark" /> About</>}
        title="Nexdoz Brand and Design Direction"
        subtitle="Nexdoz combines clinical clarity with emotionally calm interaction patterns. The visual system is grounded in deep persian-blue trust tones, turquoise guidance accents, and measured orange-coral highlights."
      />

      <div id="brand-principles" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
        <Card>
          <CardHeader title={<><Icon name="spark" /> Brand Principles</>} />
          <CardBody>
            <p className="dbui-muted">
              Keep form simple, message clear, and hierarchy obvious. Each element must communicate purpose quickly.
            </p>
            <p className="dbui-muted">
              We apply Paul Rand-inspired principles in practice: strong geometry, limited palette discipline, and memorable
              symbol-first identity.
            </p>
          </CardBody>
        </Card>
        <Card id="design-strategy">
          <CardHeader title={<><Icon name="timeline" /> Design Strategy</>} />
          <CardBody>
            <p className="dbui-muted">
              Light mode favors clarity and readability for daytime workflows. Dark mode emphasizes focus and confidence
              with higher signal contrast for navigation icons and active states.
            </p>
            <p className="dbui-muted">
              Motion is purposeful and lightweight. It can be disabled in settings to keep performance deterministic on
              lower-powered devices.
            </p>
          </CardBody>
        </Card>
      </div>
    </section>
  );
}
