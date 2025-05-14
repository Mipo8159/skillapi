export interface IResource {
  id: string;
  resource: string;
  data: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export type BaseResource = Omit<IResource, 'id' | 'updatedAt' | 'createdAt'>;
