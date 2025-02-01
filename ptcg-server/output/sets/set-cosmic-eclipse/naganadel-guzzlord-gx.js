"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NaganadelGuzzlordGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class NaganadelGuzzlordGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.TAG_TEAM, card_types_1.CardTag.ULTRA_BEAST];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = N;
        this.hp = 280;
        this.weakness = [{ type: Y }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Violent Appetite',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may discard a Pokémon from your hand. If you do, heal 60 damage from this Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Jet Pierce',
                cost: [P, D, C],
                damage: 180,
                text: ''
            },
            {
                name: 'Chaotic Order-GX',
                cost: [C],
                damage: 0,
                gxAttack: true,
                text: 'Turn all of your Prize cards face up. (Those Prize cards remain face up for the rest of the game.) If this Pokémon has at least 1 extra [P] Energy and 1 extra [D] Energy attached to it (in addition to this attack\'s cost), take 2 Prize cards. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'CEC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '158';
        this.name = 'Naganadel & Guzzlord-GX';
        this.fullName = 'Naganadel & Guzzlord-GX CEC';
        this.VIOLENT_APPETITE_MARKER = 'VIOLENT_APPETITE_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Violent Appetite
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    if (card.marker.hasMarker(this.VIOLENT_APPETITE_MARKER, this)) {
                        throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
                    }
                    const hasPokemonInHand = player.hand.cards.some(b => b instanceof pokemon_card_1.PokemonCard);
                    if (!hasPokemonInHand) {
                        throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
                    }
                    ;
                    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARDS, player.hand, { superType: card_types_1.SuperType.POKEMON }, { allowCancel: false, min: 1, max: 1 }), cards => {
                        player.hand.moveCardsTo(cards, player.discard);
                        card.marker.addMarker(this.VIOLENT_APPETITE_MARKER, this);
                        player.marker.addMarker(this.VIOLENT_APPETITE_MARKER, this);
                        prefabs_1.ABILITY_USED(player, card);
                        const healing = new game_effects_1.HealEffect(player, player.active, 60);
                        store.reduceEffect(state, healing);
                    });
                }
            });
        }
        // Chaotic Order-GX
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            if (player.usedGX === true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            player.usedGX = true;
            player.prizes.forEach(p => {
                p.isPublic = true;
                p.faceUpPrize = true;
                p.isSecret = false;
            });
            // Check for the extra energy cost.
            const extraEffectCost = [P, D, C];
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergy);
            const meetsExtraEffectCost = game_1.StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);
            if (!meetsExtraEffectCost) {
                return state;
            } // If we don't have the extra energy, we just deal damage.
            return store.prompt(state, new game_1.ChoosePrizePrompt(player.id, game_1.GameMessage.CHOOSE_PRIZE_CARD, { count: 2, allowCancel: false }), prizes => {
                for (const prize of prizes) {
                    prize.moveTo(player.hand);
                }
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.VIOLENT_APPETITE_MARKER, this)) {
            effect.player.marker.removeMarker(this.VIOLENT_APPETITE_MARKER, this);
            this.marker.removeMarker(this.VIOLENT_APPETITE_MARKER, this);
        }
        return state;
    }
}
exports.NaganadelGuzzlordGX = NaganadelGuzzlordGX;
