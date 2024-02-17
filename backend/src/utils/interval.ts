import { wait } from './wait';

export const interval = (cb: () => Promise<unknown>, time: number) => {
    cb()
        .finally(() => wait(time))
        .then(() => interval(cb, time));
};