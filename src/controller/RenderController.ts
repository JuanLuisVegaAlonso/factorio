import { BoxGeometry, Color, EdgesGeometry, Group, LineBasicMaterial, LineSegments,  Mesh, MeshBasicMaterial, Object3D, OrthographicCamera, Raycaster, Scene, Vector2, Vector3, WebGLRenderer } from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {CSS3DObject, CSS3DRenderer} from 'three/examples/jsm/renderers/CSS3DRenderer';
import { AlternativeSelectionAnimation } from '../animation/AlternativeSelectionAnimation';
import { Animation } from '../animation/animation';
import { Matrix, MatrixEvents } from '../data/matrix';

export class RenderController {
    private binaryRepresentationElement: HTMLElement;
    private scene: Scene;
    private camera: OrthographicCamera;
    private renderer: WebGLRenderer;
    private controls: any;
    private labelRenderer: CSS3DRenderer;
    private cubeSize: number;
    private meshMatrix: {cube: Mesh, line: Mesh}[][][];
    private cubes: Group;
    private anchor: Object3D;
    private animations: Animation[];
    private inactiveMaterial: MeshBasicMaterial;
    private activeMaterial: MeshBasicMaterial;
    private nonTransparentInactiveMaterial: MeshBasicMaterial;
    private nonTransparentActiveMaterial: MeshBasicMaterial;
    private intersectedMaterial: MeshBasicMaterial;
    private labels: CSS3DObject[] = [];

    private selecting: boolean;
    private selected: boolean;

    private raycaster: Raycaster;
    private mouse: Vector2;
    private lines: Group;
    private testAnimation: Animation;


    constructor(public matrix: Matrix,public maxHeight) {
        Object3D.DefaultUp = new Vector3(0,0,1);
        this.cubeSize = 10;
        this.binaryRepresentationElement = document.getElementById('binary-representation')!;
        this.scene = new Scene();
        const offset = 160;
        const frustrum = (this.cubeSize * this.matrix.rows + offset)/ 2 
        this.camera = new OrthographicCamera( frustrum * -1, frustrum , frustrum , frustrum * - 1 , .1, 1000 );
        this.renderer = new WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        this.labelRenderer = new CSS3DRenderer();
        this.maxHeight = maxHeight;
        
        this.meshMatrix = [];
        this.lines = new Group();
        this.cubes = new Group();
        this.anchor = new Object3D();
        this.animations = [];
        const reverseCamera = this.camera.position.clone().multiplyScalar(-1);
        for (let i = 0; i < 10; i++) {
            const elem = document.createElement('span');
            elem.classList.add("exponential-label")
            elem.innerHTML = `}2<sup>${i}</sup>`;
            const object = new CSS3DObject(elem);
            this.labels.push(object);
            this.scene.add(object)
            //object.position.set(this.cubeSize * (matrix.rows + 1) + 10, this.cubeSize * (matrix.columns + 1) + 10, this.cubeSize * (i));
            object.position.set(-10, (this.cubeSize *1.5 + 1) * (matrix.columns), (this.cubeSize + 1.2)* (i));
            object.lookAt(reverseCamera)
        }

        this.inactiveMaterial = new MeshBasicMaterial( { color: 0x1e1e1f, transparent: true, depthTest: true, opacity: 0.11 } );
        this.activeMaterial = new MeshBasicMaterial( { color: 0xf8f8f8, transparent: true, depthTest: true, opacity: 0.2 } );
        this.nonTransparentInactiveMaterial = new MeshBasicMaterial( { color: 0x1e1e1f, transparent: false, opacity: 0.1 } );
        this.nonTransparentActiveMaterial = new MeshBasicMaterial( { color: 0xf8f8f8, transparent: false, opacity: 0.2 } );
        this.intersectedMaterial = new MeshBasicMaterial( { color: 0xe39827, transparent: false, opacity: 0.2 } );


        this.scene.background = new Color( 0x313031 );
        this.camera.position.set( (this.cubeSize * this.matrix.rows + offset) * 2 , this.cubeSize * this.matrix.columns + offset , this.matrix.maxShifts * this.cubeSize + offset);
        this.camera.lookAt( 0, 0, 50 );
        this.camera.updateMatrixWorld()
        this.renderer.setSize(900, this.maxHeight);
        

        
        // animation
        
        this.selecting = false;
        this.selected = false;

        this.labelRenderer.setSize( 900, this.maxHeight );
        this.labelRenderer.domElement.style.position = 'absolute';
        this.labelRenderer.domElement.style.top = '0px';
        this.labelRenderer.domElement.style['pointer-events'] ='none';

        this.binaryRepresentationElement.appendChild(this.renderer.domElement);
        this.binaryRepresentationElement.appendChild(this.labelRenderer.domElement );
        this.binaryRepresentationElement.addEventListener('mousemove', event => this.onMouseMove(event));
        this.binaryRepresentationElement.addEventListener('mousedown', () => this.onClick());
        this.buildCubes();

        this.matrix.addChangeListener((eventType?: MatrixEvents) => {
            if (eventType && eventType === MatrixEvents.SIZE_CHANGED) {
                this.buildCubes();
                this.labels.forEach((object,i) => object.position.set(-this.cubeSize, (this.cubeSize *1.5 + 1) * (matrix.columns) , (this.cubeSize + 1)* (i)))
            }
            this.updateMaterials();
        });

        this.scene.add(this.anchor);

        this.raycaster = new Raycaster();
        this.mouse = new Vector2(200,200);

        this.updateMaterials();
    }


    private onMouseMove( event ) {

        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        const {x,y, width, height} = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ( (event.clientX  -x ) /  width)  * 2 - 1;
        this.mouse.y = - (( event.clientY - y) /  height)  * 2 + 1;
    }


    private buildCubes() {
        const {rows, columns} = this.matrix;
        this.scene.remove(this.cubes);
        this.scene.remove(this.lines);
        this.cubes = new Group();
        this.lines = new Group();
        this.meshMatrix = [];
        for (let row = 0; row < rows; row++) {
            const meshRow = [] as any[];
            for (let column = 0; column < columns; column++) {
                const meshColumn = [] as any[];
                for (let shift = 0; shift < 10; shift++){
                    const geometry = new BoxGeometry(this.cubeSize,this.cubeSize,this.cubeSize);
                    const cube = new Mesh( geometry, this.inactiveMaterial );
                    const edges = new EdgesGeometry( geometry );
                    const line = new LineSegments( edges, new LineBasicMaterial( { color: 0x000000, transparent: true, opacity: 0.2 } ) );
                    cube.position.set(this.cubeSize * row + 1*row, this.cubeSize * column + 1 * column, this.cubeSize * shift + 1*shift);
                    cube.userData.row = row;
                    cube.userData.column = column;
                    line.position.set(this.cubeSize * row + 1*row, this.cubeSize* column + 1*column, this.cubeSize * shift + 1*shift);
                    this.cubes.add(cube);
                    
                    meshColumn.push({cube, line});
                    this.lines.add(line);
                }
                meshRow.push(meshColumn);
            }
            this.meshMatrix.push(meshRow)
        }
        this.scene.add(this.lines);
        this.scene.add(this.cubes);
    }

    private updateMaterials() {
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
    private onClick() {
        if (this.selecting) {
            this.selected = true;
            const intersects = this.raycaster.intersectObjects( this.cubes.children);
            const {row, column} = intersects[0].object.userData;
            const cubeConga = this.meshMatrix[row][column].map(a => a.cube)
            cubeConga.forEach((cubeMesh, i) => this.animations.push(new AlternativeSelectionAnimation(
                .5,
                cubeMesh.position,
                this.camera,
                this.cubes,
                this.cubes,
                cubeMesh,
                new Vector3(0,0,1),
                200,
                i
                )
            ))
            console.log(this.animations)
            //this.animations.push( new SelectionAnimation(this.meshMatrix, this.anchor, this.cubes,  row, column));
            this.updateMaterials();
        } else if (this.selected) {
            this.selected = false;
            this.animations.filter(a => !a.reversing).forEach(a => a.reverse())
        }

    }
    tick() {
        const {x,y,z} = this.camera.position;
        this.anchor.position.set(x,y,z);
        this.anchor.setRotationFromQuaternion(this.camera.quaternion);
        this.raycaster.setFromCamera( this.mouse, this.camera );

        for (const label of this.labels) {
            label.lookAt(this.camera.position.x, this.camera.position.y, label.position.z);
        }
        if(this.testAnimation) {
            this.testAnimation.tick();
            this.cubes.children[0].position.copy(this.testAnimation.position);
        }

        // calculate objects intersecting the picking ray
        if (!this.selected) {
            const intersects = this.raycaster.intersectObjects( this.cubes.children);
            this.updateMaterials();
            if (intersects.length != 0) {
                this.selecting = true;
                const {row, column} = intersects[0].object.userData;
                for (let shift = 0; shift < 10; shift++){
                    this.meshMatrix[row][column][shift].cube.material = this.intersectedMaterial;
                    (intersects[0].object as any).material = this.intersectedMaterial;
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