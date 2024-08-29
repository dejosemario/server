import Joi from "joi";

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

// Define a schema for a ticket type
const ticketTypeSchema = Joi.object({
  name: Joi.string().min(1).required(), // e.g., 'VIP'
  price: Joi.number().positive().required(), // e.g., 300
  limit: Joi.number().integer().positive().required(), // e.g., 40
});

// USER SCHEMAS
export const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const userIdSchema = Joi.object({
  userId: Joi.string().uuid().required(),
});

export const eventSchema = Joi.object({
  name: Joi.string().min(2).required(),
  description: Joi.string().min(2).required(),
  guests: Joi.array().items(Joi.string()),
  media: Joi.array().items(Joi.string().uri()),
  date: Joi.date().required(),
  time: Joi.string().required(),
  organizer: Joi.string().required(),
  address: Joi.string().min(2).required(),
  city: Joi.string().min(2).required(),
  state: Joi.string().min(2).required(),
  ticketTypes: Joi.array().items(ticketTypeSchema),
});

export const updateEventSchema = Joi.object({
  name: Joi.string().min(2),
  description: Joi.string().min(2),
  guests: Joi.array().items(Joi.string()),
  media: Joi.array().items(Joi.string().uri()),
  time: Joi.string(),
  date: Joi.date(),
  organizer: Joi.string(),
  address: Joi.string().min(2),
  city: Joi.string().min(2),
  state: Joi.string().min(2),
  ticketTypes: Joi.array().items(ticketTypeSchema),
  creator: Joi.string().pattern(objectIdPattern),
});

export const bookingSchema = Joi.object({
  ticketType: Joi.array().items(ticketTypeSchema).default([]),
  ticketsCount: Joi.number().required(),
  totalAmount: Joi.number().required(),
  paymentId: Joi.string().required(),
  status: Joi.string()
    .valid("booked", "cancelled", "completed")
    .default("booked"),
});
