import mongoose, { Document, Schema } from "mongoose";

export interface EventDocument extends Document {
  title: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  time: string;
  location: string;
  defaultReminderDate?: Date;
  media?: string[];
  guests?: string[];
  creator: mongoose.Types.ObjectId; // Reference to the User
}

const eventSchema = new Schema<EventDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: false,
      validate: [
        function (date: Date) {
          return date > new Date(); // Custom validator for future dates
        },
        "Date must be in the future",
      ],
    },
    endDate: {
      type: Date,
      required: false,
      validate: [
        function (this: EventDocument,date: Date) {
          return this.startDate ? date > this.startDate : true; // Custom validator for future dates
        },
        "End date must be after start date",
      ]
    },
    time: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    guests: {
      type: [String],
      required: false,
      default: [],
    },
    defaultReminderDate: {
      type: Date,
      required: false,
    },
    media: {
      type: [String],
      required: false,
      default: [],
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Event = mongoose.model<EventDocument>("Event", eventSchema);

export default Event;
