import { Action } from '../store/actions/action';
import { CardTarget } from '../store/actions/play-card-action';
import { GameSettings } from '../core/game-settings';
import { State } from '../store/state/state';
import { Store } from '../store/store';
import { HeadlessPromptOverride } from './prompt-resolution';
export declare type HeadlessPromptMode = 'auto' | 'manual';
export interface HeadlessPokemonSlotConfig {
    card: string;
    energy?: string[];
    damage?: number;
    tools?: string[];
}
export interface HeadlessPlayerScenarioConfig {
    name?: string;
    active: HeadlessPokemonSlotConfig;
    bench?: HeadlessPokemonSlotConfig[];
    hand?: string[];
    deck?: string[];
    discard?: string[];
    prizeCount?: number;
}
export interface HeadlessScenarioConfig {
    player1: HeadlessPlayerScenarioConfig;
    player2: HeadlessPlayerScenarioConfig;
    turn?: number;
    activePlayer?: number;
    promptMode?: HeadlessPromptMode;
    gameSettings?: Partial<GameSettings>;
}
export interface HeadlessDeckPlayerConfig {
    id?: number;
    name: string;
    deck: string[];
}
export interface HeadlessDeckGameConfig {
    player1: HeadlessDeckPlayerConfig;
    player2: HeadlessDeckPlayerConfig;
    promptMode?: HeadlessPromptMode;
    gameSettings?: Partial<GameSettings>;
}
export interface HeadlessEvent {
    type: string;
    payload?: any;
}
export interface HeadlessSnapshot {
    summary: any;
    prompts: any[];
    events: HeadlessEvent[];
    serializedState: string;
}
export declare class HeadlessGameSession {
    readonly promptMode: HeadlessPromptMode;
    readonly store: Store;
    private readonly resolver;
    private readonly events;
    private constructor();
    static fromScenario(config: HeadlessScenarioConfig): HeadlessGameSession;
    static fromDecks(config: HeadlessDeckGameConfig): HeadlessGameSession;
    get state(): State;
    dispatch(action: Action): State;
    playCard(playerIndex: number, handIndex: number, target?: CardTarget): State;
    attack(playerIndex: number, name: string): State;
    useAbility(playerIndex: number, name: string, target: CardTarget): State;
    passTurn(playerIndex?: number): State;
    retreat(playerIndex: number, benchIndex: number): State;
    resolvePrompt(id: number, rawResult: any): State;
    overridePromptOnce(promptType: string, handler: HeadlessPromptOverride): void;
    snapshot(): HeadlessSnapshot;
    drainEvents(): HeadlessEvent[];
    private getPlayer;
    private applyGameSettings;
}
export declare function createHeadlessGame(config: HeadlessScenarioConfig | HeadlessDeckGameConfig): HeadlessGameSession;
export declare function activeTarget(): CardTarget;
