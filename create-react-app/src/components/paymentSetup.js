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
    methodId: paymentMethods[0]?.id || 'card',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    membershipPlan: membershipPlans[0]?.id || '',
  });

  const selectedMethod = useMemo(
    () => paymentMethods.find((method) => method.id === formState.methodId) || paymentMethods[0],
    [formState.methodId]
  );

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormState((previous) => ({ ...previous, [name]: value }));
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
        cardLast4: formState.cardNumber.slice(-4),
        expiryMonth: formState.expiryMonth,
        expiryYear: formState.expiryYear,
        membershipPlan: formState.membershipPlan,
      });

      setStatusMessage(
        `Payment method saved for ${result.guestName}. Status: ${result.status.replace('-', ' ')}.`
      );
      setFormState({
        guestName: '',
        email: '',
        methodId: paymentMethods[0]?.id || 'card',
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        membershipPlan: membershipPlans[0]?.id || '',
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
            Capture and tokenize payment details with built-in compliance. Pair a method to a
            membership or spa package to streamline renewals.
          </p>
        </header>

        <div className="payment-grid">
          <section className="card-surface payment-card">
            <h2 style={{ marginTop: 0 }}>Choose payment flow</h2>
            <p className="helper-text">
              Select how the guest prefers to settle invoices. Wallet and corporate billing options can
              be activated once agreements are on file.
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
                    <p className="helper-text" style={{ marginTop: '0.35rem' }}>
                      {method.processing}
                    </p>
                  </div>
                </label>
              ))}
            </div>
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

              {formState.methodId === 'card' && (
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
                </>
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

              <button className="button button-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving…' : 'Store payment method'}
              </button>
            </form>
            {statusMessage && <div className="status-banner">{statusMessage}</div>}
          </section>
        </div>
      </main>
    </div>
  );
};

export default PaymentSetup;
