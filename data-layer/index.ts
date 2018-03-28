export * from './lib/interfaces/generic-repository.infc';
export * from './lib/generic-repository';
export * from './lib/query-builder';
export type ObjectType<T> = { new (): T } | Function;
