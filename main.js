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
    const ratio = maxHeight / rows;
    squareElement.style = `width: ${ratio}px; height: ${ratio}px; margin: ${ratio * spaceBetween}px`;
    const labelElement = document.createElement('label');
    labelElement.innerText = 0;
    squareElement.appendChild(labelElement);
    matrix.addChangeListener(() => labelElement.innerText = matrix.getRawValue(row, column))
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
    for (let row = 0; row < rows; row++) {
        const rowElement = createRow(row);
        rowElement.classList.add('row')
        for (let column = 0; column < columns; column++) {
            rowElement.appendChild(createSquare(matrix, row,column));
        }
        matrixDrawing.appendChild(rowElement);
    }

    // listener of changes
    matrix.addChangeListener(() => {
        redrawMatrix(matrix);
        redrawMiniMatrix(matrix);
        document.getElementsByClassName('current')[0].classList.remove('current')
        document.getElementById(getShiftControlId(matrix.getCurrentShift())).classList.add('current');
    });


    let oldId;
    const ACTIVATE_MODE = 1;
    const DEACTIVATE_MODE = 2;

    let mouseMode;
    function handleDrawing(event) {
       if (event.type !== 'click' && event.buttons != 1 ) return;
        const id = event.target.getAttribute('id');
        if (event.target.tagName === 'DIV' && id.startsWith('square') && id !== oldId) {
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
    }
    matrixDrawing.addEventListener('mousemove', handleDrawing);
    matrixDrawing.addEventListener('mousedown', handleDrawing);
    matrixDrawing.addEventListener('mouseup', () => {
        oldId = undefined;
        mouseMode = undefined;
    })
    


    // Three.js
    THREE.Object3D.DefaultUp = new THREE.Vector3(0,0,1);
    const binaryRepresentationElement = document.getElementById('binary-representation');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xf0f0f0 );
    const camera = new THREE.OrthographicCamera( -100, 100, 100, -100, 1, 1000 );
    
    
    camera.position.set( 90, 80, 150 );
    camera.lookAt( 0, 0, 50 );

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(900, maxHeight);
    binaryRepresentationElement.appendChild( renderer.domElement );

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    labelRenderer = new THREE.CSS3DRenderer({ antialias: true });
    labelRenderer.setSize( 900, maxHeight );
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    labelRenderer.domElement.style['pointer-events'] ='none'
    binaryRepresentationElement.appendChild( labelRenderer.domElement );

    const axesHelper = new THREE.AxesHelper( 5 );
    scene.add( axesHelper );
    // geometry

    const cubeSize = 10;
    
    const inactiveMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, transparent: true, depthTest: true, opacity: 0.011 } );
    const activeMaterial = new THREE.MeshBasicMaterial( { color: 0x0000FF, transparent: true, depthTest: true, opacity: 0.2 } );
    const nonTransparentInactiveMaterial = new THREE.MeshBasicMaterial( { color: 0xCAC9C9, transparent: false, opacity: 0.1 } );
    const nonTransparentActiveMaterial = new THREE.MeshBasicMaterial( { color: 0x0000FF, transparent: false, opacity: 0.2 } );
    const intersectedMaterial = new THREE.MeshBasicMaterial( { color: 0xFF00FF, transparent: false, opacity: 0.2 } );
    
    
    const meshMatrix = [];
    const cubes = new THREE.Group();
    
    for (let row = 0; row < rows; row++) {
        const meshRow = [];
        for (let column = 0; column < columns; column++) {
            meshColumn = [];
            for (let shift = 0; shift < 10; shift++){
                const geometry = new THREE.BoxGeometry(cubeSize,cubeSize,cubeSize);
                const cube = new THREE.Mesh( geometry, inactiveMaterial );
                const edges = new THREE.EdgesGeometry( geometry );
                const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000, transparent: true, opacity: 0.2 } ) );
                // if (column === columns - 1 && row === 0) {
                //     const shiftDiv = document.createElement( 'div' );
                //     shiftDiv.className = 'shift';
                //     shiftDiv.textContent = `2^${shift}: ${2 << shift}`;
                //     shiftDiv.style.fontSize = '6px';
                //     const shiftLabel = new THREE.CSS3DObject( shiftDiv );
                //     shiftLabel.position.set( 0, 20, -5 );
                //     shiftLabel.lookAt(camera.position)
                //     shiftLabel.rotateOnWorldAxis(new THREE.Vector3(0,0,1), Math.PI/2)
                //     cube.add( shiftLabel );
                    
                // }
                
                cube.position.set(cubeSize * row + 1*row, cubeSize* column + 1*column, cubeSize * shift + 1*shift);
                cube.userData.row = row;
                cube.userData.column = column;
                line.position.set(cubeSize * row + 1*row, cubeSize* column + 1*column, cubeSize * shift + 1*shift);
                cubes.add(cube);
                
                meshColumn.push({cube, line});
                scene.add(line);
            }
            meshRow.push(meshColumn);
        }
        meshMatrix.push(meshRow)
    }
    scene.add(cubes);
    

    function updateMaterials() {
            for (let shift = 0; shift < 10; shift++){
                const shiftedMatrix = matrix.getShiftedMatrix(shift);
                for (let row = 0; row < rows; row++) {
                    for (let column = 0; column < columns; column++) {
                        let material;

                        if (shift > matrix.getCurrentShift()) {
                            
                            if (shiftedMatrix[row][column] == 0) {
                                material = inactiveMaterial;
                            } else {
                               material = activeMaterial;
                            }
                        } else {
                            if (shiftedMatrix[row][column] == 0) {
                               material = nonTransparentInactiveMaterial;
                            } else {
                               material = nonTransparentActiveMaterial;
                            }
                        }
                        meshMatrix[row][column][shift].cube.material = material;
                    }
                }
            }
    }
    matrix.addChangeListener(() => {
        updateMaterials();
    })

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(200,200);

    function onMouseMove( event ) {

        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        const {x,y, width, height} = renderer.domElement.getBoundingClientRect();
        mouse.x = ( (event.clientX  -x ) /  width)  * 2 - 1;
        mouse.y = - (( event.clientY - y) /  height)  * 2 + 1;


    }
    const cubesVisual = new THREE.Group();
    const anchor = new THREE.Object3D();
    anchor.add(cubesVisual);
    for (let shift = 0; shift < 10; shift++){
        const geometry = new THREE.BoxGeometry(cubeSize,cubeSize,cubeSize);
        const cube = new THREE.Mesh( geometry, inactiveMaterial );
        // if (column === columns - 1 && row === 0) {
        //     const shiftDiv = document.createElement( 'div' );
        //     shiftDiv.className = 'shift';
        //     shiftDiv.textContent = `2^${shift}: ${2 << shift}`;
        //     shiftDiv.style.fontSize = '6px';
        //     const shiftLabel = new THREE.CSS3DObject( shiftDiv );
        //     shiftLabel.position.set( 0, 20, -5 );
        //     shiftLabel.lookAt(camera.position)
        //     shiftLabel.rotateOnWorldAxis(new THREE.Vector3(0,0,1), Math.PI/2)
        //     cube.add( shiftLabel );
            
        // }
        const {x,y,z} = new THREE.Vector3(-15 * shift + 90, -90, -10);
        
        cube.position.set(x,y,z);
        cube.lookAt(x +10,y,z)
        cubesVisual.add(cube);
        
    }


    
    scene.add(anchor);
   
    function onClick(event) {
        if (selecting) {
            selected = true;
            const intersects = raycaster.intersectObjects( cubes.children);
            const {row, column} = intersects[0].object.userData;
            const rawValue = matrix.getRawValue(row,column);
            renderer.render( scene, camera );
            labelRenderer.render( scene, camera );  
            for (let shift = 0; shift < 10; shift++){
                
                if (rawValue >> shift & 1) {
                    material = nonTransparentActiveMaterial
                 } else {
                    material = nonTransparentInactiveMaterial;
                 }
                cubesVisual.children[shift].material = material;
            }
            updateMaterials();
        } else if (selected) selected = false;
    }

    binaryRepresentationElement.addEventListener('mousemove', onMouseMove);
    binaryRepresentationElement.addEventListener('click', onClick);
    // animation
    updateMaterials();
    let selecting = false;
    let selected = false;
    
    function animate() {
        requestAnimationFrame( animate );

        controls.update();
        const {x,y,z} = camera.position;
        anchor.position.set(x,y,z);
        anchor.setRotationFromQuaternion(camera.quaternion);
        raycaster.setFromCamera( mouse, camera );

        // calculate objects intersecting the picking ray
        if (!selected) {
            const intersects = raycaster.intersectObjects( cubes.children);
            updateMaterials();
            if (intersects.length != 0) {
                selecting = true;
                const {row, column} = intersects[0].object.userData;
                for (let shift = 0; shift < 10; shift++){
                    meshMatrix[row][column][shift].cube.material = intersectedMaterial;
                    intersects[0].object.material = intersectedMaterial;
                }
            } else {
                selecting = false;
            }
        } else {
            selecting = false;
        }
        renderer.render( scene, camera );
        labelRenderer.render( scene, camera );    
    }
    animate();
}