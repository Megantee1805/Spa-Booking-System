const PAYMENT_METHODS = [
  {
    id: 'stripe-card',
    label: 'Stripe · Card on file',
    processing: 'Instant tokenization with automatic renewals',
    provider: 'Stripe',
    requiresCard: true,
    features: ['Supports Visa, Mastercard, Amex, and more', '3D Secure when required', 'Auto retry for renewals'],
  },
  {
    id: 'stripe-link',
    label: 'Stripe Link · Saved checkout',
    processing: 'Frictionless wallet for repeat guests',
    provider: 'Stripe',
    requiresEmailOnly: true,
    features: ['One-click checkout experience', 'Guest authenticated by Stripe', 'Best for fast digital prepay'],
  },
  {
    id: 'paypal',
    label: 'PayPal Billing Agreements',
    processing: 'Secure redirect with PayPal protection',
    provider: 'PayPal',
    requiresPaypal: true,
    features: ['Guests sign in with PayPal credentials', 'Supports bank or balance funding sources', 'Ideal for international visitors'],
  },
];

export const listPaymentMethods = () => PAYMENT_METHODS;

const wait = (duration = 650) => new Promise((resolve) => setTimeout(resolve, duration));

const simulateStripeTokenization = async ({ cardNumber, expiryMonth, expiryYear, cvc }) => {
  if (!cardNumber || !expiryMonth || !expiryYear || !cvc) {
    throw new Error('Stripe card details are incomplete.');
  }

  await wait(520);
  return {
    token: `pm_${cardNumber.slice(-4)}${Date.now()}`,
    fingerprint: `fp_${Math.random().toString(36).slice(2, 10)}`,
  };
};

const simulateStripeLinkCheckout = async ({ email }) => {
  if (!email) {
    throw new Error('Stripe Link requires a guest email.');
  }

  await wait(380);
  return {
    linkId: `link_${Date.now()}`,
    status: 'awaiting-verification',
  };
};

const simulatePaypalAgreement = async ({ paypalEmail }) => {
  if (!paypalEmail) {
    throw new Error('PayPal requires the guest PayPal email.');
  }

  await wait(480);
  return {
    billingAgreementId: `B-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
    approvalUrl: 'https://paypal.com/checkoutnow?token=mock',
  };
};

export const createPaymentProfile = async ({
  guestName,
  email,
  methodId,
  cardNumber,
  expiryMonth,
  expiryYear,
  cvc,
  paypalEmail,
  membershipPlan,
  saveAsDefault,
}) => {
  const method = PAYMENT_METHODS.find((candidate) => candidate.id === methodId);
  if (!method) {
    throw new Error('Unsupported payment method selected.');
  }

  await wait(450);

  let providerReference = '';
  let status = 'requires-confirmation';
  let nextAction;

  if (method.requiresCard) {
    const tokenization = await simulateStripeTokenization({
      cardNumber,
      expiryMonth,
      expiryYear,
      cvc,
    });
    providerReference = tokenization.token;
    status = 'requires-authentication';
    nextAction = 'Complete 3D Secure if prompted by Stripe.';
  } else if (method.requiresPaypal) {
    const paypal = await simulatePaypalAgreement({ paypalEmail });
    providerReference = paypal.billingAgreementId;
    status = 'awaiting-approval';
    nextAction = 'Guest must approve billing agreement via PayPal redirect.';
  } else if (method.requiresEmailOnly) {
    const linkCheckout = await simulateStripeLinkCheckout({ email });
    providerReference = linkCheckout.linkId;
    status = linkCheckout.status;
    nextAction = 'Send guest the Stripe Link email to finalize checkout.';
  }

  return {
    id: `${methodId}-${Date.now()}`,
    guestName,
    email,
    methodId,
    provider: method.provider,
    membershipPlan,
    cardLast4: cardNumber ? cardNumber.slice(-4) : undefined,
    paypalEmail,
    saveAsDefault,
    status,
    providerReference,
    nextAction,
  };
};
