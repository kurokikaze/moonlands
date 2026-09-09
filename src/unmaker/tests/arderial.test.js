/// <reference types="vitest/globals" />

import { State } from '../../index.js';
import { Unmaker } from '../unmaker.js';

const originalIt = globalThis.it;
const originalUpdate = State.prototype.update;
let activeTest;

State.prototype.update = function updateWithUnmaker(...args) {
    if (activeTest && !activeTest.state) {
        activeTest.state = this;
        activeTest.before = JSON.stringify(this.serializeData(0, false));
        activeTest.unmaker = new Unmaker(this);
        activeTest.unmaker.setCheckpoint();
    }

    return originalUpdate.apply(this, args);
};

globalThis.it = (name, test, timeout) => originalIt(name, async (...args) => {
    activeTest = {};
    try {
        await test(...args);
    } finally {
        if (activeTest.state) {
            activeTest.unmaker.revertToCheckpoint();
            expect(JSON.stringify(activeTest.state.serializeData(0, false))).toBe(activeTest.before);
        }
        activeTest = undefined;
    }
}, timeout);

await import('../../../test/cards/arderial.test.js');

globalThis.it = originalIt;
State.prototype.update = originalUpdate;
