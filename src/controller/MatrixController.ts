import { Matrix, MatrixEvents } from "../data/matrix";
import { getMiniMatrixId, getMiniSquareId, getRowId, getShiftControlId, getSquareId } from "../utils";

export class MatrixController {
    public static ACTIVATE_MODE = 1;
    public static DEACTIVATE_MODE = 2;

    private matrixContainer: HTMLElement;
    private matrixDrawing: HTMLElement | void;
    private matrixSizeOverlay: HTMLElement;
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
        shiftControl.classList.add("shift-control");
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
        for(let i = 0; i < this.matrix.maxShifts; i++) {
            const currentMatrix = this.matrix.getShiftedMatrix(i);
            const {rows, columns} = this.matrix;
            for (let row = 0; row < rows; row++) {
                for (let column = 0; column < columns; column++) {
                    const miniSquare = document.getElementById(getMiniSquareId(i, row, column));
                    if (currentMatrix[row][column] === 0) {
                        miniSquare!.classList.remove('active');
                    } else {
                        miniSquare!.classList.add('active');
                    }
                }
            }
        }
        
    }
    createAllShiftControls() {
        const availableShiftsElement = document.getElementById('available-shifts')!;
        availableShiftsElement.innerHTML = "";
        for(let number = 0; number < this.matrix.maxShifts; number++) {
            availableShiftsElement.appendChild(this.createShiftControl(number));
        }
        document.getElementById(getShiftControlId(this.matrix.getCurrentShift()))!.classList.add('current');
    }

    createMatrix() {
        const matrixDrawing = document.getElementById('matrix-drawing')!;
        matrixDrawing.innerHTML = "";
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

    createControls() {

        const sliderRows = document.createElement('input');
        sliderRows.type = 'range';
        sliderRows.min = 1 + "";
        sliderRows.max = Math.floor(Math.sqrt(this.matrix.maxNumberOfCells)) + "";
        sliderRows.setAttribute("id", "slider-rows");
        sliderRows.setAttribute("orient", "vertical");
        
        this.matrixContainer.appendChild(sliderRows);
        

        const sliderColumns = document.createElement('input');
        sliderColumns.type = 'range';
        sliderColumns.min = 1 + "";
        sliderColumns.max = Math.floor(Math.sqrt(this.matrix.maxNumberOfCells)) + "";
        sliderColumns.setAttribute("id", "slider-columns");
        this.matrixContainer.appendChild(sliderColumns);

       
        sliderRows.addEventListener('input', () => this.handleNumberOfRowsInput(sliderRows, sliderColumns));
        sliderColumns.addEventListener('input', () => this.handleNumberOfColsInput(sliderRows, sliderColumns));

        sliderRows.addEventListener('change', () => this.handleNumberOfRowsOrColsChange(sliderRows, sliderColumns));
        sliderColumns.addEventListener('change', () => this.handleNumberOfRowsOrColsChange(sliderRows, sliderColumns));

        sliderRows.value = this.matrix.rows + "";
        sliderColumns.value = this.matrix.columns + "";

        const button = document.createElement('button');
        button.innerText = "Change size to 8x8";
        button.onclick =() => {
            this.matrix.changeMatrixSize(8,8);
        };
    }


    private handleNumberOfRowsInput(sliderRows: HTMLInputElement, sliderColumns: HTMLInputElement) {
        const rows = Number(sliderRows.value);
        const cols = Number(sliderColumns.value);
        const maxCols = Math.floor(this.matrix.maxNumberOfCells / rows);
        if (cols > maxCols) {
            sliderColumns.value = maxCols + "";
        }
        this.updateMatrixSizeOverlay(rows, cols);
    }
    private handleNumberOfColsInput(sliderRows: HTMLInputElement, sliderColumns: HTMLInputElement) {
        const rows = Number(sliderRows.value);
        const cols = Number(sliderColumns.value);
        const maxRows = Math.floor(this.matrix.maxNumberOfCells / cols);
        if (rows > maxRows) {
            sliderRows.value = maxRows + "";
        }
        this.updateMatrixSizeOverlay(rows, cols);
    }

    private updateMatrixSizeOverlay(rows: number, columns: number) {
        this.matrixSizeOverlay.classList.remove("hidden");
        this.matrixSizeOverlay.innerHTML = `<span>${rows}x${columns}`;
        
    }

    private handleNumberOfRowsOrColsChange(sliderRows: HTMLInputElement, sliderColumns: HTMLInputElement) {
        const rows = Number(sliderRows.value);
        const cols = Number(sliderColumns.value);
        this.matrix.changeMatrixSize(rows, cols);
        this.matrixSizeOverlay.classList.add("hidden");
        
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
             const rowColRegx = /square-([0-9]+)-([0-9]+)*/g;
             const rowCol = rowColRegx.exec(id);
             if (this.mouseMode === MatrixController.ACTIVATE_MODE) {
                 this.matrix.activate(Number(rowCol![1]),Number(rowCol![2]));
             }
             if (this.mouseMode === MatrixController.DEACTIVATE_MODE) {
                this.matrix.deactivate(Number(rowCol![1]),Number(rowCol![2]));
             }
             this.oldId = id;
         }
     }

    init() {
        this.matrixContainer = document.getElementById('matrix-container')!;
        this.matrixSizeOverlay = document.getElementById('matrix-size-overlay')!;
        this.createControls();
        this.createAllShiftControls();
        this.createMatrix();
        
    
        // listener of changes
        this.matrix.addChangeListener((eventType?: MatrixEvents) => {
            if (eventType && eventType === MatrixEvents.SIZE_CHANGED) {
                this.createMatrix();
                this.createAllShiftControls();
            }
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