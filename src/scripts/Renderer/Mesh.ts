import { mat4, vec3 } from 'gl-matrix';
import { Material, Shader } from './Material';

export class Transform3 {
    public readonly matrix = mat4.create();

    public translate(vector: vec3): void {
        mat4.translate(this.matrix, this.matrix, vector);
    }

    public rotate(rotation: number, axis: vec3): void {
        mat4.rotate(this.matrix, this.matrix, rotation, axis);
    }
}

export interface Object3 {
    readonly transform: Transform3;
}

export interface Mesh extends Object3 {
    readonly material: Material;

    toBuffer(): Buffer;
}

export interface Buffer {
    readonly matrix: mat4;

    bind(gl: WebGLRenderingContext): void;
    unbind(gl: WebGLRenderingContext): void;
    draw(gl: WebGLRenderingContext): void;
}

export namespace WebGL {
    function createBuffer(
        gl: WebGLRenderingContext,
        target: GLenum,
        usage: GLenum,
        data: ArrayBufferLike
    ): WebGLBuffer {
        const buffer = gl.createBuffer();

        // @start development
        if (!buffer) {
            throw 'Failed to create buffer';
        }
        // @end development

        gl.bindBuffer(target, buffer);
        gl.bufferData(target, data, usage);
        gl.bindBuffer(target, null);

        return buffer;
    }

    export function createDataBuffer(gl: WebGLRenderingContext, data: ArrayBuffer): WebGLBuffer {
        return createBuffer(gl, gl.ARRAY_BUFFER, gl.STATIC_DRAW, data);
    }

    export function createIndexBuffer(gl: WebGLRenderingContext, data: ArrayBuffer): WebGLBuffer {
        return createBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, gl.STATIC_DRAW, data);
    }
}

export class MeshBuffer implements Mesh, Buffer {
    public readonly transform: Transform3;

    private vertexBuffer: WebGLBuffer | null = null;
    private normalBuffer: WebGLBuffer | null = null;
    private uvBuffer: WebGLBuffer | null = null;
    private indexBuffer: WebGLBuffer | null = null;

    public constructor(
        public readonly material: Material,
        private readonly vertices: number[],
        private readonly normals: number[],
        private readonly uvs: number[],
        private readonly indices: number[]
    ) {
        this.transform = new Transform3();
    }

    public get matrix(): mat4 {
        return this.transform.matrix;
    }

    public bind(gl: WebGLRenderingContext): void {
        if ([this.vertexBuffer, this.normalBuffer, this.uvBuffer, this.indexBuffer].includes(null)) {
            this.vertexBuffer = WebGL.createDataBuffer(gl, new Float32Array(this.vertices));
            this.normalBuffer = WebGL.createDataBuffer(gl, new Float32Array(this.normals));
            this.uvBuffer = WebGL.createDataBuffer(gl, new Float32Array(this.uvs));
            this.indexBuffer = WebGL.createIndexBuffer(gl, new Uint16Array(this.indices));
        }

        const shader = this.material.toShader();

        {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = numComponents * Float32Array.BYTES_PER_ELEMENT;
            const offset = 0;
            const position = shader.getAttributeLocation(Shader.Attribute.POSITION);

            if (position !== null) {
                gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
                gl.vertexAttribPointer(position, numComponents, type, normalize, stride, offset);
                gl.enableVertexAttribArray(position);
            }
        }

        {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = numComponents * Float32Array.BYTES_PER_ELEMENT;
            const offset = 0;
            const position = shader.getAttributeLocation(Shader.Attribute.NORMAL);

            if (position !== null) {
                gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
                gl.vertexAttribPointer(position, numComponents, type, normalize, stride, offset);
                gl.enableVertexAttribArray(position);
            }
        }

        {
            const numComponents = 2;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = numComponents * Float32Array.BYTES_PER_ELEMENT;
            const offset = 0;
            const position = shader.getAttributeLocation(Shader.Attribute.UV);

            if (position !== null) {
                gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
                gl.vertexAttribPointer(position, numComponents, type, normalize, stride, offset);
                gl.enableVertexAttribArray(position);
            }
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    }

    public unbind(gl: WebGLRenderingContext): void {
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    public draw(gl: WebGLRenderingContext): void {
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
    }

    public toBuffer(): Buffer {
        return this;
    }
}

export class Cube extends MeshBuffer {
    private static readonly vertices = [
        // Front
        -0.5, -0.5, 0.5,
        0.5, -0.5, 0.5,
        0.5, 0.5, 0.5,
        -0.5, 0.5, 0.5,
        // Back
        -0.5, -0.5, -0.5,
        -0.5, 0.5, -0.5,
        0.5, 0.5, -0.5,
        0.5, -0.5, -0.5,
        // Top
        -0.5, 0.5, -0.5,
        -0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,
        0.5, 0.5, -0.5,
        // Bottom
        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5,
        0.5, -0.5, 0.5,
        -0.5, -0.5, 0.5,
        // Right
        0.5, -0.5, -0.5,
        0.5, 0.5, -0.5,
        0.5, 0.5, 0.5,
        0.5, -0.5, 0.5,
        // Left
        -0.5, -0.5, -0.5,
        -0.5, -0.5, 0.5,
        -0.5, 0.5, 0.5,
        -0.5, 0.5, -0.5
    ];
    private static readonly normals = [
        // Front
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        // Back
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        // Top
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        // Bottom
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        // Right
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        // Left
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0
    ];
    private static readonly uvs = [
        // Front
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Back
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Top
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Bottom
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Right
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Left
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0
    ];
    private static readonly indices = [
        0, 1, 2, 0, 2, 3,       // Front
        4, 5, 6, 4, 6, 7,       // Back
        8, 9, 10, 8, 10, 11,    // Top
        12, 13, 14, 12, 14, 15, // Bottom
        16, 17, 18, 16, 18, 19, // Right
        20, 21, 22, 20, 22, 23  // Left
    ];

    public constructor(material: Material, scale = 1) {
        let vertices = Cube.vertices;

        if (scale !== 1) {
            vertices = vertices.map(element => element * scale);
        }

        super(material, vertices, Cube.normals, Cube.uvs, Cube.indices);
    }
}
