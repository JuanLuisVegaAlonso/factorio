// Configuration
// TODO change to customizable matrix
import { Matrix } from './data/matrix';

import { MatrixController } from './controller/MatrixController';
import { RenderController } from './controller/RenderController';
import { FactorioDataViewerController } from './controller/FactorioDataViewerController';
import { allItems, segmentedDisplay } from './data/baseInfo';
import { ToolsController } from './controller/ToolsController';
let rows = 7;
let columns = 5;
const maxHeight = 600;





window.onload = () => {
    
    const matrix = new Matrix(rows, columns, 10, allItems.length);
    const matrixController = new MatrixController(matrix, maxHeight);
    matrixController.init();
    const renderController = new RenderController(matrix, maxHeight)
    const factorioDataViewerController = new FactorioDataViewerController(segmentedDisplay);
    factorioDataViewerController.init();

    const toolController = new ToolsController(matrix, segmentedDisplay);
    toolController.init();

    // Scene for debugging

    // const debuggingWidth = 300;
    // const debuggingHeight = 300;
    // const debuggingCamera = new THREE.OrthographicCamera( -100, 100, 100, -100, 1, 10000 );
    // debuggingCamera.position.set( -300, 900, 950 );
    // debuggingCamera.lookAt(50,50,50);
    // const debuggingRenderer = new THREE.WebGLRenderer({ antialias: true });
    // debuggingRenderer.setSize(debuggingWidth, debuggingHeight);
    // document.getElementById('binary-representation').appendChild(debuggingRenderer.domElement);

    

    function animate() {
        requestAnimationFrame( animate );
        renderController.tick();

        
        // debugging
        // debuggingRenderer.render(renderController.scene, debuggingCamera);
    }
    animate();
}