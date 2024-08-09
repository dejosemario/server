import mongoose, { Document, Schema } from 'mongoose';

interface EventDocument extends Document {
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  defaultReminderDate?: Date;
  creator: mongoose.Types.ObjectId; // Reference to the User
}

const eventSchema = new Schema<EventDocument>({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    validate: [function(date: Date) {
      return date > new Date(); // Custom validator for future dates
    }, 'Date must be in the future']
  },
  time: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  defaultReminderDate: {
    type: Date,
    required: false
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

}, { timestamps: true });

const Event = mongoose.model<EventDocument>('Event', eventSchema);

export default Event;
