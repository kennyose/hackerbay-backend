import { Router } from 'express';
import { ResizeController, AuthController, JsonPatchController } from './controllers';
import { authenticate } from './middleware';

const routes = Router();

/**
 * GET home page
 */
routes.get('/', (req, res) => {
  res.render('index', { title: 'Hackerbay Backend Task' });
});

/**
 * GET Login request
 */
routes.get('/login', (req, res) => res.render('login.ejs'));

/**
 * POST
 * @desc Login controller endpoint
 */
routes.post('/login', AuthController);

/**
 * @desc Patch controller endpoint
 * Auth middleware is applied to protect this endpoint
 */
routes.post('/patch', authenticate, JsonPatchController);

/**
 * @desc Thumbnail controller endpoint
 * Auth middleware is applied to protect this endpoint
 */
routes.post('/thumbnail', authenticate, ResizeController);

export default routes;
