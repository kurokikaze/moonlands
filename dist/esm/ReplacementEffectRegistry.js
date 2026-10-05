import { ZONE_TYPE_ACTIVE_MAGI, ZONE_TYPE_IN_PLAY } from './const.js';
import { SourceEffectIndex } from './SourceEffectIndex.js';
/** Conditions, controller and once-per-turn usage are intentionally not cached. */
export class ReplacementEffectRegistry {
    constructor(context) {
        this.context = context;
        this.initialized = false;
        this.watchedZones = [];
        this.index = new SourceEffectIndex(card => (card.card.data.replacementEffects || []).map(effect => (Object.assign(Object.assign({}, effect), { self: card }))), entry => entry.find.effectType);
        this.unsubscribe = context.subscribeSourceChanges(change => this.onSourceChange(change));
    }
    onSourceChange(change) {
        if (change.kind === 'batch')
            change.changes.forEach(item => this.onSourceChange(item));
        else if (change.kind === 'reset')
            this.invalidate();
        else if (change.kind === 'zone' && this.initialized) {
            const position = this.watchedZones.indexOf(change.zone);
            if (position !== -1)
                this.index.setGroup(`zone:${position}`, change.current);
        }
    }
    dispose() { this.unsubscribe(); this.invalidate(); }
    invalidate() { this.initialized = false; this.index.clear(); }
    getCandidates() {
        this.context.ensureSourcesCurrent();
        if (!this.initialized) {
            const zones = this.context.getZones();
            this.watchedZones = [
                zones.find(zone => zone.type === ZONE_TYPE_IN_PLAY && zone.player === null),
                ...this.context.getPlayers().slice(0, 2).map(player => zones.find(zone => zone.type === ZONE_TYPE_ACTIVE_MAGI && zone.player === player)),
            ];
            this.watchedZones.forEach((zone, index) => this.index.setGroup(`zone:${index}`, (zone === null || zone === void 0 ? void 0 : zone.cards) || []));
            this.initialized = true;
        }
        return this.index.getAll();
    }
}
//# sourceMappingURL=ReplacementEffectRegistry.js.map