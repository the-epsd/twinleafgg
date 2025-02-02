"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slakingex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Slakingex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Vigoroth';
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 340;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [
            {
                name: 'Born to Slack',
                powerType: game_1.PowerType.ABILITY,
                text: 'If your opponent has no Pokemon ex or Pokemon V in play, this Pokemon can\'t attack.',
            }
        ];
        this.attacks = [
            {
                name: 'Great Swing',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 280,
                text: 'Discard an Energy from this Pokemon.'
            }
        ];
        this.set = 'SSP';
        this.setNumber = '147';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'H';
        this.name = 'Slaking ex';
        this.fullName = 'Slaking ex SSP';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.player.active.getPokemonCard() === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Check each of our opponent's Pokemon to see if they have an ex or V.
            let hasSpecialPokemon = false;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card.tags.includes(card_types_1.CardTag.POKEMON_ex) || card.tags.includes(card_types_1.CardTag.POKEMON_V)) {
                    hasSpecialPokemon = true;
                }
            });
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                return state;
            }
            // If we don't have a ex or V in play, block the attack.
            if (!hasSpecialPokemon) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_ABILITY);
            }
        }
        // Great Swing
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
            state = store.reduceEffect(state, checkProvidedEnergy);
            state = store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [card_types_1.CardType.COLORLESS], { allowCancel: false }), energy => {
                const cards = (energy || []).map(e => e.card);
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                discardEnergy.target = player.active;
                store.reduceEffect(state, discardEnergy);
            });
        }
        return state;
    }
}
exports.Slakingex = Slakingex;
