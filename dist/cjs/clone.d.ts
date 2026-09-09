import CardInGame from "./classes/CardInGame.js";
import Zone from "./classes/Zone.js";
export default function clone<T extends (any | any[] | Date | CardInGame | Zone)>(item: T, cardsGenerated?: Record<string, CardInGame>): T;
