import {html, render} from 'lit-html/lib/lit-extended.js';
import {
    State
} from '../wasm-metal.d';
import {Store} from '../redux/redux-store'

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

    loadClick(e: any) {
        Store.dispatch({
            type: 'LOAD_HEX_CODE_INTO_MEMORY'
        });
    }

    render() {
        const state: State = Store.getState();

        render(html`
            <style>
                .hexCodeInput {
                    width: 50vw;
                }
            </style>

            <h1>Wasm metal</h1>
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
                Source code: 0x<input type="text" class="hexCodeInput" oninput="${(e: Event) => this.hexCodeInputChanged(e)}" value="${state.hexCode}"> <button onclick="${(e: Event) => this.loadClick(e)}">Load</button>
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
                            ${index}: <input id="memoryLocation${index}" type="text" value="${state.memory[index]}">
                        </div>
                    `;
                })}
            </div>
        `, this);
    }
}

window.customElements.define('metal-micro-simulator', MetalMicroSimulator);
