import { PaginationProps } from './pagination-props.interface';

export interface Repository<M> {
  findById(id: number): Promise<M>;
  findAll(pagination?: PaginationProps, filters?: Partial<M>): Promise<M[]>;
  findOne(filters: Partial<M>): Promise<M>;
  findByIds(ids: number[]): Promise<M[]>;
  create(dto: Partial<M>): Promise<M>;
  updateById(id: number, dto: Partial<M>): Promise<[affectedCount: number]>;
  deleteById(id: number): Promise<number>;
}
