import {html, render} from 'lit-html/lib/lit-extended.js';

class MetalMemory extends HTMLElement {
    _memory: string[];

    get memory() {
        return this._memory;
    }

    set memory(val) {
        this._memory = val;
        this.render(this._memory);
    }

    render(memory: string[]) {
        render(html`
            <div>
                Memory
                ${memory.map((x, index) => {
                    return html`
                        <div>
                            ${index}: <input id="memoryLocation${index}" type="text" value="${memory[index]}">
                        </div>
                    `;
                })}
            </div>
        `, this);
    }
}

window.customElements.define('metal-memory', MetalMemory);
