import { Region, RestrictionObjectType, StatusType, ZoneType } from "./common";
import { 
    ACTION_SELECT,

    SELECTOR_OPPONENT_ID,
    SELECTOR_OWN_MAGI,
    SELECTOR_OWN_MAGI_SINGLE,
    SELECTOR_CREATURES,
    SELECTOR_ENEMY_MAGI,
    SELECTOR_CREATURES_OF_PLAYER,
    SELECTOR_CREATURES_AND_MAGI,
    SELECTOR_CREATURES_OF_REGION,
    SELECTOR_CREATURES_NOT_OF_REGION,
    SELECTOR_OWN_CREATURES,
    SELECTOR_ENEMY_CREATURES,
    SELECTOR_MAGI_OF_REGION,
    SELECTOR_MAGI_NOT_OF_REGION,
    SELECTOR_TOP_MAGI_OF_PILE,
    SELECTOR_CARDS_WITH_ENERGIZE_RATE,
    SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE,
    SELECTOR_OWN_CARDS_IN_PLAY,
    SELECTOR_MAGI,
    SELECTOR_ID,
    SELECTOR_RELICS,
    SELECTOR_CREATURES_NOT_OF_TYPE,
    SELECTOR_OWN_CREATURES_OF_TYPE,
    SELECTOR_CREATURES_OF_TYPE,
    SELECTOR_OWN_SPELLS_IN_HAND,
    SELECTOR_OTHER_CREATURES_OF_TYPE,
    SELECTOR_OWN_CREATURES_WITH_STATUS,
    SELECTOR_CREATURES_WITHOUT_STATUS,
    SELECTOR_STATUS,
    SELECTOR_OWN_CREATURE_WITH_LEAST_ENERGY,
    SELECTOR_NTH_CARD_OF_ZONE,
} from "../const";

export type SelectorParams = {
    selector: SelectorTypeType,
    variable?: string,
    opponentOf?: string,
    creatureType?: string,
    region?: Region,
    status?: string,
}

export type SelectorTypeType = typeof SELECTOR_OPPONENT_ID |
    typeof SELECTOR_MAGI |
    typeof SELECTOR_ID |
    typeof SELECTOR_CREATURES_OF_PLAYER |
    typeof SELECTOR_OWN_MAGI |
    typeof SELECTOR_OWN_MAGI_SINGLE |
    typeof SELECTOR_CREATURES |
    typeof SELECTOR_ENEMY_MAGI |
    typeof SELECTOR_RELICS |
    typeof SELECTOR_CREATURES_AND_MAGI |
    typeof SELECTOR_CREATURES_OF_REGION |
    typeof SELECTOR_CREATURES_NOT_OF_REGION |
    typeof SELECTOR_CREATURES_NOT_OF_TYPE |
    typeof SELECTOR_OWN_CREATURES |
    typeof SELECTOR_ENEMY_CREATURES |
    typeof SELECTOR_MAGI_OF_REGION |
    typeof SELECTOR_MAGI_NOT_OF_REGION |
    typeof SELECTOR_TOP_MAGI_OF_PILE |
    typeof SELECTOR_CARDS_WITH_ENERGIZE_RATE |
    typeof SELECTOR_OWN_CREATURES_OF_TYPE |
    typeof SELECTOR_CREATURES_OF_TYPE |
    typeof SELECTOR_OWN_SPELLS_IN_HAND |
    typeof SELECTOR_OTHER_CREATURES_OF_TYPE |
    typeof SELECTOR_OWN_CREATURES_WITH_STATUS |
    typeof SELECTOR_CREATURES_WITHOUT_STATUS |
    typeof SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE |
    typeof SELECTOR_OWN_CARDS_IN_PLAY |
    typeof SELECTOR_STATUS |
    typeof SELECTOR_OWN_CREATURE_WITH_LEAST_ENERGY;

interface SelectAction {
    type: typeof ACTION_SELECT;
    player?: number;
    variable?: string;
    generatedBy?: string;
    replacedBy?: string[];
}

// Variable can always be specified
interface SelectParams {
    variable?: string;
}

type SelectOwnCardsInPlay = SelectAction & {
    selector: typeof SELECTOR_OWN_CARDS_IN_PLAY;
}

type SelectOwnCreaturesOfTypeParams = SelectParams & {
    selector: typeof SELECTOR_OWN_CREATURES_OF_TYPE;
    creatureType: string;
}

type SelectOwnCreaturesOfType = SelectAction & SelectOwnCreaturesOfTypeParams;

type SelectCreaturesParams = SelectParams & {
    selector: typeof SELECTOR_CREATURES;
}

type SelectCreatures = SelectAction & SelectCreaturesParams;

type SelectMagiParams = SelectParams & {
    selector: typeof SELECTOR_MAGI;
}

type SelectMagi = SelectAction & SelectMagiParams;

type SelectOwnCreaturesParams = SelectParams & {
    selector: typeof SELECTOR_OWN_CREATURES;
}

type SelectOwnCreatures = SelectAction & SelectOwnCreaturesParams;

type SelectCreaturesOfTypeParams = SelectParams & {
    selector: typeof SELECTOR_CREATURES_OF_TYPE;
    creatureType: string;
}

type SelectCreaturesOfType = SelectAction & SelectCreaturesOfTypeParams;

type SelectOtherCreaturesOfTypeParams = SelectParams & {
    selector: typeof SELECTOR_OTHER_CREATURES_OF_TYPE;
    creatureType: string;
}

type SelectOtherCreaturesOfType = SelectAction & SelectOtherCreaturesOfTypeParams;

type SelectCreaturesNotOfTypeParams = SelectParams & {
    selector: typeof SELECTOR_CREATURES_NOT_OF_TYPE;
    creatureType: string;
}

type SelectCreaturesNotOfType = SelectAction & SelectCreaturesNotOfTypeParams;

type SelectRelicsParams = SelectParams & {
    selector: typeof SELECTOR_RELICS;
}

type SelectRelics = SelectAction & SelectRelicsParams;

type SelectOwnMagiParams = SelectParams & {
    selector: typeof SELECTOR_OWN_MAGI;
}

type SelectOwnMagi = SelectAction & SelectOwnMagiParams;

type SelectEnemyMagiParams = SelectParams & {
    selector: typeof SELECTOR_ENEMY_MAGI;
}

type SelectEnemyMagi = SelectAction & SelectEnemyMagiParams;

type SelectCardsWithEnergizeRateParams = {
    selector: typeof SELECTOR_CARDS_WITH_ENERGIZE_RATE;
}
type SelectCardsWithEnergizeRate = SelectAction & SelectCardsWithEnergizeRateParams;

type SelectOpponentIdParams = {
    selector: typeof SELECTOR_OPPONENT_ID;
    opponentOf?: string;
    variable?: string;
}

type SelectOpponentId = SelectAction & SelectOpponentIdParams;

type SelectCreaturesAndMagiParams = SelectParams & {
    selector: typeof SELECTOR_CREATURES_AND_MAGI;
}

type SelectCreaturesAndMagi = SelectAction & SelectCreaturesAndMagiParams;

type SelectOwnCardsWithEnergizeRateParams = {
    selector: typeof SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE;
}
type SelectOwnCardsWithEnergizeRate = SelectAction & SelectOwnCardsWithEnergizeRateParams;

type SelectCreaturesOfRegionParams = SelectParams & {
    selector: typeof SELECTOR_CREATURES_OF_REGION;
    region: Region;
}

type SelectCreaturesOfRegion = SelectAction & SelectCreaturesOfRegionParams;

type SelectCreaturesNotOfRegionParams = SelectParams & {
    selector: typeof SELECTOR_CREATURES_NOT_OF_REGION;
    region: Region;
}

type SelectCreaturesNotOfRegion = SelectAction & SelectCreaturesNotOfRegionParams;

type SelectMagiOfRegionParams =  SelectParams & {
    selector: typeof SELECTOR_MAGI_OF_REGION;
    region: Region;
}

type SelectMagiOfRegion =  SelectAction & SelectMagiOfRegionParams;

type SelectMagiNotOfRegionParams = {
    selector: typeof SELECTOR_MAGI_NOT_OF_REGION;
    region: Region;
}

type SelectMagiNotOfRegion =  SelectAction & SelectMagiNotOfRegionParams;

type SelectStatusParams = SelectParams & {
    selector: typeof SELECTOR_STATUS;
    status: StatusType;
}

type SelectStatus = SelectAction & SelectStatusParams;

type SelectCreaturesWithoutStatusParams = {
    selector: typeof SELECTOR_CREATURES_WITHOUT_STATUS;
    status: StatusType;
}

type SelectCreaturesWithoutStatus = SelectAction & SelectCreaturesWithoutStatusParams;

type SelectTopMagiOfPileParams = SelectParams & {
    selector: typeof SELECTOR_TOP_MAGI_OF_PILE;
}

type SelectTopMagiOfPile = SelectAction & SelectTopMagiOfPileParams;

type SelectEnemyCreaturesParams = {
    selector: typeof SELECTOR_ENEMY_CREATURES;
}

type SelectEnemyCreatures = SelectAction & SelectEnemyCreaturesParams;

type SelectOwnCreatureOfLeastEnergyParams = {
  selector: typeof SELECTOR_OWN_CREATURE_WITH_LEAST_ENERGY;
  variable?: string;
}

type SelectOwnCreatureOfLeastEnergy = SelectAction & SelectOwnCreatureOfLeastEnergyParams;

type SelectNthCardParams = {
  selector: typeof SELECTOR_NTH_CARD_OF_ZONE;
  zone: ZoneType | string;
  zoneOwner: number | string;
  cardNumber: number | string;
  restrictions?: RestrictionObjectType[];
}

type SelectNthCard = SelectAction & SelectNthCardParams;

export type RefinedSelectParams = SelectCreaturesOfTypeParams |
    SelectOtherCreaturesOfTypeParams |
    SelectCreaturesNotOfTypeParams |
    SelectOpponentIdParams |
    SelectOwnMagiParams |
    SelectEnemyMagiParams |
    SelectMagiNotOfRegionParams |
    SelectEnemyCreaturesParams |
    SelectCreaturesWithoutStatusParams |
    SelectOwnCreaturesParams |
    SelectStatusParams |
    SelectOwnCreaturesOfTypeParams | 
    SelectMagiOfRegionParams |
    SelectCreaturesParams |
    SelectMagiParams |
    SelectRelicsParams |
    SelectTopMagiOfPileParams |
    SelectCreaturesNotOfRegionParams |
    SelectCreaturesOfRegionParams |
    SelectOwnCardsWithEnergizeRateParams |
    SelectCardsWithEnergizeRateParams |
    SelectCreaturesAndMagiParams |
    SelectOwnCreatureOfLeastEnergyParams |
    SelectNthCardParams;

export type SelectType = SelectCreatures |
    SelectMagi |
    SelectOwnCardsInPlay |
    SelectOwnCreatures |
    SelectRelics |
    SelectOwnCreaturesOfType |
    SelectCreaturesOfType |
    SelectCreaturesNotOfType |
    SelectOtherCreaturesOfType |
    SelectCardsWithEnergizeRate |
    SelectOpponentId |
    SelectCreaturesAndMagi |
    SelectOwnCardsWithEnergizeRate |
    SelectCreaturesOfRegion |
    SelectCreaturesNotOfRegion |
    SelectMagiOfRegion |
    SelectMagiNotOfRegion |
    SelectStatus |
    SelectCreaturesWithoutStatus |
    SelectTopMagiOfPile |
    SelectEnemyCreatures |
    SelectOwnMagi |
    SelectEnemyMagi |
    SelectOwnCreatureOfLeastEnergy |
    SelectNthCard;
