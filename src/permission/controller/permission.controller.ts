import { PermissionService } from "../services/permission.service";
import { Request, Response } from "express";

class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  async createPermission(req: Request, res: Response) {
    try {
      const permission = await this.permissionService.createPermission(
        req.body,
      );
      res.status(201).send(permission);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async getPermissions(req: Request, res: Response) {
    try {
      const permissions = await this.permissionService.getPermissions();
      res.status(200).send(permissions);
    } catch (error) {
      res.status;
    }
  }

  async getPermissionById(req: Request, res: Response) {
    try {
      const permission = await this.permissionService.getPermissionById(
        Number(req.params.id),
      );
      res.status(200).send(permission);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async updatePermission(req: Request, res: Response) {
    try {
      const permission = await this.permissionService.updatePermission(
        Number(req.params.id),
        req.body,
      );
      res.status(200).send(permission);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async deletePermission(req: Request, res: Response) {
    try {
      const permission = await this.permissionService.deletePermission(
        Number(req.params.id),
      );
      res.status(200).send(permission);
    } catch (error) {
      res.status(400).send(error);
    }
  }
}

export { PermissionController };
