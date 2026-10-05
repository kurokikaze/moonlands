export const snapshotCardData = (card) => ({
    flags: card.flags,
    data: Object.assign(Object.assign({}, card.data), { actionsUsed: [...card.data.actionsUsed] }),
});
export class Journal {
    constructor() {
        this.entries = [];
        this.frames = [];
    }
    get length() {
        return this.entries.length;
    }
    get hasFrames() {
        return this.frames.length > 0;
    }
    record(entry) {
        this.entries.push(entry);
    }
    beginFrame(twister) {
        const frame = {
            index: this.entries.length,
            depth: this.frames.length,
            // Snapshot PRNG so die rolls, shuffles and seeded ids replay identically
            twister: (twister && Array.isArray(twister.mt)) ? { mt: [...twister.mt], mti: twister.mti } : null,
        };
        this.frames.push(frame);
        return frame;
    }
    /** Drops the frame (and frames nested in it) keeping the changes */
    endFrame(frame) {
        this.checkFrame(frame);
        this.frames.length = frame.depth;
        if (this.frames.length === 0) {
            this.entries = [];
        }
    }
    /** Undoes every mutation recorded since the frame was started. Nested frames are discarded too. */
    rollback(frame, state) {
        this.checkFrame(frame);
        while (this.entries.length > frame.index) {
            this.undo(this.entries.pop(), state);
        }
        const twister = state.twister;
        if (frame.twister && twister) {
            twister.mt = [...frame.twister.mt];
            twister.mti = frame.twister.mti;
        }
        this.frames.length = frame.depth;
    }
    checkFrame(frame) {
        if (this.frames[frame.depth] !== frame) {
            throw new Error('Search frame is not active (already rolled back or ended)');
        }
    }
    undo(entry, state) {
        switch (entry.kind) {
            case 'energy': {
                entry.card.data.energy = entry.previousEnergy;
                entry.card.data.energyLostThisTurn = entry.previousEnergyLostThisTurn;
                break;
            }
            case 'cardData': {
                entry.card.flags = entry.previous.flags;
                Object.assign(entry.card.data, entry.previous.data);
                break;
            }
            case 'moveCard': {
                const previousTo = [...entry.to.cards];
                const previousFrom = entry.from === entry.to ? previousTo : [...entry.from.cards];
                entry.to.removeById(entry.newCard.id);
                const cards = entry.from.cards;
                entry.from.cards = [...cards.slice(0, entry.fromIndex), entry.card, ...cards.slice(entry.fromIndex)];
                state.notifyZoneChange(entry.to, previousTo);
                if (entry.from !== entry.to)
                    state.notifyZoneChange(entry.from, previousFrom);
                break;
            }
            case 'zoneCards': {
                const previous = entry.zone.cards;
                entry.zone.cards = entry.previousCards;
                state.notifyZoneChange(entry.zone, previous);
                break;
            }
            case 'key': {
                if (entry.had) {
                    entry.target[entry.key] = entry.previous;
                }
                else {
                    delete entry.target[entry.key];
                }
                break;
            }
            case 'record': {
                for (const key of Object.keys(entry.target)) {
                    delete entry.target[key];
                }
                Object.assign(entry.target, entry.previous);
                break;
            }
            case 'stateFields': {
                const continuous = state.state.continuousEffects;
                const delayed = state.state.delayedTriggers;
                Object.assign(state.state, entry.previous);
                if ('continuousEffects' in entry.previous)
                    state.notifySourceChange({ kind: 'continuous', previous: continuous, current: state.state.continuousEffects });
                if ('delayedTriggers' in entry.previous)
                    state.notifySourceChange({ kind: 'delayed', previous: delayed, current: state.state.delayedTriggers });
                break;
            }
            case 'arrayPush': {
                const continuous = entry.array === state.state.continuousEffects;
                const delayed = entry.array === state.state.delayedTriggers;
                const previous = continuous || delayed ? [...entry.array] : [];
                entry.array.splice(entry.array.length - entry.count, entry.count);
                if (continuous)
                    state.notifySourceChange({ kind: 'continuous', previous, current: state.state.continuousEffects });
                if (delayed)
                    state.notifySourceChange({ kind: 'delayed', previous, current: state.state.delayedTriggers });
                break;
            }
            case 'arrayUnshift': {
                entry.array.splice(0, entry.count);
                break;
            }
            case 'arrayShift': {
                entry.array.unshift(entry.item);
                break;
            }
            case 'winner': {
                state.winner = entry.previous;
                break;
            }
            case 'turn': {
                state.turn = entry.previous;
                break;
            }
        }
    }
}
//# sourceMappingURL=Journal.js.map