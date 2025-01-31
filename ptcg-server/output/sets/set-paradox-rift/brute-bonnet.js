"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BruteBonnet = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class BruteBonnet extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.ANCIENT];
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [
            {
                name: 'Toxic Powder',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, if this Pokémon has an Ancient Booster Energy Capsule attached, you may make both Active Pokémon Poisoned.'
            }
        ];
        this.attacks = [
            {
                name: 'Rampaging Hammer',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: 'During your next turn, this Pokémon can\'t attack.'
            }
        ];
        this.set = 'PAR';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '123';
        this.name = 'Brute Bonnet';
        this.fullName = 'Brute Bonnet PAR';
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
        this.TOXIC_POWDER_MARKER = 'TOXIC_POWDER_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.TOXIC_POWDER_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
            const player = effect.player;
            player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
            player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
            console.log('marker cleared');
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
            const player = effect.player;
            player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
            console.log('second marker added');
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.TOXIC_POWDER_MARKER, this);
            console.log('toxic powder marker cleared');
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let isBruteBonnetWithAncientBooster = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this && cardList.tool && cardList.tool.name === 'Ancient Booster Energy Capsule') {
                    isBruteBonnetWithAncientBooster = true;
                }
            });
            if (!isBruteBonnetWithAncientBooster) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.TOXIC_POWDER_MARKER, this)) {
                throw new game_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE(store, state, player, this);
            prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE(store, state, opponent, this);
            player.marker.addMarker(this.TOXIC_POWDER_MARKER, this);
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            // Check marker
            if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
                console.log('attack blocked');
                throw new game_1.GameError(game_message_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
            console.log('marker added');
        }
        return state;
    }
}
exports.BruteBonnet = BruteBonnet;
