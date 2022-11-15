export enum MatrixEvents {
    SIZE_CHANGED = 1
}

export class Matrix {

    public static BIGGEST_SHIFT = 32;
    private matrix: number[][];
    private listeners: ((event?: MatrixEvents) => void)[];
    private currentShift: number;
    constructor(public rows: number, public columns: number, public maxShifts: number, public readonly maxNumberOfCells) {
        this.matrix = [];
        this.updateMatrix();
        this.currentShift = 0;
        this.listeners = [];
        
    }
    private updateMatrix() {
        for (let row = 0; row < this.rows; row++) {
            const rowArray = this.matrix[row] || [] as number[];
            for (let column = 0; column < this.columns; column++) {
                rowArray[column] = 0;
            }
            this.matrix[row] = rowArray;
        }
    }

    _activate(row: number, column: number) {

        if (this.getTranslatedValue(row, column) !== 1) {
            this.matrix[row][column] = this.matrix[row][column] + (1 << this.currentShift);
        }
    }
    
    _deactivate(row: number, column: number) {
        if (this.getTranslatedValue(row, column) !== 0) {
            this.matrix[row][column] = this.matrix[row][column] - (1 << this.currentShift);
        }
    }

    getTranslatedValue(row: number, column: number) {
        return (this.matrix[row][column] >> this.currentShift) & 1;
    }

    tellListeners(eventType?: MatrixEvents) {
        this.listeners.forEach(listener => listener(eventType));
    }

    addChangeListener(listener: (event: MatrixEvents | undefined) => void) {
        this.listeners.push(listener);
    }

    toggle(row: number, column: number) {
        const currentState = (this.matrix[row][column] >> this.currentShift) & 1;
        if (currentState === 1) {
            this.deactivate(row, column)
        } else {
            this.activate(row, column);
        }
        this.tellListeners();
    }

    activate(row: number, column: number) {
        this._activate(row, column);
        this.tellListeners();
    }
    deactivate(row: number, column: number) {
        this._deactivate(row, column);
        this.tellListeners();
    }

    getRawValue(row: number, column: number) {
        return  this.matrix[row][column];
    }

    setRawValue(row: number, column: number, value: number) {
        this.matrix[row][column] = value;
        this.tellListeners();
    }

    changeShift(shift: number) {
        this.currentShift = shift;
        this.tellListeners();
    }

    changeMaxShifts(newMaxShifts: number) {
        this.maxShifts = newMaxShifts;
        this.tellListeners();
    }

    changeMatrixSize(rows: number, columns: number) {
        this.rows = rows;
        this.columns = columns;
        this.updateMatrix();
        this.tellListeners(MatrixEvents.SIZE_CHANGED);
    }

    getCurrentShift() {
        return this.currentShift;
    }
    getShiftedMatrix(shift) {
        const shiftedMatrix = [] as number[][];
        for (let row = 0; row < this.rows; row++) {
            const rowArray = [] as number[];
            for (let column = 0; column < this.columns; column++) {  
                rowArray.push((this.matrix[row][column] >> shift) % 2);
            }
            shiftedMatrix.push(rowArray);
        }
        return shiftedMatrix;
    }
}