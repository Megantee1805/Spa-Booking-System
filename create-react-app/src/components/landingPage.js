import React from 'react';
import { Link } from 'react-router-dom';
import AppNavbar from './navbar';

const features = [
  {
    title: 'Smart Scheduling',
    description:
      'Balance room availability, team assignments, and client preferences automatically with a single drag-and-drop calendar.',
    icon: '🗓️',
  },
  {
    title: 'Client Journeys',
    description:
      'Delight guests with detailed profiles, treatment history, and follow-up reminders tailored to their wellness goals.',
    icon: '🌿',
  },
  {
    title: 'Team Intelligence',
    description:
      'Track performance, certifications, and workload to empower every therapist to excel and grow.',
    icon: '💡',
  },
  {
    title: 'Integrated Commerce',
    description:
      'Bundle retail products, memberships, and packages with Stripe and PayPal-ready flows for effortless checkouts.',
    icon: '🛍️',
  },
];

const processSteps = [
  {
    title: 'Plan the day',
    description: 'Visual dashboards reveal staffing gaps and high-demand treatments at a glance.',
  },
  {
    title: 'Personalize sessions',
    description: 'Instantly reference notes, allergies, and rituals for every returning guest.',
  },
  {
    title: 'Grow loyalty',
    description: 'Automated touchpoints keep guests inspired between visits and coming back.',
  },
];

const testimonials = [
  {
    quote:
      'Our average guest rating jumped to 4.9 stars after adopting the new CRM experience. The team stays aligned and our clients notice.',
    author: 'Sasha Martinez · Director, Aurora Spa Retreat',
  },
  {
    quote:
      'Booking used to take three different tools. Now front desk to treatment room all live in one beautiful workflow.',
    author: 'Michael Tan · Operations Lead, Meridian Wellness',
  },
  {
    quote:
      'We grew memberships by 28% in a single quarter thanks to automated follow-ups and curated offers.',
    author: 'Emily Chen · Founder, Tranquility Collective',
  },
];

const LandingPage = () => {
  return (
    <div className="page-shell">
      <AppNavbar />
      <main>
        <section className="hero">
          <div className="content-container hero-content">
            <div>
              <span className="eyebrow">Spa CRM Platform</span>
              <h1 className="hero-title">Elevate every wellness experience</h1>
              <p className="hero-subtitle">
                Manage therapists, rooms, and loyal guests in a single orchestrated hub. From first
                booking to post-treatment rituals, deliver the signature moments your spa is known for.
              </p>
              <div className="hero-actions">
                <Link to="/register" className="button button-primary">
                  Start free trial
                </Link>
                <Link to="/services" className="button button-secondary">
                  Explore treatments
                </Link>
                <Link to="/memberships" className="button button-ghost">
                  Membership programs
                </Link>
              </div>
              <div className="metrics-row">
                <div className="metric-card">
                  <div className="metric-value">98%</div>
                  <div className="metric-label">Guest satisfaction across partners</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value">3x</div>
                  <div className="metric-label">Faster booking coordination</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value">24/7</div>
                  <div className="metric-label">Automated concierge coverage</div>
                </div>
              </div>
            </div>
            <div className="card-surface" style={{ position: 'relative', overflow: 'hidden' }}>
              <h2 style={{ marginTop: 0 }}>Design your signature journey</h2>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
                Outline rituals, soundtrack, lighting, and aromatherapy preferences for every service.
                Your therapists receive beautifully formatted run sheets the moment a guest checks in.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '2rem 0 0', display: 'grid', gap: '1rem' }}>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <span role="img" aria-hidden="true" style={{ fontSize: '1.6rem' }}>
                    ✨
                  </span>
                  <div>
                    <strong>Luxury-ready templates</strong>
                    <p style={{ margin: '0.3rem 0 0', color: 'var(--color-text-muted)' }}>
                      Configure signature sequences once and replicate instantly across locations.
                    </p>
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <span role="img" aria-hidden="true" style={{ fontSize: '1.6rem' }}>
                    🤝
                  </span>
                  <div>
                    <strong>Connected care teams</strong>
                    <p style={{ margin: '0.3rem 0 0', color: 'var(--color-text-muted)' }}>
                      Share prep notes, contraindications, and upsell suggestions instantly.
                    </p>
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <span role="img" aria-hidden="true" style={{ fontSize: '1.6rem' }}>
                    📊
                  </span>
                  <div>
                    <strong>Real-time insights</strong>
                    <p style={{ margin: '0.3rem 0 0', color: 'var(--color-text-muted)' }}>
                      Monitor occupancy, therapist utilization, and revenue with live dashboards.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="section content-container" id="about">
          <h2 className="section-title">Crafted for modern spa leaders</h2>
          <p className="section-subtitle">
            Every feature is tuned for hospitality-driven experiences. From boutique retreats to
            multi-location brands, the platform adapts to your rituals and team structure.
          </p>
          <div className="feature-grid">
            {features.map((feature) => (
              <article key={feature.title} className="feature-card">
                <div className="feature-icon" aria-hidden="true">
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section content-container">
          <h2 className="section-title">A thoughtful flow for every visit</h2>
          <p className="section-subtitle">
            Our guided operating system keeps your front desk, concierge, and therapists in sync, so
            guests feel the difference from greeting to farewell.
          </p>
          <div className="process-grid">
            {processSteps.map((step, index) => (
              <article key={step.title} className="process-step">
                <span>{index + 1}</span>
                <h3 style={{ marginTop: 0 }}>{step.title}</h3>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section content-container">
          <h2 className="section-title">Loved by spa teams everywhere</h2>
          <p className="section-subtitle">
            Leaders trust our platform to amplify human hospitality with technology that feels
            invisible to guests and effortless for staff.
          </p>
          <div className="testimonial-grid">
            {testimonials.map((testimonial) => (
              <figure key={testimonial.author} className="testimonial-card">
                <blockquote className="testimonial-quote">“{testimonial.quote}”</blockquote>
                <figcaption className="testimonial-author">{testimonial.author}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="content-container cta-section" id="contact">
          <h2>Let’s orchestrate unforgettable spa journeys</h2>
          <p>
            See how our spa CRM can streamline your operations and create signature experiences at
            scale. Our specialists will tailor a walkthrough to your brand.
          </p>
          <div className="hero-actions" style={{ justifyContent: 'center' }}>
            <Link to="/register" className="button button-primary">
              Book a demo
            </Link>
            <a href="mailto:hello@spacrm.com" className="button button-secondary">
              Talk to a specialist
            </a>
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="content-container">
          <p>&copy; {new Date().getFullYear()} TranquilFlow CRM. Designed for serene experiences.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
