import mongoose, { Document, Schema } from "mongoose";

// Define the ticket type schema
const ticketTypeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  limit: {
    type: Number,
    required: true,
  }
}, { _id: false }); // `_id: false` to avoid creating an _id field for ticket types

export interface EventDocument extends Document {
  name: string;
  description: string;
  organizer: string;
  date: Date;
  time: string;
  address: string;
  city: string;
  state: string;
  media?: string[];
  guests?: string[];
  creator: mongoose.Types.ObjectId; // Reference to the User
  ticketTypes?: typeof ticketTypeSchema[];
}

const eventSchema = new Schema<EventDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    organizer: {
      type: String,
      required: true,
    },    
    date: {
      type: Date,
      required: true,
      validate: [
        function (date: Date) {
          return date > new Date(); // Custom validator for future dates
        },
        "Date must be in the future",
      ],
    },
    time: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    guests: {
      type: [String],
      required: false,
      default: [],
    },
    media: {
      type: [String],
      required: false,
      default: [],
    },
    ticketTypes: {
      type: [ticketTypeSchema], // Use the ticketTypeSchema here
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
