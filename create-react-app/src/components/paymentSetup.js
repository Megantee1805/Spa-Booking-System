import React, { useMemo, useState } from 'react';
import AppNavbar from './navbar';
import { createPaymentProfile, listPaymentMethods } from '../services/payments';
import { listMembershipPlans } from '../services/memberships';

const paymentMethods = listPaymentMethods();
const membershipPlans = listMembershipPlans();

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

    if (formState.methodId === 'card' && (!formState.cardNumber || !formState.expiryMonth || !formState.expiryYear)) {
      setStatusMessage('Card details are required to tokenize the payment method.');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage('Creating payment profile…');

    try {
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

      setStatusMessage(
        `Payment method saved for ${result.guestName} via ${result.provider}. Status: ${result.status.replace('-', ' ')}${
          result.nextAction ? ` · Next step: ${result.nextAction}` : ''
        }`
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
          <span className="eyebrow">Billing studio</span>
          <h1 className="section-title">Initiate secure guest payments</h1>
          <p>
            Capture and tokenize payment details with built-in compliance. Choose between Stripe or
            PayPal to meet every guest preference and link their method to the perfect membership.
          </p>
        </header>

        <div className="payment-grid">
          <section className="card-surface payment-card">
            <h2 style={{ marginTop: 0 }}>Choose payment flow</h2>
            <p className="helper-text">
              Select how the guest prefers to settle invoices. Enable Stripe for saved cards or Stripe
              Link for lightning-fast checkout, or use PayPal for a trusted redirect experience.
            </p>
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
              <div className="method-summary">
                <span className="integration-pill">{selectedMethod.provider} integration</span>
                <p className="helper-text" style={{ marginBottom: '0.5rem' }}>
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

          <section className="card-surface payment-card">
            <h2 style={{ marginTop: 0 }}>Payment details</h2>
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
                    We will redirect the guest to PayPal to approve the billing agreement.
                  </p>
                </div>
              )}

              {selectedMethod?.requiresEmailOnly && (
                <p className="helper-text" style={{ marginTop: '-0.25rem' }}>
                  Stripe Link uses the guest email to send a secure checkout link for future visits.
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
                  <span>Charge the saved payment method each billing cycle</span>
                </div>
              </div>

              <button className="button button-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving…' : 'Store payment method'}
              </button>
            </form>
            {statusMessage && <div className="status-banner">{statusMessage}</div>}
          </section>

          <aside className="card-surface payment-card payment-side-panel">
            <h2 style={{ marginTop: 0 }}>Activation checklist</h2>
            <ol className="workflow-steps">
              <li>
                <strong>Collect guest consent</strong>
                <p className="helper-text">Review terms for storing payment details and renewals.</p>
              </li>
              <li>
                <strong>Tokenize with {selectedMethod?.provider || 'Stripe/PayPal'}</strong>
                <p className="helper-text">Use the secure form on the left to capture credentials.</p>
              </li>
              <li>
                <strong>Attach to membership</strong>
                <p className="helper-text">Ensure the selected plan matches their visit cadence.</p>
              </li>
              <li>
                <strong>Send confirmation</strong>
                <p className="helper-text">Deliver a branded receipt with next steps and perks.</p>
              </li>
            </ol>
            <div className="divider" />
            <div className="insight-metric">
              <span className="insight-metric__value">92%</span>
              <span className="insight-metric__label">of members stay active with saved payments</span>
            </div>
            <p className="helper-text" style={{ marginTop: '0.75rem' }}>
              Need to support corporate invoicing or gift cards? Extend the catalog from settings at
              any time.
            </p>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default PaymentSetup;
