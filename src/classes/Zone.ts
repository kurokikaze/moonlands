import CardInGame, { ConvertedCard, HiddenConvertedCard } from "./CardInGame";
import { MercenneFixed, ZoneType } from "../types";
import { MersenneTwister } from "../mersenneTwister";

function shuffle<T>(array: T[]): T[] {
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

export default class Zone {
	_name: string;
	_player: number | null;
	_type: ZoneType;
	ordered: boolean;
	_twister: MercenneFixed | null = null
	cards: CardInGame[];
	constructor(name: string, type: ZoneType, player: number | null = null, ordered = false) {
		this._name = name;
		this._player = player;
		this._type = type;
		this.ordered = ordered;

		this.cards = [];
	}

	setPRNG(twister: MercenneFixed) {
		this._twister = twister;
	}
	// Возвращаем карту если она единственная
	// Для зон типа ACTIVE_MAGI
	get card() {
		return this.cards.length == 1 ? this.cards[0] : null;
	}

	get name() {
		return this._name;
	}

	get player() {
		return this._player;
	}

	get type() {
		return this._type;
	}

	get length() {
		return this.cards.length;
	}

	add(cards: CardInGame[]) {
		for (let card of cards) {
			this.cards.push(card);
		}
		return this;
	}

	addToTop(cards: CardInGame[]) {
		this.cards = [...cards, ...this.cards];

		return this;
	}

	byId(id: string) {
		return this.cards.find(card => card.id === id);
	}

	containsId(id: string) {
		return this.cards.some(card => card.id === id);
	}

	removeById(id: string) {
		this.cards = this.cards.filter(card => card.id != id);
	}

	shuffle() {
		this.cards = this._shuffle(this.cards);
	}

	_shuffle<T>(array: T[]): T[] {
		var currentIndex = array.length, temporaryValue, randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			// @ts-ignore
			const randomValue = this._twister ? this._twister.random() : Math.random()
			randomIndex = Math.floor(randomValue * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}
	empty() {
		this.cards = [];
	}

	serialize<T>(hidden: T): T extends true ? HiddenConvertedCard[] : ConvertedCard[]
	serialize(): ConvertedCard[]
	serialize(hidden = false): HiddenConvertedCard[] | ConvertedCard[] {
		return hidden ? this.cards.map(card => card.serialize(true)) : this.cards.map(card => card.serialize(false));
	}
}
