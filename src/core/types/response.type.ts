type EntityType = any;
type EntityCollection = EntityType | EntityType[];

export type TResponse<Entity = EntityCollection> = {
  data: Entity;
};

export type TListResponseType<Entity> = {
  data: Entity[];
  meta: TMeta;
};

export type TMeta = {
  currentPage: number;
  perPage: number;
  lastPage: number;
  total: number;
};
