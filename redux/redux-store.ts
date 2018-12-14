import {createStore} from 'redux';
import {
    ParametersPhaseReducer
} from '../redux/reducers/parameters-phase/parameters-phase-reducer';
import {
    State,
    Action
} from '../wasm-metal.d';

const numberOfRegisters = parseInt(window.localStorage.getItem('numberOfRegisters') || '10');
const numberOfMemoryLocations = parseInt(window.localStorage.getItem('numberOfMemoryLocations') || '500');

const InitialState: State = {
    numberOfRegisters,
    numberOfMemoryLocations,
    sourceCode: window.localStorage.getItem('sourceCode') || '',
    phase: 'OPCODE',
    opcodePhaseStep: 0,
    registers: new Array(numberOfRegisters).fill(''),
    currentResult: '',
    cyclesElapsed: 0,
    memory: new Array(numberOfMemoryLocations).fill(''),
    programCounter: '0x0',
    memoryAddressRegister: '',
    memoryDataRegister: '',
    opcodeRegister: '',
    parameterCountRegister: '',
    parameterDecoder: {
        input: '',
        output0: '',
        output1: '',
        table: {
            '0x6a': {
                parameterSize: '0x40',
                parameterCount: '0x2'
            }
        }
    },
    parameterMux: {
        input0: '',
        input1: '',
        output: ''
    },
    parameterDecrementer: {
        input: '',
        output: ''
    }
};

const RootReducer = (state=InitialState, action: Action) => {

    if (action.type === 'CHANGE_NUMBER_OF_REGISTERS') {
        return {
            ...state,
            registers: new Array(action.numberOfRegisters && action.numberOfRegisters > 0 ? action.numberOfRegisters : 1).fill('')
        };
    }

    if (action.type === 'CHANGE_NUMBER_OF_MEMORY_LOCATIONS') {
        return {
            ...state,
            memory: new Array(action.numberOfMemoryLocations && action.numberOfMemoryLocations > 0 ? action.numberOfMemoryLocations : 1).fill('')
        };
    }

    if (action.type === 'CHANGE_SOURCE_CODE') {
        return {
            ...state,
            sourceCode: action.sourceCode
        };
    }

    if (action.type === 'LOAD_SOURCE_CODE_INTO_MEMORY') {
        return {
            ...state,
            memory: state.sourceCode.split('').reduce((result, character, index, array) => {
                if (index >= array.length / 2) {
                    return result;
                }
                else {
                    return {
                        ...result,
                        finalArray: [...result.finalArray.slice(0, index), `${array[result.index]}${array[result.index + 1]}`, ...result.finalArray.slice(index + 1)],
                        index: result.index + 2
                    };
                }
            }, {
                finalArray: state.memory,
                index: 0
            }).finalArray
        };
    }

    if (action.type === 'STEP') {
        if (state.phase === 'OPCODE') {

            if (state.opcodePhaseStep === 0) {
                const opcodePhaseStep = 1;
                const memoryAddressRegister = state.programCounter;
                const cyclesElapsed = state.cyclesElapsed + 1;

                return {
                    ...state,
                    opcodePhaseStep,
                    memoryAddressRegister,
                    cyclesElapsed
                };
            }

            if (state.opcodePhaseStep === 1) {
                const opcodePhaseStep = 2;
                const memoryDataRegister = `0x${state.memory[parseInt(state.memoryAddressRegister, 16)]}`;
                const programCounter = `0x${(parseInt(state.programCounter, 16) + 1).toString(16)}`;
                const memoryAddressRegister = programCounter;
                const cyclesElapsed = state.cyclesElapsed + 1;

                return {
                    ...state,
                    opcodePhaseStep,
                    memoryDataRegister,
                    programCounter,
                    memoryAddressRegister,
                    cyclesElapsed
                };
            }

            if (state.opcodePhaseStep === 2) {
                const opcodePhaseStep = 0;
                const opcodeRegister = state.memoryDataRegister;
                const parameterDecoder = {
                    ...state.parameterDecoder,
                    input: opcodeRegister,
                    output0: state.parameterDecoder.table[opcodeRegister].parameterSize,
                    output1: state.parameterDecoder.table[opcodeRegister].parameterCount
                };
                const parameterDecrementer = {
                    input: state.parameterCountRegister,
                    output: parseInt(state.parameterDecrementer.input, 16) - 1
                };
                const parameterMux = {
                    ...state.parameterMux,
                    input0: parameterDecoder.output1,
                    input1: parameterDecrementer.output,
                    output: state.phase === 'OPCODE' ? parameterDecoder.output1 : parameterDecrementer.output
                };
                const parameterCountRegister = parameterMux.output;

                return {
                    ...state,
                    opcodePhaseStep,
                    opcodeRegister,
                    parameterDecoder,
                    parameterDecrementer,
                    parameterMux,
                    parameterCountRegister
                };
            }
        }

        // case 'OPCODE': {
        //     if (state.opcodePhaseStep === 0) {
        //
        //     }
        //
        //     // const currentOpcode = state.sourceCode.slice(state.programCounter, state.programCounter + 2);
        //     // const newHexCodeIndex = state.programCounter + 2;
        //     //
        //     // return {
        //     //     ...state,
        //     //     currentOpcode,
        //     //     hexCodeIndex: newHexCodeIndex,
        //     //     instructionCycle: 'PARAMETERS',
        //     //     cyclesElapsed: state.cyclesElapsed + 1
        //     // };
        // }
        // case 'PARAMETERS': {
        //     return ParametersPhaseReducer(state, action);
        // }
        // case 'COMPUTE': {
        //     //TODO Find out which hardware execution unit will need to do this
        //     switch(state.currentOpcode.toLowerCase()) {
        //         case '6a': {
        //             const param1 = state.registers[0];
        //             const param2 = state.registers[1];
        //
        //             const result = parseInt(param1 + param2, 8).toString(); //TODO Emulate how the hardware will do this calculation
        //
        //             return {
        //                 ...state,
        //                 currentResult: result,
        //                 instructionCycle: 'RESULT',
        //                 cyclesElapsed: state.cyclesElapsed + 1
        //             };
        //         }
        //         default: {
        //             throw new Error(`Opcode ${state.currentOpcode} not defined`);
        //         }
        //     }
        // }
        // case 'RESULT': {
        //     return {
        //         ...state,
        //         registers: [state.currentResult],
        //         instructionCycle: 'OPCODE',
        //         cyclesElapsed: state.cyclesElapsed + 1
        //     }
        // }
    }

    return state;
};

export const Store = createStore(RootReducer);
