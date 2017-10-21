export * from './lib/interfaces/generic-repository.infc';
export * from './lib/generic-repository';
export type ObjectType<T> = { new (): T } | Function;
