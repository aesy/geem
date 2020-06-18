import { Entity } from '../Entities/Entity';
import { Game } from '../Game/Game';

export class System {
    public appliesTo(entity: Entity): boolean {
        return false;
    }

    public initialize(game: Game): void {
        // Intentionally left empty
    }

    public update(dt: number, entities: Entity[], game: Game): void {
        throw new Error('Not implemented');
    }
}

/*
 export interface System {
    initialize(game: Game): void;
    dispose(): void;
    update(dt: number): void;
}
*/