import { Router } from 'express';
import { MenuController } from './menu.controller';
import { 
  validateBody,
  validateQuery 
} from '../../app/middlewares/validation.middleware';
import { 
  createMenuValidation, 
  updateMenuValidation,
  menuQueryValidation 
} from './menu.validation';

const router = Router();

// Main CRUD operations
router.post('/menus', validateBody(createMenuValidation), MenuController.createMenu);
router.get('/menus', validateQuery(menuQueryValidation), MenuController.getAllMenus);
router.get('/menus/:id', MenuController.getMenuById);
router.put('/menus/:id', validateBody(updateMenuValidation), MenuController.updateMenu);
router.delete('/menus/:id', MenuController.deleteMenu);

// Additional utility endpoints
router.get('/menus/:id/children', MenuController.getChildMenus);
router.get('/menus/root/list', MenuController.getRootMenus);

export default router;
