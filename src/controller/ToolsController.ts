import { encode, decode, Blueprint } from '@jensforstmann/factorio-blueprint-tools';
import { entityMap, numberColumns, numberRows, virtualSignals } from "../data/baseInfo";
import { Entity, FactorioInfo, FiltersEntity, Signal } from "../data/FactorioData";
import { Matrix } from "../data/matrix";

export class ToolsController {

    private section: HTMLElement;
    private blueprintInput: HTMLTextAreaElement;
    private lampTypeSelect: HTMLSelectElement; 

    constructor(private matrix: Matrix, private factorioData: FactorioInfo) {

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
        const maxIterations = numberRows * numberColumns;
        const constantCombinator1 = this.factorioData.blueprint.entities.find(a => a.entity_number === 40)!;
        let constantCombinator2: Entity = this.factorioData.blueprint.entities.find(a => a.entity_number === 42)!;
        if (!constantCombinator2) {
            constantCombinator2 = JSON.parse(JSON.stringify(constantCombinator1))!;
            constantCombinator2.entity_number = 42;
            constantCombinator2.position.y = constantCombinator1.position.y + 1;
            this.factorioData.blueprint.entities.push(constantCombinator2)
        }
        
        constantCombinator1.control_behavior.filters = [];
        constantCombinator2.control_behavior.filters = [];

        for (let i = 0; i < maxIterations; i++) {
            const row = Math.floor(i / numberColumns);
            const col = i % numberColumns;
            const value = this.matrix.getRawValue(row,col);
            const signalName = virtualSignals[i];
            const signal: Signal = {
                name: signalName,
                type: "virtual"
            }
            const filter: FiltersEntity = {
                signal,
                count: value,
                index: i%20 + 1
            }
            if (i < 20) {
                constantCombinator1.control_behavior.filters.push(filter);
            } else {
                constantCombinator2.control_behavior.filters.push(filter);
            }
            

            const entityID = entityMap[i];
            const entity = this.factorioData.blueprint.entities.find(a => a.entity_number === entityID)!;
            entity.name = this.lampTypeSelect.value;
            entity.control_behavior.circuit_condition!.first_signal = signal;
            entity.control_behavior.circuit_condition!.comparator = "=";
            entity.control_behavior.circuit_condition!.constant = 1;
        }
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