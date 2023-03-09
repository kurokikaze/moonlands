import CardInGame from "./classes/CardInGame";
import Zone from "./classes/Zone";
export default function clone<T extends (Object | Object[] | Date | CardInGame | Zone)>(item: T): T;
