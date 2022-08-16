import { Region, StatusType } from "./common";
import { ACTION_SELECT, SELECTOR_OPPONENT_ID, SELECTOR_OWN_MAGI, SELECTOR_OWN_MAGI_SINGLE, SELECTOR_CREATURES, SELECTOR_ENEMY_MAGI, SELECTOR_CREATURES_OF_PLAYER, SELECTOR_CREATURES_AND_MAGI, SELECTOR_CREATURES_OF_REGION, SELECTOR_CREATURES_NOT_OF_REGION, SELECTOR_OWN_CREATURES, SELECTOR_ENEMY_CREATURES, SELECTOR_MAGI_OF_REGION, SELECTOR_MAGI_NOT_OF_REGION, SELECTOR_TOP_MAGI_OF_PILE, SELECTOR_CARDS_WITH_ENERGIZE_RATE, SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE, SELECTOR_OWN_CARDS_IN_PLAY, SELECTOR_MAGI, SELECTOR_ID, SELECTOR_RELICS, SELECTOR_CREATURES_NOT_OF_TYPE, SELECTOR_OWN_CREATURES_OF_TYPE, SELECTOR_CREATURES_OF_TYPE, SELECTOR_OWN_SPELLS_IN_HAND, SELECTOR_OTHER_CREATURES_OF_TYPE, SELECTOR_OWN_CREATURES_WITH_STATUS, SELECTOR_CREATURES_WITHOUT_STATUS, SELECTOR_STATUS, SELECTOR_OWN_CREATURE_WITH_LEAST_ENERGY } from "../const";
export declare type SelectorParams = {
    selector: SelectorTypeType;
    variable?: string;
    opponentOf?: string;
    creatureType?: string;
    region?: Region;
    status?: string;
};
export declare type SelectorTypeType = typeof SELECTOR_OPPONENT_ID | typeof SELECTOR_MAGI | typeof SELECTOR_ID | typeof SELECTOR_CREATURES_OF_PLAYER | typeof SELECTOR_OWN_MAGI | typeof SELECTOR_OWN_MAGI_SINGLE | typeof SELECTOR_CREATURES | typeof SELECTOR_ENEMY_MAGI | typeof SELECTOR_RELICS | typeof SELECTOR_CREATURES_AND_MAGI | typeof SELECTOR_CREATURES_OF_REGION | typeof SELECTOR_CREATURES_NOT_OF_REGION | typeof SELECTOR_CREATURES_NOT_OF_TYPE | typeof SELECTOR_OWN_CREATURES | typeof SELECTOR_ENEMY_CREATURES | typeof SELECTOR_MAGI_OF_REGION | typeof SELECTOR_MAGI_NOT_OF_REGION | typeof SELECTOR_TOP_MAGI_OF_PILE | typeof SELECTOR_CARDS_WITH_ENERGIZE_RATE | typeof SELECTOR_OWN_CREATURES_OF_TYPE | typeof SELECTOR_CREATURES_OF_TYPE | typeof SELECTOR_OWN_SPELLS_IN_HAND | typeof SELECTOR_OTHER_CREATURES_OF_TYPE | typeof SELECTOR_OWN_CREATURES_WITH_STATUS | typeof SELECTOR_CREATURES_WITHOUT_STATUS | typeof SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE | typeof SELECTOR_OWN_CARDS_IN_PLAY | typeof SELECTOR_STATUS | typeof SELECTOR_OWN_CREATURE_WITH_LEAST_ENERGY;
interface SelectAction {
    type: typeof ACTION_SELECT;
    player?: number;
    variable?: string;
    generatedBy?: string;
    replacedBy?: string[];
}
interface SelectParams {
    variable?: string;
}
declare type SelectOwnCardsInPlay = SelectAction & {
    selector: typeof SELECTOR_OWN_CARDS_IN_PLAY;
};
declare type SelectOwnCreaturesOfTypeParams = SelectParams & {
    selector: typeof SELECTOR_OWN_CREATURES_OF_TYPE;
    creatureType: string;
};
declare type SelectOwnCreaturesOfType = SelectAction & SelectOwnCreaturesOfTypeParams;
declare type SelectCreaturesParams = SelectParams & {
    selector: typeof SELECTOR_CREATURES;
};
declare type SelectCreatures = SelectAction & SelectCreaturesParams;
declare type SelectMagiParams = SelectParams & {
    selector: typeof SELECTOR_MAGI;
};
declare type SelectMagi = SelectAction & SelectMagiParams;
declare type SelectOwnCreaturesParams = SelectParams & {
    selector: typeof SELECTOR_OWN_CREATURES;
};
declare type SelectOwnCreatures = SelectAction & SelectOwnCreaturesParams;
declare type SelectCreaturesOfTypeParams = SelectParams & {
    selector: typeof SELECTOR_CREATURES_OF_TYPE;
    creatureType: string;
};
declare type SelectCreaturesOfType = SelectAction & SelectCreaturesOfTypeParams;
declare type SelectOtherCreaturesOfTypeParams = SelectParams & {
    selector: typeof SELECTOR_OTHER_CREATURES_OF_TYPE;
    creatureType: string;
};
declare type SelectOtherCreaturesOfType = SelectAction & SelectOtherCreaturesOfTypeParams;
declare type SelectCreaturesNotOfTypeParams = SelectParams & {
    selector: typeof SELECTOR_CREATURES_NOT_OF_TYPE;
    creatureType: string;
};
declare type SelectCreaturesNotOfType = SelectAction & SelectCreaturesNotOfTypeParams;
declare type SelectRelicsParams = SelectParams & {
    selector: typeof SELECTOR_RELICS;
};
declare type SelectRelics = SelectAction & SelectRelicsParams;
declare type SelectOwnMagiParams = SelectParams & {
    selector: typeof SELECTOR_OWN_MAGI;
};
declare type SelectOwnMagi = SelectAction & SelectOwnMagiParams;
declare type SelectEnemyMagiParams = SelectParams & {
    selector: typeof SELECTOR_ENEMY_MAGI;
};
declare type SelectEnemyMagi = SelectAction & SelectEnemyMagiParams;
declare type SelectCardsWithEnergizeRateParams = {
    selector: typeof SELECTOR_CARDS_WITH_ENERGIZE_RATE;
};
declare type SelectCardsWithEnergizeRate = SelectAction & SelectCardsWithEnergizeRateParams;
declare type SelectOpponentIdParams = {
    selector: typeof SELECTOR_OPPONENT_ID;
    opponentOf?: string;
    variable?: string;
};
declare type SelectOpponentId = SelectAction & SelectOpponentIdParams;
declare type SelectCreaturesAndMagiParams = SelectParams & {
    selector: typeof SELECTOR_CREATURES_AND_MAGI;
};
declare type SelectCreaturesAndMagi = SelectAction & SelectCreaturesAndMagiParams;
declare type SelectOwnCardsWithEnergizeRateParams = {
    selector: typeof SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE;
};
declare type SelectOwnCardsWithEnergizeRate = SelectAction & SelectOwnCardsWithEnergizeRateParams;
declare type SelectCreaturesOfRegionParams = SelectParams & {
    selector: typeof SELECTOR_CREATURES_OF_REGION;
    region: Region;
};
declare type SelectCreaturesOfRegion = SelectAction & SelectCreaturesOfRegionParams;
declare type SelectCreaturesNotOfRegionParams = SelectParams & {
    selector: typeof SELECTOR_CREATURES_NOT_OF_REGION;
    region: Region;
};
declare type SelectCreaturesNotOfRegion = SelectAction & SelectCreaturesNotOfRegionParams;
declare type SelectMagiOfRegionParams = SelectParams & {
    selector: typeof SELECTOR_MAGI_OF_REGION;
    region: Region;
};
declare type SelectMagiOfRegion = SelectAction & SelectMagiOfRegionParams;
declare type SelectMagiNotOfRegionParams = {
    selector: typeof SELECTOR_MAGI_NOT_OF_REGION;
    region: Region;
};
declare type SelectMagiNotOfRegion = SelectAction & SelectMagiNotOfRegionParams;
declare type SelectStatusParams = SelectParams & {
    selector: typeof SELECTOR_STATUS;
    status: StatusType;
};
declare type SelectStatus = SelectAction & SelectStatusParams;
declare type SelectCreaturesWithoutStatusParams = {
    selector: typeof SELECTOR_CREATURES_WITHOUT_STATUS;
    status: StatusType;
};
declare type SelectCreaturesWithoutStatus = SelectAction & SelectCreaturesWithoutStatusParams;
declare type SelectTopMagiOfPileParams = SelectParams & {
    selector: typeof SELECTOR_TOP_MAGI_OF_PILE;
};
declare type SelectTopMagiOfPile = SelectAction & SelectTopMagiOfPileParams;
declare type SelectEnemyCreaturesParams = {
    selector: typeof SELECTOR_ENEMY_CREATURES;
};
declare type SelectEnemyCreatures = SelectAction & SelectEnemyCreaturesParams;
declare type SelectOwnCreatureOfLeastEnergyParams = {
    selector: typeof SELECTOR_OWN_CREATURE_WITH_LEAST_ENERGY;
    variable?: string;
};
declare type SelectOwnCreatureOfLeastEnergy = SelectAction & SelectOwnCreatureOfLeastEnergyParams;
export declare type RefinedSelectParams = SelectCreaturesOfTypeParams | SelectOtherCreaturesOfTypeParams | SelectCreaturesNotOfTypeParams | SelectOpponentIdParams | SelectOwnMagiParams | SelectEnemyMagiParams | SelectMagiNotOfRegionParams | SelectEnemyCreaturesParams | SelectCreaturesWithoutStatusParams | SelectOwnCreaturesParams | SelectStatusParams | SelectOwnCreaturesOfTypeParams | SelectMagiOfRegionParams | SelectCreaturesParams | SelectMagiParams | SelectRelicsParams | SelectTopMagiOfPileParams | SelectCreaturesNotOfRegionParams | SelectCreaturesOfRegionParams | SelectOwnCardsWithEnergizeRateParams | SelectCardsWithEnergizeRateParams | SelectCreaturesAndMagiParams | SelectOwnCreatureOfLeastEnergyParams;
export declare type SelectType = SelectCreatures | SelectMagi | SelectOwnCardsInPlay | SelectOwnCreatures | SelectRelics | SelectOwnCreaturesOfType | SelectCreaturesOfType | SelectCreaturesNotOfType | SelectOtherCreaturesOfType | SelectCardsWithEnergizeRate | SelectOpponentId | SelectCreaturesAndMagi | SelectOwnCardsWithEnergizeRate | SelectCreaturesOfRegion | SelectCreaturesNotOfRegion | SelectMagiOfRegion | SelectMagiNotOfRegion | SelectStatus | SelectCreaturesWithoutStatus | SelectTopMagiOfPile | SelectEnemyCreatures | SelectOwnMagi | SelectEnemyMagi | SelectOwnCreatureOfLeastEnergy;
export {};
