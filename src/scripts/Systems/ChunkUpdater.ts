import textureAtlas from '../../assets/images/textureAtlas.png';
import { ChunkMesh } from '../Entities/ChunkMesh';
import { Entity } from '../Entities/Entity';
import { BlockRemoved } from '../Event/BlockRemoved';
import { ChunkLoaded } from '../Event/ChunkLoaded';
import { ChunkUnloaded } from '../Event/ChunkUnloaded';
import { Game } from '../Game/Game';
import { TextureMaterial } from '../Renderer/Material';
import { Mesh, MeshBuffer } from '../Renderer/Mesh';
import { MeshData } from '../Util/Math';
import { BlockType } from '../WorldGen/Block';
import { Chunk } from '../WorldGen/Chunk';
import {
    ChunkMeshGeneratorScheduler,
    InstantChunkMeshGeneratorScheduler,
    OffloadedChunkMeshGeneratorScheduler
} from '../WorldGen/ChunkMeshGeneratorScheduler';
import { CullingChunkMesher } from '../WorldGen/CullingChunkMesher';
import { World, WorldUtils } from '../WorldGen/World';
import { System } from './System';

const material = new TextureMaterial(textureAtlas);

const opaqueBlockTypes = [
    BlockType.DIRT,
    BlockType.SAND,
    BlockType.TREE,
    BlockType.DRY_DIRT,
    BlockType.MOSSY_STONE,
    BlockType.STONE,
    BlockType.SNOW,
];

const transparentBlockTypes = [
    BlockType.WATER,
    BlockType.LEAVES,
    BlockType.MOSS,
    BlockType.SMALL_STONE,
    BlockType.TWIG,
];

const instantOpaqueScheduler: ChunkMeshGeneratorScheduler = new InstantChunkMeshGeneratorScheduler(
    new CullingChunkMesher(opaqueBlockTypes));
const instantTransparentScheduler: ChunkMeshGeneratorScheduler = new InstantChunkMeshGeneratorScheduler(
    new CullingChunkMesher(transparentBlockTypes));
const asyncOpaqueScheduler: ChunkMeshGeneratorScheduler = new OffloadedChunkMeshGeneratorScheduler(
    CullingChunkMesher, [ opaqueBlockTypes ], 3, 3);
const asyncTransparentScheduler: ChunkMeshGeneratorScheduler = new OffloadedChunkMeshGeneratorScheduler(
    CullingChunkMesher, [ transparentBlockTypes ], 3, 3);

export class ChunkUpdater extends System {
    private readonly chunkEntities: Map<Chunk, ChunkMesh[]>;
    private readonly toBeMeshedNow: Chunk[];
    private readonly toBeMeshedLater: Chunk[];
    private readonly toBeRemoved: Chunk[];
    private dirty: boolean;

    public constructor(
        private readonly world: World
    ) {
        super();

        this.chunkEntities = new Map();
        this.toBeMeshedNow = [];
        this.toBeMeshedLater = [];
        this.toBeRemoved = [];
        this.dirty = false;
    }

    public initialize(game: Game): void {
        game.events.register(BlockRemoved, this.onBlockDeleted.bind(this));
        game.events.register(ChunkLoaded, this.onChunkLoaded.bind(this));
        game.events.register(ChunkUnloaded, this.onChunkUnloaded.bind(this));
    }

    public update(dt: number, entities: Entity[], game: Game): void {
        if (!this.dirty) {
            return;
        }

        while (this.toBeMeshedNow.length) {
            const chunk = this.toBeMeshedNow.pop()!;
            const opaqueMeshPromise = instantOpaqueScheduler.schedule(chunk);
            const transparentMeshPromise = instantTransparentScheduler.schedule(chunk);

            Promise.all([ opaqueMeshPromise, transparentMeshPromise ])
                .then(this.onNewMeshes(chunk, game))
                .catch(error => {
                    console.error(error);
                    this.toBeMeshedNow.push(chunk);
                });
        }

        while (this.toBeMeshedLater.length) {
            const chunk = this.toBeMeshedLater.pop()!;
            const opaqueMeshPromise = asyncOpaqueScheduler.schedule(chunk);
            const transparentMeshPromise = asyncTransparentScheduler.schedule(chunk);

            Promise.all([ opaqueMeshPromise, transparentMeshPromise ])
                .then(this.onNewMeshes(chunk, game))
                .catch(error => {
                    console.error(error);
                    this.toBeMeshedLater.push(chunk);
                });
        }

        while (this.toBeRemoved.length) {
            const chunk = this.toBeRemoved.pop()!;
            const entities = this.chunkEntities.get(chunk);

            if (entities) {
                this.chunkEntities.delete(chunk);

                for (const entity of entities) {
                    game.removeEntity(entity);
                }
            } else {
                debugger;
            }
        }

        this.dirty = false;
    }

    private onBlockDeleted(event: BlockRemoved): void {
        // TODO Schedule immediate neighbour chunk as well
        const position = WorldUtils.worldToChunk(event.position);
        const chunk = this.world.getChunk(position);

        if (this.toBeMeshedNow.includes(chunk)) {
            return;
        }

        this.toBeMeshedNow.push(chunk);
        this.dirty = true;
    }

    private onChunkLoaded(event: ChunkLoaded): void {
        const chunk = event.chunk;

        if (this.toBeMeshedLater.includes(chunk)) {
            return;
        }

        this.toBeMeshedLater.push(chunk);
        this.dirty = true;
    }

    private onChunkUnloaded(event: ChunkLoaded): void {
        const chunk = event.chunk;

        if (this.toBeRemoved.includes(chunk)) {
            return;
        }

        this.toBeRemoved.push(chunk);
        this.dirty = true;
    }

    private onNewMeshes(chunk: Chunk, game: Game): (data: MeshData[]) => void {
        return (data: MeshData[]): void => {
            const entities = this.chunkEntities.get(chunk) || [];

            for (let i = entities.length; i--;) {
                const entity = entities[ i ];

                if (entity.chunk === chunk) {
                    entities.splice(i, 1);
                    game.removeEntity(entity);
                }
            }

            for (let i = 0; i < data.length; i++) {
                const datum = data[ i ];
                const mesh = ChunkUpdater.createMesh(datum);
                const newEntity = new ChunkMesh(chunk, mesh);

                game.addEntity(newEntity);
                entities.push(newEntity);
                this.chunkEntities.set(chunk, entities);
            }
        };
    }

    private static createMesh(data: MeshData): Mesh {
        return new MeshBuffer(material, data.vertices, data.normals, data.uvs, data.indices);
    }
}
