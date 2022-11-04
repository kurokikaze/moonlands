import {nanoid} from 'nanoid';
import clone from '../clone';
import Card from './Card';

export type InGameData = { 
	energy: number;
	controller: number;
	attacked: number;
	actionsUsed: string[];
	energyLostThisTurn: number;
	defeatedCreature: boolean;
	hasAttacked: boolean;
	wasAttacked: boolean;
	burrowed?: boolean;
	ableToAttack?: boolean;
	energyLossThreshold?: number;
}

export type ConvertedCard = {
	id: string;
	card: string;
	owner: number;
	data: InGameData;
}

export type HiddenConvertedCard = {
	id: string;
	card: null;
	owner: number;
	data: {};
}

export default class CardInGame {
	private _card: Card;
	id: string;
	data: InGameData;
	owner: number;
	modifiedCard: Card;
	constructor(card: Card, owner: number) {
		this._card = card;
    this.modifiedCard = clone(card)
		this.id = nanoid();
		this.data = {
			energy: 0,
			controller: owner,
			attacked: 0,
			actionsUsed: [],
			energyLostThisTurn: 0,
			defeatedCreature: false,
			hasAttacked: false,
			wasAttacked: false,
		};
		this.owner = owner;
	}

	get card() {
		return this._card;
	}

	addEnergy(amount: number = 0) {
		this.data.energy += amount;
		return this;
	}

	removeEnergy(amount: number = 0) {
		const amountToRemove = Math.min(this.data.energy, amount);
		this.data.energy -= amountToRemove;
		this.data.energyLostThisTurn += amountToRemove;
	}

	setEnergy(amount: number) {
		const amountToRemove = Math.max(this.data.energy - amount, 0);
		this.data.energyLostThisTurn += amountToRemove;
		this.data.energy = amount;
	}

	markAttackDone() {
		this.data.hasAttacked = true;
		this.data.attacked += 1;
	}

	forbidAttacks() {
		this.data.attacked = 100; // Hack, but will work for now
	}

	markAttackReceived() {
		this.data.wasAttacked = true;
	}

	markDefeatedCreature() {
		this.data.defeatedCreature = true;
	}

	// In future, refer to actions by ID, not name
	wasActionUsed(actionName: string) {
		return this.data.actionsUsed.includes(actionName);
	}

	setActionUsed(actionName: string) {
		this.data.actionsUsed.push(actionName);
	}

	clearActionsUsed() {
		this.data.actionsUsed = [];
	}

	clearAttackMarkers() {
		this.data.wasAttacked = false;
		this.data.hasAttacked = false;
		this.data.attacked = 0;
		this.data.defeatedCreature = false;
		this.data.energyLostThisTurn = 0;
	}

	copy() {
		const newCard = new CardInGame(this._card, this.owner);
		newCard.data = {...this.data};
		newCard.id = this.id;

		return newCard;
	}

	serialize<T extends boolean>(hidden: T = false as T): T extends true ? HiddenConvertedCard : ConvertedCard  {
		return hidden ? {
      card: null,
      data: {},
      owner: this.owner,
			id: this.id,
    } as any : {
			card: this.card.name,
			data: this.data,
      owner: this.owner,
			id: this.id,
		} as ConvertedCard;
	}
}
