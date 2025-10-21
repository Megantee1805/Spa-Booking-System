const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit or debit card', processing: 'Instant confirmation' },
  { id: 'wallet', label: 'Spa digital wallet', processing: 'Auto-apply loyalty balance' },
  { id: 'invoice', label: 'Corporate invoice', processing: 'Net 15 settlement' },
];

export const listPaymentMethods = () => PAYMENT_METHODS;

export const createPaymentProfile = async ({
  guestName,
  email,
  methodId,
  cardLast4,
  expiryMonth,
  expiryYear,
  membershipPlan,
}) => {
  await new Promise((resolve) => setTimeout(resolve, 550));

  return {
    id: `${methodId}-${Date.now()}`,
    guestName,
    email,
    methodId,
    cardLast4,
    expiryMonth,
    expiryYear,
    membershipPlan,
    status: 'requires-confirmation',
  };
};
