const nanoid = require('nanoid');

class CardInGame {
	constructor(card, owner) {
		this._card = card;
		this.id = nanoid();
		this.data = {
			energy: 0,
			controller: owner,
			attacked: 0,
			actionsUsed: [],
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
		this.data.energy = Math.max(this.data.energy - parseInt(amount), 0);
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
	}

	copy() {
		const newCard = new CardInGame(this._card, this.owner);
		newCard.data = {...this.data};
		newCard.id = this.id;

		return newCard;
	}

	serialize() {
		return {
			card: this.card.name,
			data: this.data,
			id: this.id,
		};
	}
}

module.exports = CardInGame;
