"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Banette = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Banette extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Shuppet';
        this.regulationMark = 'F';
        this.cardType = game_1.CardType.PSYCHIC;
        this.hp = 100;
        this.weakness = [{ type: game_1.CardType.DARK }];
        this.resistance = [{ type: game_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Puppet Offering',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may put a Supporter card from your discard pile into your hand. If you do, put this Pokémon in the Lost Zone. (Discard all attached cards.)'
            }];
        this.attacks = [
            {
                name: 'Spooky Shot',
                cost: [game_1.CardType.PSYCHIC, game_1.CardType.PSYCHIC],
                damage: 50,
                text: ''
            }
        ];
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '73';
        this.name = 'Banette';
        this.fullName = 'Banette LOR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const hasSupporter = player.discard.cards.some(c => {
                return c instanceof game_1.TrainerCard && c.trainerType === game_1.TrainerType.SUPPORTER;
            });
            if (!hasSupporter) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Check if DiscardToHandEffect is prevented
            const discardEffect = new play_card_effects_1.DiscardToHandEffect(player, this);
            store.reduceEffect(state, discardEffect);
            if (discardEffect.preventDefault) {
                return state;
            }
            let cards = [];
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DECK, player.discard, { superType: game_1.SuperType.TRAINER, trainerType: game_1.TrainerType.SUPPORTER }, { min: 1, max: 1, allowCancel: false }), selected => {
                cards = selected || [];
                player.discard.moveCardsTo(cards, player.hand);
            });
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    const pokemons = cardList.getPokemons();
                    cardList.moveCardsTo(pokemons, player.lostzone);
                    cardList.moveTo(player.discard);
                    cardList.clearEffects();
                }
            });
        }
        return state;
    }
}
exports.Banette = Banette;
