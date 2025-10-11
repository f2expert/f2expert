import { MenuModel } from './menu.model';
import { IMenuDTO } from './menu.types';

export class MenuService {
  static async createMenu(data: IMenuDTO) {
    const menu = new MenuModel(data);
    return menu.save();
  }

  static async getAllMenus() {
    return MenuModel.find().sort({ order: 1 });
  }

  static async getMenuById(id: string) {
    return MenuModel.findById(id);
  }

  static async updateMenu(id: string, data: Partial<IMenuDTO>) {
    return MenuModel.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteMenu(id: string) {
    return MenuModel.findByIdAndDelete(id);
  }
}
