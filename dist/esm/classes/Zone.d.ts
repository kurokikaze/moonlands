import CardInGame, { ConvertedCard, HiddenConvertedCard } from "./CardInGame.js";
import { MercenneFixed, RestrictionObjectType, ZoneType } from "../types/index.js";
import { State } from "../index.js";
export default class Zone {
    _name: string;
    _player: number | null;
    _type: ZoneType;
    ordered: boolean;
    _twister: MercenneFixed | null;
    cards: CardInGame[];
    constructor(name: string, type: ZoneType, player?: number | null, ordered?: boolean);
    setPRNG(twister: MercenneFixed): void;
    get card(): CardInGame | null;
    get name(): string;
    get player(): number | null;
    get type(): ZoneType;
    get length(): number;
    add(cards: CardInGame[]): this;
    addToTop(cards: CardInGame[]): this;
    byId(id: string): CardInGame | undefined;
    containsId(id: string): boolean;
    removeById(id: string): void;
    shuffle(): void;
    getCardsByRestriction(restrictions: RestrictionObjectType[], state: State): CardInGame[];
    _shuffle<T>(array: T[]): T[];
    empty(): void;
    serialize<T>(hidden: T): T extends true ? HiddenConvertedCard[] : ConvertedCard[];
    serialize(): ConvertedCard[];
}
