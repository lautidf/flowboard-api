import express, { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { authenticateJWT } from './middleware/auth.middleware.js';
import { organizationRoutes } from './modules/organizations/organization.routes.js';
import { errorHandler, notExistentRouteHandler } from './middleware/error.middleware.js';
import { projectRoutes } from './modules/projects/project.routes.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { invitationRoutes } from './modules/invitations/invitation.routes.js';
import { taskRoutes } from './modules/tasks/task.routes.js';
import { membershipRoutes } from './modules/memberships/membership.routes.js';
import { userRoutes } from './modules/users/user.routes.js';
import { swaggerSpec } from './docs/openapi.js';


export const app = express();

app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
    },
  })
);

app.use(express.json());

app.get('/', (_req, res: Response) => {
	res.redirect('/docs');
});

app.use('/', authRoutes);

app.use(authenticateJWT);

app.use('/organizations', organizationRoutes);
app.use('/', projectRoutes);
app.use('/', invitationRoutes);
app.use('/', taskRoutes);
app.use('/', membershipRoutes);
app.use('/', userRoutes)

app.use(notExistentRouteHandler);
app.use(errorHandler);