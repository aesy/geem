import textureAtlas from '../../assets/images/textureAtlas.png';
import {
    BufferAttribute,
    BufferGeometry,
    MeshLambertMaterial,
    NearestFilter,
    RepeatWrapping,
    TextureLoader
} from 'three';
import { ChunkMesh } from '../Entities/ChunkMesh';
import { Entity } from '../Entities/Entity';
import { BlockRemoved } from '../Event/BlockRemoved';
import { ChunkLoaded } from '../Event/ChunkLoaded';
import { ChunkUnloaded } from '../Event/ChunkUnloaded';
import { Game } from '../Game/Game';
import { MeshData } from '../Util/Math';
import { BlockType } from '../WorldGen/Block';
import { Chunk } from '../WorldGen/Chunk';
import {
    ChunkMeshGeneratorScheduler,
    OffloadedChunkMeshGeneratorScheduler
} from '../WorldGen/ChunkMeshGeneratorScheduler';
import { CullingChunkMesher } from '../WorldGen/CullingChunkMesher';
import { World, WorldUtils } from '../WorldGen/World';
import { System } from './System';

const loader = new TextureLoader();
const texture = loader.load(textureAtlas);
texture.wrapS = RepeatWrapping;
texture.wrapT = RepeatWrapping;
texture.magFilter = NearestFilter;
texture.minFilter = NearestFilter;
const opaqueMaterial = new MeshLambertMaterial({ map: texture });
const transparentMaterial = new MeshLambertMaterial({ map: texture, transparent: true });

const opaqueBlockTypes = [
    BlockType.DIRT,
    BlockType.SAND,
    BlockType.TREE
];

const transparentBlockTypes = [
    BlockType.WATER,
    BlockType.LEAVES
];

const opaqueScheduler: ChunkMeshGeneratorScheduler = new OffloadedChunkMeshGeneratorScheduler(
    CullingChunkMesher, [ opaqueBlockTypes ], -1, 4);
const transparentScheduler: ChunkMeshGeneratorScheduler = new OffloadedChunkMeshGeneratorScheduler(
    CullingChunkMesher, [ transparentBlockTypes ], -1, 2);

export class ChunkUpdater extends System {
    private readonly chunkEntities: Map<Chunk, Entity[]>;
    private readonly toBeMeshed: Chunk[];
    private readonly toBeRemoved: Chunk[];
    private dirty: boolean;

    public constructor(
        private readonly world: World
    ) {
        super();

        this.chunkEntities = new Map();
        this.toBeMeshed = [];
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

        while (this.toBeMeshed.length) {
            const chunk = this.toBeMeshed.pop()!;

            console.log(`Scheduling update of chunk: x: ${ chunk.x }, y: ${ chunk.y }, z: ${ chunk.z }`);

            opaqueScheduler.schedule(chunk)
                .then((data: MeshData): void => {
                    const geometry = ChunkUpdater.createMesh(data);
                    const newEntity = new ChunkMesh(chunk, geometry, opaqueMaterial);
                    const entities = this.chunkEntities.get(chunk) || [];

                    game.addEntity(newEntity);
                    entities.push(newEntity);
                    this.chunkEntities.set(chunk, entities);
                })
                .catch(console.error);

            transparentScheduler.schedule(chunk)
                .then((data: MeshData): void => {
                    const geometry = ChunkUpdater.createMesh(data);
                    const newEntity = new ChunkMesh(chunk, geometry, transparentMaterial);
                    const entities = this.chunkEntities.get(chunk) || [];

                    game.addEntity(newEntity);
                    entities.push(newEntity);
                    this.chunkEntities.set(chunk, entities);
                })
                .catch(console.error);
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

        console.log('Block deleted');

        const position = WorldUtils.worldToChunk(event.position);
        const chunk = this.world.getChunk(position);

        if (this.toBeMeshed.includes(chunk)) {
            return;
        }

        this.toBeMeshed.push(chunk);
        this.dirty = true;
    }

    private onChunkLoaded(event: ChunkLoaded): void {
        const chunk = event.chunk;

        console.log('Chunk updated');

        if (this.toBeMeshed.includes(chunk)) {
            return;
        }

        this.toBeMeshed.push(chunk);
        this.dirty = true;
    }

    private onChunkUnloaded(event: ChunkLoaded): void {
        const chunk = event.chunk;

        console.log('Chunk removed');

        if (this.toBeRemoved.includes(chunk)) {
            return;
        }

        this.toBeRemoved.push(chunk);
        this.dirty = true;
    }

    private static createMesh(data: MeshData): BufferGeometry {
        const geometry = new BufferGeometry();
        geometry.setAttribute('position', new BufferAttribute(new Float32Array(data.vertices), 3));
        geometry.setAttribute('normal', new BufferAttribute(new Float32Array(data.normals), 3));
        geometry.setAttribute('uv', new BufferAttribute(new Float32Array(data.uvs), 2));
        geometry.setIndex(data.indices);

        return geometry;
    }
}
