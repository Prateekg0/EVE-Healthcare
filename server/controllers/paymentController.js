import mongoose from 'mongoose';
import { randomUUID } from 'node:crypto';
import Booking from '../models/bookingSchema.js';
import Payment from '../models/paymentSchema.js';

export async function applyPaymentEvent({ bookingId, userId, status, eventId,
}) {
  if ( !mongoose.isValidObjectId(bookingId) || !['SUCCESS', 'FAILED'].includes(status) || typeof eventId !== 'string' || !eventId.trim() || eventId.length > 120) {
    const error = new Error(
      'A valid bookingId, status (SUCCESS or FAILED), and eventId are required.'
    );
    error.status = 400;
    throw error;
  }

  const booking = await Booking.findById(bookingId);

  if (!booking || (userId && String(booking.user) !== String(userId))) {
    const error = new Error('Booking not found.');
    error.status = 404;
    throw error;
  }

  const normalizedEventId = eventId.trim();

  const existingPayment = await Payment.findOne({
    eventId: normalizedEventId,
  });

  if (existingPayment) {
    if (String(existingPayment.booking) !== String(booking.id)) {
      const error = new Error(
        'This event ID is already associated with another booking.'
      );
      error.status = 409;
      throw error;
    }

    return {
      payment: existingPayment,
      booking,
      duplicate: true,
    };
  }

  if (booking.status !== 'PENDING') {
    const error = new Error(
      `Booking is already ${booking.status.toLowerCase()}.`
    );
    error.status = 409;
    throw error;
  }

  let payment;

  try {
    payment = await Payment.create({
      booking: booking.id,
      user: booking.user,
      eventId: normalizedEventId,
      status,
      amount: booking.amount,
    });
  } catch (error) {
    if (error.code !== 11000) throw error;

    const duplicatePayment = await Payment.findOne({
      eventId: normalizedEventId,
    });

    if (String(duplicatePayment.booking) !== String(booking.id)) {
      const conflict = new Error(
        'This event ID is already associated with another booking.'
      );
      conflict.status = 409;
      throw conflict;
    }

    return {
      payment: duplicatePayment,
      booking: await Booking.findById(bookingId),
      duplicate: true,
    };
  }

  booking.status = status === 'SUCCESS' ? 'CONFIRMED' : 'FAILED';

  await booking.save();

  return {
    payment,
    booking,
    duplicate: false,
  };
}

export async function processMockPayment(req, res, next) {
  try {
    const { bookingId } = req.body || {};

    const booking = mongoose.isValidObjectId(bookingId)
      ? await Booking.findOne({
        _id: bookingId,
        user: req.user.id,
      })
      : null;

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found.',
      });
    }

    if (booking.status !== 'PENDING') {
      return res.status(409).json({
        message: `Booking is already ${booking.status.toLowerCase()}.`,
      });
    }

    const status = Math.random() < 0.88 ? 'SUCCESS' : 'FAILED';

    const result = await applyPaymentEvent({
      bookingId,
      userId: req.user.id,
      status,
      eventId: `sim_${randomUUID()}`,
    });

    res.status(201).json({
      ...result,
      message:
        status === 'SUCCESS'
          ? 'Payment complete. Your visit is confirmed.'
          : 'Payment did not go through. Please book again.',
    });
  } catch (error) {
    next(error);
  }
}

export async function receivePaymentWebhook(req, res, next) {
  try {
    const secret = process.env.WEBHOOK_SECRET;

    if (
      secret &&
      req.headers['x-webhook-secret'] !== secret
    ) {
      return res.status(401).json({
        message: 'Invalid webhook secret.',
      });
    }

    const result = await applyPaymentEvent(req.body || {});

    res.json({
      received: true,
      duplicate: result.duplicate,
      payment: result.payment,
      booking: result.booking,
    });
  } catch (error) {
    next(error);
}}