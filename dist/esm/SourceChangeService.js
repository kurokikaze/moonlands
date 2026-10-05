/** Structural notifications are synchronous, post-mutation, and never gameplay actions. */
export class SourceChangeService {
    constructor(getPlayers) {
        this.getPlayers = getPlayers;
        this.listeners = new Set();
        this.players = [];
        this.batchDepth = 0;
        this.pending = [];
        this.disposed = false;
        this.ensureCurrent();
    }
    subscribe(listener) {
        if (this.disposed)
            throw new Error('Source subscriptions have been disposed');
        this.listeners.add(listener);
        return () => { this.listeners.delete(listener); };
    }
    dispose() {
        this.disposed = true;
        this.listeners.clear();
        this.pending = [];
    }
    /** Publish after the complete mutation/rollback, never between its two zone edits. */
    batch(operation) {
        this.batchDepth++;
        try {
            return operation();
        }
        finally {
            if (--this.batchDepth === 0 && this.pending.length) {
                const changes = this.pending;
                this.pending = [];
                this.emit({ kind: 'batch', changes });
            }
        }
    }
    /** Player assignments are infrequent; this is an O(1) topology check, not a source scan. */
    ensureCurrent() {
        if (this.disposed)
            return;
        const players = this.getPlayers();
        if (players[0] !== this.players[0] || players[1] !== this.players[1]) {
            this.players = players.slice(0, 2);
            this.emit({ kind: 'reset' });
        }
    }
    /** Called only by explicit State mutation boundaries and non-recording Journal inverses. */
    emit(change) {
        if (this.disposed)
            return;
        if (this.batchDepth) {
            this.pending.push('current' in change ? Object.assign(Object.assign({}, change), { previous: [...change.previous], current: [...change.current] }) : change);
            return;
        }
        for (const listener of [...this.listeners])
            listener(change);
    }
}
//# sourceMappingURL=SourceChangeService.js.map