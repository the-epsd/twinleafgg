"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HisuianSamurottVSTAR = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class HisuianSamurottVSTAR extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.VSTAR;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 270;
        this.evolvesFrom = 'Hisuian Samurott V';
        this.tags = [card_types_1.CardTag.POKEMON_VSTAR];
        this.powers = [
            {
                name: 'Moon Cleave Star',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'During your turn, you may put 4 damage counters on 1 of your opponent\'s Pokémon. (You can\'t use more than 1 VSTAR Power in a game.)'
            }
        ];
        this.attacks = [
            {
                name: 'Merciless Blade',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.DARK],
                damage: 110,
                text: 'If your opponent\'s Active Pokémon already has any damage counters on it, this attack does 110 more damage.'
            }
        ];
        this.set = 'ASR';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '102';
        this.name = 'Hisuian Samurott VSTAR';
        this.fullName = 'Hisuian Samurott VSTAR ASR';
        this.VSTAR_MARKER = 'VSTAR_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.VSTAR_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.marker.hasMarker(this.VSTAR_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: true }), selected => {
                const targets = selected || [];
                targets.forEach(target => {
                    target.damage += 40;
                    player.marker.addMarker(this.VSTAR_MARKER, this);
                });
                if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
                    const player = effect.player;
                    const opponent = game_1.StateUtils.getOpponent(state, player);
                    if (opponent.active.damage > 0) {
                        effect.damage += 110;
                    }
                }
            });
        }
        return state;
    }
}
exports.HisuianSamurottVSTAR = HisuianSamurottVSTAR;
