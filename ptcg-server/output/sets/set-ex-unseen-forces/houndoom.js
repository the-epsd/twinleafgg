"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Houndoom = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const attack_effects_2 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const choose_energy_prompt_1 = require("../../game/store/prompts/choose-energy-prompt");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Houndoom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Houndour';
        this.cardType = R;
        this.hp = 70;
        this.retreat = [C];
        this.weakness = [{ type: W }];
        this.powers = [{
                name: 'Lonesome',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'As long as you have less Pokémon in play than your opponent, your opponent can\'t play any Trainer cards (except for Supporter cards) from his or her hand.'
            }];
        this.attacks = [
            {
                name: 'Tight Jaw',
                cost: [C, C],
                damage: 20,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            },
            {
                name: 'Flamethrower',
                cost: [R, R, C],
                damage: 70,
                text: 'Discard a [R] Energy attached to Houndoom.'
            }
        ];
        this.set = 'UF';
        this.name = 'Houndoom';
        this.fullName = 'Houndoom UF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '7';
    }
    reduceEffect(store, state, effect) {
        if ((effect instanceof play_card_effects_1.PlayItemEffect || effect instanceof play_card_effects_1.AttachPokemonToolEffect || effect instanceof play_card_effects_1.PlayStadiumEffect) &&
            game_1.StateUtils.isPokemonInPlay(effect.player, this)) {
            const owner = game_1.StateUtils.findOwner(state, game_1.StateUtils.findCardList(state, this));
            const opponent = game_1.StateUtils.getOpponent(state, owner);
            // Count Pokémon for owner
            let ownerPokemonCount = 0;
            if (owner.active.cards.length > 0)
                ownerPokemonCount++;
            owner.bench.forEach(bench => {
                if (bench.cards.length > 0)
                    ownerPokemonCount++;
            });
            // Count Pokémon for opponent
            let opponentPokemonCount = 0;
            if (opponent.active.cards.length > 0)
                opponentPokemonCount++;
            opponent.bench.forEach(bench => {
                if (bench.cards.length > 0)
                    opponentPokemonCount++;
            });
            // If owner has less Pokémon and it's opponent's turn, block the trainer card
            if (ownerPokemonCount < opponentPokemonCount && effect.player === opponent) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.PARALYZED]);
                    store.reduceEffect(state, specialConditionEffect);
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            return store.prompt(state, new choose_energy_prompt_1.ChooseEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [card_types_1.CardType.FIRE], { allowCancel: false }), energy => {
                const cards = (energy || []).map(e => e.card);
                const discardEnergy = new attack_effects_2.DiscardCardsEffect(effect, cards);
                discardEnergy.target = player.active;
                store.reduceEffect(state, discardEnergy);
            });
        }
        return state;
    }
}
exports.Houndoom = Houndoom;
