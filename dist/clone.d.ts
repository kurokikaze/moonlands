import CardInGame from "./classes/CardInGame";
import Zone from "./classes/Zone";
export default function clone<T extends (any | any[] | Date | CardInGame | Zone)>(item: T): T;
