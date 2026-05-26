import { Action } from './action';
export declare class SandboxModifyPokemonAction implements Action {
    clientId: number;
    targetPlayerId: number;
    location: 'active' | 'bench';
    modifications: {
        damage?: number;
        hp?: number;
        energyCount?: number;
        energyTypes?: string[];
        conditions?: {
            burned?: boolean;
            poisoned?: boolean;
            asleep?: boolean;
            paralyzed?: boolean;
            confused?: boolean;
        };
        markers?: {
            [key: string]: boolean;
        };
    };
    benchIndex?: number | undefined;
    readonly type: string;
    constructor(clientId: number, targetPlayerId: number, location: 'active' | 'bench', modifications: {
        damage?: number;
        hp?: number;
        energyCount?: number;
        energyTypes?: string[];
        conditions?: {
            burned?: boolean;
            poisoned?: boolean;
            asleep?: boolean;
            paralyzed?: boolean;
            confused?: boolean;
        };
        markers?: {
            [key: string]: boolean;
        };
    }, benchIndex?: number | undefined);
}
