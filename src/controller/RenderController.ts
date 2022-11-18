import { BoxGeometry, Color, EdgesGeometry, Group, LineBasicMaterial, LineSegments,  Mesh, MeshBasicMaterial, Object3D, OrthographicCamera, Raycaster, Scene, Vector2, Vector3, WebGLRenderer } from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {CSS3DObject, CSS3DRenderer} from 'three/examples/jsm/renderers/CSS3DRenderer';
import { SelectionAnimation } from '../animation/selectionAnimation';
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
    private animations: SelectionAnimation[];
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


    constructor(public matrix: Matrix,public maxHeight) {
        Object3D.DefaultUp = new Vector3(0,0,1);
        this.binaryRepresentationElement = document.getElementById('binary-representation')!;
        this.scene = new Scene();
        this.camera = new OrthographicCamera( -150, 150, 150, -150, 1, 1000 );
        this.renderer = new WebGLRenderer({ antialias: true });
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.labelRenderer = new CSS3DRenderer();
        this.maxHeight = maxHeight;
        this.cubeSize = 10;
        this.meshMatrix = [];
        this.lines = new Group();
        this.cubes = new Group();
        this.anchor = new Object3D();
        this.animations = [];

        const reverseCamera = this.camera.position.clone().multiplyScalar(-1);
        for (let i = 0; i < 10; i++) {
            const elem = document.createElement('span');
            elem.classList.add("exponential-label")
            elem.innerHTML = `2<sup>${i}</sup>`;
            const object = new CSS3DObject(elem);
            this.labels.push(object);
            this.scene.add(object)
            object.position.set(this.cubeSize * (matrix.rows + 1) + 10, this.cubeSize * matrix.columns + 10, this.cubeSize * (i));
            object.lookAt(reverseCamera)
        }

        this.inactiveMaterial = new MeshBasicMaterial( { color: 0x000000, transparent: true, depthTest: true, opacity: 0.011 } );
        this.activeMaterial = new MeshBasicMaterial( { color: 0x4c4c5f, transparent: true, depthTest: true, opacity: 0.2 } );
        this.nonTransparentInactiveMaterial = new MeshBasicMaterial( { color: 0xCAC9C9, transparent: false, opacity: 0.1 } );
        this.nonTransparentActiveMaterial = new MeshBasicMaterial( { color: 0x4c4c5f, transparent: false, opacity: 0.2 } );
        this.intersectedMaterial = new MeshBasicMaterial( { color: 0x101A2C, transparent: false, opacity: 0.2 } );


        this.scene.background = new Color( 0xf0f0f0 );
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
        this.binaryRepresentationElement.addEventListener('mousemove', event => this.onMouseMove(event));
        this.binaryRepresentationElement.addEventListener('click', () => this.onClick());
        this.buildCubes();

        this.matrix.addChangeListener((eventType?: MatrixEvents) => {
            if (eventType && eventType === MatrixEvents.SIZE_CHANGED) {
                this.buildCubes();
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

            this.animations.push( new SelectionAnimation(this.meshMatrix, this.anchor, this.cubes,  row, column));
            this.updateMaterials();
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

        for (const label of this.labels) {
            label.lookAt(this.camera.position.x, this.camera.position.y, label.position.z);
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