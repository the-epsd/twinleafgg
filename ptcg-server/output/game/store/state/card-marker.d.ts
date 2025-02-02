import { Card } from '../card/card';
interface MarkerItem {
    source?: Card;
    name: string;
}
export declare class Marker {
    markers: MarkerItem[];
    hasMarker(name: string, source?: Card): boolean;
    removeMarker(name: string, source?: Card): void;
    addMarker(name: string, source: Card): void;
    addMarkerToState(name: string): void;
}
export {};
