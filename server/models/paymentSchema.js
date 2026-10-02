import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    eventId: {
      type: String,
      required: true,
      unique: true,
    },

    status: {
      type: String,
      enum: ['SUCCESS', 'FAILED'],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    provider: {
      type: String,
      default: 'EVE SIMULATED PAY',
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;