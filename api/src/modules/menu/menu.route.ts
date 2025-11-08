import { Router } from 'express';
import { MenuController } from './menu.controller';
import { 
  validateBody,
  validateQuery 
} from '../../app/middlewares/validation.middleware';
import { authMiddleware, authorizeRoles } from '../../app/middlewares/auth.middleware';
import { 
  createMenuValidation, 
  updateMenuValidation,
  menuQueryValidation 
} from './menu.validation';

const router = Router();

// Main CRUD operations
router.post('/', 
  authMiddleware, 
  authorizeRoles(['admin']), 
  validateBody(createMenuValidation), 
  MenuController.createMenu
);
router.get('/', validateQuery(menuQueryValidation), MenuController.getAllMenus);
router.get('/:id', MenuController.getMenuById);
router.put('/:id', 
  authMiddleware, 
  authorizeRoles(['admin']), 
  validateBody(updateMenuValidation), 
  MenuController.updateMenu
);
router.delete('/:id', 
  authMiddleware, 
  authorizeRoles(['admin']), 
  MenuController.deleteMenu
);

// Additional utility endpoints
router.get('/:id/children', MenuController.getChildMenus);
router.get('/root/list', MenuController.getRootMenus);

// User navigation endpoint
router.get('/user-navigation/:userId', MenuController.getUserNavigation);

export default router;
