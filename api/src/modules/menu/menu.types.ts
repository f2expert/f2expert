export interface IMenuDTO {
  title: string;
  path: string;
  icon?: string;
  roles: string[];
  parentId?: string;
  order?: number;
}
