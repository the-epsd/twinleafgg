"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MewVMAX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class MewVMAX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_VMAX, card_types_1.CardTag.FUSION_STRIKE];
        this.regulationMark = 'E';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 310;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.retreat = [];
        this.attacks = [{
                name: 'Cross Fusion Strike',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'This Pokemon can use the attacks of any Pokemon in play ' +
                    '(both yours and your opponent\'s). (You still need the necessary ' +
                    'Energy to use each attack.)'
            },
            {
                name: 'Max Miracle',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC],
                damage: 130,
                text: 'This attack\'s damage isn\'t affected by any effects on your ' +
                    'Opponent\'s Active Pokémon.'
            }
        ];
        this.set = 'FST';
        this.set2 = 'fusionstrike';
        this.setNumber = '114';
        this.name = 'Mew VMAX';
        this.fullName = 'Mew VMAX FST 114';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const pokemonCard = player.active.getPokemonCard();
            if (pokemonCard !== this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // Build cards and blocked for Choose Attack prompt
            const { pokemonCards, blocked } = this.buildAttackList(state, store, player);
            // No attacks to copy
            if (pokemonCards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            return store.prompt(state, new game_1.ChooseAttackPrompt(player.id, game_1.GameMessage.CHOOSE_ATTACK_TO_COPY, pokemonCards, { allowCancel: true, blocked }), attack => {
                if (attack !== null) {
                    const useAttackEffect = new game_effects_1.UseAttackEffect(player, attack);
                    store.reduceEffect(state, useAttackEffect);
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const applyWeakness = new attack_effects_1.ApplyWeaknessEffect(effect, 130);
            store.reduceEffect(state, applyWeakness);
            const damage = applyWeakness.damage;
            effect.damage = 0;
            if (damage > 0) {
                opponent.active.damage += damage;
                const afterDamage = new attack_effects_1.AfterDamageEffect(effect, damage);
                state = store.reduceEffect(state, afterDamage);
            }
        }
        return state;
    }
    buildAttackList(state, store, player) {
        const pokemonCards = [];
        const blocked = [];
        player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
            this.checkAttack(state, store, player, card, pokemonCards, blocked);
        });
        return { pokemonCards, blocked };
    }
    checkAttack(state, store, player, card, pokemonCards, blocked) {
        {
            // Only include Pokemon V cards
            if (!card.tags.includes(card_types_1.CardTag.FUSION_STRIKE)) {
                return;
            }
            // No need to include this Mew VMAX to the list
            if (card === this) {
                return;
            }
            const attacks = card.attacks.filter(attack => {
            });
            const index = pokemonCards.length;
            pokemonCards.push(card);
            card.attacks.forEach(attack => {
                if (!attacks.includes(attack)) {
                    blocked.push({ index, attack: attack.name });
                }
            });
        }
    }
}
exports.MewVMAX = MewVMAX;
