import { entityMap, virtualSignals } from "../data/baseInfo";
import { Entity, FactorioInfo } from "../data/FactorioData";
import { LampBlueprint } from "../data/LampBlueprint";

export class FactorioDataViewerController {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private section: HTMLElement;
    private entitySize = 1;
    private margin = 120;
    private lineHeight = .25;
    private factorioData: FactorioInfo;

    constructor(private lampBlueprint: LampBlueprint) {

    }

    init() {
        this.section = document.getElementById('segmented-display-controller')!;
        const {clientWidth, clientHeight} = this.section;
        console.log({clientWidth, clientHeight});
        this.canvas = document.createElement('canvas');
        this.canvas.width = clientWidth - 10;
        this.canvas.height = clientHeight - 10;
        this.section.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d')!;
        

        this.lampBlueprint.addListener(bluprint => {
            this.factorioData = bluprint;
            this.redraw();
        })
        
        this.factorioData = this.lampBlueprint.blueprint;
        
        this.redraw();

    }

    redraw() {
        const {clientWidth, clientHeight} = this.section;
        console.log({clientWidth, clientHeight});
        this.canvas.width = clientWidth - 10;
        this.canvas.height = clientHeight - 10;
        const oldFill = this.ctx.fillStyle;
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = oldFill;
        const copiedEntities = [...this.factorioData.blueprint.entities];
        copiedEntities.sort((a,b) => b.position.x - a.position.x);
        const minX = copiedEntities[copiedEntities.length - 1].position.x;
        const maxX = copiedEntities[0].position.x;
        const xRatio = (this.canvas.width - this.margin*2) /Math.abs(maxX - minX);

        copiedEntities.sort((a,b) => b.position.y - a.position.y);
        const minY = copiedEntities[copiedEntities.length - 1].position.y;
        const maxY = copiedEntities[0].position.y;
        const yRatio = (this.canvas.height - this.margin*2) / Math.abs(maxY - minY);
        this.ctx.fillStyle = "black";
        this.ctx.strokeStyle = "black";
        console.log({minX, maxX, minY, maxY, canvas: this.canvas.height})

        const mapPosition = (entity: Entity) => {
            const x = (entity.position.x - minX) * xRatio - this.entitySize / 2 + this.margin;
            const y = (entity.position.y - minY) * yRatio - this.entitySize / 2 + this.margin;
            return {x, y};
        }
        for (let entity of copiedEntities) {
            const { x, y } = mapPosition(entity);
            this.ctx.strokeRect(
                x,
                y,
                this.entitySize * xRatio, this.entitySize * yRatio);
            const subText = `[${entity.position.x}, ${entity.position.y}]`;
            const printText = (text: string | undefined, lineNumber: number) => {
                if (text)
                this.ctx.fillText(
                    text,
                    (entity.position.x - minX) * xRatio + this.entitySize * xRatio / 2 - subText.length * 0.025 * xRatio + this.margin,
                    (entity.position.y - minY) * yRatio + this.entitySize * yRatio / 2 + lineNumber * this.lineHeight * yRatio - 5 + this.margin);
            };
            printText(entity.entity_number + '', 0);
            printText(`[${entity.position.x}, ${entity.position.y}]`, 1);

            printText(entity.control_behavior.circuit_condition?.first_signal.name, 2);


            for (let connectionKey in entity.connections) {
                const connection = entity.connections[connectionKey];
                if (connection?.green) {
                    this.ctx.strokeStyle = "green";
                    this.ctx.beginPath();
                    for (let green of connection.green) {
                        this.ctx.moveTo(x, y);
                        const other = copiedEntities.find(a => a.entity_number == green.entity_id)!;
                        const otherPos = mapPosition(other);
                        this.ctx.lineTo(otherPos.x, otherPos.y);
                    }
                    this.ctx.stroke();
                }
                if (connection?.red) {
                    this.ctx.strokeStyle = "red";
                    this.ctx.beginPath();
                    for (let red of connection.red) {
                        this.ctx.moveTo(x + this.entitySize * xRatio, y);
                        const other = copiedEntities.find(a => a.entity_number == red.entity_id)!;
                        const otherPos = mapPosition(other);
                        this.ctx.lineTo(otherPos.x + this.entitySize * xRatio, otherPos.y);
                    }
                    this.ctx.stroke();
                }
                this.ctx.strokeStyle = "black";
            }
        }
    }
}