import express, {Request, Response} from 'express';
import { authenticateJWT } from './middleware/auth.middleware';
import { organizationRoutes } from './modules/organizations/organization.routes';
import { errorHandler } from './middleware/error.middleware';
import { projectRoutes } from './modules/projects/project.routes';
import { authRoutes } from './modules/auth/auth.routes';

export const app = express();

app.use(express.json());

app.use(authenticateJWT);

app.get('/', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.use('/', authRoutes);
app.use('/organizations', organizationRoutes);
app.use('/', projectRoutes);


app.use(errorHandler);