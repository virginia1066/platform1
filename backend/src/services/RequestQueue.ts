import { wait } from '../utils/wait';

export class RequestQueue {
    private readonly queue: Array<Req<unknown>> = [];
    private readonly rps: number;
    private readonly interval: number;
    private run_in_progress: boolean = false;

    constructor(rps: number) {
        this.rps = rps;
        this.interval = Math.ceil(1_000 / rps);
    }

    public push<T>(request: Req<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            this.queue.push(() => {
                return request()
                    .then(resolve, reject);
            });

            this.run();
        });
    }

    private run(): void {
        if (this.run_in_progress) {
            return void 0;
        }

        if (!this.queue.length) {
            return void 0;
        }

        this.run_in_progress = true;
        const req = this.queue.shift()!;

        req()
            .finally(() => wait(this.interval))
            .then(() => {
                this.run_in_progress = false;
                this.run();
            });
    }


}

type Req<T> = () => Promise<T>;
