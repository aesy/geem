
export default class System {
	appliesTo(entity) {
		return false;
	}

    initialize(events) {}

	update(dt, entities, events) {
		throw new Error('Not implemented');
	}
}
