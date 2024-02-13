import { wait } from '../utils/wait';
import { info } from '../utils/log';

export class RequestQueue {
    private readonly queue: Array<Req<unknown>> = [];
    private readonly interval: number;
    private run_in_progress: boolean = false;
    private last_request_end: number | null = null;

    constructor(rps: number) {
        this.interval = Math.ceil(1_000 / rps);
    }

    public push<T>(request: Req<T>): Promise<T> {
        info(`Push new request to queue.`);
        return new Promise((resolve, reject) => {
            const on_done = (data: T) => {
                this.last_request_end = Date.now();
                resolve(data);
            };

            const on_fail = (err: Error) => {
                this.last_request_end = Date.now();
                reject(err);
            };

            this.queue.push(() => {
                return request()
                    .then(on_done, on_fail);
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

        const launch = () => {
            req()
                .then(() => {
                    this.run_in_progress = false;
                    this.run();
                });
        };

        const now = Date.now();

        if (!this.last_request_end || now - this.last_request_end > this.interval) {
            launch();
        } else {
            wait(this.interval - (now - this.last_request_end))
                .then(launch);
        }
    }


}

type Req<T> = () => Promise<T>;
