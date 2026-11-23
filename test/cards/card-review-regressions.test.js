import { State } from '../../src/index.ts';
import { byName } from '../../src/cards.ts';
import CardInGame from '../../src/classes/CardInGame.ts';
import * as C from '../../src/const.ts';
import { Unmaker } from '../../src/unmaker/unmaker.ts';
import { createZones, STEP_CREATURES, STEP_PRS_FIRST, STEP_PRS_SECOND } from '../utils.js';

const card = (name, owner, energy = 0) => new CardInGame(byName(name), owner).addEnergy(energy);

function setup(magi, opposingMagi, inPlay) {
	const state = new State({ zones: createZones(0, 1, inPlay, [magi]), step: STEP_PRS_FIRST, activePlayer: 0 });
	state.setPlayers(0, 1);
	state.getZone(C.ZONE_TYPE_ACTIVE_MAGI, 1).add([opposingMagi]);
	return state;
}

function resolve(state, selection) {
	return state.update({ type: C.ACTION_RESOLVE_PROMPT, player: state.state.promptPlayer, generatedBy: state.state.promptGeneratedBy, ...selection });
}

it.each([0, 1])('Fog Bank protects a creature of player %i only on the next two opposing turns', owner => {
	const target = card('Furok', owner, 4);
	const state = setup(card('Ora', 0, 10), card('Whall', 1, 10), [target]);
	const spell = card('Fog Bank', 0);
	state.getZone(C.ZONE_TYPE_HAND, 0).add([spell]);
	state.update({ type: C.ACTION_PLAY, payload: { card: spell, player: 0 } });
	resolve(state, { target });
	const attached = state.getZone(C.ZONE_TYPE_IN_PLAY).cards.find(({ card }) => card.name === 'Fog Bank');
	expect(state.state.attachedTo[attached.id]).toBe(target.id);
	expect(state.getZone(C.ZONE_TYPE_DISCARD, 0).length).toBe(0);
	const attackable = () => state.modifyByStaticAbilities(target, C.PROPERTY_CAN_BE_ATTACKED);
	const passTurn = () => {
		state.setStep(STEP_PRS_SECOND);
		state.update({ type: C.ACTION_PASS, player: state.state.activePlayer });
	};
	expect(attackable()).toBe(true);
	passTurn();
	expect(attackable()).toBe(false);
	passTurn();
	expect(attackable()).toBe(true);
	expect(state.state.attachedTo[attached.id]).toBe(target.id);
	passTurn();
	expect(attackable()).toBe(false);
	const frame = state.beginSearchFrame();
	passTurn();
	expect(attackable()).toBe(true);
	expect(state.state.attachedTo[attached.id]).toBeUndefined();
	expect(state.state.cardsAttached[target.id]).toBeUndefined();
	expect(state.getZone(C.ZONE_TYPE_DISCARD, 0).card.card.name).toBe('Fog Bank');
	state.rollback(frame);
	expect(attackable()).toBe(false);
	expect(state.state.attachedTo[attached.id]).toBe(target.id);

	state.update({
		type: C.ACTION_EFFECT,
		effectType: C.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
		target,
		sourceZone: C.ZONE_TYPE_IN_PLAY,
		destinationZone: C.ZONE_TYPE_HAND,
		generatedBy: 'remove-fog-bank-target',
	});
	expect(state.getZone(C.ZONE_TYPE_IN_PLAY).cards).toEqual([]);
	expect(state.getZone(C.ZONE_TYPE_DISCARD, 0).card.card.name).toBe('Fog Bank');
	expect(state.state.attachedTo[attached.id]).toBeUndefined();
});

it.each(['journal', 'Unmaker'])('Deck shuffle restores order and randomness through %s', mechanism => {
	const state = setup(card('Orwin', 0, 10), card('Evu', 1, 10), []);
	state.initiatePRNG(1);
	const deck = state.getZone(C.ZONE_TYPE_DECK, 0);
	const original = ['Leaf Hyren', 'Rudwot', 'Furok', 'Pruitt'].map(name => card(name, 0));
	deck.add(original);
	const discard = state.getZone(C.ZONE_TYPE_DISCARD, 0);
	const discarded = card('Giant Parathin', 0);
	discard.add([discarded]);
	const unmaker = mechanism === 'Unmaker' ? new Unmaker(state) : null;
	const frame = unmaker ? unmaker.setCheckpoint() : state.beginSearchFrame();
	const shuffle = () => state.update({ type: C.ACTION_EFFECT, effectType: C.EFFECT_TYPE_SHUFFLE_DECK, player: 0, generatedBy: 'shuffle' });

	shuffle();
	const shuffled = [...deck.cards];
	expect(shuffled).not.toEqual(original);
	expect(new Set(shuffled)).toEqual(new Set(original));
	expect(discard.cards).toEqual([discarded]);
	if (unmaker) unmaker.revertToCheckpoint();
	else state.rollback(frame);
	expect(deck.cards).toEqual(original);
	shuffle();
	expect(deck.cards).toEqual(shuffled);
});

it.each(['Ancestral Flute', "Orwin's Staff", 'Vellup'])('%s shuffles after taking the searched card', name => {
	const source = card(name, 0);
	const chosen = card(name === 'Vellup' ? 'Vellup' : 'Furok', 0);
	const target = card('Furok', 0, 4);
	const state = setup(card('Orwin', 0, 10), card('Evu', 1, 10), name === 'Vellup' ? [target] : [source, target]);
	const deck = state.getZone(C.ZONE_TYPE_DECK, 0);
	deck.add([chosen, card('Rudwot', 0), card('Leaf Hyren', 0)]);
	const hand = state.getZone(C.ZONE_TYPE_HAND, 0);
	const shuffledDecks = [];
	const shuffleZone = state.shuffleZone.bind(state);
	vi.spyOn(state, 'shuffleZone').mockImplementation(zone => {
		shuffledDecks.push({ zone, chosenWasInDeck: zone.containsId(chosen.id) });
		shuffleZone(zone);
	});

	if (name === 'Vellup') {
		state.setStep(STEP_CREATURES);
		hand.add([source]);
		state.update({ type: C.ACTION_PLAY, payload: { card: source, player: 0 } });
		resolve(state, { useEffect: true });
	} else {
		const payment = [card('Rudwot', 0), card('Leaf Hyren', 0)];
		if (name === "Orwin's Staff") hand.add(payment);
		state.update({ type: C.ACTION_POWER, source, power: source.card.data.powers[0], player: 0 });
		resolve(state, name === 'Ancestral Flute' ? { target } : { cards: payment });
	}

	resolve(state, { cards: [chosen] });
	expect(state.state.prompt).toBe(false);
	expect(hand.cards.map(({ card }) => card.name)).toEqual([chosen.card.name]);
	expect(shuffledDecks).toEqual([{ zone: deck, chosenWasInDeck: false }]);
});

it('Undertow shuffles a creature into its owner’s deck even if another player controls it', () => {
	const creature = card('Rudwot', 1, 4);
	creature.data.controller = 0;
	const state = setup(card("O'Qua", 0, 10), card('Evu', 1, 10), [creature]);
	state.initiatePRNG(1);
	const ownDeck = state.getZone(C.ZONE_TYPE_DECK, 0);
	const ownerDeck = state.getZone(C.ZONE_TYPE_DECK, 1);
	ownDeck.add([card('Leaf Hyren', 0)]);
	ownerDeck.add([card('Furok', 1), card('Leaf Hyren', 1), card('Giant Parathin', 1)]);
	const shuffle = vi.spyOn(state, 'shuffleZone');
	const spell = card('Undertow', 0);
	state.getZone(C.ZONE_TYPE_HAND, 0).add([spell]);
	state.update({ type: C.ACTION_PLAY, payload: { card: spell, player: 0 } });
	resolve(state, { target: creature });
	expect(state.state.prompt).toBe(false);
	expect(shuffle).toHaveBeenCalledExactlyOnceWith(ownerDeck);
	expect(ownDeck.cards.map(({ card }) => card.name)).toEqual(['Leaf Hyren']);
	expect(ownerDeck.cards.map(({ card }) => card.name)).toContain('Rudwot');
	expect(state.getZone(C.ZONE_TYPE_DISCARD, 1).cards).toHaveLength(0);
});

it('Recall skips only its player’s Draw Step this turn, even after Orwin leaves play', () => {
	const orwin = card('Orwin', 0, 10);
	const parathin = card('Giant Parathin', 0, 10);
	const state = setup(orwin, card('Evu', 1, 10), [parathin]);
	state.getZone(C.ZONE_TYPE_MAGI_PILE, 0).add([card('Pruitt', 0)]);
	state.getZone(C.ZONE_TYPE_DECK, 0).add([card('Furok', 0), card('Furok', 0), card('Furok', 0)]);
	state.getZone(C.ZONE_TYPE_DECK, 1).add([card('Furok', 1), card('Furok', 1)]);
	const recalled = card('Leaf Hyren', 0);
	state.getZone(C.ZONE_TYPE_DISCARD, 0).add([recalled]);

	state.update({ type: C.ACTION_POWER, source: orwin, power: orwin.card.data.powers[0], player: 0 });
	resolve(state, { cards: [recalled] });
	state.update({ type: C.ACTION_POWER, source: parathin, power: parathin.card.data.powers[0], player: 0 });
	expect(state.getZone(C.ZONE_TYPE_ACTIVE_MAGI, 0).card.card.name).toBe('Pruitt');

	const draw = (effectType, player) => state.update({ type: C.ACTION_EFFECT, effectType, player, numberOfCards: 2, generatedBy: 'test-draw' });
	const handSize = player => state.getZone(C.ZONE_TYPE_HAND, player).length;
	draw(C.EFFECT_TYPE_DRAW, 0);
	draw(C.EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP, 1);
	expect(handSize(0)).toBe(2);
	expect(handSize(1)).toBe(2);

	state.setStep(STEP_PRS_SECOND);
	state.update({ type: C.ACTION_PASS, player: 0 });
	expect(handSize(0)).toBe(2);
	expect(state.state.activePlayer).toBe(1);
	expect(state.state.continuousEffects).toHaveLength(0);

	state.update({ type: C.ACTION_EFFECT, effectType: C.EFFECT_TYPE_START_TURN, player: 0, generatedBy: 'test-next-turn' });
	state.setStep(STEP_PRS_SECOND);
	state.update({ type: C.ACTION_PASS, player: 0 });
	expect(handSize(0)).toBe(4);
});

it('Recall filters by name until Orwin leaves play and tracks memory through rollback', () => {
	const orwin = card('Orwin', 0, 10);
	const parathins = [card('Giant Parathin', 0, 10), card('Giant Parathin', 0, 10)];
	const state = setup(orwin, card('Evu', 1, 10), parathins);
	const discard = state.getZone(C.ZONE_TYPE_DISCARD, 0);
	const active = state.getZone(C.ZONE_TYPE_ACTIVE_MAGI, 0);
	state.getZone(C.ZONE_TYPE_MAGI_PILE, 0).add([card('Pruitt', 0)]);
	const first = card('Leaf Hyren', 0);
	const duplicate = card('Leaf Hyren', 0);
	const other = card('Rudwot', 0);
	discard.add([first, duplicate, other]);
	const recall = source => state.update({ type: C.ACTION_POWER, source, power: source.card.data.powers[0], player: 0 });
	const offered = () => state.state.promptParams.cards.map(({ id }) => id);

	const frame = state.beginSearchFrame();
	recall(orwin);
	resolve(state, { cards: [first] });
	expect(orwin.data.memory?.recall).toEqual(['Leaf Hyren']);
	state.rollback(frame);
	expect(orwin.data.memory).toBeUndefined();
	expect(state.state.continuousEffects).toHaveLength(0);

	recall(orwin);
	resolve(state, { cards: [first] });
	expect(state.getZone(C.ZONE_TYPE_HAND, 0).card.card.name).toBe('Leaf Hyren');
	state.clearActionsUsed(orwin);
	recall(orwin);
	expect(offered()).toEqual([other.id]);
	resolve(state, { cards: [duplicate] });
	expect(state.state.prompt).toBe(true);
	resolve(state, { cards: [other] });
	state.clearActionsUsed(orwin);
	recall(orwin);
	expect(state.state.prompt).toBe(false);
	expect(orwin.data.energy).toBe(6);

	for (const [index, source] of parathins.entries()) {
		state.update({ type: C.ACTION_POWER, source, power: source.card.data.powers[0], player: 0 });
		expect(active.card.card.name).toBe(index === 0 ? 'Pruitt' : 'Orwin');
	}
	const returned = active.card;
	expect(returned.id).not.toBe(orwin.id);
	recall(returned);
	expect(offered()).toContain(duplicate.id);
	resolve(state, { cards: [duplicate] });
	expect(returned.data.memory?.recall).toEqual(['Leaf Hyren']);
});

it('Flame Control can redistribute energy while keeping Colossus unchanged', () => {
	const colossus = card('Colossus', 0, 12);
	const donor = card('Raxis', 0, 4);
	const recipient = card('Greater Vaal', 0, 5);
	const state = setup(card('Grega', 0, 10), card('Evu', 1, 10), [colossus, donor, recipient]);
	const spell = card('Flame Control', 0);
	state.getZone(C.ZONE_TYPE_HAND, 0).add([spell]);
	state.update({ type: C.ACTION_PLAY, payload: { card: spell, player: 0 } });
	expect(state.state.promptType).toBe(C.PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES);

	for (const delta of [-1, 1]) {
		resolve(state, { energyOnCreatures: { [colossus.id]: 12 + delta, [donor.id]: 4 - delta, [recipient.id]: 5 } });
		expect(state.state.prompt).toBe(true);
		expect([colossus, donor, recipient].map(card => card.data.energy)).toEqual([12, 4, 5]);
	}

	resolve(state, { energyOnCreatures: { [colossus.id]: 12, [donor.id]: 2, [recipient.id]: 7 } });
	expect(state.state.prompt).toBe(false);
	expect([colossus, donor, recipient].map(card => card.data.energy)).toEqual([12, 2, 7]);
});

it.each([
	{ name: 'Deep Hyren', energy: 7 },
	{ name: 'Colossus', energy: 12 },
])('Dream Twist puts $name into play with $energy energy with Staff of Hyren in play', ({ name, energy }) => {
	const whall = card('Whall', 0, 10);
	const sacrifice = card('Furok', 0, 4);
	const staff = card('Staff of Hyren', 0);
	const creature = card(name, 0);
	const state = setup(whall, card('Evu', 1, 10), [sacrifice, staff]);
	state.getZone(C.ZONE_TYPE_HAND, 0).add([creature]);
	state.update({ type: C.ACTION_POWER, source: whall, power: whall.card.data.powers[0], player: 0 });
	resolve(state, { target: sacrifice });
	resolve(state, { cards: [creature] });

	expect(state.state.prompt).toBe(false);
	expect(whall.data.energy).toBe(5);
	const summoned = state.getZone(C.ZONE_TYPE_IN_PLAY).cards.find(({ card }) => card.name === name);
	expect(summoned?.data.energy).toBe(energy);
});

it('Shatterfire discards the relic without offering payment at three energy', () => {
	const raxis = card('Raxis', 0, 4);
	const relic = card('Orothean Gloves', 1);
	const opposing = card('Pruitt', 1, 3);
	const state = setup(card('Grega', 0, 10), opposing, [raxis, relic]);
	state.update({ type: C.ACTION_POWER, source: raxis, power: raxis.card.data.powers[0], player: 0 });
	resolve(state, { target: relic });
	expect(state.state.prompt).toBe(false);
	expect(opposing.data.energy).toBe(3);
	expect(state.getZone(C.ZONE_TYPE_IN_PLAY).cards).toEqual([raxis]);
	expect(state.getZone(C.ZONE_TYPE_DISCARD, 1).card.card.name).toBe('Orothean Gloves');
});

it('Heat Lens stays in play after discarding a card from the chosen hand', () => {
	const lens = card('Heat Lens', 0);
	const own = card('Grega', 0, 10);
	const discarded = card('Rudwot', 1);
	const kept = card('Furok', 1);
	const state = setup(own, card('Evu', 1, 10), [lens]);
	state.getZone(C.ZONE_TYPE_HAND, 1).add([discarded, kept]);
	state.update({ type: C.ACTION_POWER, source: lens, power: lens.card.data.powers[0], player: 0 });
	resolve(state, { targetPlayer: 1 });
	resolve(state, { cards: [discarded] });
	expect(state.state.prompt).toBe(false);
	expect(own.data.energy).toBe(8);
	expect(state.getZone(C.ZONE_TYPE_IN_PLAY).cards).toEqual([lens]);
	expect(state.getZone(C.ZONE_TYPE_HAND, 1).cards).toEqual([kept]);
	expect(state.getZone(C.ZONE_TYPE_DISCARD, 1).cards.map(({ card }) => card.name)).toEqual(['Rudwot']);
});

it('Spirit of the Flame rejects Magi and adds energy per Cald creature discarded', () => {
	const own = card('Grega', 0, 10);
	const target = card('Furok', 1, 4);
	const state = setup(own, card('Evu', 1, 10), [target]);
	const spell = card('Spirit of the Flame', 0);
	const discarded = [card('Raxis', 0), card('Greater Vaal', 0)];
	const kept = card('Rudwot', 0);
	state.getZone(C.ZONE_TYPE_HAND, 0).add([spell, ...discarded, kept]);
	state.update({ type: C.ACTION_PLAY, payload: { card: spell, player: 0 } });
	expect(state.state.promptType).toBe(C.PROMPT_TYPE_SINGLE_CREATURE);
	resolve(state, { target: own });
	expect(state.state.promptType).toBe(C.PROMPT_TYPE_SINGLE_CREATURE);
	resolve(state, { target });
	resolve(state, { cards: discarded });
	expect(state.state.prompt).toBe(false);
	expect(own.data.energy).toBe(9);
	expect(target.data.energy).toBe(6);
	expect(state.getZone(C.ZONE_TYPE_HAND, 0).cards).toEqual([kept]);
});

it.each([1, 6])('Typhoon uses the die result %i and spares Orothe creatures', roll => {
	const target = card('Furok', 1, 10);
	const orothe = card('Deep Hyren', 1, 10);
	const state = setup(card('Whall', 0, 10), card('Evu', 1, 10), [target, orothe]);
	const spell = card('Typhoon', 0);
	state.setRollDebugValue(roll);
	state.getZone(C.ZONE_TYPE_HAND, 0).add([spell]);
	state.update({ type: C.ACTION_PLAY, payload: { card: spell, player: 0 } });
	expect(target.data.energy).toBe(10 - roll);
	expect(orothe.data.energy).toBe(10);
});

it("Gorgle's Ring removes four energy from the selected Magi on a six", () => {
	const ring = card("Gorgle's Ring", 0);
	const own = card('Grega', 0, 10);
	const opposing = card('Evu', 1, 10);
	const state = setup(own, opposing, [ring]);
	state.setRollDebugValue(6);
	state.update({ type: C.ACTION_POWER, source: ring, power: ring.card.data.powers[0], player: 0 });
	expect(state.state.promptType).toBe(C.PROMPT_TYPE_SINGLE_MAGI);
	resolve(state, { target: opposing });
	expect(opposing.data.energy).toBe(6);
	expect(own.data.energy).toBe(10);
});

it('Greater Vaal adds two independently rolled results', () => {
	const vaal = card('Greater Vaal', 0, 8);
	const target = card('Furok', 1, 12);
	const state = setup(card('Grega', 0, 10), card('Evu', 1, 10), [vaal, target]);
	state.initiatePRNG(1);
	const random = vi.spyOn(state.twister, 'random').mockReturnValueOnce(0.2).mockReturnValueOnce(0.9);
	state.update({ type: C.ACTION_POWER, source: vaal, power: vaal.card.data.powers[0], player: 0 });
	resolve(state, { target });
	expect(random).toHaveBeenCalledTimes(2);
	expect(vaal.data.energy).toBe(3);
	expect(target.data.energy).toBe(4);
});

it.each([false, true])('Sanctuary returns the chosen creature to hand (targets itself: %s)', targetsItself => {
	const magi = card('Gruk', 0, 10);
	const hyren = card('Mushroom Hyren', 0, 7);
	const other = card('Furok', 0, 4);
	const target = targetsItself ? hyren : other;
	const state = setup(magi, card('Evu', 1, 10), [hyren, other]);
	state.update({ type: C.ACTION_POWER, source: hyren, power: hyren.card.data.powers[0], player: 0 });
	resolve(state, { target });

	expect(magi.data.energy).toBe(targetsItself ? 16 : 14);
	expect(state.getZone(C.ZONE_TYPE_HAND, 0).cards.map(({ card }) => card.name)).toEqual([target.card.name]);
	expect(state.getZone(C.ZONE_TYPE_DISCARD, 0).length).toBe(0);
	expect(state.getZone(C.ZONE_TYPE_IN_PLAY).cards).toEqual([targetsItself ? other : hyren]);
});

it('Cataclysm discards cards on both sides and defeats both active Magi', () => {
	const trug = card('Trug', 0, 20);
	const evu = card('Evu', 1, 10);
	const state = setup(trug, evu, [card('Furok', 0, 4), card('Rudwot', 1, 3), card('Book of Ages', 0), card('Water of Life', 1)]);
	state.getZone(C.ZONE_TYPE_MAGI_PILE, 0).add([card('Gruk', 0)]);
	state.getZone(C.ZONE_TYPE_MAGI_PILE, 1).add([card('Pruitt', 1)]);
	state.update({ type: C.ACTION_POWER, source: trug, power: trug.card.data.powers[0], player: 0 });
	expect(state.getZone(C.ZONE_TYPE_IN_PLAY).length).toBe(0);
	for (const [player, magi] of [[0, trug], [1, evu]]) {
		expect(state.getZone(C.ZONE_TYPE_DISCARD, player).length).toBe(2);
		expect(state.getZone(C.ZONE_TYPE_DEFEATED_MAGI, player).card.card.name).toBe(magi.card.name);
	}
});

it.each([
	{ energy: 10, takeSecond: true, expectedEnergy: 0 },
	{ energy: 10, takeSecond: false, expectedEnergy: 4 },
	{ energy: 9, takeSecond: false, expectedEnergy: 3 },
])('Tidal Wave with $energy energy and second target $takeSecond', ({ energy, takeSecond, expectedEnergy }) => {
	const magi = card('Whall', 0, energy);
	const first = card('Furok', 1, 4);
	const second = card('Rudwot', 1, 3);
	const state = setup(magi, card('Evu', 1, 10), [first, second]);
	const spell = card('Tidal Wave', 0);
	state.getZone(C.ZONE_TYPE_HAND, 0).add([spell]);
	state.update({ type: C.ACTION_PLAY, payload: { card: spell, player: 0 } });
	resolve(state, { target: first });
	if (energy >= 10) {
		expect(state.state.promptType).toBe(C.PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE);
		resolve(state, { cards: takeSecond ? [second] : [] });
	}
	expect(state.state.prompt).toBe(false);
	expect(magi.data.energy).toBe(expectedEnergy);
	expect(state.getZone(C.ZONE_TYPE_IN_PLAY).containsId(first.id)).toBe(false);
	expect(state.getZone(C.ZONE_TYPE_IN_PLAY).containsId(second.id)).toBe(!takeSecond);
});

it('Healing Storm accepts a controlled Pharan and rejects an opposing Pharan', () => {
	const narth = card('Cloud Narth', 0, 2);
	const own = card('Pharan', 0, 3);
	const enemy = card('Pharan', 1, 3);
	const magi = card('Ora', 0, 10);
	const state = setup(magi, card('Evu', 1, 10), [narth, enemy, own]);
	state.update({ type: C.ACTION_POWER, source: narth, power: narth.card.data.powers[1], player: 0 });
	resolve(state, { target: magi });
	expect(state.state.promptType).toBe(C.PROMPT_TYPE_SINGLE_CREATURE_FILTERED);
	resolve(state, { target: enemy });
	expect(state.state.prompt).toBe(true);
	resolve(state, { target: own });
	expect(state.state.prompt).toBe(false);
	expect(magi.data.energy).toBe(18);
	expect(state.getZone(C.ZONE_TYPE_IN_PLAY).cards).toEqual([enemy]);
});

it('Tidal Wave skips the second choice when only the protected first target remains', () => {
	const magi = card('Whall', 0, 10);
	const first = card('Lovian', 1, 4);
	const state = setup(magi, card('Evu', 1, 10), [first]);
	const spell = card('Tidal Wave', 0);
	state.getZone(C.ZONE_TYPE_HAND, 0).add([spell]);
	state.update({ type: C.ACTION_PLAY, payload: { card: spell, player: 0 } });
	resolve(state, { target: first });
	expect(state.state.prompt).toBe(false);
	expect(magi.data.energy).toBe(4);
	expect(state.getZone(C.ZONE_TYPE_IN_PLAY).cards).toEqual([first]);
});
