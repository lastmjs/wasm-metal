import {createStore} from 'redux';
import {
    ParametersPhaseReducer
} from '../redux/reducers/parameters-phase/parameters-phase-reducer';
import {
    State,
    Action
} from '../wasm-metal.d';

const InitialState: State = {
    numberOfRegisters: parseInt(window.localStorage.getItem('numberOfRegisters') || '10'),
    numberOfMemoryLocations: parseInt(window.localStorage.getItem('numberOfMemoryLocations') || '500'),
    sourceCode: window.localStorage.getItem('sourceCode') || '',
    phase: 'OPCODE',
    opcodePhaseStep: 0,
    registers: [],
    currentResult: '',
    cyclesElapsed: 0,
    memoryLocations: [],
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
    parameterDecrementer: '0x1'
};

const RootReducer = (state=InitialState, action: Action) => {

    if (action.type === 'CHANGE_NUMBER_OF_REGISTERS') {
        return {
            ...state,
            numberOfRegisters: action.numberOfRegisters && action.numberOfRegisters > 0 ? action.numberOfRegisters : 1
        };
    }

    if (action.type === 'CHANGE_NUMBER_OF_MEMORY_LOCATIONS') {
        return {
            ...state,
            numberOfMemoryLocations: action.numberOfMemoryLocations && action.numberOfMemoryLocations > 0 ? action.numberOfMemoryLocations : 1
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
            memoryLocations: state.sourceCode.split('').reduce((result, character, index, array) => {
                if (index >= array.length / 2) {
                    return result;
                }
                else {
                    return {
                        ...result,
                        finalArray: [...result.finalArray, `${array[result.index]}${array[result.index + 1]}`],
                        index: result.index + 2
                    };
                }
            }, {
                finalArray: [],
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
                const memoryDataRegister = `0x${state.memoryLocations[parseInt(state.memoryAddressRegister, 16)]}`;
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
                const parameterMux = {
                    ...state.parameterMux,
                    input0: parameterDecoder.output1,
                    input1: state.parameterDecrementer,
                    output: (1 + parseInt(parameterDecoder.output1, 16) - parseInt(state.parameterDecrementer, 16)).toString(16)
                }; //TODO figure out why we have to add 1 to the decrementer above
                const parameterCountRegister = parameterMux.output;

                return {
                    ...state,
                    opcodePhaseStep,
                    opcodeRegister,
                    parameterDecoder,
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
