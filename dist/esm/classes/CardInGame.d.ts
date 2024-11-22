import Card from './Card.js';
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
    attachedTo?: string;
};
export type ConvertedCard = {
    id: string;
    card: string;
    owner: number;
    data: InGameData;
};
export type HiddenConvertedCard = {
    id: string;
    card: null;
    owner: number;
    data: {};
};
export default class CardInGame {
    private _card;
    id: string;
    data: InGameData;
    owner: number;
    modifiedCard: Card;
    constructor(card: Card, owner: number);
    get card(): Card;
    addEnergy(amount?: number): this;
    removeEnergy(amount?: number): void;
    setEnergy(amount: number): void;
    markAttackDone(): void;
    forbidAttacks(): void;
    markAttackReceived(): void;
    markDefeatedCreature(): void;
    wasActionUsed(actionName: string): boolean;
    setActionUsed(actionName: string): void;
    clearActionsUsed(): void;
    clearAttackMarkers(): void;
    copy(): CardInGame;
    serialize<T extends boolean>(hidden?: T): T extends true ? HiddenConvertedCard : ConvertedCard;
}
