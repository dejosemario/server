import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils";
import EventModel from "../models/events.model";

export const isAuthUser = (req: Request, res: Response, next: NextFunction) => {
  const cookieName = process.env.ACCESS_TOKEN_NAME as string;
  const token = req.cookies[cookieName];
  if (!token) {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }
  try {
    const payload = verifyToken(token);
    (req as any).user = {};
    (req as any).user = payload;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired OTP code" });
  }
};

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const cookieName = process.env.ACCESS_TOKEN_NAME as string;
  const token = req.cookies[cookieName];
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorizedd" });
  }
  try {
    const payload = verifyToken(token);
    (req as any).user = {};
    (req as any).user._id = payload.id;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

export const isAuthorized = (resource: "event") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log((req as any).user._id, req.params.id);
    const userId = (req as any).user._id;
    if (resource === "event") {
      const eventId = req.params.id;
      const event = await EventModel.findById(eventId);
      if (!event) {
        return res
          .status(404)
          .json({ success: false, message: "Event not found" });
      }
      if (event.creator.toString() !== userId) {
        return res
          .status(403)
          .json({ success: false, message: "Not Authorized to access" });
      }
    }
    next();
  };
};

export default isAuthenticated;
