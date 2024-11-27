import { Box3, BufferGeometry, Camera, Clock, CubicBezierCurve3, CurvePath, Line, LineBasicMaterial, LineCurve3, Mesh, Object3D, OrthographicCamera, QuadraticBezierCurve3, Quaternion, Ray, Raycaster, Vector2, Vector3, Vector4 } from "three";
import { Animation } from "./animation";


export class AlternativeSelectionAnimation implements Animation {
    linearPart: LineCurve3;
    bezierPart: CubicBezierCurve3;
    halted: boolean;

    get lookingAt(): Vector3 {
        return new Vector3();
    }
    get position(): Vector3 {
        return this._position;
    }

    get finished(): boolean {
        return this._finished;
    }

    get reversing(): boolean {
        return this.direction === "Reverse"
    }
    get quaternion(): Quaternion {
        return this._quaternion 
    }
    private direction: "Forward" | "Reverse" = "Forward";
    private clock: Clock;
    private _finished: boolean = false;
    private isInLinearPart = true;
    private _position: Vector3 = new Vector3();
    public line: Line;
    private originalPosition:Vector3;
    private originalQuaternion: Quaternion;
    private _quaternion: Quaternion;
    private waitTime = 0.1;
    constructor(
        public duration = 1,
        originalPosition: Vector3,
        private camera: OrthographicCamera,
        private escape: Object3D,
        private avoid: Object3D,
        private cube: Mesh,
        private escapeDirection = new Vector3(0, 0, 1),
        private speed = 80,
        private index = 5
        ) {
            this.originalPosition = originalPosition.clone()
            this.originalQuaternion = cube.quaternion.clone()
            this._quaternion = this.originalQuaternion.clone()
        const boundingBox = new Box3().setFromObject(escape);
        const boundingBoxAvoid = new Box3().setFromObject(avoid);
        if (!boundingBox.containsPoint(originalPosition) || !boundingBoxAvoid.containsPoint(originalPosition)) {
            throw new Error('Original point must be inside the bounding box')
        }
        this.clock = new Clock();
        this.buildPath();
        const points = [...this.linearPart.getPoints(60), ...this.bezierPart.getPoints(60)];
        const geometry = new BufferGeometry().setFromPoints(points);
        const material = new LineBasicMaterial({ color: 0xffffff });

        this.line = new Line(geometry, material);
        this.waitTime = this.waitTime * this.index
    }
    tick(): void {
        if (this._finished || this.halted) {
            return;
        }
        if (this.direction == "Forward") {
            this.forwardDirection()
        }
        if (this.direction == "Reverse") {
            const elapsedTime = this.clock.getElapsedTime();    
            if (elapsedTime > this.waitTime) {
                if (this.waitTime > 0) {
                    this.waitTime = -1;
                    this.clock = new Clock();
                }
                
                this.reverseDirection();
            }
        }
        this.cube.position.copy(this._position.clone());
        this.cube.quaternion.copy(this._quaternion)
    }

    private forwardDirection(): void {
        const elapsedTime = this.clock.getElapsedTime();
        if (this.isInLinearPart) {
            let alpha = this.elapsedTimeToAlpha(elapsedTime)
            this.quaternion.slerp(this.originalQuaternion, 1)
            if (alpha >= 1) {
                this.isInLinearPart = false;
                alpha = 1;
                this.clock = new Clock(); 
            }
            this.linearPart.getPoint(alpha, this._position) 
        } else {
            const alpha = elapsedTime / this.duration;
            this.quaternion.slerp(this.camera.quaternion, alpha)
            if (alpha > 1) {
                this.halted = true;
                this.bezierPart.getPoint(1, this._position);
            } else {
                this._position = this.bezierPart.getPoint(alpha);
            }
        }
    }

    private reverseDirection() {
        const elapsedTime = this.clock.getElapsedTime();
        this.quaternion.slerp(this.originalQuaternion, 1)
        if (this.isInLinearPart) {
            let alpha = 1 - this.elapsedTimeToAlpha(elapsedTime)
            if (alpha < 0) {
                this._finished = true;
                alpha = 0;
            }
            this.linearPart.getPoint(alpha, this._position) 
        } else {
            const alpha = (this.duration - elapsedTime ) / this.duration;
            this.quaternion.slerp(this.camera.quaternion, alpha)
            if (alpha < 0) {
                this.isInLinearPart = true
                this.bezierPart.getPoint(0, this._position);
                this.clock = new Clock(); 
            } else {
                this.bezierPart.getPoint(alpha, this._position);
            }
        }
    }
    reverse(): void {
        this.direction = "Reverse"
        this.halted = false;
        this.clock = new Clock()
    }

    private elapsedTimeToAlpha(elapsedTime: number): number {
        const initialPoint = this.linearPart.getPoint(0);
        const finalPoint = this.linearPart.getPoint(1);
        const distance = initialPoint.distanceTo(finalPoint);
        const alpha = (this.speed * elapsedTime) / distance 
        return alpha
    }


    private buildPath(): void {
        const raycasterEscape = new Ray(this.originalPosition, this.escapeDirection.normalize())
        const firstPoint = new Vector3();
        raycasterEscape.intersectBox(new Box3().setFromObject(this.avoid), firstPoint);
        // TODO extract to something more sensible
        this.linearPart = new LineCurve3(this.originalPosition, firstPoint);
        let secondPoint = this.camera.position.clone().add(new Vector3(0,0,100))

        raycasterEscape.intersectBox(new Box3().setFromObject(this.escape), firstPoint);
        const clonedTarget = this.camera.position.clone();
        const raycasterAvoidTarget = new Ray(this.originalPosition, clonedTarget.sub(this.originalPosition).normalize());
        const thirdPoint = new Vector3();
        const boxAvoid = new Box3().setFromObject(this.avoid);
        raycasterAvoidTarget.intersectBox(boxAvoid, thirdPoint);
        
        const fourthPoint4d = new Vector3(0,0,0)
        
        // TODO extract to something more sensible
        this.camera.getWorldDirection(fourthPoint4d)
        let fourthPoint = new Vector3((.9 - this.index*.1), -.8, -.9)
        fourthPoint.unproject(this.camera)
        this.bezierPart = new CubicBezierCurve3(firstPoint, secondPoint, thirdPoint, fourthPoint);
        console.log({linear: this.linearPart, bezier: this.bezierPart, camera: this.camera})
    }
}