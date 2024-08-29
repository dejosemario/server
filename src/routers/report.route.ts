import express from "express";
import { wrapper } from "../utils";
import { isAuthUser } from "../middlewares/auth";
import { ReportController } from "../controllers/report.controller";

class ReportRoutes {
  router = express.Router();
  ReportController = new ReportController();
  path = "/reports";
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/get-creator-reports`,
      isAuthUser,
      wrapper(
        this.ReportController.getCreatorReports.bind(this.ReportController)
      )
    );
    this.router.post(
      `${this.path}/get-user-reports`,
      isAuthUser,
      wrapper(this.ReportController.getUserReports.bind(this.ReportController))
    );
  }
}

const reportRoutes = new ReportRoutes();

export default reportRoutes;
