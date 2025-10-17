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
router.post('/', validateBody(createMenuValidation), MenuController.createMenu);
router.get('/', validateQuery(menuQueryValidation), MenuController.getAllMenus);
router.get('/:id', MenuController.getMenuById);
router.put('/:id', validateBody(updateMenuValidation), MenuController.updateMenu);
router.delete('/:id', MenuController.deleteMenu);

// Additional utility endpoints
router.get('/:id/children', MenuController.getChildMenus);
router.get('/root/list', MenuController.getRootMenus);

// User navigation endpoint
router.get('/user-navigation/:userId', MenuController.getUserNavigation);

export default router;
