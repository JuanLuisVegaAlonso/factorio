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

class RenderController {
    constructor(matrix, maxHeight) {
        THREE.Object3D.DefaultUp = new THREE.Vector3(0,0,1);
        this.matrix = matrix;
        this.binaryRepresentationElement = document.getElementById('binary-representation');
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera( -150, 150, 150, -150, 1, 1000 );
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.labelRenderer = new THREE.CSS3DRenderer({ antialias: true });
        this.maxHeight = maxHeight;
        this.cubeSize = 10;
        this.meshMatrix = [];
        this.cubes = new THREE.Group();
        this.anchor = new THREE.Object3D();
        this.animations = [];

        this.inactiveMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, transparent: true, depthTest: true, opacity: 0.011 } );
        this.activeMaterial = new THREE.MeshBasicMaterial( { color: 0x0000FF, transparent: true, depthTest: true, opacity: 0.2 } );
        this.nonTransparentInactiveMaterial = new THREE.MeshBasicMaterial( { color: 0xCAC9C9, transparent: false, opacity: 0.1 } );
        this.nonTransparentActiveMaterial = new THREE.MeshBasicMaterial( { color: 0x0000FF, transparent: false, opacity: 0.2 } );
        this.intersectedMaterial = new THREE.MeshBasicMaterial( { color: 0xFF00FF, transparent: false, opacity: 0.2 } );


        this.scene.background = new THREE.Color( 0xf0f0f0 );
        this.camera.position.set( 90, 80, 150 );
        this.camera.lookAt( 0, 0, 50 );
        this.renderer.setSize(900, this.maxHeight);
        this.controls.enableZoom = false;

        
        // animation
        
        this.selecting = false;
        this.selected = false;

        this.labelRenderer.setSize( 900, maxHeight );
        this.labelRenderer.domElement.style.position = 'absolute';
        this.labelRenderer.domElement.style.top = '0px';
        this.labelRenderer.domElement.style['pointer-events'] ='none';

        this.binaryRepresentationElement.appendChild(this.renderer.domElement);
        this.binaryRepresentationElement.appendChild(this.labelRenderer.domElement );
        this.binaryRepresentationElement.addEventListener('mousemove', event => this._onMouseMove(event));
        this.binaryRepresentationElement.addEventListener('click', event => this._onClick(event));
        this._buildCubes();

        this.matrix.addChangeListener(() => {
            this._updateMaterials();
        });

        

    
        this.scene.add(this.anchor);

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2(200,200);

        this._updateMaterials();
    }


    _onMouseMove( event ) {

        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        const {x,y, width, height} = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ( (event.clientX  -x ) /  width)  * 2 - 1;
        this.mouse.y = - (( event.clientY - y) /  height)  * 2 + 1;
    }


    _buildCubes() {
        const {rows, columns} = this.matrix;
        for (let row = 0; row < rows; row++) {
            const meshRow = [];
            for (let column = 0; column < columns; column++) {
                const meshColumn = [];
                for (let shift = 0; shift < 10; shift++){
                    const geometry = new THREE.BoxGeometry(this.cubeSize,this.cubeSize,this.cubeSize);
                    const cube = new THREE.Mesh( geometry, this.inactiveMaterial );
                    const edges = new THREE.EdgesGeometry( geometry );
                    const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000, transparent: true, opacity: 0.2 } ) );
                    cube.position.set(this.cubeSize * row + 1*row, this.cubeSize * column + 1 * column, this.cubeSize * shift + 1*shift);
                    cube.userData.row = row;
                    cube.userData.column = column;
                    line.position.set(this.cubeSize * row + 1*row, this.cubeSize* column + 1*column, this.cubeSize * shift + 1*shift);
                    this.cubes.add(cube);
                    
                    meshColumn.push({cube, line});
                    this.scene.add(line);
                }
                meshRow.push(meshColumn);
            }
            this.meshMatrix.push(meshRow)
        }
        this.scene.add(this.cubes);
    }

    _updateMaterials() {
        for (let shift = 0; shift < 10; shift++){
            const shiftedMatrix = this.matrix.getShiftedMatrix(shift);
            const {rows, columns} = this.matrix;
            for (let row = 0; row < rows; row++) {
                for (let column = 0; column < columns; column++) {
                    let material;

                    if (shift > this.matrix.getCurrentShift()) {
                        
                        if (shiftedMatrix[row][column] == 0) {
                           material = this.inactiveMaterial;
                        } else {
                           material = this.activeMaterial;
                        }
                    } else {
                        if (shiftedMatrix[row][column] == 0) {
                           material = this.nonTransparentInactiveMaterial;
                        } else {
                           material = this.nonTransparentActiveMaterial;
                        }
                    }
                    this.meshMatrix[row][column][shift].cube.material = material;
                }
            }
        }
    }
    _onClick(event) {
        if (this.selecting) {
            this.selected = true;
            const intersects = this.raycaster.intersectObjects( this.cubes.children);
            const {row, column} = intersects[0].object.userData;

            this.animations.push( new SelectionAnimation(this.meshMatrix, this.anchor, this.cubes,  row, column));
            this._updateMaterials();
        } else if (this.selected) {
            this.selected = false;
            this.animations[this.animations.length - 1].reverse();
        }

    }
    tick() {
        const {x,y,z} = this.camera.position;
        this.anchor.position.set(x,y,z);
        this.anchor.setRotationFromQuaternion(this.camera.quaternion);
        this.raycaster.setFromCamera( this.mouse, this.camera );

        // calculate objects intersecting the picking ray
        if (!this.selected) {
            const intersects = this.raycaster.intersectObjects( this.cubes.children);
            this._updateMaterials();
            if (intersects.length != 0) {
                this.selecting = true;
                const {row, column} = intersects[0].object.userData;
                for (let shift = 0; shift < 10; shift++){
                    this.meshMatrix[row][column][shift].cube.material = this.intersectedMaterial;
                    intersects[0].object.material = this.intersectedMaterial;
                }
            } else {
                this.selecting = false;
            }
        } else {
            this.selecting = false;
        }
        this.animations.forEach(animation => animation.tick());
        this.renderer.render( this.scene, this.camera );
        this.labelRenderer.render( this.scene, this.camera );
    }
}


class SelectionAnimation {
    constructor(meshMatrix, anchor, originalParent, row, column) {
        this.row = row;
        this.column = column;
        this.meshMatrix = meshMatrix;
        this.duration = 2;
        this.anchor = anchor;

        // TODO Fix this in the future
        this.cubeSize = 10;
        this.duration = 20;
        this.upDuration = this.duration /2;
        this.translationDuration = this.duration / 2;


        this.isFinished = false;
        this.reversed = false;

        this.clock = new THREE.Clock();
        this.originalParent = originalParent;

        this.paths = [];
        for (let shift = 0; shift < 10; shift++) {
            const minZ = (shift + 11) * this.cubeSize;
            const firstPosition = new THREE.Vector3(this.row * this.cubeSize, this.column * this.cubeSize, minZ);
            const curve = this._calculateCurve(this.row, this.column, shift);
            const reverseInitialPosition = this.meshMatrix[this.row][this.column][shift].cube.position.clone();
            this.paths.push({firstPosition, curve, reverseInitialPosition})
        }
    }

    
    _forward() {
        if (this.clock.getElapsedTime() < this.duration) {
            for (let shift = 0; shift < 10; shift++) {
                const {curve, firstPosition, reverseInitialPosition} = this.paths[shift];
                const cube = this.meshMatrix[this.row][this.column][shift].cube;
                if (this.clock.getElapsedTime() < this.upDuration) {
                    const alpha = this.clock.getElapsedTime() / this.upDuration ;
                    cube.position.copy(reverseInitialPosition.clone().lerp(firstPosition, alpha));
                } else {
                    const curvePos = (this.clock.getElapsedTime() - this.upDuration) / this.translationDuration ;
                    cube.position.copy(curve.getPoint(curvePos));
                    cube.quaternion.slerp(this.anchor.quaternion, curvePos);
                }
            }
        } else if (!this.isFinished) {
            for (let shift = 0; shift < 10; shift++) {
                const quaternion = new THREE.Quaternion();
                quaternion.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), Math.PI / 2 );
                this.meshMatrix[this.row][this.column][shift].cube.setRotationFromQuaternion(quaternion);
                this.meshMatrix[this.row][this.column][shift].cube.position.copy(this.anchor.worldToLocal(this.meshMatrix[this.row][this.column][shift].cube.position))
                this.anchor.add(this.meshMatrix[this.row][this.column][shift].cube);
            }
            this.isFinished = true;
        }
    }

    _backwards() {
        if (this.clock.getElapsedTime() < this.duration) {
            for (let shift = 0; shift < 10; shift++) {
                const {curve, reverseInitialPosition} = this.paths[shift];
                const cube = this.meshMatrix[this.row][this.column][shift].cube;
                if (this.clock.getElapsedTime() < this.translationDuration) {
                    const curvePos = 1 - ((this.clock.getElapsedTime()) / this.translationDuration);
                    cube.position.copy(curve.getPoint(curvePos));
                    cube.quaternion.slerp(this.originalParent.quaternion, curvePos);
                } else {
                    const alpha = (this.clock.getElapsedTime() - this.translationDuration) / (this.upDuration  );
                    cube.position.lerp(reverseInitialPosition, alpha);
                    
                }
            }
        } else if (!this.isFinished) {
            for (let shift = 0; shift < 10; shift++) {
                this.originalParent.add(this.meshMatrix[this.row][this.column][shift].cube);
            }
            this.isFinished = true;
        }
    }

    tick() {
        if (!this.reversed) {
            this._forward();
        } else {
            this._backwards();
        }
    }
    reverse() {
        this.reversed = true;
        this.clock = new THREE.Clock();
        for (let shift = 0; shift < 10; shift++) {
            this.meshMatrix[this.row][this.column][shift].cube.position.copy(this.originalParent.worldToLocal(this.meshMatrix[this.row][this.column][shift].cube.position))
            this.originalParent.add(this.meshMatrix[this.row][this.column][shift].cube);
        }
    }
    _calculateCurve(row, column, shift) {
            const minZ = (shift + 11) * 10;
            const initialPoint = new THREE.Vector3(row * this.cubeSize, column * this.cubeSize, minZ)
            const direction = new THREE.Vector3();
            direction.add(this.anchor.position);
            direction.sub(initialPoint);
            const firstPoint = direction.clone();
            firstPoint.setZ(0);
            firstPoint.clampLength((Math.max(rows,columns) + 1) * this.cubeSize,(Math.max(rows,columns) + 1) * this.cubeSize  );
            firstPoint.setZ(minZ);
            const secondPoint = this.anchor.position.clone();
            const secondPointDistance = this.anchor.position.length() - 10;
            secondPoint.clampLength(secondPointDistance, secondPointDistance);
    
            const finalPoint = this.anchor.localToWorld(new THREE.Vector3(-15 * shift + 90, -90, -10));
    
    
            return new THREE.CubicBezierCurve3(
                initialPoint,
                firstPoint,
                secondPoint,
                finalPoint
            );
        }
}

window.onload = () => {
    
    const matrix = new Matrix(rows, columns);
    const matrixController = new MatrixController(matrix);
    matrixController.init();
    const renderController = new RenderController(matrix, maxHeight)

    // Scene for debugging

    const debuggingWidth = 300;
    const debuggingHeight = 300;
    const debuggingCamera = new THREE.OrthographicCamera( -100, 100, 100, -100, 1, 10000 );
    debuggingCamera.position.set( -300, 900, 950 );
    debuggingCamera.lookAt(50,50,50);
    const debuggingRenderer = new THREE.WebGLRenderer({ antialias: true });
    debuggingRenderer.setSize(debuggingWidth, debuggingHeight);
    document.getElementById('binary-representation').appendChild(debuggingRenderer.domElement);

    

    function animate() {
        requestAnimationFrame( animate );
        renderController.tick();

        
        // debugging
        debuggingRenderer.render(renderController.scene, debuggingCamera);
    }
    animate();
}