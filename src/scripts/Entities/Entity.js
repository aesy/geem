
export default class Entity {
	constructor() {
		this.components = {};
	}

	getComponent(component) {
		return this.components[component.name];
	}

	addComponent(component) {
		this.components[component.name] = component;
	}

	addComponents(...components) {
		for (const component of components) {
			this.addComponent(component);
		}
	}

	hasComponent(component) {
		return !!this.components[component.name];
	}

	hasComponents(...components) {
		for (const component of components) {
			if (!this.hasComponent(component)) {
				return false;
			}
		}

		return true;
	}
}
                                                       f