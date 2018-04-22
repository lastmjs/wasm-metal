import {html, render} from 'lit-html/lib/lit-extended.js';
import {createStore} from 'redux';

interface State {
    numberOfRegisters: number;
    numberOfMemoryLocations: number;
    hexCode: string;
}

interface Action {
    type: string;
    numberOfRegisters?: number;
    numberOfMemoryLocations?: number;
    hexCode?: string;
}

interface StateChangeEvent extends CustomEvent {
    detail: {
        state: State;
    }
}

const InitialState: State = {
    numberOfRegisters: parseInt(window.localStorage.getItem('numberOfRegisters') || '10'),
    numberOfMemoryLocations: parseInt(window.localStorage.getItem('numberOfMemoryLocations') || '500'),
    hexCode: window.localStorage.getItem('hexCode') || ''
};

const RootReducer = (state=InitialState, action: Action) => {
    switch (action.type) {
        case 'CHANGE_NUMBER_OF_REGISTERS': {
            return {
                ...state,
                numberOfRegisters: action.numberOfRegisters > 0 ? action.numberOfRegisters : 1
            };
        }
        case 'CHANGE_NUMBER_OF_MEMORY_LOCATIONS': {
            return {
                ...state,
                numberOfMemoryLocations: action.numberOfMemoryLocations > 0 ? action.numberOfMemoryLocations : 1
            };
        }
        case 'CHANGE_HEX_CODE': {
            return {
                ...state,
                hexCode: action.hexCode
            };
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

    numberOfRegistersChanged(e) {
        const numberOfRegisters = parseInt(e.target.value);
        window.localStorage.setItem('numberOfRegisters', numberOfRegisters.toString());
        Store.dispatch({
            type: 'CHANGE_NUMBER_OF_REGISTERS',
            numberOfRegisters
        });
    }

    numberOfMemoryLocationsChanged(e) {
        const numberOfMemoryLocations = parseInt(e.target.value);
        window.localStorage.setItem('numberOfMemoryLocations', numberOfMemoryLocations.toString());
        Store.dispatch({
            type: 'CHANGE_NUMBER_OF_MEMORY_LOCATIONS',
            numberOfMemoryLocations
        });
    }

    hexCodeInputChanged(e) {
        const hexCode = e.target.value;
        window.localStorage.setItem('hexCode', hexCode);
        Store.dispatch({
            type: 'CHANGE_HEX_CODE',
            hexCode
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
                Hex code to execute: 0x<input type="text" class="hexCodeInput" oninput="${(e) => this.hexCodeInputChanged(e)}" value="${state.hexCode}">
            </div>

            <div>
                Number of registers: <input type="number" value="${state.numberOfRegisters}" oninput="${(e) => this.numberOfRegistersChanged(e)}">
            </div>

            <div>
                Number of memory locations: <input type="number" value="${state.numberOfMemoryLocations}" oninput="${(e) => this.numberOfMemoryLocationsChanged(e)}"
            </div>

            <br>
            <br>

            <div>
                Registers
                ${new Array(state.numberOfRegisters).fill(0).map((x, index) => {
                    return html`
                        <div>
                            ${index}: <input id="register${index}" type="text">
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
