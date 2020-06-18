import vertexSource from '../../assets/shaders/default.vert.glsl';
import fragmentSource from '../../assets/shaders/default.frag.glsl';

export interface Material {
    toShader(): Shader;
}

export interface Shader {
    bind(gl: WebGLRenderingContext): void;
    unbind(gl: WebGLRenderingContext): void;
    getAttributeLocation(attribute: Shader.Attribute): number | null;
    getUniformLocation(uniform: Shader.Uniform): WebGLUniformLocation | null;
}

export namespace Shader {
    export enum Attribute {
        POSITION = 'vertexPosition',
        NORMAL = 'vertexNormal',
        UV = 'vertexUV'
    }

    export enum Uniform {
        PROJECTION = 'projectionMatrix',
        MODEL = 'modelMatrix',
        VIEW = 'viewMatrix',
        TEXTURE = 'sampler'
    }
}

export namespace WebGL {
    function createShader(gl: WebGLRenderingContext, type: GLenum, source: string): WebGLShader {
        const shader = gl.createShader(type);

        // @start development
        if (!shader) {
            throw 'Failed to create Shader';
        }
        // @end development

        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        // @start development
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const info = gl.getShaderInfoLog(shader);

            gl.deleteShader(shader);

            throw 'Failed to compile shader: ' + info;
        }
        // @end development

        return shader;
    }

    export function createVertexShader(gl: WebGLRenderingContext, source: string): WebGLShader {
        return createShader(gl, gl.VERTEX_SHADER, source);
    }

    export function createFragmentShader(gl: WebGLRenderingContext, source: string): WebGLShader {
        return createShader(gl, gl.FRAGMENT_SHADER, source);
    }

    export function createProgram(
        gl: WebGLRenderingContext,
        vertexShader: WebGLShader,
        fragmentShader: WebGLShader
    ): WebGLProgram {
        const program = gl.createProgram();

        // @start development
        if (!program) {
            throw 'Failed to create shader program';
        }
        // @end development

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        // @start development
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            gl.deleteProgram(program);
            throw 'Failed to line shader program: ' + gl.getProgramInfoLog(program);
        }

        gl.validateProgram(program);

        if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
            gl.deleteProgram(program);
            throw 'Failed to validate shader program: ' + gl.getProgramInfoLog(program);
        }
        // @end development

        gl.detachShader(program, vertexShader);
        gl.detachShader(program, fragmentShader);

        return program;
    }
}

export abstract class ShaderMaterial implements Material, Shader {
    private static readonly EMPTY_MAP = new Map();

    private program: WebGLProgram | null = null;
    private attributes: Map<Shader.Attribute, number> = ShaderMaterial.EMPTY_MAP;
    private uniforms: Map<Shader.Uniform, WebGLUniformLocation> = ShaderMaterial.EMPTY_MAP;

    protected constructor(
        private readonly vertexSource: string,
        private readonly fragmentSource: string
    ) {}

    public getAttributeLocation(attribute: Shader.Attribute): number | null {
        const position = this.attributes.get(attribute);

        if (position === undefined) {
            return null;
        }

        return position;
    }

    public getUniformLocation(uniform: Shader.Uniform): WebGLUniformLocation | null {
        const position = this.uniforms.get(uniform);

        if (position === undefined) {
            return null;
        }

        return position;
    }

    public bind(gl: WebGLRenderingContext): void {
        this.program = this.getShaderProgram(gl);

        gl.useProgram(this.program);
    }

    public unbind(gl: WebGLRenderingContext): void {
        gl.useProgram(null);
    }

    public toShader(): Shader {
        return this;
    }

    protected getAttributes(gl: WebGLRenderingContext, program: WebGLProgram): Map<Shader.Attribute, number> {
        const attributes: Map<Shader.Attribute, number> = new Map();

        const vertexAttribute = gl.getAttribLocation(program, Shader.Attribute.POSITION);

        if (vertexAttribute >= 0) {
            attributes.set(Shader.Attribute.POSITION, vertexAttribute);
        } else {
            debugger;
        }

        const normalAttribute = gl.getAttribLocation(program, Shader.Attribute.NORMAL);

        if (normalAttribute >= 0) {
            attributes.set(Shader.Attribute.NORMAL, normalAttribute);
        } else {
            debugger;
        }

        const uvAttribute = gl.getAttribLocation(program, Shader.Attribute.UV);

        if (uvAttribute >= 0) {
            attributes.set(Shader.Attribute.UV, uvAttribute);
        } else {
            debugger;
        }

        return attributes;
    }

    protected getUniforms(gl: WebGLRenderingContext, program: WebGLProgram): Map<Shader.Uniform, WebGLUniformLocation> {
        const uniforms: Map<Shader.Uniform, WebGLUniformLocation> = new Map();

        const projectionMatrix = gl.getUniformLocation(program, Shader.Uniform.PROJECTION);

        if (projectionMatrix !== null) {
            uniforms.set(Shader.Uniform.PROJECTION, projectionMatrix);
        }

        const modelMatrix = gl.getUniformLocation(program, Shader.Uniform.MODEL);

        if (modelMatrix !== null) {
            uniforms.set(Shader.Uniform.MODEL, modelMatrix);
        }

        const viewMatrix = gl.getUniformLocation(program, Shader.Uniform.VIEW);

        if (viewMatrix !== null) {
            uniforms.set(Shader.Uniform.VIEW, viewMatrix);
        }

        return uniforms;
    }

    private getShaderProgram(gl: WebGLRenderingContext): WebGLProgram {
        if (this.program) {
            return this.program;
        }

        const vertexShader = WebGL.createVertexShader(gl, this.vertexSource);
        const fragmentShader = WebGL.createFragmentShader(gl, this.fragmentSource);
        const program = WebGL.createProgram(gl, vertexShader, fragmentShader);

        this.attributes = this.getAttributes(gl, program);
        this.uniforms = this.getUniforms(gl, program);

        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);

        return program;
    }
}

export class TextureMaterial extends ShaderMaterial {
    private texture: WebGLTexture | null = null;

    public constructor(
        private readonly textureSource: string
    ) {
        super(vertexSource, fragmentSource);
    }

    protected getUniforms(gl: WebGLRenderingContext, program: WebGLProgram): Map<Shader.Uniform, WebGLUniformLocation> {
        const uniforms = super.getUniforms(gl, program);

        const texture = gl.getUniformLocation(program, Shader.Uniform.TEXTURE);

        if (texture !== null) {
            uniforms.set(Shader.Uniform.TEXTURE, texture);
        }

        return uniforms;
    }

    public bind(gl: WebGLRenderingContext): void {
        super.bind(gl);

        if (!this.texture) {
            this.texture = gl.createTexture();

            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB,
                gl.UNSIGNED_BYTE, new Uint8Array([ 255, 0, 0 ]));
            gl.bindTexture(gl.TEXTURE_2D, null);

            const image = new Image();
            image.onload = (): void => {
                gl.bindTexture(gl.TEXTURE_2D, this.texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                gl.bindTexture(gl.TEXTURE_2D, null);
            };
            image.src = this.textureSource;
        }

        const position = this.getUniformLocation(Shader.Uniform.TEXTURE);

        if (position !== null) {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.uniform1i(position, 0);
        }
    }

    public unbind(gl: WebGLRenderingContext): void {
        super.unbind(gl);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }
}

export class VideoMaterial extends ShaderMaterial {
    private texture: WebGLTexture | null = null;
    private video: HTMLVideoElement | null = null;
    private shouldUpdate = false;

    public constructor(
        private readonly videoSource: string
    ) {
        super(vertexSource, fragmentSource);
    }

    protected getUniforms(gl: WebGLRenderingContext, program: WebGLProgram): Map<Shader.Uniform, WebGLUniformLocation> {
        const uniforms = super.getUniforms(gl, program);

        const texture = gl.getUniformLocation(program, Shader.Uniform.TEXTURE);

        if (texture !== null) {
            uniforms.set(Shader.Uniform.TEXTURE, texture);
        }

        return uniforms;
    }

    public bind(gl: WebGLRenderingContext): void {
        super.bind(gl);

        if (!this.texture) {
            this.texture = gl.createTexture();
            this.video = this.loadVideo(this.videoSource);

            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB,
                gl.UNSIGNED_BYTE, new Uint8Array([ 0, 0, 0 ]));
            gl.bindTexture(gl.TEXTURE_2D, null);
        }

        if (this.shouldUpdate && this.video) {
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.video);
            gl.bindTexture(gl.TEXTURE_2D, null);
        }

        const position = this.getUniformLocation(Shader.Uniform.TEXTURE);

        if (position !== null) {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.uniform1i(position, 0);
        }
    }

    public unbind(gl: WebGLRenderingContext): void {
        super.unbind(gl);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    private loadVideo(url: string): HTMLVideoElement {
        const video = document.createElement('video');

        let playing = false;
        let timeupdate = false;

        video.autoplay = true;
        video.muted = true;
        video.loop = true;

        const checkReady = (): void => {
            if (playing && timeupdate) {
                this.shouldUpdate = true;
            }
        };

        video.addEventListener('playing', () => {
            playing = true;
            checkReady();
        }, true);

        video.addEventListener('timeupdate', () => {
            timeupdate = true;
            checkReady();
        }, true);

        video.src = url;
        video.play();

        return video;
    }
}
