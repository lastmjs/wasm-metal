import {html, render} from 'lit-html/lib/lit-extended.js';
import {createStore} from 'redux';

interface State {
    numberOfRegisters: number;
}

interface Action {
    type: string;
    numberOfRegisters: number;
}

interface StateChangeEvent extends CustomEvent {
    detail: {
        state: State;
    }
}

const InitialState: State = {
    numberOfRegisters: 10
};
const RootReducer = (state=InitialState, action: Action) => {
    switch (action.type) {
        case 'CHANGE_NUMBER_OF_REGISTERS': {
            return {
                ...state,
                numberOfRegisters: action.numberOfRegisters > 0 ? action.numberOfRegisters : 1
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
        Store.dispatch({
            type: 'CHANGE_NUMBER_OF_REGISTERS',
            numberOfRegisters: parseInt(e.target.value)
        });
    }

    render() {
        const state = Store.getState();

        render(html`
            <style>
                .hexCodeInput {
                    display: inline-block;
                    border: solid 1px black;
                    min-width: 25vw;
                }
            </style>

            <h1>WASM Metal</h1>
            <h2>Microarchitecture Simulator</h2>

            <div>
                Hex code to execute: 0x<span id="hexCodeInput" contenteditable class="hexCodeInput"></span>
            </div>

            <div>
                Number of registers: <input type="number" value="10" oninput="${(e) => this.numberOfRegistersChanged(e)}">
            </div>

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
        `, this);
    }
}

window.customElements.define('metal-micro-simulator', MetalMicroSimulator);
