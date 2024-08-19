import { Response } from "express";

export default class SendResponse {
  public error(res: any, statusCode: number, message: string) {
    return res
      .status(statusCode)
      .json({ success: false, message: message ?? "error" });
  }

  public success(res: any, statusCode: number, message: string, data?: any) {
    return res
      .status(statusCode)
      .json({ success: true, message: message ?? "success", data });
  }
}
