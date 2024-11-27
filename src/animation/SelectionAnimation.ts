import {
    Clock,
    CubicBezierCurve3,
    Mesh,
    Object3D,
    Quaternion,
    Vector3
} from 'three';
export class SelectionAnimation {
    public position: Vector3;
    private duration: number;
    private cubeSize: number;
    private upDuration: number;
    private translationDuration: number;
    private isFinished: boolean;
    private reversed: boolean;
    private clock: Clock;
    private paths: {firstPosition: Vector3, curve:CubicBezierCurve3, reverseInitialPosition: Vector3 }[]; 
    constructor(private meshMatrix: {cube: Mesh, line: Mesh}[][][],private anchor: Object3D,private originalParent: Object3D,private row: number,private column: number) {
        
        this.meshMatrix = meshMatrix;
        this.duration = 2;
        this.anchor = anchor;

        // TODO Fix this in the future
        this.cubeSize = 10;
        this.duration = 2;
        this.upDuration = this.duration /2;
        this.translationDuration = this.duration / 2;


        this.isFinished = false;
        this.reversed = false;

        this.clock = new Clock();
        this.originalParent = originalParent;

        this.paths = [];
        for (let shift = 0; shift < 10; shift++) {
            const minZ = (shift + 11) * this.cubeSize;
            const firstPosition = new Vector3(this.row * this.cubeSize, this.column * this.cubeSize, minZ);
            const curve = this.calculateCurve(this.row, this.column, shift);
            const reverseInitialPosition = this.meshMatrix[this.row][this.column][shift].cube.position.clone();
            this.paths.push({firstPosition, curve, reverseInitialPosition})
        }
    }

    
    private forward() {
        if (this.clock.getElapsedTime() < this.duration) {
            for (let shift = 0; shift < 10; shift++) {
                const {curve, firstPosition, reverseInitialPosition} = this.paths[shift];
                const cube = this.meshMatrix[this.row][this.column][shift].cube;
                if (this.clock.getElapsedTime() < this.upDuration) {
                    const alpha = this.clock.getElapsedTime() / this.upDuration ;
                    cube.position.copy(reverseInitialPosition.clone().lerp(firstPosition, alpha));
                } else {
                    const curvePos = (this.clock.getElapsedTime() - this.upDuration) / this.translationDuration ;
                    cube.position.copy(curve.getPoint(curvePos));
                    cube.quaternion.slerp(this.anchor.quaternion, curvePos);
                }
            }
        } else if (!this.isFinished) {
            for (let shift = 0; shift < 10; shift++) {
                const quaternion = new Quaternion();
                quaternion.setFromAxisAngle( new Vector3( 0, 1, 0 ), Math.PI / 2 );
                this.meshMatrix[this.row][this.column][shift].cube.setRotationFromQuaternion(quaternion);
                this.meshMatrix[this.row][this.column][shift].cube.position.copy(this.anchor.worldToLocal(this.meshMatrix[this.row][this.column][shift].cube.position))
                this.anchor.add(this.meshMatrix[this.row][this.column][shift].cube);
            }
            this.isFinished = true;
        }
    }

    private backwards() {
        if (this.clock.getElapsedTime() < this.duration) {
            for (let shift = 0; shift < 10; shift++) {
                const {curve, reverseInitialPosition} = this.paths[shift];
                const cube = this.meshMatrix[this.row][this.column][shift].cube;
                if (this.clock.getElapsedTime() < this.translationDuration) {
                    const curvePos = 1 - ((this.clock.getElapsedTime()) / this.translationDuration);
                    cube.position.copy(curve.getPoint(curvePos));
                    cube.quaternion.slerp(this.originalParent.quaternion, curvePos);
                } else {
                    const alpha = (this.clock.getElapsedTime() - this.translationDuration) / (this.upDuration  );
                    cube.position.lerp(reverseInitialPosition, alpha);
                    
                }
            }
        } else if (!this.isFinished) {
            for (let shift = 0; shift < 10; shift++) {
                this.originalParent.add(this.meshMatrix[this.row][this.column][shift].cube);
            }
            this.isFinished = true;
        }
    }

    tick() {
        if (!this.reversed) {
            this.forward();
        } else {
            
            this.backwards();
        }
    }
    reverse() {
        this.reversed = true;
        this.clock = new Clock();
        for (let shift = 0; shift < 10; shift++) {
            this.meshMatrix[this.row][this.column][shift].cube.position.copy(this.originalParent.worldToLocal(this.meshMatrix[this.row][this.column][shift].cube.position))
            this.originalParent.add(this.meshMatrix[this.row][this.column][shift].cube);
        }
    }
    private calculateCurve(row: number, column: number, shift: number) {
            const rows = this.meshMatrix.length;
            const columns = this.meshMatrix[0].length;
            const minZ = (shift + 11) * 10;
            const initialPoint = new Vector3(row * this.cubeSize, column * this.cubeSize, minZ)
            const direction = new Vector3();
            direction.add(this.anchor.position);
            direction.sub(initialPoint);
            const firstPoint = direction.clone();
            firstPoint.setZ(0);
            firstPoint.clampLength((Math.max(rows,columns) + 1) * this.cubeSize,(Math.max(rows,columns) + 1) * this.cubeSize  );
            firstPoint.setZ(minZ);
            const secondPoint = this.anchor.position.clone();
            const secondPointDistance = this.anchor.position.length() - 10;
            secondPoint.clampLength(secondPointDistance, secondPointDistance);
    
            const finalPoint = this.anchor.localToWorld(new Vector3(-15 * shift + 90, -90, -10));
    
    
            return new CubicBezierCurve3(
                initialPoint,
                firstPoint,
                secondPoint,
                finalPoint
            );
        }
}