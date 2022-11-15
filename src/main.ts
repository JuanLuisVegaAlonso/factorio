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


export function changeView(elem: HTMLElement) {
    const navigationData = elem.getAttribute("data-navigation")!;
    const sections = document.getElementsByTagName("section");
    for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const navigationDataSection = section.getAttribute("data-navigation")!;
        if (navigationData === navigationDataSection) {
            section.classList.remove("hidden");
        } else {
            section.classList.add("hidden");
        }
        
    }
}



window.onload = () => {


    //navigation
    const nav = document.getElementsByTagName('nav')[0]!;
    const navEntries = nav.getElementsByTagName('li');
    for (let i = 0; i < navEntries.length; i++) {
        const navEntry = navEntries[i];
        navEntry.addEventListener('click',()=>changeView(navEntry))
    }
    changeView(navEntries[0])
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