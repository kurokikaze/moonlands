class Card {
	constructor(name, type, region, cost, data = {}) {
		this.name = name;
		this.type = type;
		this.region = region;
		this.cost = cost;
		this.data = {
			attacksPerTurn: 1,
			canAttackMagiDirectly: false,
			...data,
		};
	}

	getName() {
		return this.name;
	}

	getCost() {
		return this.cost;
	}
}

module.exports = Card;
