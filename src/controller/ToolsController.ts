import { encode, decode, Blueprint } from '@jensforstmann/factorio-blueprint-tools';
import { entityMap, numberColumns, numberRows, virtualSignals } from "../data/baseInfo";
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

        const button = document.createElement('button');
        button.innerHTML = "export";
        button.addEventListener("click", () => this.exportBlueprint());
        this.section.appendChild(button);

        const buttonImport = document.createElement('button');
        buttonImport.innerHTML = "import";
        buttonImport.addEventListener("click", () => this.importBlueprint());
        this.section.appendChild(buttonImport);

        this.blueprintInput = document.createElement('textarea');
        this.section.appendChild(this.blueprintInput);

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

        const constantCombinator1 = this.factorioData.blueprint.entities.find(a => a.entity_number === 40)!;
        const constantCombinator2: Entity = this.factorioData.blueprint.entities.find(a => a.entity_number === 42)!;
        const filters = [...constantCombinator1.control_behavior.filters!, ...constantCombinator2.control_behavior.filters!];

        for(const filter of filters) {
            const i = virtualSignals.findIndex(a => a == filter.signal.name);
            const row = Math.floor(i / numberColumns);
            const col = i % numberColumns;
            this.matrix.setRawValue(row,col, filter.count);
        }
    }
}