export interface NoParamConstructor<T> {
  new (): T;
}
export interface Crud {
  hookOnInit();
  hookOnViewInit();
  hookOnDestroy();
}
