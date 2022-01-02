function getRowId(row) {
    return `row-${row}`;
}

function getSquareId(row, column) {
    return `square-${row}-${column}`;
}

function createMatrix(rows, columns) {
    const matrix = [];
    for (let row = 0; row < rows; row++) {
        const rowArray = []
        for (let column = 0; column < columns; column++) {
            rowArray.push(0);
        }
        matrix.push(rowArray);
    }
    const listeners = [];
    let currentShift = 0;
    
    function getTranslatedValue(row, column) {
        return (matrix[row][column] >> currentShift) % 2;
    }

    return {
        addChangeListener: listener => listeners.push(listener),
        toggle: (row, column) => {
            const currentState = (matrix[row][column] >> currentShift) % 2;
            if (currentState == 1) {
                matrix[row][column] = matrix[row][column] - (1 << currentShift);
            } else {
                matrix[row][column] = matrix[row][column] + (1 << currentShift);
            }
            listeners.forEach(listener => listener(row, column, getTranslatedValue(row, column)))
        },
        changeShift: shift => currentShift = shift,
    }
}

window.onload = () => {
    let rows = 7;
    let columns = 5;
    let currentShift = 0;

    const maxHeight = 700;
    const spaceBetween = 0.1;
    
    
    
    // Matrix representation of the encoding
    const matrix = [];
    const matrixDrawing = document.getElementById('matrix-drawing');

    function toggleSquare(square, row, column) {
        const currentState = (matrix[row][column] >> currentShift) % 2;
        if (currentState == 1) {
            matrix[row][column] = matrix[row][column] - (1 << currentShift);
            square.classList.remove('active');
            
        } else {
            matrix[row][column] = matrix[row][column] + (1 << currentShift);
            square.classList.add('active');
        }
        updateListElement(row, column);
    } 
    
    function createRow(row) {
        const rowElement = document.createElement('div');
        rowElement.setAttribute('id', getRowId(row));
        rowElement.classList.add('row');
        return rowElement;
    }
    
    function createSquare(row, column) {
        const squareElement = document.createElement('div');
        squareElement.setAttribute('id', getSquareId(row, column));
        squareElement.classList.add('square');
        squareElement.addEventListener('click', () => toggleSquare(squareElement, row, column));
        const ratio = maxHeight / rows;
        squareElement.style = `width: ${ratio}px; height: ${ratio}px; margin: ${ratio * spaceBetween}px`
        return squareElement;
    }


    function redrawMatrix() {
        for (let row = 0; row < rows; row++) {
            for (let column = 0; column < columns; column++) {
                const square = document.getElementById(getSquareId(row,column));
                const currentState = (matrix[row][column] >> currentShift) % 2;
                if (currentState == 1) {
                    square.classList.add('active');
                }  else {
                    square.classList.remove('active');
                }
            }
        }
    }
    

    function redrwawMiniMatrix(number) {

    }
    
    // list representation of the encoding 
    const listRepresentationElement = document.getElementById('list-representation');

    function getListElementId(row, column) {
        return `list-element-${row}-${column}`;
    }

    function createListElement(row, column) {
        const label = document.createElement('label');
        const val = document.createElement('span');
        const listElement = document.createElement('div');
        listElement.setAttribute('id', getListElementId(row, column));
        listElement.classList.add('list-element');
        label.innerText = `${row} x ${column}: `;
        val.innerText = 0;

        listElement.appendChild(label);
        listElement.appendChild(val);
        return listElement;
    }

    function updateListElement(row, column) {
        document.getElementsByTagName
        document
            .getElementById(getListElementId(row,column))
            .getElementsByTagName('span')[0].innerText = matrix[row][column];
    }

    const availableShiftsElement = document.getElementById('available-shifts');

    
    function getShiftControlId(number) {
        return `shift-control-${number}`;
    }
    function createShiftControl(number) {
        const shiftControl = document.createElement('span');
        shiftControl.setAttribute('id', getShiftControlId(number));
        shiftControl.innerText = number;
        shiftControl.onclick = () => {
            document.getElementById(getShiftControlId(currentShift)).classList.remove('current');
            currentShift =  number;
            shiftControl.classList.add('current')
            redrawMatrix();
            redrwawMiniMatrix();
        };
        return shiftControl;
    }

    
    for(let number = 0; number < 10; number++) {
        availableShiftsElement.appendChild(createShiftControl(number));
    }

    document.getElementById(getShiftControlId(currentShift)).classList.add('current');
    
    for (let row = 0; row < rows; row++) {
        const rowArray = []
        const rowElement = createRow(row);
        for (let column = 0; column < columns; column++) {
            rowElement.appendChild(createSquare(row,column));
            rowArray.push(0);
            listRepresentationElement.appendChild(createListElement(row, column));
        }
        matrixDrawing.appendChild(rowElement);
        matrix.push(rowArray);
    }


}