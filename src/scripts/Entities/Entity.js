
export default class Entity {
	constructor() {
		this.components = [];
	}

	getComponent(type) {
        for (const component of components) {
            if (component instanceof type) {
                return component;
            }
        }

		return null;
	}

	addComponent(component) {
        this.components.push(component);
	}

	addComponents(...components) {
		for (const component of components) {
			this.addComponent(component);
		}
	}

	hasComponent(type) {
        for (const component of components) {
            if (component instanceof type) {
                return true;
            }
        }

        return false;
	}

	hasComponents(...types) {
		for (const type of types) {
			if (!this.hasComponent(type)) {
				return false;
			}
		}

		return true;
	}
}
                                                       f