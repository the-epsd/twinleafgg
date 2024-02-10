"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeoxysVSTAR = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class DeoxysVSTAR extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.evolvesFrom = 'Deoxys V';
        this.hp = 270;
        this.tags = [card_types_1.CardTag.POKEMON_VSTAR];
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Psychict Javelin',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 190,
                text: 'This attack also does 60 damage to 1 of your opponent\'s Benched Pokémon V. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Star Force',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 60,
                text: 'This attack does 60 damage for each Energy attached to both Active Pokémon. (You can\'t use more than 1 VSTAR Power in a game.)'
            },
        ];
        this.regulationMark = 'F';
        this.set = 'SSP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '268';
        this.name = 'Deoxys VSTAR';
        this.fullName = 'Deoxys VSTAR SSP';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let opponentPokemonVInPlay = false;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (list, card) => {
                if (card.tags.includes(card_types_1.CardTag.POKEMON_V || card_types_1.CardTag.POKEMON_VMAX || card_types_1.CardTag.POKEMON_VSTAR)) {
                    opponentPokemonVInPlay = true;
                }
            });
            if (!opponentPokemonVInPlay) {
                return state;
            }
            const blocked2 = [];
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (list, card, target) => {
                if (card.tags.includes(card_types_1.CardTag.POKEMON_V || card_types_1.CardTag.POKEMON_VMAX || card_types_1.CardTag.POKEMON_VSTAR)) {
                    blocked2.push(target);
                }
            });
            state = store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false, blocked: blocked2 }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 60);
                damageEffect.target = targets[0];
                store.reduceEffect(state, damageEffect);
            });
            if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
                const player = effect.player;
                const opponent = game_1.StateUtils.getOpponent(state, player);
                if (player.usedVSTAR === true) {
                    throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
                }
                player.usedVSTAR = true;
                const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(opponent);
                const checkProvidedEnergyEffect2 = new check_effects_1.CheckProvidedEnergyEffect(player);
                store.reduceEffect(state, checkProvidedEnergyEffect);
                const energyCount = checkProvidedEnergyEffect.energyMap.reduce((left, p) => left + p.provides.length, 0);
                const energyCount2 = checkProvidedEnergyEffect2.energyMap.reduce((left, p) => left + p.provides.length, 0);
                effect.damage += energyCount + energyCount2 * 60;
            }
            return state;
        }
        return state;
    }
}
exports.DeoxysVSTAR = DeoxysVSTAR;
