import { allItems } from "./baseInfo";
import { Entity, FactorioInfo } from "./FactorioData";
import { Matrix, MatrixEvents } from "./matrix";

export class LampBlueprint {


    private static BOTTOM_RIGHT_CORNER_LAMP_MATRIX_POSITION = {x: -207.5,y: 276.5};
    private static BOTTOM_CONSTANT_COMBINATOR_POSITION = {x: -206.5,y: 277.5};
    private static MAX_NUMBER_SIGNALS_COMBINATOR = 20;
    private static COMBINATOR_SIZE = 1;



    private lamps: Entity[];
    private combinators: Entity[];
    private listeners: ((newBlueprint: FactorioInfo) => void)[] = []; 
    private matrixOutput: Entity = {
        entity_number: 1,
        name: "arithmetic-combinator",
        position: {
            x: -211.5,
            y: 278
        },
        control_behavior: {
            arithmetic_conditions: {
                first_signal: {
                    type: "virtual",
                    name: "signal-each"
                },
                second_constant: 2,
                operation: "%",
                output_signal: {
                    type: "virtual",
                    name: "signal-each"
                }
            }
        },
        connections: {
            "1": {
                red: [
                    {
                        entity_id: 2,
                        circuit_id: 2
                    }
                ]
            },
            "2": {
                red: [
                    // Connection with the last lamp
                ]
            }
        }
    };
    private shifter: Entity = {
        entity_number: 2,
        name: "arithmetic-combinator",
        position: {
            x: -210.5,
            y: 278
        },
        control_behavior: {
            arithmetic_conditions: {
                first_signal: {
                    type: "virtual",
                    name: "signal-each"
                },
                second_signal: {
                    type: "virtual",
                    name: "signal-green"
                },
                operation: ">>",
                output_signal: {
                    type: "virtual",
                    name: "signal-each"
                }
            }
        },
        connections: {
            "1": {
                red: [
                    {
                        entity_id: 3,
                        circuit_id: 2
                    }
                ],
                green: [
                    // connection with last combinator
                ]
            },
            "2": {
                red: [
                    {
                        entity_id: 1,
                        circuit_id: 1
                    }
                ]
            }
        }
    };
    private numberSelector: Entity = {
        entity_number: 3,
        name: "arithmetic-combinator",
        position: {
          x: -209.5,
          y: 278
        },
        control_behavior: {
          arithmetic_conditions: {
            first_signal: {
              type: "virtual",
              name: "signal-each"
            },
            second_constant: 10,
            operation: "%",
            output_signal: {
              type: "virtual",
              name: "signal-each"
            }
          }
        },
        connections: {
          "1": {
            green: [
              {
                entity_id: 4,
                circuit_id: 1
              }
            ]
          },
          "2": {
            red: [
              {
                entity_id: 2,
                circuit_id: 1
              }
            ]
          }
        }
    };
    private numberPositionSelector: Entity = {
        entity_number: 4,
        name: "arithmetic-combinator",
        position: {
          x: -208.5,
          y: 278
        },
        control_behavior: {
          arithmetic_conditions: {
            first_signal: {
              type: "virtual",
              name: "signal-each"
            },
            second_constant: 10,
            operation: "/",
            output_signal: {
              type: "virtual",
              name: "signal-each"
            }
          }
        },
        connections: {
          "1": {
            green: [
              {
                entity_id: 3,
                circuit_id: 1
              },
              {
                entity_id: 5,
                circuit_id: 2
              }
            ]
          }
        }
      };
    private input: Entity = {
        entity_number: 5,
        name: "arithmetic-combinator",
        position: {
          x: -207.5,
          y: 278
        },
        control_behavior: {
          arithmetic_conditions: {
            first_signal: {
              type: "virtual",
              name: "signal-each"
            },
            second_constant: 1,
            operation: "*",
            output_signal: {
              type: "virtual",
              name: "signal-green"
            }
          }
        },
        connections: {
          "2": {
            green: [
              {
                entity_id: 4,
                circuit_id: 1
              }
            ]
          }
        }
    };
    private blueprintBase: FactorioInfo = {
        blueprint: {
            description: "Single digit display\n\nInput most right combinator",
            icons: [
                {
                    signal: {
                        type: "item",
                        name: "small-lamp"
                    },
                    index: 1
                }
            ],
            entities: [],
            item: "blueprint",
            label: "Single digit display",
            version: 281479276265473
        }
    }
    public blueprint: FactorioInfo;
    constructor(private readonly matrix: Matrix, public lampType = "small-lamp", public lampSize = 1) {
        this.matrix.addChangeListener((matrixEvent) => this.onMatrixChange(matrixEvent));
        this.generateBlueprint();
    }



    private onMatrixChange(matrixEvent?: MatrixEvents) {
        this.generateBlueprint();
    }


    private generateLampArray(rows: number, columns: number) {
        const topLeftCornerPosition = {
            x: LampBlueprint.BOTTOM_RIGHT_CORNER_LAMP_MATRIX_POSITION.x - columns * this.lampSize + 1,
            y: LampBlueprint.BOTTOM_RIGHT_CORNER_LAMP_MATRIX_POSITION.y - rows * this.lampSize + 1,
        }
        const lamps: Entity[] = [];
        const connectionName = "1";
        for (let row = 0; row < rows; row++) {
            for (let col=0; col < columns; col++ ) {
                const lamp: Entity =  {
                    connections: {
                        [connectionName]: {
                            red: []
                        }
                    },
                    control_behavior: {
                        circuit_condition: {
                            first_signal: {
                                name: allItems[row*columns + col].name,
                                type: allItems[row*columns + col].type
                            },
                            comparator: "=",
                            constant: 1
                        }
                    },
                    name: this.lampType,
                    entity_number: this.getLampId(row, col),
                    position: {
                        x: topLeftCornerPosition.x + col*this.lampSize,
                        y: topLeftCornerPosition.y + row*this.lampSize,
                    }
                }
                if (row === 0) {
                    if (col > 1) {
                        lamp.connections[connectionName]?.red?.push({entity_id: this.getLampId(row, col - 1)});
                    }
                    if (col < columns - 1) {
                        lamp.connections[connectionName]?.red?.push({entity_id: this.getLampId(row, col + 1)});
                    }
                }
                if (row < rows - 1) {
                    lamp.connections[connectionName]?.red?.push({entity_id: this.getLampId(row + 1, col)});
                }
                lamps.push(lamp)
            }
        }
        return lamps;
    }


    

    private generateCombinators() {
        const numberOfSignals = this.matrix.rows * this.matrix.columns;
        const combinators: Entity[] = [];
        const maxNumberCombinators = Math.floor(numberOfSignals / LampBlueprint.MAX_NUMBER_SIGNALS_COMBINATOR);
        const connectionName = "1";
        const topPosition = {
            x: LampBlueprint.BOTTOM_CONSTANT_COMBINATOR_POSITION.x,
            y: LampBlueprint.BOTTOM_CONSTANT_COMBINATOR_POSITION.y - maxNumberCombinators * LampBlueprint.COMBINATOR_SIZE
        };
        for (let i = 0; i < numberOfSignals; i++) {
            const combinatorIndex = Math.floor(i / LampBlueprint.MAX_NUMBER_SIGNALS_COMBINATOR);
            if (i % LampBlueprint.MAX_NUMBER_SIGNALS_COMBINATOR === 0) {
                const combinator: Entity =  {
                    connections: {
                        [connectionName]: {
                            red: []
                        }
                    },
                    control_behavior: {
                        filters: []
                    },
                    entity_number: this.getCombinatorId(combinatorIndex),
                    name: "constant-combinator",
                    position: {
                        x: topPosition.x,
                        y: topPosition.y + combinatorIndex * LampBlueprint.COMBINATOR_SIZE
                    }
                }
                
                if (combinatorIndex > 0) {
                    combinator.connections[connectionName]?.red?.push({entity_id: this.getCombinatorId(combinatorIndex - 1)});
                }
                if (combinatorIndex < maxNumberCombinators - 1) {
                    combinator.connections[connectionName]?.red?.push({entity_id: this.getCombinatorId(combinatorIndex + 1)});
                }
                combinators[combinatorIndex] = combinator;
            }
            const filters = combinators[combinatorIndex].control_behavior.filters!;
            const row = Math.floor(i / this.matrix.columns);
            const column = i % this.matrix.columns;
            filters.push({
                count: this.matrix.getRawValue(row, column),
                index: i % LampBlueprint.MAX_NUMBER_SIGNALS_COMBINATOR + 1,
                signal: allItems[i]
            })
            
        }

        return combinators;
    }

    private getCombinatorId(index: number) {
        return this.lamps[this.lamps.length - 1].entity_number + index + 1;
    }
    private getLampId(row: number, col: number): number {
        return 6 + row * this.matrix.columns + col + 1;
    }

    private tellListeners() {
        this.listeners.forEach(listener => listener(this.blueprint));
    }

    generateBlueprint() {
        this.lamps = this.generateLampArray(this.matrix.rows, this.matrix.columns);
        this.combinators = this.generateCombinators();

        const lastLamp = this.lamps[this.lamps.length - 1];
        this.matrixOutput.connections["2"]!.red = [{entity_id: lastLamp.entity_number}];
        lastLamp.connections["1"]?.red?.push({entity_id: this.matrixOutput.entity_number});

        const lastCombinator = this.combinators[this.combinators.length - 1];
        this.shifter.connections["1"]!.red = [{entity_id: lastCombinator.entity_number}];
        lastCombinator.connections["1"]?.red?.push({entity_id: this.shifter.entity_number});

        // copy
        this.blueprint = JSON.parse(JSON.stringify(this.blueprintBase));
        this.blueprint.blueprint.entities = [
            this.input,
            this.matrixOutput,
            this.numberSelector,
            this.numberPositionSelector,
            this.shifter,
            ...this.lamps,
            ...this.combinators
        ];
        console.log(this.blueprint)
        this.tellListeners();
    }

    exportBlueprint() {

    }

    importBlueprint() {

    }

    addListener(listener: ((newBlueprint: FactorioInfo) => void)) {
        this.listeners.push(listener);
    }
}