import { Schema, model } from 'mongoose';

const MenuSchema = new Schema({
  title: { type: String, required: true },
  path: { type: String, required: true },
  icon: { type: String },
  roles: [{ type: String, required: true }], // e.g., ['admin', 'user']
  parentId: { type: Schema.Types.ObjectId, ref: 'Menu', default: null },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export const MenuModel = model('Menu', MenuSchema);
