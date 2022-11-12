export class Matrix {   
    private matrix: number[][];
    private listeners: (() => void)[];
    private currentShift: number;
    constructor(public rows: number, public columns: number) {
        this.matrix = [];
        for (let row = 0; row < this.rows; row++) {
            const rowArray = [] as number[];
            for (let column = 0; column < this.columns; column++) {
                rowArray.push(0);
            }
            this.matrix.push(rowArray);
        }
        this.listeners = [];
        this.currentShift = 0;
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

    tellListeners() {
        this.listeners.forEach(listener => listener());
    }

    addChangeListener(listener) {
        this.listeners.push(listener);
    }

    toggle(row, column) {
        const currentState = (this.matrix[row][column] >> this.currentShift) & 1;
        if (currentState === 1) {
            this.deactivate(row, column)
        } else {
            this.activate(row, column);
        }
        this.tellListeners();
    }

    activate(row, column) {
        this._activate(row, column);
        this.tellListeners();
    }
    deactivate(row, column) {
        this._deactivate(row, column);
        this.tellListeners();
    }

    getRawValue(row, column) {
        return  this.matrix[row][column];
    }

    setRawValue(row, column, value) {
        this.matrix[row][column] = value;
    }

    changeShift(shift) {
        this.currentShift = shift;
        this.listeners.forEach(listener => listener())
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