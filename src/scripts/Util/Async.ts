export class Deferred<T> {
    public readonly promise: Promise<T>;
    public resolve: (value: T) => Promise<T> | void;
    public reject: (error: any) => void;

    public constructor() {
        this.resolve = (): void => { throw 'This shouldn\'t happen'; };
        this.reject = (): void => { throw 'This shouldn\'t happen'; };

        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        })
    }
}
