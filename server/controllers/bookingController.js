import mongoose from 'mongoose';
import Booking from '../models/bookingSchema.js';
import {
  findCentreById,
  findTestById,
} from '../utils/centreCatalogue.js';

export async function getMyBookings(req, res, next) {
  try {
    const bookings = await Booking.find({
      user: req.user.id,
    }).sort({ appointmentAt: 1 });

    res.json({ bookings });
  } catch (error) {
    next(error);
  }
}

export async function createBooking(req, res, next) {
  try {
    const { centreId, testId, appointmentAt } = req.body || {};

    if (!mongoose.isValidObjectId(centreId) ||!mongoose.isValidObjectId(testId)) {
      return res.status(400).json({
        message: 'Choose a valid centre and test.',
      });
    }

    const date = new Date(appointmentAt);

    if (!appointmentAt ||Number.isNaN(date.getTime()) ||date <= new Date()) {
      return res.status(400).json({
        message: 'Choose an appointment time in the future.',
      });
    }

    if (date > new Date(Date.now() + 90 * 86400000)) {
      return res.status(400).json({
        message: 'Appointments can be booked up to 90 days ahead.',
      });
    }

    const centre = findCentreById(centreId);

    if (!centre) {
      return res.status(404).json({
        message: 'Centre not found.',
      });
    }

    const test = findTestById(centre, testId);

    if (!test) {
      return res.status(404).json({
        message: 'That test is not offered at this centre.',
      });
    }

    const booking = await Booking.create({
      user: req.user.id,
      centre: centre._id,
      testId: test._id,
      testName: test.name,
      centreName: centre.name,
      location: centre.location,
      appointmentAt: date,
      amount: test.price,
    });

    res.status(201).json({ booking });
  } catch (error) {
    next(error);
  }
}

export async function cancelBooking(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({
      message: 'Invalid booking ID.',
    });
  }

  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found.',
      });
    }

    if (booking.status !== 'PENDING') {
      return res.status(409).json({
        message: 'Only pending bookings can be cancelled.',
      });
    }

    booking.status = 'CANCELLED';

    await booking.save();

    res.json({ booking });
  } catch (error) {
    next(error);
  }
}