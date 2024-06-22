import { AuthService } from "../services/auth.service";
import { Request, Response } from "express";

class AuthController {
  constructor(private readonly authService: AuthService) {}

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { user, token } = await this.authService.login(email, password);
      res.json({ token });
    } catch (error) {
      res.status(401).json({ message: (error as Error).message });
    }
  }
}

export { AuthController };
