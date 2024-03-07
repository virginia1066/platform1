export type Func<Args extends Array<any>, Return> = (...args: Args) => Return;
export type Optional<T, Key extends keyof T> = Omit<T, Key> & Partial<Pick<T, Key>>;