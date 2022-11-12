export function getRowId(row) {
    return `row-${row}`;
}

export function getSquareId(row, column) {
    return `square-${row}-${column}`;
}

export function getShiftControlId(number) {
    return `shift-control-${number}`;
}

export function getMiniMatrixId(shift) {
    return `mini-matrix-${shift}`;
}

export function getMiniSquareId(shift, row, column) {
    return `mini-square-${shift}-${row}-${column}`;
}