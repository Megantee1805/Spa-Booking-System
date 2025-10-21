import { collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { firestore } from './firebase';

const BOOKINGS_COLLECTION = 'bookings';

const sanitizeString = (value) => {
  if (!value) {
    return '';
  }

  return String(value)
    .trim()
    .replace(/[&<>'"`]/g, (char) => {
      const entities = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;',
        '`': '&#96;',
      };
      return entities[char] || char;
    });
};

const normalizeEmail = (email) => email.trim().toLowerCase();

const isEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());

export const fetchBookingsByMasseur = async (masseurId) => {
  if (!masseurId) {
    return [];
  }

  if (!firestore) {
    console.warn('Firestore is not configured. Skipping booking fetch.');
    return [];
  }

  const safeMasseurId = sanitizeString(String(masseurId));
  const bookingsQuery = query(
    collection(firestore, BOOKINGS_COLLECTION),
    where('masseurId', '==', safeMasseurId)
  );

  const snapshot = await getDocs(bookingsQuery);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      masseurId: data.masseurId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      start: data.start?.toDate?.() ?? new Date(data.start),
      end: data.end?.toDate?.() ?? new Date(data.end),
      notes: data.notes || '',
    };
  });
};

export const createBooking = async ({
  masseurId,
  customerName,
  customerEmail,
  start,
  end,
  notes = '',
}) => {
  if (!masseurId) {
    throw new Error('A masseur must be selected before creating a booking.');
  }

  if (!firestore) {
    throw new Error('Firestore is not configured. Cannot create booking.');
  }

  if (!start || !end) {
    throw new Error('A booking requires both start and end times.');
  }

  const safeEmail = customerEmail && isEmail(customerEmail)
    ? normalizeEmail(customerEmail)
    : '';

  const sanitizedPayload = {
    masseurId: sanitizeString(String(masseurId)),
    customerName: sanitizeString(customerName),
    customerEmail: safeEmail,
    notes: sanitizeString(notes),
    start: Timestamp.fromDate(new Date(start)),
    end: Timestamp.fromDate(new Date(end)),
    createdAt: Timestamp.now(),
  };

  return addDoc(collection(firestore, BOOKINGS_COLLECTION), sanitizedPayload);
};
