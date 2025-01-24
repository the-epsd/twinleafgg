"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BanetteGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const card_types_1 = require("../../game/store/card/card-types");
const game_2 = require("../../game");
const game_3 = require("../../game");
const game_4 = require("../../game");
const game_5 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_6 = require("../../game");
// CES Banette-GX 66 (https://limitlesstcg.com/cards/CES/66)
class BanetteGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Shuppet';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 190;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Shady Move',
                useWhenInPlay: true,
                powerType: game_2.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), if this Pokémon is your Active Pokémon, you may move 1 damage counter from 1 Pokémon to another Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Shadow Chant',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 30,
                text: 'This attack does 10 more damage for each Supporter card in your discard pile. You can\'t add more than 100 damage in this way.'
            },
            {
                name: 'Tomb Hunt-GX',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 0,
                text: 'Put 3 cards from your discard pile into your hand. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'CES';
        this.setNumber = '66';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Banette-GX';
        this.fullName = 'Banette-GX CES';
        this.SHADY_MARKER = 'SHADY_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.SHADY_MARKER, this);
        }
        // Shady Move
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = game_4.StateUtils.getOpponent(state, player);
            if (player.active.getPokemonCard() !== this) {
                throw new game_1.GameError(game_2.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.SHADY_MARKER, this)) {
                throw new game_1.GameError(game_2.GameMessage.POWER_ALREADY_USED);
            }
            // damage map gaming
            const maxAllowedDamage = [];
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                const checkHpEffect = new check_effects_1.CheckHpEffect(opponent, cardList);
                store.reduceEffect(state, checkHpEffect);
                maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
            });
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                const checkHpEffect = new check_effects_1.CheckHpEffect(player, cardList);
                store.reduceEffect(state, checkHpEffect);
                maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
            });
            // doing the actual moving of cards
            return store.prompt(state, new game_1.MoveDamagePrompt(effect.player.id, game_2.GameMessage.MOVE_DAMAGE, game_1.PlayerType.ANY, [game_5.SlotType.ACTIVE, game_5.SlotType.BENCH], maxAllowedDamage, { min: 1, max: 1, allowCancel: false }), transfers => {
                if (transfers === null) {
                    return;
                }
                player.marker.addMarker(this.SHADY_MARKER, this);
                for (const transfer of transfers) {
                    const source = game_4.StateUtils.getTarget(state, player, transfer.from);
                    const target = game_4.StateUtils.getTarget(state, player, transfer.to);
                    if (source.damage >= 10) {
                        source.damage -= 10;
                        target.damage += 10;
                    }
                }
            });
        }
        // Shadow Chant
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let supportersInDiscard = 0;
            player.discard.cards.forEach(c => {
                if (c instanceof game_6.TrainerCard && c.trainerType === game_6.TrainerType.SUPPORTER) {
                    supportersInDiscard += 1;
                }
            });
            // no doing too much damage bozo
            if (supportersInDiscard > 10) {
                supportersInDiscard = 10;
            }
            effect.damage += supportersInDiscard * 10;
        }
        // Shadowy Hunter-GX
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            if (player.discard.cards.length === 0) {
                throw new game_1.GameError(game_2.GameMessage.CANNOT_USE_POWER);
            }
            // Check if player has used GX attack
            if (player.usedGX == true) {
                throw new game_1.GameError(game_2.GameMessage.LABEL_GX_USED);
            }
            // set GX attack as used for game
            player.usedGX = true;
            return store.prompt(state, [
                new game_3.ChooseCardsPrompt(player, game_2.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, {}, { min: 1, max: 3, allowCancel: false })
            ], selected => {
                const cards = selected || [];
                player.discard.moveCardsTo(cards, player.hand);
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.SHADY_MARKER, this);
        }
        return state;
    }
}
exports.BanetteGX = BanetteGX;
