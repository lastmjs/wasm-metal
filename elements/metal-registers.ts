import {html, render} from 'lit-html/lib/lit-extended.js';

class MetalRegisters extends HTMLElement {
    _registers: string[];

    get registers() {
        return this._registers;
    }

    set registers(val) {
        this._registers = val;
        this.render(this._registers);
    }

    render(registers: string[]) {
        render(html`
            <div>
                Registers
                ${registers.map((x, index) => {
                    return html`
                        <div>
                            ${index}: <input id="register${index}" type="text" value="${registers[index] !== undefined ? registers[index] : ''}">
                        </div>
                    `;
                })}
            </div>
        `, this);
    }
}

window.customElements.define('metal-registers', MetalRegisters);
