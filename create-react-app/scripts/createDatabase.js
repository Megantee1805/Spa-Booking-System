#!/usr/bin/env node
/**
 * Script to bootstrap Firestore collections required by the Spa Booking System.
 *
 * Usage:
 *   GOOGLE_APPLICATION_CREDENTIALS=path/to/serviceAccount.json \
 *   FIREBASE_PROJECT_ID=your-project-id \
 *   node scripts/createDatabase.js
 */

let admin;

try {
  admin = require('firebase-admin');
} catch (error) {
  console.error(
    'The firebase-admin package is required to run this script. Install it with "npm install firebase-admin --no-save".'
  );
  process.exit(1);
}

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const projectId = process.env.FIREBASE_PROJECT_ID;

if (!serviceAccountPath || !projectId) {
  console.error(
    'Missing GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_PROJECT_ID environment variables.'
  );
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath)),
  projectId,
});

const firestore = admin.firestore();

const seedBookings = async () => {
  const now = admin.firestore.Timestamp.now();

  const bookings = [
    {
      masseurId: '1',
      customerName: 'Sample Guest',
      customerEmail: 'guest@example.com',
      start: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 3600000)),
      end: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 7200000)),
      notes: 'Imported via seed script.',
      createdAt: now,
    },
  ];

  const batch = firestore.batch();

  bookings.forEach((booking) => {
    const ref = firestore.collection('bookings').doc();
    batch.set(ref, booking);
  });

  await batch.commit();
};

seedBookings()
  .then(() => {
    console.log('Database bootstrap complete.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to bootstrap database:', error);
    process.exit(1);
  });
