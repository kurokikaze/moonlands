import { ACTION_EFFECT, ZONE_TYPE_ACTIVE_MAGI, ZONE_TYPE_IN_PLAY } from './const.js';
/**
 * Derived state: never serialized or shared between State clones.
 * Reconcile source identities and definitions before lookup, because public zone
 * arrays and unmaker can mutate canonical state without going through handlers.
 * Unchanged sources reuse the index; only candidates of this effectType are matched.
 */
export class TriggerEffectRegistry {
    constructor(context) {
        this.context = context;
        this.sources = [];
        this.byEffectType = new Map();
        this.indexedEffectTypes = new WeakMap();
    }
    invalidate() {
        this.sources = [];
        this.byEffectType.clear();
    }
    synchronize() {
        var _a, _b;
        const zones = this.context.getZones();
        const watchedZones = [
            zones.find(zone => zone.type === ZONE_TYPE_IN_PLAY && zone.player === null),
            ...this.context.getPlayers().slice(0, 2).map(player => zones.find(zone => zone.type === ZONE_TYPE_ACTIVE_MAGI && zone.player === player)),
        ];
        const sources = [];
        for (const zone of watchedZones) {
            for (const card of (zone === null || zone === void 0 ? void 0 : zone.cards) || []) {
                if ((_a = card.card.data.triggerEffects) === null || _a === void 0 ? void 0 : _a.length) {
                    sources.push({ kind: 'card', owner: card, self: card, player: card.data.controller, triggers: card.card.data.triggerEffects });
                }
            }
        }
        for (const trigger of this.context.getDelayedTriggers()) {
            sources.push({ kind: 'delayed', owner: trigger, self: trigger.self, id: trigger.id, player: trigger.self.data.controller, triggers: [trigger] });
        }
        for (const effect of this.context.getContinuousEffects()) {
            if ((_b = effect.triggerEffects) === null || _b === void 0 ? void 0 : _b.length) {
                sources.push({ kind: 'continuous', owner: effect, self: effect.self, id: effect.id, player: effect.player, triggers: effect.triggerEffects });
            }
        }
        const unchanged = sources.length === this.sources.length && sources.every((source, index) => {
            const previous = this.sources[index];
            return source.kind === previous.kind && source.owner === previous.owner &&
                source.self === previous.self && source.id === previous.id && source.player === previous.player &&
                source.triggers.length === previous.triggers.length && source.triggers.every((trigger, ordinal) => trigger === previous.triggers[ordinal] && trigger.find.effectType === this.indexedEffectTypes.get(trigger));
        });
        if (unchanged)
            return;
        this.byEffectType.clear();
        for (const source of sources) {
            for (const trigger of source.triggers) {
                this.indexedEffectTypes.set(trigger, trigger.find.effectType);
                const entry = { kind: source.kind, trigger, self: source.self, id: source.id, player: source.player };
                const bucket = this.byEffectType.get(trigger.find.effectType);
                if (bucket)
                    bucket.push(entry);
                else
                    this.byEffectType.set(trigger.find.effectType, [entry]);
            }
        }
        this.sources = sources.map(source => (Object.assign(Object.assign({}, source), { triggers: [...source.triggers] })));
    }
    getCandidates(action) {
        if (action.type !== ACTION_EFFECT)
            return [];
        this.synchronize();
        return [...(this.byEffectType.get(action.effectType) || [])];
    }
    /** Evaluate lazily, preserving metadata updates between successive matches. */
    *getMatchingTriggers(action) {
        for (const entry of this.getCandidates(action)) {
            if (this.context.matchAction(action, entry.trigger.find, entry.self))
                yield entry;
        }
    }
}
//# sourceMappingURL=TriggerEffectRegistry.js.map