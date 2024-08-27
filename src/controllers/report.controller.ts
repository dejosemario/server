import { Request, Response } from "express";
import ReportService from "../services/report.service";
import BaseController from "./base.controller";

export class ReportController extends BaseController {
  private reportService: ReportService;
  constructor() {
    super();
    this.reportService = new ReportService();
  }

  public getCreatorReports = async (req: Request, res: Response) => {
    const { startDate, endDate, eventId } = req.body;
    const response = await this.reportService.getCreatorReports(
      startDate,
      endDate,
      eventId
    );
    if (response) return this.success(res, 201, "Report fetched", response);
    this.error(res, 500, "Internal Error");
  };

  public getUserReports = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    if (!(req as any).user || !(req as any).user.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }
    const response = await this.reportService.getUserReports(userId);
    if (response) return this.success(res, 201, "Report fetched", response);
    this.error(res, 500, "Internal Error");
  };
}
