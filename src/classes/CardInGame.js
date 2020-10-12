import nanoid from 'nanoid';

export default class CardInGame {
	constructor(card, owner) {
		this._card = card;
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

	addEnergy(amount = 0) {
		this.data.energy += parseInt(amount, 10);
		return this;
	}

	removeEnergy(amount = 0) {
		const amountToRemove = Math.min(this.data.energy, parseInt(amount, 10));
		this.data.energy -= amountToRemove;
		this.data.energyLostThisTurn += amountToRemove;
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
	wasActionUsed(actionName) {
		return this.data.actionsUsed.includes(actionName);
	}

	setActionUsed(actionName) {
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

	serialize(hidden) {
		return {
			card: hidden ? null : this.card.name,
			data: hidden ? {} : this.data,
			id: this.id,
		};
	}
}
