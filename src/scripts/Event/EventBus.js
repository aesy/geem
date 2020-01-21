export default class EventBus {
    constructor() {
        this.events = new Map();
    }

    register(type, callback) {
        if (!this.events.has(type)) {
            this.events.set(type, []);
        }

        const callbacks = this.events.get(type);

        callbacks.push(callback);
    }

    emit(event) {
        const callbacks = this.events.get(event.constructor);

        if (callbacks) {
            for (const callback of callbacks) {
                callback(event);
            }
        }
    }
}
