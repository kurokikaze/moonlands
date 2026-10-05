# Architecture goals

* No Javascript in cards. Cards should be declarative. Don't mind all the `prompt`, `effect` or `select` calls in cards file - they just add default fields to objects. Card data and code should be separate.
* No code for individual cards. If card does something, it should tie into existing engine capabilities, not just be an "edge case" in game logic. All cards are constructed from the same pieces.
* We have to be able to interact with events as a whole and with their parts. If we want to trigger on (or replace) attack as a whole, we should be able to. If we need to trigger on (or replace) energy loss or creature death in attack - we also should be able to. That's where all this "actions transforming into more actions" scheme comes from.
* The engine have to be extendable, not just cover existing game or sets. If I would want to test custom Creature or Power, I should be able to. Be it Daybreak, custom cards or just a neat card idea.
* The engine needs to have API for bots to connect. I have already written bots for similar game, no point of letting that go to waste. Should be easier to test play too.
* All state changes go through the mutation API on `State` (`changeEnergy`, `moveCard`, `setSpellMetadata`, `attachCard`, `addContinuousEffect`, `setPrompt`, `addLogEntry` and friends). The reducer and the action maps call these methods instead of writing into `state.state`, zones or cards directly.
* Search (bots, simulations) uses the journal built into the mutation API instead of cloning the state: `const frame = state.beginSearchFrame()`, then `state.update(...)`, then `state.rollback(frame)`. While a frame is open, each mutation method records an un-action first, and `rollback` replays them in reverse order (the PRNG is restored as well). Frames can be nested; `endSearchFrame(frame)` keeps the changes instead. Any new kind of state change must go through a mutation method that records its un-action, or rollback will miss it.

## Trigger effect registry

`State` owns a derived `TriggerEffectRegistry`, separate from serialized game state.
It indexes triggers by `find.effectType`, in this order: in-play cards, active Magi
in player order, delayed triggers, then continuous effects. Matching is lazy so
metadata updates from one trigger remain visible to the next. `State` still owns
template preparation, prompt validation, and action scheduling; discovery runs
after replacement effects and before the triggering action's handler.

The registry reconciles against live source identities and trigger definitions
before each effect lookup, rebuilding only when they change. This deliberately
retains a source scan: public zone arrays, setup, and undo can mutate state without
notifications. Only the relevant effect-type bucket is passed to the matcher.
Clones create their own registry, and rollback is observed on the next lookup.
Engine-driven source and queue changes use the mutation API, so Journal frames
restore them before reconciliation. Supporting direct edits for discovery does
not make arbitrary public-array writes reversible by Journal. Legacy Unmaker
checkpoint rollback also restores consumed delayed triggers and invalidates the
gathered static/replacement caches used by trigger conditions.

Continuous triggers persist until their owning effect expires; unlike delayed
triggers, matching does not consume them. Creation captures an optional source
card from `source`, `triggerSource`, or spell metadata. `%self` refers to that
captured incarnation, even after it leaves play. Source-independent triggers may
omit it. Continuous triggers use the effect's player and ID for ownership and
metadata, rather than sharing the source card's namespace. Rollback restores
their source metadata along with canonical effect state.
