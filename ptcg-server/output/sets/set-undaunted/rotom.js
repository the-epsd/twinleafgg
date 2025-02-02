"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rotom = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Rotom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.COLORLESS, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Mischievous Trick',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may switch 1 of ' +
                    'your face-down Prize cards with the top card of your deck. ' +
                    'This power can\'t be used if Rotom is affected by a Special Condition.'
            }];
        this.attacks = [
            {
                name: 'Plasma Arrow',
                cost: [card_types_1.CardType.LIGHTNING],
                damage: 0,
                text: 'Choose 1 of your opponent\'s Pokemon. This attack does 20 ' +
                    'damage for each Energy attached to that Pokemon. This attack\'s ' +
                    'damage isn\'t affected by Weakness or Resistance.'
            }
        ];
        this.set = 'UD';
        this.name = 'Rotom';
        this.fullName = 'Rotom UD';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '20';
        this.MISCHIEVOUS_TRICK_MAREKER = 'MISCHIEVOUS_TRICK_MAREKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.MISCHIEVOUS_TRICK_MAREKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (cardList.specialConditions.length > 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.MISCHIEVOUS_TRICK_MAREKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            player.marker.addMarker(this.MISCHIEVOUS_TRICK_MAREKER, this);
            state = store.prompt(state, new game_1.ChoosePrizePrompt(player.id, game_1.GameMessage.CHOOSE_PRIZE_CARD, { count: 1, allowCancel: false }), prizes => {
                if (prizes && prizes.length > 0) {
                    const temp = player.deck.cards[0];
                    player.deck.cards[0] = prizes[0].cards[0];
                    prizes[0].cards[0] = temp;
                }
            });
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            state = store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                let damage = 0;
                targets[0].cards.forEach(c => {
                    if (c instanceof game_1.EnergyCard) {
                        damage += 20 * c.provides.length;
                    }
                });
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, damage);
                damageEffect.target = targets[0];
                store.reduceEffect(state, damageEffect);
            });
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.MISCHIEVOUS_TRICK_MAREKER, this);
        }
        return state;
    }
}
exports.Rotom = Rotom;
