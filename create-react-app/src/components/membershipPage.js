import React, { useMemo, useState } from 'react';
import AppNavbar from './navbar';
import { createMembershipEnrollment, listMembershipPlans } from '../services/memberships';

const plans = listMembershipPlans();

const MembershipPage = () => {
  const defaultPlan = useMemo(() => plans.find((plan) => plan.featured) || plans[0], []);
  const [selectedPlanId, setSelectedPlanId] = useState(defaultPlan.id);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    startDate: '',
    autopay: true,
  });

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === selectedPlanId) || plans[0],
    [selectedPlanId]
  );

  const handleSelectPlan = (planId) => {
    setSelectedPlanId(planId);
    setStatusMessage(`"${plans.find((plan) => plan.id === planId)?.name}" membership selected.`);
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormState((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEnrollment = async (event) => {
    event.preventDefault();

    if (!formState.name || !formState.email || !formState.startDate) {
      setStatusMessage('Please complete all required enrollment fields.');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage('Submitting membership enrollment…');

    try {
      const enrollment = await createMembershipEnrollment({
        name: formState.name,
        email: formState.email,
        planId: selectedPlanId,
        startDate: formState.startDate,
        autopay: formState.autopay,
      });

      setStatusMessage(
        `Welcome, ${enrollment.name}! The ${selectedPlan.name} membership will activate on ${new Date(
          enrollment.startDate
        ).toLocaleDateString()}.`
      );
      setFormState({ name: '', email: '', startDate: '', autopay: true });
    } catch (error) {
      console.error('Membership enrollment failed', error);
      setStatusMessage('We were unable to start the membership. Please try again shortly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-shell">
      <AppNavbar />
      <main className="content-container page-section">
        <header className="membership-hero">
          <span className="eyebrow">Memberships</span>
          <h1 className="section-title">Curated wellness, renewed each month</h1>
          <p className="section-subtitle">
            Reward loyalty with elevated rituals, exclusive lounges, and concierge care. Choose a plan
            for your guest and lock in their preferred cadence.
          </p>
        </header>

        <section className="membership-grid">
          {plans.map((plan) => {
            const isSelected = plan.id === selectedPlanId;
            return (
              <article
                key={plan.id}
                className="card-surface membership-card"
                style={{
                  borderColor: isSelected ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.12)',
                  boxShadow: isSelected ? '0 25px 45px rgba(99, 91, 255, 0.35)' : undefined,
                }}
              >
                {plan.featured && <span className="tag">Popular</span>}
                <div className="membership-card__header">
                  <h3 style={{ margin: 0 }}>{plan.name}</h3>
                  <span className="membership-card__price">${plan.price}</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>{plan.frequency}</span>
                </div>
                <ul className="benefit-list">
                  {plan.perks.map((perk) => (
                    <li key={perk}>{perk}</li>
                  ))}
                </ul>
                <button
                  type="button"
                  className={`button ${isSelected ? 'button-primary' : 'button-secondary'}`}
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  {isSelected ? 'Selected plan' : 'Choose this plan'}
                </button>
              </article>
            );
          })}
        </section>

        <section className="card-surface" style={{ marginTop: '3rem' }}>
          <h2 style={{ marginTop: 0 }}>Activate a member</h2>
          <p className="helper-text">
            Secure billing details and welcome gifts once you confirm the enrollment. Memberships can be
            paused or upgraded at any time from the guest profile.
          </p>
          <form className="stacked-form" onSubmit={handleEnrollment}>
            <div className="form-row two-column">
              <div>
                <label htmlFor="name">Guest name</label>
                <input
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleInputChange}
                  placeholder="Jordan Nguyen"
                  required
                />
              </div>
              <div>
                <label htmlFor="email">Guest email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleInputChange}
                  placeholder="guest@email.com"
                  required
                />
              </div>
            </div>
            <div className="form-row two-column">
              <div>
                <label htmlFor="startDate">First visit date</label>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formState.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="plan">Membership plan</label>
                <select id="plan" name="plan" value={selectedPlanId} onChange={(event) => handleSelectPlan(event.target.value)}>
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} · ${plan.price}/{plan.frequency.replace('per ', '')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <label style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <input
                type="checkbox"
                name="autopay"
                checked={formState.autopay}
                onChange={handleInputChange}
                style={{ width: 'auto' }}
              />
              Enroll the member in automatic billing each month
            </label>
            <button className="button button-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enrolling…' : `Activate ${selectedPlan.name}`}
            </button>
          </form>
          {statusMessage && <div className="status-banner" style={{ marginTop: '1.75rem' }}>{statusMessage}</div>}
        </section>
      </main>
    </div>
  );
};

export default MembershipPage;
