import Card from './Card';
declare type InGameData = {
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
};
export declare type ConvertedCard = {
    id: string;
    card: string;
    owner: number;
    data: InGameData;
};
export declare type HiddenConvertedCard = {
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
export {};