import {
    State, Action
} from '../../../wasm-metal.d';
import {
    ParametersPhaseControlInstructionsReducer
} from './parameters-phase-control-instructions-reducer';
import {
    ParametersPhaseParametricInstructionsReducer
} from './parameters-phase-parametric-instructions-reducer';
import {
    ParametersPhaseVariableInstructionsReducer
} from './parameters-phase-variable-instructions-reducer';
import {
    ParametersPhaseMemoryInstructionsReducer
} from './parameters-phase-memory-instructions-reducer';
import {
    ParametersPhaseNumericInstructionsReducer
} from './parameters-phase-numeric-instructions-reducer';

export const ParametersPhaseReducer = (state: State, action: Action) => {
    const hexOpcode = parseInt(state.currentOpcode.toLowerCase(), 16);

    if (hexOpcode <= parseInt('0x11', 16)) {
        return ParametersPhaseControlInstructionsReducer(state, action);
    }

    if (hexOpcode <= parseInt('0x1B', 16)) {
        return ParametersPhaseParametricInstructionsReducer(state, action);
    }

    if (hexOpcode <= parseInt('0x24', 16)) {
        return ParametersPhaseVariableInstructionsReducer(state, action);
    }

    if (hexOpcode <= parseInt('0x40', 16)) {
        return ParametersPhaseMemoryInstructionsReducer(state, action);
    }

    if (hexOpcode <= parseInt('0xBF', 16)) {
        return ParametersPhaseNumericInstructionsReducer(state, action);
    }

    //TODO figure out expression instructions
};
