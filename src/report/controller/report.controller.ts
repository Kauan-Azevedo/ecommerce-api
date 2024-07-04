import { ReportService } from "../services/report.service";
import { Request, Response } from "express";

class ReportController {
  constructor(private readonly reportService: ReportService) {}

  async getAllUnfinishedOrders(req: Request, res: Response) {
    try {
      const orders = await this.reportService.getAllUnfinishedOrders();
      res.status(200).json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getOrderByUserId(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      const orders = await this.reportService.getOrderByUserId(userId);
      res.status(200).json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export { ReportController };
