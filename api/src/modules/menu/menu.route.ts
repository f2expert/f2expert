import { Router } from 'express';
import { MenuController } from './menu.controller';

const router = Router();

router.post('/menus', MenuController.createMenu);
router.get('/menus', MenuController.getAllMenus);
router.get('/menus/:id', MenuController.getMenuById);
router.put('/menus/:id', MenuController.updateMenu);
router.delete('/menus/:id', MenuController.deleteMenu);

export default router;
