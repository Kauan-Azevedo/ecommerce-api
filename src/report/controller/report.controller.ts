import { Request, Response, NextFunction } from 'express'
import { ReportService } from "../services/report.service";
import prismaErrorHandler from '../../../prisma/middleware/errorHandler'
import { Prisma } from '@prisma/client';

class ReportController {

  constructor(private readonly reportService: ReportService) { }

  async createReport(req: Request, res: Response): Promise<void> {
    try {
      const reportData = req.body
      const report = await this.reportService.createReport(reportData)
      res.status(201).json(report)
    } catch (error: any) {
      this.orderReportErrorHandler(error, req, res, () => {
        prismaErrorHandler(error, req, res)
      })
    }
  }

  orderReportErrorHandler(error: any, req: Request, res: Response, next: NextFunction) {
    return next(error)
  }
}

export { ReportController };