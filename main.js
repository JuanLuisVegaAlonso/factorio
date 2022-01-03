// Configuration
// TODO change to customizable matrix

let rows = 7;
let columns = 5;
const maxHeight = 600;
const spaceBetween = 0.1;

function getRowId(row) {
    return `row-${row}`;
}

function getSquareId(row, column) {
    return `square-${row}-${column}`;
}

function getShiftControlId(number) {
    return `shift-control-${number}`;
}


function getListElementId(row, column) {
    return `list-element-${row}-${column}`;
}

function getMiniMatrixId(shift) {
    return `mini-matrix-${shift}`;
}

function getMiniSquareId(shift, row, column) {
    return `mini-square-${shift}-${row}-${column}`;
}
// Matrix closure
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

    function activate(row, column) {
        if (getTranslatedValue(row, column) !== 1) {
            matrix[row][column] = matrix[row][column] + (1 << currentShift);
        }
        
        
    }

    function deactivate(row, column) {
        if (getTranslatedValue(row, column) !== 0) {
            matrix[row][column] = matrix[row][column] - (1 << currentShift);
        }
    }

    function tellListeners() {
        listeners.forEach(listener => listener());
    }

    return {
        addChangeListener: listener => listeners.push(listener),
        toggle: (row, column) => {
            const currentState = (matrix[row][column] >> currentShift) % 2;
            if (currentState === 1) {
                deactivate(row, column)
            } else {
                activate(row, column);
            }
            tellListeners();
            
        },
        activate: (row, column) => {
            activate(row, column);
            tellListeners();
        },
        deactivate: (row, column) => {
            deactivate(row, column);
            tellListeners();
        },
        getRawValue: (row, column) => matrix[row][column],
        getTranslatedValue,
        changeShift: shift => {
            currentShift = shift;
            listeners.forEach(listener => listener())
        },
        getCurrentShift: () => currentShift,
        getShiftedMatrix: (shift) => {
            const shiftedMatrix = [];
            for (let row = 0; row < rows; row++) {
                const rowArray = []
                for (let column = 0; column < columns; column++) {  
                    rowArray.push((matrix[row][column] >> shift) % 2);
                }
                shiftedMatrix.push(rowArray);
            }
            return shiftedMatrix;
        }
    }
}




// DOM functions
function createRow(row) {
    const rowElement = document.createElement('div');
    rowElement.setAttribute('id', getRowId(row));
    rowElement.classList.add('row');
    return rowElement;
}

function createSquare(matrix, row, column) {
    const squareElement = document.createElement('div');
    squareElement.setAttribute('id', getSquareId(row, column));
    squareElement.classList.add('square');
    squareElement.addEventListener('click', () => matrix.toggle(row,column));
    const ratio = maxHeight / rows;
    squareElement.style = `width: ${ratio}px; height: ${ratio}px; margin: ${ratio * spaceBetween}px`
    return squareElement;
}


function createShiftControl(matrix, number) {
    const shiftControl = document.createElement('div');
    const shiftLabel = document.createElement('label');
    shiftControl.appendChild(shiftLabel);
    shiftControl.appendChild(createMiniMatrix(number))
    shiftControl.setAttribute('id', getShiftControlId(number));
    shiftLabel.innerText = number;
    shiftControl.onclick = () => {
        matrix.changeShift(number);
    };
    return shiftControl;
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

function createMiniMatrix(shift) {
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

// Update functions

function updateListElement(row, column, value) {
    document.getElementsByTagName
    document
        .getElementById(getListElementId(row,column))
        .getElementsByTagName('span')[0].innerText = value;
}

function redrawMatrix(matrix) {
    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            const square = document.getElementById(getSquareId(row,column));
            const currentState = matrix.getTranslatedValue(row, column);
            if (currentState == 1) {
                square.classList.add('active');
            }  else {
                square.classList.remove('active');
            }
        }
    }
}

function redrawMiniMatrix(matrix) {
    const currentMatrix = matrix.getShiftedMatrix(matrix.getCurrentShift());
    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            const miniSquare = document.getElementById(getMiniSquareId(matrix.getCurrentShift(), row, column));
            if (currentMatrix[row][column] === 0) {
                miniSquare.classList.remove('active');
            } else {
                miniSquare.classList.add('active');
            }
        }
    }
}


window.onload = () => {
    
    const matrix = createMatrix(rows, columns);

    // Shift control
    const availableShiftsElement = document.getElementById('available-shifts');
    for(let number = 0; number < 10; number++) {
        availableShiftsElement.appendChild(createShiftControl(matrix, number));
    }
    document.getElementById(getShiftControlId(matrix.getCurrentShift())).classList.add('current');


    // Matrix representation of the encoding
    const matrixDrawing = document.getElementById('matrix-drawing');
    const listRepresentationElement = document.getElementById('list-representation');
    for (let row = 0; row < rows; row++) {
        const rowElement = createRow(row);
        rowElement.classList.add('row')
        for (let column = 0; column < columns; column++) {
            rowElement.appendChild(createSquare(matrix, row,column));
            listRepresentationElement.appendChild(createListElement(row, column));
        }
        matrixDrawing.appendChild(rowElement);
    }

    // listener of changes
    matrix.addChangeListener(() => {
        for (let row = 0; row < rows; row++) {
            for (let column = 0; column < columns; column++) {
                const value = matrix.getRawValue(row, column);
                updateListElement(row, column, value)
            }
        }
        redrawMatrix(matrix);
        redrawMiniMatrix(matrix);
        document.getElementsByClassName('current')[0].classList.remove('current')
        document.getElementById(getShiftControlId(matrix.getCurrentShift())).classList.add('current');
    });


    let oldId;
    const ACTIVATE_MODE = 1;
    const DEACTIVATE_MODE = 2;

    let mouseMode;
    matrixDrawing.addEventListener('mousemove', event => {
        if (event.buttons != 1) return;
        const id = event.target.getAttribute('id');
        if (id.startsWith('square') && id !== oldId) {
            if (!mouseMode) {
                if (event.target.classList.contains('active')) {
                    mouseMode = DEACTIVATE_MODE;
                } else {
                    mouseMode = ACTIVATE_MODE;
                }
            }
            const rowColRegx = /square-([0-9])-([0-9])/g;
            const rowCol = rowColRegx.exec(id);
            if (mouseMode === ACTIVATE_MODE) {
                matrix.activate(rowCol[1],rowCol[2]);
            }
            if (mouseMode === DEACTIVATE_MODE) {
                matrix.deactivate(rowCol[1],rowCol[2]);
            }
            oldId = id;
        }
    });
    matrixDrawing.addEventListener('mouseup', () => {
        console.log('clean')
        mouseMode = undefined;
    })
    document.addEventListener('mousepressed', console.log)
    


    // Three.js
    THREE.Object3D.DefaultUp = new THREE.Vector3(0,0,1);
    const binaryRepresentationElement = document.getElementById('binary-representation');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xf0f0f0 );
    const camera = new THREE.PerspectiveCamera( 75, 500 / maxHeight, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(500, maxHeight);
    binaryRepresentationElement.appendChild( renderer.domElement );

    const axesHelper = new THREE.AxesHelper( 5 );
    scene.add( axesHelper );
    // geometry

    const geometry = new THREE.BoxGeometry(1,1,1);
    const inactiveMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, transparent: true, opacity: 0.1 } );
    const activeMaterial = new THREE.MeshBasicMaterial( { color: 0x0000FF, transparent: true, opacity: 0.2 } );
    
    
    const edges = new THREE.EdgesGeometry( geometry );
    const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) );

    const meshMatrix = [];
    for (let row = 0; row < rows; row++) {
        const meshRow = [];
        for (let column = 0; column < columns; column++) {
            meshColumn = [];
            for (let shift = 0; shift < 10; shift++){
                const cube = new THREE.Mesh( geometry, inactiveMaterial );
                const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
                cube.position.set(row, column, shift)
                line.position.set(row, column, shift)
                meshColumn.push({cube, line});
                scene.add(cube);
                //scene.add(line);
            }
            meshRow.push(meshColumn);
        }
        meshMatrix.push(meshRow)
    }

    camera.position.set( 10, 10, 15 );
    camera.lookAt( 0, 0, 0 );
    camera.rotateX(0);

    matrix.addChangeListener(() => {
        for (let shift = 0; shift < 10; shift++){
            const shiftedMatrix = matrix.getShiftedMatrix(shift);
            for (let row = 0; row < rows; row++) {
                for (let column = 0; column < columns; column++) {
                
                    if (shiftedMatrix[row][column] == 0) {
                        meshMatrix[row][column][shift].cube.material = inactiveMaterial;
                    } else {
                        meshMatrix[row][column][shift].cube.material = activeMaterial;
                    }
                }
            }
        }
    })
    // animation
    function animate() {
        requestAnimationFrame( animate );
        renderer.render( scene, camera );
    }
    animate();
}