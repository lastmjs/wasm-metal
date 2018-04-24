import {
    State, Action
} from '../../../wasm-metal.d';

export const ParametersPhaseNumericInstructionsReducer = (state: State, action: Action) => {
    //TODO Find out which hardware execution unit will need to do this
    switch(state.currentOpcode.toLowerCase()) {
        case '6a': {
            const param1 = state.hexCode.slice(state.hexCodeIndex, state.hexCodeIndex + 2);
            const param2 = state.hexCode.slice(state.hexCodeIndex + 2, state.hexCodeIndex + 4);
            const newHexCodeIndex = state.hexCodeIndex + 4;

            return {
                ...state,
                instructionCycle: 'COMPUTE',
                registers: [param1, param2],
                hexCodeIndex: newHexCodeIndex,
                numberOfCycles: state.numberOfCycles + 1
            };
        }
        default: {
            throw new Error(`Opcode ${state.currentOpcode} not defined`);
        }
    }
};
