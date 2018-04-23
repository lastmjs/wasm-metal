import {
    State, Action
} from '../../../wasm-metal.d';
import {
    ParametersInstructionCycleControlInstructionsReducer
} from './parameters-instruction-cycle-control-instructions-reducer';
import {
    ParametersInstructionCycleParametricInstructionsReducer
} from './parameters-instruction-cycle-parametric-instructions-reducer';
import {
    ParametersInstructionCycleVariableInstructionsReducer
} from './parameters-instruction-cycle-variable-instructions-reducer';
import {
    ParametersInstructionCycleMemoryInstructionsReducer
} from './parameters-instruction-cycle-memory-instructions-reducer';
import {
    ParametersInstructionCycleNumericInstructionsReducer
} from './parameters-instruction-cycle-numeric-instructions-reducer';

export const ParametersInstructionCycleReducer = (state: State, action: Action) => {
    const hexOpcode = parseInt(state.currentOpcode.toLowerCase(), 16);

    if (hexOpcode <= parseInt('0x11', 16)) {
        return ParametersInstructionCycleControlInstructionsReducer(state, action);
    }

    if (hexOpcode <= parseInt('0x1B', 16)) {
        return ParametersInstructionCycleParametricInstructionsReducer(state, action);
    }

    if (hexOpcode <= parseInt('0x24', 16)) {
        return ParametersInstructionCycleVariableInstructionsReducer(state, action);
    }

    if (hexOpcode <= parseInt('0x40', 16)) {
        return ParametersInstructionCycleMemoryInstructionsReducer(state, action);
    }

    if (hexOpcode <= parseInt('0xBF', 16)) {
        return ParametersInstructionCycleNumericInstructionsReducer(state, action);
    }

    //TODO figure out expression instructions
};
