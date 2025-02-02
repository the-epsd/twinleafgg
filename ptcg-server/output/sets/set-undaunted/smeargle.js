"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Smeargle = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Smeargle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Portrait',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), if Smeargle is your ' +
                    'Active Pokemon, you may look at your opponent\'s hand. If you do, ' +
                    'choose a Support card you find there and use the effect of that card ' +
                    'as the effect of this power. This power can\'t be used if Smeargle ' +
                    'is affected by a Special Condition.'
            }];
        this.attacks = [
            {
                name: 'Tail Rap',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'Flip 2 coins. This attack does 20 damage times the number of heads.'
            }
        ];
        this.set = 'UD';
        this.name = 'Smeargle';
        this.fullName = 'Smeargle UD';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '8';
        this.PORTRAIT_MARKER = 'PORTRAIT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.PORTRAIT_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (cardList.specialConditions.length > 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (cardList !== player.active) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.PORTRAIT_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            player.marker.addMarker(this.PORTRAIT_MARKER, this);
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_COPY_EFFECT, opponent.hand, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.SUPPORTER }, { allowCancel: true, min: 1, max: 1 }), cards => {
                if (cards === null || cards.length === 0) {
                    return;
                }
                const trainerCard = cards[0];
                const playTrainerEffect = new play_card_effects_1.TrainerEffect(player, trainerCard);
                store.reduceEffect(state, playTrainerEffect);
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], results => {
                let heads = 0;
                results.forEach(r => { heads += r ? 1 : 0; });
                effect.damage = 20 * heads;
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.PORTRAIT_MARKER, this);
        }
        return state;
    }
}
exports.Smeargle = Smeargle;
