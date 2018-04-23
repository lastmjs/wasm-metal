import {createStore} from 'redux';
import {
    ParametersInstructionCycleReducer
} from '../redux/reducers/parameters-instruction-cycle/parameters-instruction-cycle-reducer';
import {
    State,
    Action
} from '../wasm-metal.d';

const InitialState: State = {
    numberOfRegisters: parseInt(window.localStorage.getItem('numberOfRegisters') || '10'),
    numberOfMemoryLocations: parseInt(window.localStorage.getItem('numberOfMemoryLocations') || '500'),
    hexCode: window.localStorage.getItem('hexCode') || '',
    currentOpcode: '',
    hexCodeIndex: 0,
    instructionCycle: 'OPCODE',
    registers: [],
    currentResult: '',
    numberOfCycles: 0
};

const RootReducer = (state=InitialState, action: Action) => {
    switch (action.type) {
        case 'CHANGE_NUMBER_OF_REGISTERS': {
            return {
                ...state,
                numberOfRegisters: action.numberOfRegisters && action.numberOfRegisters > 0 ? action.numberOfRegisters : 1
            };
        }
        case 'CHANGE_NUMBER_OF_MEMORY_LOCATIONS': {
            return {
                ...state,
                numberOfMemoryLocations: action.numberOfMemoryLocations && action.numberOfMemoryLocations > 0 ? action.numberOfMemoryLocations : 1
            };
        }
        case 'CHANGE_HEX_CODE': {
            return {
                ...state,
                hexCode: action.hexCode
            };
        }
        case 'STEP': {
            switch (state.instructionCycle) {
                case 'OPCODE': {
                    const currentOpcode = state.hexCode.slice(state.hexCodeIndex, state.hexCodeIndex + 2);
                    const newHexCodeIndex = state.hexCodeIndex + 2;

                    return {
                        ...state,
                        currentOpcode,
                        hexCodeIndex: newHexCodeIndex,
                        instructionCycle: 'PARAMETERS',
                        numberOfCycles: state.numberOfCycles + 1
                    };
                }
                case 'PARAMETERS': {
                    return ParametersInstructionCycleReducer(state, action);
                }
                case 'COMPUTE': {
                    //TODO Find out which hardware execution unit will need to do this
                    switch(state.currentOpcode.toLowerCase()) {
                        case '6a': {
                            const param1 = state.registers[0];
                            const param2 = state.registers[1];

                            const result = parseInt(param1 + param2, 8).toString(); //TODO Emulate how the hardware will do this calculation

                            return {
                                ...state,
                                currentResult: result,
                                instructionCycle: 'RESULT',
                                numberOfCycles: state.numberOfCycles + 1
                            };
                        }
                        default: {
                            throw new Error(`Opcode ${state.currentOpcode} not defined`);
                        }
                    }
                }
                case 'RESULT': {
                    return {
                        ...state,
                        registers: [state.currentResult],
                        instructionCycle: 'OPCODE',
                        numberOfCycles: state.numberOfCycles + 1
                    }
                }
                default: {
                    return state;
                }
            }
        }
        default: {
            return state;
        }
    }
};

export const Store = createStore(RootReducer);
