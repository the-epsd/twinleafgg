"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ralts = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
class Ralts extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Memory Skip',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 10,
                text: 'Choose 1 of your opponent\'s Active Pokémon\'s attacks. During your opponent\'s next turn, that Pokémon can\'t use that attack.'
            }];
        this.set = '151';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '151';
        this.name = 'Mew ex';
        this.fullName = 'Mew ex MEW';
        this.MEAN_LOOK_MARKER = 'MEAN_LOOK_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const pokemonCard = opponent.active.getPokemonCard();
            if (pokemonCard === undefined || pokemonCard.attacks.length === 0) {
                return state;
            }
            let selected;
            store.prompt(state, new game_1.ChooseAttackPrompt(player.id, game_1.GameMessage.CHOOSE_ATTACK_TO_COPY, [pokemonCard], { allowCancel: false }), result => {
                selected = result;
            });
            opponent.active.marker.addMarker(this.MEAN_LOOK_MARKER, this);
            const attack = selected;
            if (attack === null) {
                return state;
            }
            store.log(state, game_1.GameLog.LOG_PLAYER_COPIES_ATTACK, {
                name: player.name,
                attack: attack.name
            });
            if (effect instanceof game_effects_1.AttackEffect && effect.attack === attack) {
                if (effect.player.active.marker.hasMarker(this.MEAN_LOOK_MARKER, this)) {
                    throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
                }
                //   // Perform attack
                //   const attackEffect = new AttackEffect(player, opponent, attack);
                //   store.reduceEffect(state, attackEffect);
                //   if (store.hasPrompts()) {
                //     yield store.waitPrompt(state, () => next());
                //   }
                //   if (attackEffect.damage > 0) {
                //     const dealDamage = new DealDamageEffect(attackEffect, attackEffect.damage);
                //     state = store.reduceEffect(state, dealDamage);
                //   }
            }
            return state;
        }
        return state;
    }
}
exports.Ralts = Ralts;
