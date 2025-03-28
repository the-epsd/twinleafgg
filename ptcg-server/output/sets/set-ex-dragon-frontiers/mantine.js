"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mantine = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Mantine extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = L;
        this.hp = 50;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.powers = [{
                name: 'Power Circulation',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may search your discard pile for a basic Energy card, show it to your opponent, and put it on top of your deck. If you do, put 1 damage counter on Mantine. This power can\'t be used if Mantine is affected by a Special Condition.'
            }];
        this.attacks = [
            {
                name: 'Spiral Drain',
                cost: [L],
                damage: 10,
                text: 'Remove 1 damage counter from Mantine.'
            }
        ];
        this.set = 'DF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '20';
        this.name = 'Mantine';
        this.fullName = 'Mantine DF';
        this.POWER_CIRCULATION_MARKER = 'POWER_CIRCULATION_MARKER';
    }
    reduceEffect(store, state, effect) {
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.POWER_CIRCULATION_MARKER, this);
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            //Once per turn
            if (prefabs_1.HAS_MARKER(this.POWER_CIRCULATION_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            //Must have basic energy in discard
            if (!player.discard.cards.some(c => c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            //check if power is blocked
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: pokemon_types_1.PowerType.POKEPOWER,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            //power effect
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    const deckTop = new game_1.CardList();
                    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DECK, player.discard, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 1, max: 1, allowCancel: false }), selected => {
                        selected.forEach((card, index) => {
                            store.log(state, game_1.GameLog.LOG_PLAYER_RETURNS_TO_DECK_FROM_DISCARD, { name: player.name, card: card.name });
                        });
                        player.discard.moveCardTo(selected[0], deckTop);
                        deckTop.moveToTopOfDestination(player.deck);
                        store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, selected), () => { });
                        player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                            if (cardList.getPokemonCard() === this) {
                                cardList.damage += 10;
                            }
                        });
                        prefabs_1.ADD_MARKER(this.POWER_CIRCULATION_MARKER, player, this);
                        player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                            if (cardList.getPokemonCard() === this) {
                                cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                            }
                        });
                    });
                }
            });
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            attack_effects_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON(10, effect, store, state);
        }
        return state;
    }
}
exports.Mantine = Mantine;
