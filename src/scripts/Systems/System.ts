import { Entity } from '../Entities/Entity';
import { EventBus } from '../Event/EventBus';

export class System {
    public appliesTo(entity: Entity): boolean {
        return false;
    }

    public initialize(events: EventBus): void {
        // Intentionally left empty
    }

    public update(dt: number, entities: Entity[], events: EventBus): void {
        throw new Error('Not implemented');
    }
}
