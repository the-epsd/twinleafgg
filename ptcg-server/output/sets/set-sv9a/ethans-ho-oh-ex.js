"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthansHoOhex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class EthansHoOhex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.ETHANS];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 230;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Golden Flame',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn, you may attach up to 2 Basic [R] Energy from your hand to 1 of your Benched Ethan\'s Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Shining Feather',
                cost: [R, R, R, R],
                damage: 160,
                text: 'Heal 50 damage from each of your Pokémon.'
            }
        ];
        this.regulationMark = 'I';
        this.set = 'SV9a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '20';
        this.name = 'Ethan\'s Ho-Oh ex';
        this.fullName = 'Ethan\'s Ho-Oh ex SV9a';
        this.SHINING_FEATHER_MARKER = 'SHINING_FEATHER_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.SHINING_FEATHER_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            prefabs_1.BLOCK_EFFECT_IF_MARKER(this.SHINING_FEATHER_MARKER, player, this);
            const hasEnergyInHand = player.hand.cards.some(c => {
                return c instanceof game_1.EnergyCard
                    && c.energyType === card_types_1.EnergyType.BASIC
                    && c.provides.includes(card_types_1.CardType.FIRE);
            });
            if (!hasEnergyInHand) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (cardList === undefined) {
                return state;
            }
            const blocked2 = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                if (!card.tags.includes(card_types_1.CardTag.ETHANS)) {
                    blocked2.push(target);
                }
            });
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_ACTIVE, player.hand, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Fire Energy' }, { allowCancel: false, min: 0, max: 2, blockedTo: blocked2 }), transfers => {
                transfers = transfers || [];
                prefabs_1.ADD_MARKER(this.SHINING_FEATHER_MARKER, player, this);
                prefabs_1.ABILITY_USED(player, this);
                if (transfers.length === 0) {
                    return;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.hand.moveCardTo(transfer.card, target);
                }
                return state;
            });
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.SHINING_FEATHER_MARKER, this);
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                const healEffect = new game_effects_1.HealEffect(player, cardList, 50);
                state = store.reduceEffect(state, healEffect);
                return state;
            });
        }
        return state;
    }
}
exports.EthansHoOhex = EthansHoOhex;
