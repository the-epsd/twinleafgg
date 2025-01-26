"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Snorlax = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
function* useVoraciousness(next, store, state, self, effect) {
    const player = effect.player;
    let cards = [];
    const blocked = [];
    player.discard.cards.forEach((c, index) => {
        if (!(c.name === 'Leftovers'))
            blocked.push(index);
    });
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, {}, { min: 0, max: 2, allowCancel: false, blocked }), selected => {
        cards = selected || [];
        next();
    });
    player.marker.addMarker(self.ABILITY_USED_MARKER, self);
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === self) {
            cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
        }
    });
    player.discard.moveCardsTo(cards, player.hand);
}
class Snorlax extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 150;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Voraciousness',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may put up to 2 Leftovers cards from your discard pile into your hand.'
            }];
        this.attacks = [
            {
                name: 'Collapse',
                cost: [C, C, C],
                damage: 130,
                text: 'This Pokémon also does 30 damage to itself.'
            }
        ];
        this.regulationMark = 'G';
        this.set = 'MEW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '143';
        this.name = 'Snorlax';
        this.fullName = 'Snorlax MEW';
        this.ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.ABILITY_USED_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ABILITY_USED_MARKER, this)) {
            const player = effect.player;
            player.marker.removeMarker(this.ABILITY_USED_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            if (effect.player.marker.hasMarker(this.ABILITY_USED_MARKER, this))
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            const generator = useVoraciousness(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 30);
            dealDamage.target = player.active;
            return store.reduceEffect(state, dealDamage);
        }
        return state;
    }
}
exports.Snorlax = Snorlax;
