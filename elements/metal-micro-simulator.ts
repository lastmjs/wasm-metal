import {html, render} from 'lit-html/lib/lit-extended.js';
import {createStore} from 'redux';
import {
    State,
    Action
} from '../wasm-metal.d';
import {
    ParametersInstructionCycleReducer
} from '../redux/reducers/parameters-instruction-cycle/parameters-instruction-cycle-reducer';

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

const Store = createStore(RootReducer);

class MetalMicroSimulator extends HTMLElement {
    constructor() {
        super();
        Store.subscribe(this.render.bind(this));
        this.render();
    }

    numberOfRegistersChanged(e: any) {
        const numberOfRegisters = parseInt(e.target.value);
        window.localStorage.setItem('numberOfRegisters', numberOfRegisters.toString());
        Store.dispatch({
            type: 'CHANGE_NUMBER_OF_REGISTERS',
            numberOfRegisters
        });
    }

    numberOfMemoryLocationsChanged(e: any) {
        const numberOfMemoryLocations = parseInt(e.target.value);
        window.localStorage.setItem('numberOfMemoryLocations', numberOfMemoryLocations.toString());
        Store.dispatch({
            type: 'CHANGE_NUMBER_OF_MEMORY_LOCATIONS',
            numberOfMemoryLocations
        });
    }

    hexCodeInputChanged(e: any) {
        const hexCode = e.target.value;
        window.localStorage.setItem('hexCode', hexCode);
        Store.dispatch({
            type: 'CHANGE_HEX_CODE',
            hexCode
        });
    }

    stepClick(e: Event) {
        Store.dispatch({
            type: 'STEP'
        });
    }

    render() {
        const state = Store.getState();

        render(html`
            <style>
                .hexCodeInput {
                    width: 50vw;
                }
            </style>

            <h1>WASM Metal</h1>
            <h2>Microarchitecture Simulator</h2>

            <div>
                <button onclick="${(e: Event) => this.stepClick(e)}">${state.instructionCycle}</button>
            </div>

            <br>

            <div>
                Cycles: ${state.numberOfCycles}
            </div>

            <br>

            <div>
                Hex code to execute: 0x<input type="text" class="hexCodeInput" oninput="${(e: Event) => this.hexCodeInputChanged(e)}" value="${state.hexCode}">
            </div>

            <div>
                Number of registers: <input type="number" value="${state.numberOfRegisters}" oninput="${(e: Event) => this.numberOfRegistersChanged(e)}">
            </div>

            <div>
                Number of memory locations: <input type="number" value="${state.numberOfMemoryLocations}" oninput="${(e: Event) => this.numberOfMemoryLocationsChanged(e)}"
            </div>

            <br>
            <br>

            <div>
                Current opcode: <input type="text" value="${state.currentOpcode}">
            </div>

            <br>

            <div>
                Current result: <input type="text" value="${state.currentResult}">
            </div>

            <br>

            <div>
                Registers
                ${new Array(state.numberOfRegisters).fill(0).map((x, index) => {
                    return html`
                        <div>
                            ${index}: <input id="register${index}" type="text" value="${state.registers[index] !== undefined ? state.registers[index] : ''}">
                        </div>
                    `;
                })}
            </div>

            <br>

            <div>
                Memory
                ${new Array(state.numberOfMemoryLocations).fill(0).map((x, index) => {
                    return html`
                        <div>
                            ${index}: <input id="memoryLocation${index}" type="text">
                        </div>
                    `;
                })}
            </div>
        `, this);
    }
}

window.customElements.define('metal-micro-simulator', MetalMicroSimulator);
