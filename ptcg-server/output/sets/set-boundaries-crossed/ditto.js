"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ditto = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Ditto extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.powers = [{
                name: 'Transform',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'During your turn (before your attack), you may put a Basic Pokémon from your hand on top of this Pokémon. ' +
                    '(This does not count as playing that Pokémon or evolving.) This Pokémon is now that Pokémon. ' +
                    '(Any cards attached to this Pokémon, damage counters, Special Conditions, turns in play, and any other effects ' +
                    'remain on the new Pokémon.)',
            }];
        this.attacks = [];
        this.set = 'BCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '108';
        this.name = 'Ditto';
        this.fullName = 'Ditto BCR';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            const targetCardList = game_1.StateUtils.findCardList(state, this);
            if (!(targetCardList instanceof game_1.PokemonCardList)) {
                throw new game_1.GameError(game_1.GameMessage.INVALID_TARGET);
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS, player.hand, { superType: game_1.SuperType.POKEMON, stage: game_1.Stage.BASIC }, { min: 1, max: 1, allowCancel: false }), (selection) => {
                if (selection.length <= 0) {
                    throw new game_1.GameError(game_1.GameMessage.INVALID_TARGET);
                }
                const pokemonCard = selection[0];
                if (!(pokemonCard instanceof game_1.PokemonCard)) {
                    throw new game_1.GameError(game_1.GameMessage.INVALID_TARGET);
                }
                store.log(state, game_1.GameLog.LOG_PLAYER_TRANSFORMS_INTO_POKEMON, {
                    name: player.name,
                    pokemon: this.name,
                    card: pokemonCard.name,
                    effect: effect.power.name,
                });
                player.hand.moveCardTo(pokemonCard, targetCardList);
            });
        }
        return state;
    }
}
exports.Ditto = Ditto;
