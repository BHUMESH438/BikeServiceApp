import mongoose from 'mongoose';
import { BOOKING_STATUS, SERVICE_TYPE } from '../utils/constants.js';

const ServiceSchema = new mongoose.Schema(
  {
    serviceType: {
      type: String,
      enum: Object.values(SERVICE_TYPE),
      default: SERVICE_TYPE.GENENRAL
    },
    bookings: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.PENDING
    },
    serviceLocation: {
      type: String,
      default: 'coimbatore'
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

export default mongoose.model('Service', ServiceSchema);
