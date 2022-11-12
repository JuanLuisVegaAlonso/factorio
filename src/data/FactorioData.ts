export interface FactorioInfo {
    blueprint: Blueprint;
  }
  export interface Blueprint {
    description: string;
    icons: IconsEntity[];
    entities: Entity[];
    item: string;
    label: string;
    version: number;
  }
  export interface IconsEntity {
    signal: Signal;
    index: number;
  }
  export interface Signal {
    type: string;
    name: string;
  }
  export interface Entity {
    entity_number: number;
    name: string;
    position: Position;
    control_behavior: ControlBehavior;
    connections: Connections;
  }
  export interface Position {
    x: number;
    y: number;
  }
  export interface ControlBehavior {
    circuit_condition?: CircuitCondition | null;
    arithmetic_conditions?: ArithmeticConditions | null;
    filters?: (FiltersEntity)[] | null;
  }
  export interface CircuitCondition {
    first_signal: Signal;
    constant: number;
    comparator: string;
  }
  export interface ArithmeticConditions {
    first_signal: Signal;
    second_constant?: number | null;
    operation: string;
    output_signal: Signal;
    second_signal?: Signal | null;
  }

  export interface FiltersEntity {
    signal: Signal;
    count: number;
    index: number;
  }
  export interface Connections {
    [connectionId: number]: ConnectionObject | null;
  }
  export interface ConnectionObject {
    red?: (RedEntityOrGreenEntity)[] | null;
    green?: (RedEntityOrGreenEntity)[] | null;
  }
  export interface RedEntityOrGreenEntity {
    entity_id: number;
    circuit_id?: number | null;
  }

  