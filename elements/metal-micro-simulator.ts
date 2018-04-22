import {html, render} from 'lit-html/lib/lit-extended.js';
import {createStore} from 'redux';

interface State {

}

interface Action {
    type: string;
}

interface StateChangeEvent extends CustomEvent {
    detail: {
        state: State;
    }
}

const InitialState: State = {};
const RootReducer = (state=InitialState, action: Action) => {
    switch (action.type) {
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
    }

    render() {
        const state = Store.getState();

        render(html`
            Micro simulator
        `, this);
    }
}

window.customElements.define('metal-micro-simulator', MetalMicroSimulator);
