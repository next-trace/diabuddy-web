import { Icon } from '../components/icons';

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
    <section className="shell">
      <section className="hero">
        <p className="eyebrow eyebrowWithIcon"><Icon name="market" /> GO-TO-MARKET</p>
        <h1>Market Intelligence</h1>
        <p className="lead">
          Diabetes app competition is real. DiaBuddy differentiation is not generic logging, it is explainable recommendations plus clinician-ready escalation workflow.
        </p>
      </section>

      <section className="cards marketGrid">
        {competitors.map((item) => (
          <article className="card" key={item.name}>
            <h3>{item.name}</h3>
            <p><strong>Monetization:</strong> {item.model}</p>
            <p className="muted">{item.angle}</p>
            <a className="linkButton secondary sourceButton" href={item.url} target="_blank" rel="noreferrer">
              <Icon name="market" /> Source
            </a>
          </article>
        ))}
      </section>

      <section className="card marketPositioning">
        <h3>DiaBuddy Positioning</h3>
        <div className="stack">
          <p><strong>Primary wedge:</strong> Decision cockpit that closes care loop (track, explain, recommend, follow-up, measure).</p>
          <p><strong>Commercial motion:</strong> B2C acquisition with free + Plus, B2B expansion with Clinician Pro and Enterprise.</p>
          <p><strong>Reference date:</strong> competitor scan last updated April 20, 2026.</p>
        </div>
      </section>
    </section>
  );
}
