import { encode, decode, Blueprint } from '@jensforstmann/factorio-blueprint-tools';
import { allItems, entityMap, numberColumns, numberRows, virtualSignals } from "../data/baseInfo";
import { Entity, FactorioInfo, FiltersEntity, Signal } from "../data/FactorioData";
import { LampBlueprint } from '../data/LampBlueprint';
import { Matrix } from "../data/matrix";

export class ToolsController {

    private section: HTMLElement;
    private blueprintInput: HTMLTextAreaElement;
    private lampTypeSelect: HTMLSelectElement; 
    private factorioData: FactorioInfo;

    constructor(private matrix: Matrix,private lampBlueprint: LampBlueprint ) {

        this.lampBlueprint.addListener(bluprint => this.factorioData = bluprint);

    }

    public init() {
        this.section = document.getElementById("tools")!;

        const buttonExport = document.createElement('button');
        buttonExport.innerHTML = "export";
        buttonExport.id = 'export';
        buttonExport.addEventListener("click", () => this.exportBlueprint());
        this.section.appendChild(buttonExport);

        const buttonImport = document.createElement('button');
        buttonImport.innerHTML = "import";
        buttonImport.id = 'import'
        buttonImport.addEventListener("click", () => this.importBlueprint());
        this.section.appendChild(buttonImport);

        this.blueprintInput = document.createElement('textarea');
        this.blueprintInput.id = 'blueprint-input'
        this.section.appendChild(this.blueprintInput);

        const lampTypeLabel = document.createElement('label');
        lampTypeLabel.innerHTML = 'Lamp type';
        lampTypeLabel.id = 'lamp-type-label';
        this.section.appendChild(lampTypeLabel);

        this.lampTypeSelect = document.createElement('select');
        const smallLampOption = document.createElement('option');
        smallLampOption.value = "small-lamp";
        smallLampOption.innerText = "Small lamp";
        this.lampTypeSelect.appendChild(smallLampOption);

        const flatLampOption = document.createElement('option');
        flatLampOption.value = "flat-lamp";
        flatLampOption.innerText = "Flat lamp";
        this.lampTypeSelect.appendChild(flatLampOption);

        this.section.appendChild(this.lampTypeSelect);

    }


    private exportBlueprint() {
        navigator.clipboard.writeText(encode(this.factorioData as Blueprint)).then(() => window.alert("copied"));
    }
    private importBlueprint() {
        const blueprint: FactorioInfo = decode(this.blueprintInput.value) as FactorioInfo;
        this.factorioData = blueprint;
        this.lampBlueprint.importBlueprint(this.factorioData);
    }
}