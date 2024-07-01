import { PrismaClient, OrderReport } from "@prisma/client";

interface ReportData {
  id: number;
  name: string;
}

const prisma  = new PrismaClient();

class ReportService {
  constructor() {
    // Constructor logic here, if needed
  }

  async createReport(reportData: ReportData) {
    const report = await prisma.orderReport.create({
      data: reportData,
    });

    return report;
  }
}

export { ReportService };