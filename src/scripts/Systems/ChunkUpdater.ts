import textureAtlas from '../../assets/images/textureAtlas.png';
import {
    BufferAttribute,
    BufferGeometry,
    Material,
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
    InstantChunkMeshGeneratorScheduler,
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
    CullingChunkMesher, [ opaqueBlockTypes ], -1, 4);
const asyncTransparentScheduler: ChunkMeshGeneratorScheduler = new OffloadedChunkMeshGeneratorScheduler(
    CullingChunkMesher, [ transparentBlockTypes ], -1, 2);

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

            console.log(`Scheduling update of chunk: x: ${ chunk.x }, y: ${ chunk.y }, z: ${ chunk.z }`);

            const opaqueMeshPromise = instantOpaqueScheduler.schedule(chunk);
            const transparentMeshPromise = instantTransparentScheduler.schedule(chunk);

            Promise.all([ opaqueMeshPromise, transparentMeshPromise ])
                .then(this.onNewMeshes(chunk, game))
                .catch(console.error);
        }

        while (this.toBeMeshedLater.length) {
            const chunk = this.toBeMeshedLater.pop()!;

            console.log(`Scheduling update of chunk: x: ${ chunk.x }, y: ${ chunk.y }, z: ${ chunk.z }`);

            const opaqueMeshPromise = asyncOpaqueScheduler.schedule(chunk);
            const transparentMeshPromise = asyncTransparentScheduler.schedule(chunk);

            Promise.all([ opaqueMeshPromise, transparentMeshPromise ])
                .then(this.onNewMeshes(chunk, game))
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

        if (this.toBeMeshedNow.includes(chunk)) {
            return;
        }

        this.toBeMeshedNow.push(chunk);
        this.dirty = true;
    }

    private onChunkLoaded(event: ChunkLoaded): void {
        const chunk = event.chunk;

        console.log('Chunk updated');

        if (this.toBeMeshedLater.includes(chunk)) {
            return;
        }

        this.toBeMeshedLater.push(chunk);
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
                const geometry = ChunkUpdater.createMesh(datum);
                let material: Material;

                if (i === 0) {
                    material = opaqueMaterial;
                } else {
                    material = transparentMaterial;
                }

                const newEntity = new ChunkMesh(chunk, geometry, material);
                game.addEntity(newEntity);
                entities.push(newEntity);
                this.chunkEntities.set(chunk, entities);
            }
        };
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
