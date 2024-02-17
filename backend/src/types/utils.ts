export type PromiseEntry<T> = T extends Promise<infer R> ? R : never;

export type Replace<T, Key extends keyof T, Target> = {
    [K in keyof T]: K extends Key ? Target : T[K]
}
