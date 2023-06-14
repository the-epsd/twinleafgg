"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allSimpleTactics = exports.allPromptResolvers = exports.defaultArbiterOptions = exports.defaultStateScores = void 0;
const attach_energy_tactic_1 = require("./simple-tactics/attach-energy-tactic");
const attach_tool_tactic_1 = require("./simple-tactics/attach-tool-tactic");
const attack_tactic_1 = require("./simple-tactics/attack-tactic");
const retreat_tactic_1 = require("./simple-tactics/retreat-tactic");
const evolve_tactic_1 = require("./simple-tactics/evolve-tactic");
const play_basic_tactic_1 = require("./simple-tactics/play-basic-tactic");
const play_stadium_tactic_1 = require("./simple-tactics/play-stadium-tactic");
const play_supporter_tactic_1 = require("./simple-tactics/play-supporter-tactic");
const play_trainer_tactic_1 = require("./simple-tactics/play-trainer-tactic");
const use_discard_ability_tactic_1 = require("./simple-tactics/use-discard-ability-tactic");
const use_ability_tactic_1 = require("./simple-tactics/use-ability-tactic");
const use_stadium_tactic_1 = require("./simple-tactics/use-stadium-tactic");
const alert_prompt_resolver_1 = require("./prompt-resolver/alert-prompt-resolver");
const attach_energy_prompt_resolver_1 = require("./prompt-resolver/attach-energy-prompt-resolver");
const choose_attack_prompt_resolver_1 = require("./prompt-resolver/choose-attack-prompt-resolver");
const choose_cards_prompt_resolver_1 = require("./prompt-resolver/choose-cards-prompt-resolver");
const choose_energy_prompt_resolver_1 = require("./prompt-resolver/choose-energy-prompt-resolver");
const choose_pokemon_prompt_resolver_1 = require("./prompt-resolver/choose-pokemon-prompt-resolver");
const choose_prize_prompt_resolver_1 = require("./prompt-resolver/choose-prize-prompt-resolver");
const confirm_prompt_resolver_1 = require("./prompt-resolver/confirm-prompt-resolver");
const move_damage_prompt_resolver_1 = require("./prompt-resolver/move-damage-prompt-resolver");
const move_energy_prompt_resolver_1 = require("./prompt-resolver/move-energy-prompt-resolver");
const order_cards_prompt_resolver_1 = require("./prompt-resolver/order-cards-prompt-resolver");
const put_damage_prompt_resolver_1 = require("./prompt-resolver/put-damage-prompt-resolver");
const select_prompt_resolver_1 = require("./prompt-resolver/select-prompt-resolver");
const bot_arbiter_1 = require("../game/bots/bot-arbiter");
exports.defaultStateScores = {
    hand: {
        hasSupporter: 5,
        hasEnergy: 5,
        hasPokemon: 2,
        hasBasicWhenBenchEmpty: 20,
        evolutionScore: 10,
        itemScore: 2,
        cardScore: 1
    },
    active: {
        hp: 0.3,
        damage: 0.4,
        ability: 1,
        retreat: -5
    },
    bench: {
        hp: 0.1,
        damage: 0.1,
        ability: 25,
        retreat: 0
    },
    energy: {
        active: 30,
        bench: 20,
        missingColorless: -1,
        missingMatch: -2
    },
    specialConditions: {
        burned: -10,
        poisoned: -10,
        asleep: -50,
        paralyzed: -50,
        confused: -20
    },
    player: {
        winner: 10000,
        prize: 1000,
        deck: 1,
        deckLessThan10: -10
    },
    damage: {
        playerActive: -1,
        playerBench: -1,
        opponentActive: 3,
        opponentBench: 1
    },
    opponent: {
        deck: -1,
        hand: -2,
        board: -2,
        energy: -3,
        emptyBench: 50,
        noActiveEnergy: 50
    },
    tools: {
        active: 50,
        hpLeft: 1,
        minScore: 70
    },
    tactics: {
        passTurn: -1000,
        attackBonus: 100,
        supporterBonus: 25
    }
};
exports.defaultArbiterOptions = {
    flipMode: bot_arbiter_1.BotFlipMode.ALL_HEADS,
    shuffleMode: bot_arbiter_1.BotShuffleMode.NO_SHUFFLE
};
exports.allPromptResolvers = [
    alert_prompt_resolver_1.AlertPromptResolver,
    attach_energy_prompt_resolver_1.AttachEnergyPromptResolver,
    choose_attack_prompt_resolver_1.ChooseAttackPromptResolver,
    choose_cards_prompt_resolver_1.ChooseCardsPromptResolver,
    choose_energy_prompt_resolver_1.ChooseEnergyPromptResolver,
    choose_pokemon_prompt_resolver_1.ChoosePokemonPromptResolver,
    choose_prize_prompt_resolver_1.ChoosePrizePromptResolver,
    confirm_prompt_resolver_1.ConfirmPromptResolver,
    move_damage_prompt_resolver_1.MoveDamagePromptResolver,
    move_energy_prompt_resolver_1.MoveEnergyPromptResolver,
    order_cards_prompt_resolver_1.OrderCardsPromptResolver,
    put_damage_prompt_resolver_1.PutDamagePromptResolver,
    select_prompt_resolver_1.SelectPromptResolver
];
exports.allSimpleTactics = [
    evolve_tactic_1.EvolveTactic,
    play_basic_tactic_1.PlayBasicTactic,
    attach_energy_tactic_1.AttachEnergyTactic,
    attach_tool_tactic_1.AttachToolTactic,
    use_discard_ability_tactic_1.UseDiscardAbilityTactic,
    play_trainer_tactic_1.PlayTrainerTactic,
    play_stadium_tactic_1.PlayStadiumTactic,
    play_supporter_tactic_1.PlaySupporterTactic,
    use_ability_tactic_1.UseAbilityTactic,
    use_stadium_tactic_1.UseStadiumTactic,
    retreat_tactic_1.RetreatTactic,
    attack_tactic_1.AttackTactic
];
