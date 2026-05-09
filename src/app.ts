import express, {Request, Response} from 'express';
import { authenticateJWT } from './middleware/auth.middleware';

export const app = express();

app.use(authenticateJWT);

app.get("/", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});