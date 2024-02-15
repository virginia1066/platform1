export const iterate = <T, U>(cb: (item: T, is_last: boolean) => Promise<U>, list: Array<T>): Promise<Array<U>> => {
    return new Promise((resolve, reject) => {
        const result: Array<U> = [];
        const copy_list = list.slice().reverse();

        const loop = () => {
            if (!copy_list.length) {
                resolve(result);
                return void 0;
            }

            const item = copy_list.pop()!;

            cb(item, copy_list.length === 0)
                .then((result_item: U) => {
                    result.push(result_item);
                    loop();
                }, reject);
        };

        return loop();
    });
};