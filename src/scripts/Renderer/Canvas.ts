import { vec4 } from 'gl-matrix';
import { Color } from './Color';

export namespace WebGL {
    const defaultOptions: WebGLContextAttributes = {
        alpha: false,
        antialias: false
    };

    export function getWebGLContext(
        canvas: HTMLCanvasElement,
        options: WebGLContextAttributes = defaultOptions
    ): WebGLRenderingContext {
        const gl = canvas.getContext('webgl', options) ||
                   canvas.getContext('experimental-webgl', options);

        if (!gl) {
            throw 'Failed to create WebGL context';
        }

        if (!(gl instanceof WebGLRenderingContext)) {
            throw 'Failed to create WebGL2 context';
        }

        return gl;
    }

    export function clear(
        gl: WebGLRenderingContext,
        color: vec4 = Color.BLACK
    ): void {
        gl.clearColor(color[ 0 ], color[ 1 ], color[ 2 ], color[ 3 ]);
        gl.clearDepth(1);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
}
