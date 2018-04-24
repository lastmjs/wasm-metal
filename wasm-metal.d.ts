export interface State {
    numberOfRegisters: number;
    numberOfMemoryLocations: number;
    hexCode: string;
    currentOpcode: string;
    hexCodeIndex: number;
    instructionCycle: 'OPCODE' | 'PARAMETERS' | 'COMPUTE' | 'RESULT';
    registers: string[];
    currentResult: '';
    numberOfCycles: number;
    memory: string[];
}

export interface Action {
    type: string;
    numberOfRegisters?: number;
    numberOfMemoryLocations?: number;
    hexCode?: string;
    currentOpcode?: string;
    hexCodeIndex?: number;
}

export interface StateChangeEvent extends CustomEvent {
    detail: {
        state: State;
    }
}
