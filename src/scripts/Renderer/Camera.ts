import { mat4 } from 'gl-matrix';
import { Object3, Transform3 } from './Mesh';

export interface Camera extends Object3 {
    readonly projection: mat4;
}

export class OrthographicCamera implements Camera {
    public readonly projection: mat4;
    public readonly transform: Transform3;

    public constructor(
        left: number,
        right: number,
        bottom: number,
        top: number,
        near: number,
        far: number
    ) {
        const projection = mat4.create();

        mat4.ortho(projection, left, right, bottom, top, near, far);

        this.projection = projection;
        this.transform = new Transform3();
    }
}

export class PerspectiveCamera implements Camera {
    public readonly projection: mat4;
    public readonly transform: Transform3;

    public constructor(
        private fieldOfView: number,
        private aspectRatio: number,
        private zNear: number,
        private zFar: number
    ) {
        this.projection = mat4.create();
        this.transform = new Transform3();

        this.update();
    }

    public setAspectRatio(aspectRatio: number): void {
        this.aspectRatio = aspectRatio;

        this.update();
    }

    private update(): void {
        mat4.perspective(this.projection, this.fieldOfView, this.aspectRatio, this.zNear, this.zFar);
    }
}
