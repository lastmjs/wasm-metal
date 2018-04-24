export interface State {
    numberOfRegisters: number;
    numberOfMemoryLocations: number;
    sourceCode: string;
    phase: 'OPCODE' | 'PARAMETERS' | 'COMPUTE' | 'RESULT';
    opcodePhaseStep: number;
    registers: string[];
    currentResult: '';
    cyclesElapsed: number;
    memoryLocations: string[];
    programCounter: string;
    memoryAddressRegister: string;
    memoryDataRegister: string;
    opcodeRegister: string;
    parameterCountRegister: string;
    parameterDecoder: ParameterDecoder;
    parameterMux: ParameterMux;
    parameterDecrementer: string;
}

export interface Action {
    type: string;
    numberOfRegisters?: number;
    numberOfMemoryLocations?: number;
    sourceCode?: string;
}

export interface StateChangeEvent extends CustomEvent {
    detail: {
        state: State;
    }
}

interface ParameterDecoder {
    input: string;
    output0: string;
    output1: string;
    table: {
        [opcode: string]: {
            parameterSize: string;
            parameterCount: string;
        };
    };
}

interface ParameterMux {
    input0: string;
    input1: string;
    output: string;
}
