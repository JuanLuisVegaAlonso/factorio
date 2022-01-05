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


class Matrix {   
    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;
        this.matrix = [];
        for (let row = 0; row < this.rows; row++) {
            const rowArray = []
            for (let column = 0; column < this.columns; column++) {
                rowArray.push(0);
            }
            this.matrix.push(rowArray);
        }
        this.listeners = [];
        this.currentShift = 0;
    }

    

    _activate(row, column) {

        if (this.getTranslatedValue(row, column) !== 1) {
            this.matrix[row][column] = this.matrix[row][column] + (1 << this.currentShift);
        }
    }
    
    _deactivate(row, column) {
        if (this.getTranslatedValue(row, column) !== 0) {
            this.matrix[row][column] = this.matrix[row][column] - (1 << this.currentShift);
        }
    }

    getTranslatedValue(row, column) {
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

    changeShift(shift) {
        this.currentShift = shift;
        this.listeners.forEach(listener => listener())
    }

    getCurrentShift() {
        return this.currentShift;
    }
    getShiftedMatrix(shift) {
        const shiftedMatrix = [];
        for (let row = 0; row < this.rows; row++) {
            const rowArray = []
            for (let column = 0; column < this.columns; column++) {  
                rowArray.push((this.matrix[row][column] >> shift) % 2);
            }
            shiftedMatrix.push(rowArray);
        }
        return shiftedMatrix;
    }
}
class MatrixController {
    constructor(matrix) {
        this.matrix = matrix;
        this.matrixDrawing = undefined;

        this.oldId;
        this.ACTIVATE_MODE = 1;
        this.DEACTIVATE_MODE = 2;
        this.mouseMode;
    }

    _createRow(row) {
        const rowElement = document.createElement('div');
        rowElement.setAttribute('id', getRowId(row));
        rowElement.classList.add('row');
        return rowElement;
    }

    _createSquare(row, column) {
        const squareElement = document.createElement('div');
        squareElement.setAttribute('id', getSquareId(row, column));
        squareElement.classList.add('square');
        const ratio = maxHeight / rows;
        squareElement.style = `width: ${ratio}px; height: ${ratio}px; margin: ${ratio * spaceBetween}px`;
        const labelElement = document.createElement('label');
        labelElement.innerText = 0;
        squareElement.appendChild(labelElement);
        this.matrix.addChangeListener(() => labelElement.innerText = this.matrix.getRawValue(row, column))
        return squareElement;
    }

    _createShiftControl(number) {
        const shiftControl = document.createElement('div');
        const shiftLabel = document.createElement('label');
        shiftControl.appendChild(shiftLabel);
        shiftControl.appendChild(this._createMiniMatrix(number))
        shiftControl.setAttribute('id', getShiftControlId(number));
        shiftLabel.innerText = number;
        shiftControl.onclick = () => {
            this.matrix.changeShift(number);
        };
        return shiftControl;
    }

    _createMiniMatrix(shift) {
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
                    square.classList.add('active');
                }  else {
                    square.classList.remove('active');
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
                    miniSquare.classList.remove('active');
                } else {
                    miniSquare.classList.add('active');
                }
            }
        }
    }
    createAllShiftControls() {
        const availableShiftsElement = document.getElementById('available-shifts');
        for(let number = 0; number < 10; number++) {
            availableShiftsElement.appendChild(this._createShiftControl(number));
        }
        document.getElementById(getShiftControlId(this.matrix.getCurrentShift())).classList.add('current');
    }

    createMatrix() {
        const matrixDrawing = document.getElementById('matrix-drawing');
        for (let row = 0; row < rows; row++) {
            const rowElement = this._createRow(row);
            rowElement.classList.add('row')
            for (let column = 0; column < columns; column++) {
                rowElement.appendChild(this._createSquare(row,column));
            }
        matrixDrawing.appendChild(rowElement);
        }
        this.matrixDrawing = matrixDrawing;

    }

    _handleDrawing(event) {
        if (event.type !== 'click' && event.buttons != 1 ) return;
         const id = event.target.getAttribute('id');
         if (event.target.tagName === 'DIV' && id.startsWith('square') && id !== this.oldId) {
             if (!this.mouseMode) {
                 if (event.target.classList.contains('active')) {
                     this.mouseMode = this.DEACTIVATE_MODE;
                 } else {
                     this.mouseMode = this.ACTIVATE_MODE;
                 }
             }
             const rowColRegx = /square-([0-9])-([0-9])/g;
             const rowCol = rowColRegx.exec(id);
             if (this.mouseMode === this.ACTIVATE_MODE) {
                 this.matrix.activate(rowCol[1],rowCol[2]);
             }
             if (this.mouseMode === this.DEACTIVATE_MODE) {
                this.matrix.deactivate(rowCol[1],rowCol[2]);
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
            document.getElementById(getShiftControlId(this.matrix.getCurrentShift())).classList.add('current');
        });
    
        
        this.matrixDrawing.addEventListener('mousemove', (event) => this._handleDrawing(event));
        this.matrixDrawing.addEventListener('mousedown', (event) => this._handleDrawing(event));
        this.matrixDrawing.addEventListener('mouseup', () => {
            this.oldId = undefined;
            this.mouseMode = undefined;
        })
    }
}

window.onload = () => {
    
    const matrix = new Matrix(rows, columns);
    const matrixController = new MatrixController(matrix);
    matrixController.init();

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
    const anchor = new THREE.Object3D();

    
    scene.add(anchor);

    function calculateCurve(row, column, camera, shift) {
        const minZ = (shift + 11) * 10;
        const initialPoint = new THREE.Vector3(row * cubeSize, column * cubeSize, minZ)
        const direction = new THREE.Vector3();
        direction.add(camera.position);
        direction.sub(initialPoint);
        const firstPoint = direction.clone();
        firstPoint.setZ(0);
        firstPoint.clampLength((Math.max(rows,columns) + 1) * cubeSize,(Math.max(rows,columns) + 1) * cubeSize  );
        firstPoint.setZ(minZ);
        const secondPoint = camera.position.clone();
        const secondPointDistance = camera.position.length() - 10;
        secondPoint.clampLength(secondPointDistance, secondPointDistance);

        const finalPoint = camera.localToWorld(new THREE.Vector3(-15 * shift + 90, -90, -10));


        return new THREE.CubicBezierCurve3(
            initialPoint,
            firstPoint,
            secondPoint,
            finalPoint
        );
    }


    function selectionAnimation(row, col) {
        const duration = 2;

        const upDuration = duration /2;
        const translationDuration = duration / 2;


        let isFinished = false;
        let reversed = false;

        let clock = new THREE.Clock();

        const paths = [];
        for (let shift = 0; shift < 10; shift++) {
            const minZ = (shift + 11) * cubeSize;
            const firstPosition = new THREE.Vector3(row * cubeSize, col * cubeSize, minZ);
            const curve = calculateCurve(row, col, camera, shift);
            const reverseInitialPosition = meshMatrix[row][col][shift].cube.position.clone();
            paths.push({firstPosition, curve, reverseInitialPosition})

        }


        function forward() {
            if (clock.getElapsedTime() < duration) {
                for (let shift = 0; shift < 10; shift++) {
                    const {curve, firstPosition} = paths[shift];
                    const cube = meshMatrix[row][col][shift].cube;
                    if (clock.getElapsedTime() < upDuration) {
                        const alpha = clock.getElapsedTime() / upDuration ;
                        cube.position.lerp(firstPosition, alpha);
                    } else {
                        const curvePos = (clock.getElapsedTime() - upDuration) / translationDuration ;
                        cube.position.copy(curve.getPoint(curvePos));
                    }
                }
            } else if (!isFinished) {
                for (let shift = 0; shift < 10; shift++) {
                    // meshMatrix[row][col][shift].cube.setRotationFromQuaternion(camera.quaternion);
                    meshMatrix[row][col][shift].cube.position.copy(anchor.worldToLocal(meshMatrix[row][col][shift].cube.position))
                    anchor.add(meshMatrix[row][col][shift].cube);
                }
                isFinished = true;
            }
        }

        function backwards() {
            if (clock.getElapsedTime() < duration) {
                for (let shift = 0; shift < 10; shift++) {
                    const {curve, reverseInitialPosition} = paths[shift];
                    const cube = meshMatrix[row][col][shift].cube;
                    if (clock.getElapsedTime() < translationDuration) {
                        const curvePos = 1 - ((clock.getElapsedTime()) / translationDuration);
                        cube.position.copy(curve.getPoint(curvePos));
                    } else {
                        const alpha = (clock.getElapsedTime() - translationDuration) / (upDuration  );
                        cube.position.lerp(reverseInitialPosition, alpha);
                    }
                }
            } else if (!isFinished) {
                for (let shift = 0; shift < 10; shift++) {
                    // meshMatrix[row][col][shift].cube.setRotationFromQuaternion(camera.quaternion);
                    meshMatrix[row][col][shift].cube.position.copy(anchor.worldToLocal(meshMatrix[row][col][shift].cube.position))
                    cubes.add(meshMatrix[row][col][shift].cube);
                }
                isFinished = true;
            }
        }

        function tick() {
            if (!reversed) {
                forward();
            } else {
                backwards();
            }

        }

        function reverse() {
            reversed = true;
            clock = new THREE.Clock();
            for (let shift = 0; shift < 10; shift++) {
                // meshMatrix[row][col][shift].cube.setRotationFromQuaternion(camera.quaternion);
                meshMatrix[row][col][shift].cube.position.copy(scene.worldToLocal(meshMatrix[row][col][shift].cube.position))
                cubes.add(meshMatrix[row][col][shift].cube);
            }
        }
        return {tick, reverse}

    }

    let animation;
   
    function onClick(event) {
        if (selecting) {
            selected = true;
            const intersects = raycaster.intersectObjects( cubes.children);
            const {row, column} = intersects[0].object.userData;

            animation = selectionAnimation(row, column);
            updateMaterials();
        } else if (selected) {
            selected = false;
            animation.reverse();
        }
    }

    

    binaryRepresentationElement.addEventListener('mousemove', onMouseMove);
    binaryRepresentationElement.addEventListener('click', onClick);
    // animation
    updateMaterials();
    let selecting = false;
    let selected = false;
    

    // Scene for debugging

    const debuggingWidth = 300;
    const debuggingHeight = 300;
    const debuggingCamera = new THREE.OrthographicCamera( -100, 100, 100, -100, 1, 10000 );
    debuggingCamera.position.set( -300, 900, 950 );
    debuggingCamera.lookAt(50,50,50);
    const debuggingRenderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(debuggingWidth, debuggingHeight);
    binaryRepresentationElement.appendChild(debuggingRenderer.domElement);

    

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
        if (animation) {
            animation.tick();
        }
        renderer.render( scene, camera );
        labelRenderer.render( scene, camera );   

        
        // debugging
        debuggingRenderer.render(scene, debuggingCamera);
    }
    animate();
}