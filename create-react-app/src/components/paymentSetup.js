import React, { useMemo, useState } from 'react';
import AppNavbar from './navbar';
import { createPaymentProfile, listPaymentMethods } from '../services/payments';
import { listMembershipPlans } from '../services/memberships';

const paymentMethods = listPaymentMethods();
const membershipPlans = listMembershipPlans();

const paymentPlaybooks = [
  {
    id: 'membership-autopay',
    title: 'Membership autopay',
    description:
      'Vault a guest card on the first visit, pair it with a membership, and let renewals run on autopilot.',
    metric: '98% on-time renewals',
    tags: ['Recurring revenue', 'VIP retention'],
  },
  {
    id: 'pre-arrival',
    title: 'Pre-arrival checkout',
    description:
      'Send guests a secure link 24 hours before their treatment so they arrive ready to relax and skip the desk.',
    metric: '74% guests prepay',
    tags: ['Digital wallet', 'Frictionless'],
  },
  {
    id: 'retail-addons',
    title: 'Retail & add-ons bundle',
    description:
      'Capture a secondary payment source to cover enhancements, gratuity, and boutique items without slowing service.',
    metric: '17% uplift in add-ons',
    tags: ['Upsell ready', 'Front-desk assist'],
  },
];

const serviceCatalog = [
  {
    id: 'deep-relief',
    name: 'Deep Relief Massage',
    duration: '60 min',
    price: '145',
    description: 'Precision myofascial work focused on chronic tension and athletic recovery.',
    specialists: ['Amelia Hart', 'Mateo Rivera'],
  },
  {
    id: 'pre-natal',
    name: 'Prenatal Serenity',
    duration: '75 min',
    price: '165',
    description: 'Side-lying comfort with lymphatic support to ease swelling and nurture mom + baby.',
    specialists: ['Noah Williams'],
  },
  {
    id: 'aroma-ritual',
    name: 'Aromatherapy Ritual',
    duration: '90 min',
    price: '185',
    description: 'Guided breathwork, essential oils, and rhythmic flow to calm the nervous system.',
    specialists: ['Lena Cho'],
  },
  {
    id: 'luxe-stone',
    name: 'Luxe Stone Immersion',
    duration: '75 min',
    price: '195',
    description: 'Warm basalt stones paired with lymphatic drainage to boost circulation and glow.',
    specialists: ['Mateo Rivera', 'Amelia Hart'],
  },
];

const PaymentSetup = () => {
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState({
    guestName: '',
    email: '',
    methodId: paymentMethods[0]?.id || 'stripe-card',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    paypalEmail: '',
    membershipPlan: membershipPlans[0]?.id || '',
    saveAsDefault: true,
  });

  const selectedMethod = useMemo(
    () => paymentMethods.find((method) => method.id === formState.methodId) || paymentMethods[0],
    [formState.methodId]
  );

  const handleFieldChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormState((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formState.guestName || !formState.email) {
      setStatusMessage('Please add the guest name and email before continuing.');
      return;
    }

    if (
      selectedMethod?.requiresCard &&
      (!formState.cardNumber || !formState.expiryMonth || !formState.expiryYear)
    ) {
      setStatusMessage('Card details are required to tokenize the payment method.');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage('Creating payment profile…');

    try {
      const linkedPlan = membershipPlans.find((plan) => plan.id === formState.membershipPlan);
      const methodLabel = selectedMethod?.label?.split('·')[0].trim() || selectedMethod?.label || 'Payment method';

      const result = await createPaymentProfile({
        guestName: formState.guestName,
        email: formState.email,
        methodId: formState.methodId,
        cardNumber: formState.cardNumber,
        expiryMonth: formState.expiryMonth,
        expiryYear: formState.expiryYear,
        cvc: formState.cvc,
        paypalEmail: formState.paypalEmail,
        membershipPlan: formState.membershipPlan,
        saveAsDefault: formState.saveAsDefault,
      });

      const nextActionText = result.nextAction ? ` · Next step: ${result.nextAction}` : '';
      const planText = linkedPlan ? ` · Linked to ${linkedPlan.name} membership` : '';

      setStatusMessage(
        `${methodLabel} saved for ${result.guestName} via ${result.provider}${planText}. Status: ${result.status.replace('-', ' ')}${nextActionText}`
      );
      setFormState({
        guestName: '',
        email: '',
        methodId: paymentMethods[0]?.id || 'stripe-card',
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvc: '',
        paypalEmail: '',
        membershipPlan: membershipPlans[0]?.id || '',
        saveAsDefault: true,
      });
    } catch (error) {
      console.error('Payment profile creation failed', error);
      setStatusMessage('We were unable to store the payment method. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-shell">
      <AppNavbar />
      <main className="content-container page-section">
        <header className="page-header">
          <span className="eyebrow">Revenue cockpit</span>
          <h1 className="section-title">Payments & service readiness</h1>
          <p>
            Orchestrate how guests check out, ensure the right expertise is on the schedule, and give
            your team a single view of every billing touchpoint.
          </p>
        </header>

        <section className="card-surface payment-intro">
          <div className="payment-intro__body">
            <h2 style={{ margin: 0 }}>Design how you get paid</h2>
            <p className="helper-text" style={{ marginTop: 0 }}>
              Combine modern payment flows with curated spa offerings. Pick the processor, vault the
              method, and align the right therapist in just a few clicks.
            </p>
          </div>
          <div className="payment-intro__metrics">
            <div className="metric-chip">
              <strong>24 hr</strong>
              <span>Average confirmation time for new saved payment profiles</span>
            </div>
            <div className="metric-chip">
              <strong>+17%</strong>
              <span>Uplift when services are paired with specialist recommendations</span>
            </div>
            <div className="metric-chip">
              <strong>{paymentMethods.length}</strong>
              <span>Channels ready for secure capture</span>
            </div>
          </div>
        </section>

        <div className="payment-system-grid">
          <div className="payment-primary-column">
            <section className="card-surface payment-flow-card">
              <h2 style={{ marginTop: 0 }}>Payment playbooks</h2>
              <p className="helper-text" style={{ marginTop: '-0.25rem' }}>
                Choose a strategy that mirrors your guest journey, then pick the processor that powers
                it.
              </p>
              <ul className="payment-playbook-list">
                {paymentPlaybooks.map((playbook) => (
                  <li key={playbook.id} className="payment-playbook">
                    <div className="payment-playbook__headline">
                      <strong>{playbook.title}</strong>
                      <span className="payment-playbook__metric">{playbook.metric}</span>
                    </div>
                    <p className="helper-text" style={{ marginTop: 0 }}>{playbook.description}</p>
                    <div className="payment-playbook__tags">
                      {playbook.tags.map((tag) => (
                        <span key={tag} className="tag-pill">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="divider" />

              <h3 style={{ marginBottom: '0.75rem' }}>Select processor</h3>
              <div className="service-options">
                {paymentMethods.map((method) => (
                  <label key={method.id} className="service-option">
                    <input
                      type="radio"
                      name="methodId"
                      value={method.id}
                      checked={formState.methodId === method.id}
                      onChange={handleFieldChange}
                    />
                    <div>
                      <strong>{method.label}</strong>
                      <p className="helper-text" style={{ marginTop: '0.35rem' }}>{method.processing}</p>
                    </div>
                  </label>
                ))}
              </div>

              {selectedMethod && (
                <div className="payment-method-summary">
                  <span className="integration-pill">{selectedMethod.provider} integration</span>
                  <p className="helper-text" style={{ marginBottom: '0.25rem' }}>
                    {selectedMethod.processing}
                  </p>
                  <ul className="method-feature-list">
                    {selectedMethod.features?.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            <section className="card-surface payment-form-card">
              <h2 style={{ marginTop: 0 }}>Vault guest payment details</h2>
              <p className="helper-text" style={{ marginTop: '-0.25rem' }}>
                Securely tokenize payment credentials, attach the right membership, and automate
                renewals.
              </p>
              <form className="stacked-form" onSubmit={handleSubmit}>
                <div className="form-row two-column">
                  <div>
                    <label htmlFor="guestName">Guest name</label>
                    <input
                      id="guestName"
                      name="guestName"
                      value={formState.guestName}
                      onChange={handleFieldChange}
                      placeholder="Taylor Brooks"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleFieldChange}
                      placeholder="taylor@example.com"
                      required
                    />
                  </div>
                </div>

                {selectedMethod?.requiresCard && (
                  <>
                    <div>
                      <label htmlFor="cardNumber">Card number</label>
                      <input
                        id="cardNumber"
                        name="cardNumber"
                        inputMode="numeric"
                        maxLength={19}
                        value={formState.cardNumber}
                        onChange={handleFieldChange}
                        placeholder="4242 4242 4242 4242"
                      />
                    </div>
                    <div className="form-row two-column">
                      <div>
                        <label htmlFor="expiryMonth">Expiry month</label>
                        <input
                          id="expiryMonth"
                          name="expiryMonth"
                          placeholder="MM"
                          value={formState.expiryMonth}
                          onChange={handleFieldChange}
                          maxLength={2}
                        />
                      </div>
                      <div>
                        <label htmlFor="expiryYear">Expiry year</label>
                        <input
                          id="expiryYear"
                          name="expiryYear"
                          placeholder="YY"
                          value={formState.expiryYear}
                          onChange={handleFieldChange}
                          maxLength={2}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="cvc">CVC</label>
                      <input
                        id="cvc"
                        name="cvc"
                        placeholder="CVC"
                        value={formState.cvc}
                        onChange={handleFieldChange}
                        maxLength={4}
                      />
                    </div>
                  </>
                )}

                {selectedMethod?.requiresPaypal && (
                  <div>
                    <label htmlFor="paypalEmail">PayPal email</label>
                    <input
                      id="paypalEmail"
                      name="paypalEmail"
                      type="email"
                      value={formState.paypalEmail}
                      onChange={handleFieldChange}
                      placeholder="guest@paypal.com"
                    />
                    <p className="helper-text" style={{ marginTop: '0.35rem' }}>
                      The guest will approve a billing agreement directly with PayPal.
                    </p>
                  </div>
                )}

                {selectedMethod?.requiresEmailOnly && (
                  <p className="helper-text" style={{ marginTop: '-0.25rem' }}>
                    Stripe Link relies on the guest email to send a secure checkout link for upcoming
                    visits.
                  </p>
                )}

                <div>
                  <label htmlFor="membershipPlan">Link membership</label>
                  <select
                    id="membershipPlan"
                    name="membershipPlan"
                    value={formState.membershipPlan}
                    onChange={handleFieldChange}
                  >
                    {membershipPlans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} · ${plan.price}/{plan.frequency.replace('per ', '')}
                      </option>
                    ))}
                  </select>
                  <p className="helper-text" style={{ marginTop: '0.35rem' }}>
                    {selectedMethod.label} · {selectedMethod.processing}
                  </p>
                </div>

                <div>
                  <label htmlFor="saveAsDefault">Auto-renew membership</label>
                  <div className="toggle-field">
                    <input
                      type="checkbox"
                      id="saveAsDefault"
                      name="saveAsDefault"
                      checked={formState.saveAsDefault}
                      onChange={handleFieldChange}
                    />
                    <span>Charge the stored payment method each billing cycle</span>
                  </div>
                </div>

                <button className="button button-primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving…' : 'Store payment method'}
                </button>
              </form>
              {statusMessage && <div className="status-banner">{statusMessage}</div>}
            </section>
          </div>

          <div className="payment-secondary-column">
            <aside className="card-surface service-directory">
              <h2 style={{ marginTop: 0 }}>Services & specialists</h2>
              <p className="helper-text" style={{ marginTop: '-0.35rem' }}>
                Align every booking with the talent who delivers it best. Use this roster to prep
                staffing, pricing, and payment rules together.
              </p>

              <div className="service-directory__list">
                {serviceCatalog.map((service) => (
                  <article key={service.id} className="service-directory__item">
                    <div className="service-directory__header">
                      <h3>{service.name}</h3>
                      <span>
                        {service.duration} · ${service.price}
                      </span>
                    </div>
                    <p>{service.description}</p>
                    <div className="service-directory__team">
                      {service.specialists.map((specialist) => (
                        <span key={specialist} className="team-pill">
                          {specialist}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </aside>

            <aside className="card-surface operations-card">
              <h2 style={{ marginTop: 0 }}>Operational checklist</h2>
              <p className="helper-text" style={{ marginTop: '-0.35rem' }}>
                Follow these touchpoints so billing, staffing, and service delivery stay perfectly in
                sync.
              </p>
              <ol className="workflow-steps">
                <li>
                  <strong>Confirm guest consent</strong>
                  <p className="helper-text">Outline storage, renewals, and add-on authorisations.</p>
                </li>
                <li>
                  <strong>Tokenize with {selectedMethod?.provider || 'Stripe/PayPal'}</strong>
                  <p className="helper-text">Use the form to vault credentials against the chosen plan.</p>
                </li>
                <li>
                  <strong>Match service & specialist</strong>
                  <p className="helper-text">Reserve the therapist listed above to honour guest goals.</p>
                </li>
                <li>
                  <strong>Send confirmation</strong>
                  <p className="helper-text">Share receipts, pre-arrival tips, and optional upgrades.</p>
                </li>
              </ol>
              <div className="divider" />
              <div className="insight-metric">
                <span className="insight-metric__value">92%</span>
                <span className="insight-metric__label">membership retention with stored payments</span>
              </div>
              <p className="helper-text" style={{ marginTop: '0.75rem' }}>
                Need corporate invoicing or gift cards? Extend the payment catalog anytime from
                settings.
              </p>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentSetup;
