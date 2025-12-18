import StorageHelper, { StorageKeys } from '../../../app/data/mmkv-storage';
import { Category } from '../../categories/types/categories.types';
import { generateId } from '../../../app/utils/id';

type CategoryMap = Record<string, Category>;

class CategoriesRepository {
  private async load(): Promise<CategoryMap> {
    const map = (await StorageHelper.getItem<CategoryMap>(
      StorageKeys.CATEGORIES,
      {},
    )) as CategoryMap;
    return map ?? {};
  }

  private async save(map: CategoryMap) {
    await StorageHelper.setItem(StorageKeys.CATEGORIES, map);
  }

  async getAll(): Promise<Category[]> {
    const map = await this.load();
    return Object.values(map)
      .filter(c => !c?.deletedAt)
      .sort((a, b) => a?.name?.localeCompare?.(b?.name));
  }

  async getById(id: string): Promise<Category | null> {
    const map = await this.load();
    return map?.[id] ?? null;
  }

  async create(data: Partial<Category>): Promise<Category> {
    const map = await this.load();
    const id = data?.id ?? generateId();
    const now = Date.now();
    const cat: Category = {
      id,
      name: data?.name ?? 'Untitled',
      icon: data?.icon,
      color: data?.color ?? '#6C5CE7',
      isSystem: !!data?.isSystem,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };
    map[id] = cat;
    await this.save(map);
    return cat;
  }

  async update(id: string, patch: Partial<Category>): Promise<Category | null> {
    const map = await this.load();
    const existing = map?.[id];
    if (!existing) return null;
    const updated: Category = { ...existing, ...patch, updatedAt: Date.now() };
    map[id] = updated;
    await this.save(map);
    return updated;
  }

  async softDelete(id: string): Promise<void> {
    const map = await this.load();
    const existing = map?.[id];
    if (!existing) return;
    existing.deletedAt = Date.now();
    existing.updatedAt = Date.now();
    map[id] = existing;
    await this.save(map);
  }
}

export const categoriesRepository = new CategoriesRepository();
