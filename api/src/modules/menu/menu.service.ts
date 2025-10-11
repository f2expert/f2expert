import { MenuModel } from './menu.model';
import { IMenuDTO } from './menu.types';
import mongoose from 'mongoose';

export class MenuService {
  static async createMenu(data: IMenuDTO) {
    // Validate parentId if provided
    if (data.parentId) {
      const parentMenu = await MenuModel.findById(data.parentId);
      if (!parentMenu) {
        throw new Error('Parent menu not found');
      }
    }
    
    const menu = new MenuModel(data);
    return menu.save();
  }

  static async getAllMenus(role?: string, tree?: boolean) {
    let query: any = {};
    
    // Filter by role if provided
    if (role) {
      query.roles = { $in: [role] };
    }
    
    const menus = await MenuModel.find(query).sort({ order: 1, createdAt: 1 });
    
    // Return tree structure if requested
    if (tree) {
      return this.buildMenuTree(menus);
    }
    
    return menus;
  }

  static async getMenuById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid menu ID format');
    }
    return MenuModel.findById(id);
  }

  static async updateMenu(id: string, data: Partial<IMenuDTO>) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid menu ID format');
    }

    // Validate parentId if being updated
    if (data.parentId) {
      const parentMenu = await MenuModel.findById(data.parentId);
      if (!parentMenu) {
        throw new Error('Parent menu not found');
      }
      
      // Prevent circular reference
      if (data.parentId === id) {
        throw new Error('Menu cannot be its own parent');
      }
    }
    
    const updatedMenu = await MenuModel.findByIdAndUpdate(
      id, 
      data, 
      { new: true, runValidators: true }
    );
    
    return updatedMenu;
  }

  static async deleteMenu(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid menu ID format');
    }

    // Check if menu has children
    const hasChildren = await MenuModel.exists({ parentId: id });
    if (hasChildren) {
      // Delete all children first
      await MenuModel.deleteMany({ parentId: id });
    }
    
    const deletedMenu = await MenuModel.findByIdAndDelete(id);
    return deletedMenu;
  }

  static async getMenusByRole(roles: string[]) {
    return MenuModel.find({
      roles: { $in: roles }
    }).sort({ order: 1, createdAt: 1 });
  }

  static async getChildMenus(parentId: string) {
    return MenuModel.find({ parentId }).sort({ order: 1, createdAt: 1 });
  }

  static async getRootMenus() {
    return MenuModel.find({
      $or: [
        { parentId: null },
        { parentId: { $exists: false } }
      ]
    }).sort({ order: 1, createdAt: 1 });
  }

  private static buildMenuTree(menus: any[]): any[] {
    const menuMap = new Map();
    const rootMenus: any[] = [];

    // Create a map of all menus
    menus.forEach(menu => {
      menuMap.set(menu._id.toString(), {
        ...menu.toObject(),
        children: []
      });
    });

    // Build the tree structure
    menus.forEach(menu => {
      const menuObj = menuMap.get(menu._id.toString());
      
      if (menu.parentId) {
        const parent = menuMap.get(menu.parentId.toString());
        if (parent) {
          parent.children.push(menuObj);
        } else {
          // If parent not found, treat as root
          rootMenus.push(menuObj);
        }
      } else {
        rootMenus.push(menuObj);
      }
    });

    return rootMenus;
  }
}
