import { Camera } from './Camera';
import { WebGL } from './Canvas';
import { Color } from './Color';
import { Material, Shader } from './Material';
import { Buffer, Mesh } from './Mesh';

export interface Renderer {
    render(camera: Camera, meshes: Mesh[]): void;
}

export class WebGLForwardRenderer implements Renderer {
    private readonly buffers: Map<Mesh, Buffer> = new Map();
    private readonly shaders: Map<Material, Shader> = new Map();

    public constructor(
        private readonly gl: WebGLRenderingContext
    ) {
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);

                addEventListener('resize', this.onResize.bind(this));

                this.onResize();
    }

    public render(camera: Camera, meshes: Mesh[]): void {
        const gl = this.gl;

        WebGL.clear(gl, Color.PALATINATE);

        for (const mesh of meshes) {
            let buffer = this.buffers.get(mesh);
            let shader = this.shaders.get(mesh.material);

            if (!buffer) {
                buffer = mesh.toBuffer();

                this.buffers.set(mesh, buffer);
            }

            if (!shader) {
                shader = mesh.material.toShader();

                this.shaders.set(mesh.material, shader);
            }

            buffer.bind(gl);
            shader.bind(gl);

            const projection = shader.getUniformLocation(Shader.Uniform.PROJECTION);
            const view = shader.getUniformLocation(Shader.Uniform.VIEW);
            const model = shader.getUniformLocation(Shader.Uniform.MODEL);

            if (projection !== null) {
                gl.uniformMatrix4fv(projection, false, camera.projection);
            }

            if (view !== null) {
                gl.uniformMatrix4fv(view, false, camera.transform.matrix);
            }

            if (model !== null) {
                gl.uniformMatrix4fv(model, false, buffer.matrix);
            }

            buffer.draw(gl);
            shader.unbind(gl);
            buffer.unbind(gl);
        }
    }

    private onResize(): void {
        const pixelRatio = window.devicePixelRatio || 1;
        const width = Math.floor((this.gl.canvas as HTMLCanvasElement).clientWidth * pixelRatio);
        const height = Math.floor((this.gl.canvas as HTMLCanvasElement).clientHeight * pixelRatio);

        this.gl.canvas.width = width;
        this.gl.canvas.height = height;
        this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
    }
}
