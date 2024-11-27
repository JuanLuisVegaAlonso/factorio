import { Line, Vector3 } from "three";

export interface Animation {
    tick(): void;
    reverse(): void;
    position: Vector3;
    line?: Line;
    reversing?: boolean;
    finished?: boolean;
}