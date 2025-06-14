const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json()); // Parse JSON payloads

// ✅ PAYSTACK WEBHOOK
app.post('/paystack/webhook', async (req, res) => {
  const event = req.body;

  if (event.event === 'charge.success') {
    const reference = event.data.reference;
    const email = event.data.customer.email;
    const apartmentId = event.data.metadata?.apartmentId;

    if (!email || !apartmentId) {
      console.error('Missing metadata');
      return res.sendStatus(400);
    }

    try {
      const bookingsRef = db.collection('bookings')
        .where('userEmail', '==', email)
        .where('apartmentId', '==', apartmentId)
        .limit(1);

      const snap = await bookingsRef.get();
      if (!snap.empty) {
        await snap.docs[0].ref.update({ status: 'paid' });
        console.log(`Booking for ${email} updated to PAID`);
      } else {
        console.warn(`No booking found for ${email}`);
      }
    } catch (err) {
      console.error('Error updating booking via webhook:', err);
    }
  }

  res.sendStatus(200);
});

// ✅ Deploys to: https://your-project-id.cloudfunctions.net/api/paystack/webhook
exports.api = functions.https.onRequest(app);
