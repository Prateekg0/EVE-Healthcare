import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    centre: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    testId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    testName: {
      type: String,
      required: true,
    },

    centreName: {
      type: String,
      required: true,
    },

    location: String,

    appointmentAt: {
      type: Date,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'FAILED', 'CANCELLED'],
      default: 'PENDING',
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;