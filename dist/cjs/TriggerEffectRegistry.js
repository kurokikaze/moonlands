import CardInGame from './classes/CardInGame.js';
import { ACTION_EFFECT, ZONE_TYPE_ACTIVE_MAGI, ZONE_TYPE_IN_PLAY } from './const.js';
import { SourceEffectIndex } from './SourceEffectIndex.js';
/**
 * Derived state: never serialized or shared between State clones.
 * State contexts subscribe to structural edits, maintaining per-source chunks.
 * Only initialization or an explicit definition refresh scans all sources.
 * Standalone contexts without subscriptions retain the legacy reconciliation path.
 */
export class TriggerEffectRegistry {
    context;
    initialized = false;
    watchedZones = [];
    unsubscribe;
    index = new SourceEffectIndex(source => {
        if (source instanceof CardInGame) {
            return (source.card.data.triggerEffects || []).map(trigger => ({ kind: 'card', trigger, self: source, get player() { return source.data.controller; } }));
        }
        if ('find' in source) {
            return [{ kind: 'delayed', trigger: source, self: source.self, id: source.id, get player() { return source.self.data.controller; } }];
        }
        return (source.triggerEffects || []).map(trigger => ({ kind: 'continuous', trigger,
            get self() { return source.self; }, get id() { return source.id; }, get player() { return source.player; },
        }));
    }, entry => entry.trigger.find.effectType);
    sources = [];
    byEffectType = new Map();
    indexedEffectTypes = new WeakMap();
    constructor(context) {
        this.context = context;
        this.unsubscribe = context.subscribeSourceChanges?.(change => this.onSourceChange(change));
    }
    dispose() { this.unsubscribe?.(); this.invalidate(); }
    invalidate() {
        this.initialized = false;
        this.index.clear();
        this.sources = [];
        this.byEffectType.clear();
    }
    synchronize() {
        if (this.context.subscribeSourceChanges) {
            this.context.ensureSourcesCurrent?.();
            this.index.clear();
            const zones = this.context.getZones();
            this.watchedZones = [
                zones.find(zone => zone.type === ZONE_TYPE_IN_PLAY && zone.player === null),
                ...this.context.getPlayers().slice(0, 2).map(player => zones.find(zone => zone.type === ZONE_TYPE_ACTIVE_MAGI && zone.player === player)),
            ];
            this.watchedZones.forEach((zone, index) => this.index.setGroup(`zone:${index}`, zone?.cards || []));
            this.index.setGroup('delayed', this.context.getDelayedTriggers());
            this.index.setGroup('continuous', this.context.getContinuousEffects());
            this.initialized = true;
            return;
        }
        const zones = this.context.getZones();
        const watchedZones = [
            zones.find(zone => zone.type === ZONE_TYPE_IN_PLAY && zone.player === null),
            ...this.context.getPlayers().slice(0, 2).map(player => zones.find(zone => zone.type === ZONE_TYPE_ACTIVE_MAGI && zone.player === player)),
        ];
        const sources = [];
        for (const zone of watchedZones) {
            for (const card of zone?.cards || []) {
                if (card.card.data.triggerEffects?.length) {
                    sources.push({ kind: 'card', owner: card, self: card, player: card.data.controller, triggers: card.card.data.triggerEffects });
                }
            }
        }
        for (const trigger of this.context.getDelayedTriggers()) {
            sources.push({ kind: 'delayed', owner: trigger, self: trigger.self, id: trigger.id, player: trigger.self.data.controller, triggers: [trigger] });
        }
        for (const effect of this.context.getContinuousEffects()) {
            if (effect.triggerEffects?.length) {
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
        this.sources = sources.map(source => ({ ...source, triggers: [...source.triggers] }));
    }
    onSourceChange(change) {
        if (change.kind === 'batch') {
            change.changes.forEach(item => this.onSourceChange(item));
            return;
        }
        if (change.kind === 'reset') {
            this.invalidate();
            return;
        }
        if (!this.initialized)
            return;
        if (change.kind === 'zone') {
            const position = this.watchedZones.indexOf(change.zone);
            if (position !== -1)
                this.index.setGroup(`zone:${position}`, change.current);
        }
        else
            this.index.setGroup(change.kind, change.current);
    }
    getCandidates(action) {
        if (action.type !== ACTION_EFFECT)
            return [];
        if (this.context.subscribeSourceChanges) {
            this.context.ensureSourcesCurrent?.();
            if (!this.initialized)
                this.synchronize();
            return [...this.index.getByEffectType(action.effectType)];
        }
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