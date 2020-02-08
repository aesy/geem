type Constructor<T> = new (...args: any[]) => T;

export default class Entity {
    components: object[] = [];

    getComponent<T>(type: Constructor<T>): T {
        for (const component of this.components) {
            if (component instanceof type) {
                return component as unknown as T;
            }
        }

        throw 'No component available, use Entity#hasComponent to check existance first.';
    }

    addComponent(component: object): void {
        this.components.push(component);
    }

    addComponents(...components: object[]): void {
        for (const component of components) {
            this.addComponent(component);
        }
    }

    hasComponent(type: Constructor<any>): boolean {
        for (const component of this.components) {
            if (component instanceof type) {
                return true;
            }
        }

        return false;
    }

    hasComponents(...types: Constructor<any>[]): boolean {
        for (const type of types) {
            if (!this.hasComponent(type)) {
                return false;
            }
        }

        return true;
    }
}
