import Entity from '../Entities/Entity';
import EventBus from '../Event/EventBus';

export default class System {
    appliesTo(entity: Entity): boolean {
        return false;
    }

    initialize(events: EventBus): void {
        // Intentionally left empty
    }

    update(dt: number, entities: Entity[], events: EventBus): void {
        throw new Error('Not implemented');
    }
}
