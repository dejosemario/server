import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils";
import EventModel from "../models/events.model";
import redisClient, { getRedisKey } from "../integrations/redis";

export const isAuthUser = (req: Request, res: Response, next: NextFunction) => {
  const cookieName = process.env.ACCESS_TOKEN_NAME as string;
  const token = req.cookies[cookieName];
  if (!token) {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }

  try {
    const payload = verifyToken(token);
    (req as any).user = payload; // Ensure req.user is set correctly

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
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

export const cacheMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cachedData = await redisClient.get(getRedisKey(req));
    if (cachedData) {
      return res
        .status(200)
        .json({ success: true, data: JSON.parse(cachedData) });
    }
    next();
  } catch (error) {
    console.error("Cache Middleware Error:", error);
    next();
  }
};

export default isAuthenticated;
