import { SimpleTacticList } from './simple-tactics/simple-tactics';
import { PromptResolverList } from './prompt-resolver/prompt-resolver';
import { BotFlipMode, BotShuffleMode } from '../game/bots/bot-arbiter';
export declare const defaultStateScores: {
    hand: {
        hasSupporter: number;
        hasEnergy: number;
        hasPokemon: number;
        hasBasicWhenBenchEmpty: number;
        evolutionScore: number;
        itemScore: number;
        cardScore: number;
    };
    active: {
        hp: number;
        damage: number;
        ability: number;
        retreat: number;
    };
    bench: {
        hp: number;
        damage: number;
        ability: number;
        retreat: number;
    };
    energy: {
        active: number;
        bench: number;
        missingColorless: number;
        missingMatch: number;
    };
    specialConditions: {
        burned: number;
        poisoned: number;
        asleep: number;
        paralyzed: number;
        confused: number;
    };
    player: {
        winner: number;
        prize: number;
        deck: number;
        deckLessThan10: number;
    };
    damage: {
        playerActive: number;
        playerBench: number;
        opponentActive: number;
        opponentBench: number;
    };
    opponent: {
        deck: number;
        hand: number;
        board: number;
        energy: number;
        emptyBench: number;
        noActiveEnergy: number;
    };
    tools: {
        active: number;
        hpLeft: number;
        minScore: number;
    };
    tactics: {
        passTurn: number;
        attackBonus: number;
        supporterBonus: number;
    };
};
export declare const defaultArbiterOptions: {
    flipMode: BotFlipMode;
    shuffleMode: BotShuffleMode;
};
export declare const allPromptResolvers: PromptResolverList;
export declare const allSimpleTactics: SimpleTacticList;
