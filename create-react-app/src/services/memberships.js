const MEMBERSHIP_PLANS = [
  {
    id: 'heritage',
    name: 'Heritage',
    price: 159,
    frequency: 'per month',
    perks: [
      'One 90-minute signature ritual each month',
      'Complimentary hydrotherapy lounge access',
      'Priority booking windows and late cancellations',
      '5% retail boutique savings',
    ],
    featured: false,
  },
  {
    id: 'luminary',
    name: 'Luminary',
    price: 229,
    frequency: 'per month',
    perks: [
      'Two 75-minute bespoke treatments per month',
      'Guided wellness coaching session each quarter',
      'Complimentary enhancements on every visit',
      '10% savings on retail and add-ons',
    ],
    featured: true,
  },
  {
    id: 'celestial',
    name: 'Celestial',
    price: 349,
    frequency: 'per month',
    perks: [
      'Weekly 60-minute treatments with therapist rotation',
      'Private suite upgrade with each reservation',
      'Quarterly restorative retreat experience',
      '20% boutique savings and gifting concierge',
    ],
    featured: false,
  },
];

export const listMembershipPlans = () => MEMBERSHIP_PLANS;

export const createMembershipEnrollment = async ({ name, email, planId, startDate, autopay }) => {
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    id: `${planId}-${Date.now()}`,
    name,
    email,
    planId,
    startDate,
    autopay,
  };
};
