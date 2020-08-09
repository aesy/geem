import { Entity } from '../Entities/Entity';
import { System } from './System';
import { Game } from '../Game/Game';
import { World } from '../WorldGen/World';
import { Player } from '../Entities/Player';
import { Object3D } from 'three';
import { Friend } from '../Entities/Friend';
import { Id } from '../Components/Id';


export class OnlineSyncSystem extends System {
    public players: any[] = [];
    public disconnects: string[] = [];
    public constructor(private readonly world: World) {
        super();
    } 



    public appliesTo(entity: Entity): boolean {
        return entity instanceof Friend || entity instanceof Player;
    }

    public initialize(game: Game, entities: Entity[]): void {
        const io = game.io;

        io.on('start', (players: any[]) => {
            for (const player of players) {
                game.addEntity(new Friend(player.id));
            }
        });

        io.emit('initialized');

        io.on('joined', (id: string) => {
            if (id !== io.id) {
                console.log('friend added!')
                game.addEntity(new Friend(id));
            }
        });

        io.on('left', (id: any) => {
            console.log(id + 'disconneced :(')
            this.disconnects.push(id);
        });

        io.on('heartbeat', (players: []) => {
            this.players = players;
        });
    }

    public update(dt: number, entities: Entity[], game: Game): void {
        const io = game.io;
        for (const entity of entities) {
            if (entity instanceof Friend) {
                const id = entity.getComponent(Id).value;
                for (const disconnect of this.disconnects) {
                    if (disconnect == id) {
                        game.removeEntity(entity);
                    }
                };
                for (const player of this.players) {
                    if (id == player.id) {
                        const object = entity.getComponent(Object3D);
                        object.position.set(player.position.x, player.position.y, player.position.z);
                    } 
                }
            } else {
                const position = entity.getComponent(Object3D).position;
                io.emit('update', position);
            }
        }
    }
}
