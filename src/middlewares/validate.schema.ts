import Joi from "joi";

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
  title: Joi.string().min(2).required(),
  description: Joi.string().min(2).required(),
  guests: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)),
  media: Joi.array().items(Joi.string().uri()),
  startDate: Joi.date().required(),
  time: Joi.string().required(),
  endDate: Joi.date().required(),
  defaultReminderDate: Joi.date(),
  location: Joi.string().min(2).required(),
});

export const updateEventSchema = Joi.object({
  title: Joi.string().min(2),
  description: Joi.string().min(2),
  guests: Joi.array().items(Joi.string().uuid()),
  media: Joi.array().items(Joi.string().uri()),
  time: Joi.string(),
  startDate: Joi.date(),
  endDate: Joi.date(),
  defaultReminderDate: Joi.date(),
  location: Joi.string().min(2),
  creator: Joi.string().uuid(),
});
