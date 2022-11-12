import { Matrix } from "../data/matrix";
import { getMiniMatrixId, getMiniSquareId, getRowId, getShiftControlId, getSquareId } from "../utils";

export class MatrixController {
    public static ACTIVATE_MODE = 1;
    public static DEACTIVATE_MODE = 2;

    private matrixDrawing: HTMLElement | void;
    private oldId: number | void;
    private mouseMode: number | void;
    

    constructor(private matrix: Matrix, private maxHeight) {
        this.matrixDrawing = undefined;
    }

    private createRow(row: number) {
        const rowElement = document.createElement('div');
        rowElement.setAttribute('id', getRowId(row));
        rowElement.classList.add('row');
        return rowElement;
    }

    private createSquare(row: number, column: number) {
        const squareElement = document.createElement('div');
        squareElement.setAttribute('id', getSquareId(row, column));
        squareElement.classList.add('square');
        const {rows} = this.matrix;
        const ratio = this.maxHeight / rows;
        squareElement.style.width = `${ratio}px`;
        squareElement.style.height = `${ratio}px`;
        const labelElement = document.createElement('label');
        labelElement.innerText = '0';
        squareElement.appendChild(labelElement);
        this.matrix.addChangeListener(() => labelElement.innerText = this.matrix.getRawValue(row, column) + '');
        return squareElement;
    }

    private createShiftControl(number: number) {
        const shiftControl = document.createElement('div');
        const shiftLabel = document.createElement('label');
        shiftControl.appendChild(shiftLabel);
        shiftControl.appendChild(this.createMiniMatrix(number))
        shiftControl.setAttribute('id', getShiftControlId(number));
        shiftLabel.innerText = number + '';
        shiftControl.onclick = () => {
            this.matrix.changeShift(number);
        };
        return shiftControl;
    }

    private createMiniMatrix(shift) {
        const {rows, columns} = this.matrix;
        const miniMatrix = document.createElement('div');
        miniMatrix.setAttribute('id', getMiniMatrixId(shift));
        miniMatrix.classList.add('mini-matrix');
        for (let row = 0; row < rows; row++) {
            const miniRow = document.createElement('div');
            miniRow.classList.add('mini-row');
            for (let column = 0; column < columns; column++) {
                const miniSquare = document.createElement('div');
                miniSquare.setAttribute('id', getMiniSquareId(shift, row, column))
                miniSquare.classList.add(`mini-square`);
                miniRow.appendChild(miniSquare);
            }
            miniMatrix.appendChild(miniRow)
        }
        return miniMatrix;
    }

    redrawMatrix() {
        const {rows, columns} = this.matrix;
        for (let row = 0; row < rows; row++) {
            for (let column = 0; column < columns; column++) {
                const square = document.getElementById(getSquareId(row,column));
                const currentState = this.matrix.getTranslatedValue(row, column);
                if (currentState == 1) {
                    square!.classList.add('active');
                }  else {
                    square!.classList.remove('active');
                }
            }
        }
    }

    redrawMiniMatrix() {
        const currentMatrix = this.matrix.getShiftedMatrix(this.matrix.getCurrentShift());
        const {rows, columns} = this.matrix;
        for (let row = 0; row < rows; row++) {
            for (let column = 0; column < columns; column++) {
                const miniSquare = document.getElementById(getMiniSquareId(this.matrix.getCurrentShift(), row, column));
                if (currentMatrix[row][column] === 0) {
                    miniSquare!.classList.remove('active');
                } else {
                    miniSquare!.classList.add('active');
                }
            }
        }
    }
    createAllShiftControls() {
        const availableShiftsElement = document.getElementById('available-shifts');
        for(let number = 0; number < 10; number++) {
            availableShiftsElement!.appendChild(this.createShiftControl(number));
        }
        document.getElementById(getShiftControlId(this.matrix.getCurrentShift()))!.classList.add('current');
    }

    createMatrix() {
        const matrixDrawing = document.getElementById('matrix-drawing');
        const {rows, columns} = this.matrix;
        for (let row = 0; row < rows; row++) {
            const rowElement = this.createRow(row);
            rowElement.classList.add('row')
            for (let column = 0; column < columns; column++) {
                rowElement.appendChild(this.createSquare(row,column));
            }
        matrixDrawing!.appendChild(rowElement);
        }
        this.matrixDrawing = matrixDrawing!;

    }

    private handleDrawing(event) {
        if (event.type !== 'click' && event.buttons != 1 ) return;
         const id = event.target.getAttribute('id');
         if (event.target.tagName === 'DIV' && id.startsWith('square') && id !== this.oldId) {
             if (!this.mouseMode) {
                 if (event.target.classList.contains('active')) {
                     this.mouseMode = MatrixController.DEACTIVATE_MODE;
                 } else {
                     this.mouseMode = MatrixController.ACTIVATE_MODE;
                 }
             }
             const rowColRegx = /square-([0-9])-([0-9])/g;
             const rowCol = rowColRegx.exec(id);
             if (this.mouseMode === MatrixController.ACTIVATE_MODE) {
                 this.matrix.activate(rowCol![1],rowCol![2]);
             }
             if (this.mouseMode === MatrixController.DEACTIVATE_MODE) {
                this.matrix.deactivate(rowCol![1],rowCol![2]);
             }
             this.oldId = id;
         }
     }

    init() {
        this.createAllShiftControls();
        this.createMatrix();
    
        // listener of changes
        this.matrix.addChangeListener(() => {
            this.redrawMatrix();
            this.redrawMiniMatrix();
            document.getElementsByClassName('current')[0].classList.remove('current')
            document.getElementById(getShiftControlId(this.matrix.getCurrentShift()))!.classList.add('current');
        });
    
        
        this.matrixDrawing!.addEventListener('mousemove', (event) => this.handleDrawing(event));
        this.matrixDrawing!.addEventListener('mousedown', (event) => this.handleDrawing(event));
        this.matrixDrawing!.addEventListener('mouseup', () => {
            this.oldId = undefined;
            this.mouseMode = undefined;
        })
    }
}