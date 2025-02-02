"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Swampert = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Swampert extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 170;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Marshtomp';
        this.powers = [{
                name: 'Muddy Maker',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may attach a [W] Energy card or a [F] Energy card from your hand to 1 of your Pokémon.'
            }];
        this.attacks = [{
                name: 'Earthquake',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 180,
                text: 'This attack also does 20 damage to each of your Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'FST';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '64';
        this.name = 'Swampert';
        this.fullName = 'Swampert FST';
        this.MUDDY_MAKER_MARKER = 'MUDDY_MAKER_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (cardList === player.active) {
                    return;
                }
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 20);
                damageEffect.target = cardList;
                store.reduceEffect(state, damageEffect);
            });
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            // Check to see if anything is blocking our Ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            // Can't use ability if already used
            if (player.marker.hasMarker(this.MUDDY_MAKER_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            const hasEnergyInHand = player.hand.cards.some(c => {
                const isBasicFightingEnergy = c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC && c.name === 'Fightning Energy';
                const isBasicWaterEnergy = c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC && c.name === 'Water Energy';
                return isBasicFightingEnergy || isBasicWaterEnergy;
            });
            if (!hasEnergyInHand) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const options = [
                {
                    message: game_1.GameMessage.WANT_TO_ATTACH_ONLY_WATER_ENERGY,
                    action: () => {
                        return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.hand, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Water Energy' }, { allowCancel: true, min: 1, max: 1 }), transfers => {
                            transfers = transfers || [];
                            for (const transfer of transfers) {
                                const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                                const energyCard = transfer.card;
                                const attachEnergyEffect = new play_card_effects_1.AttachEnergyEffect(player, energyCard, target);
                                store.reduceEffect(state, attachEnergyEffect);
                            }
                            player.marker.addMarker(this.MUDDY_MAKER_MARKER, this);
                            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                                if (cardList.getPokemonCard() === this) {
                                    cardList.addSpecialCondition(card_types_1.SpecialCondition.ABILITY_USED);
                                }
                            });
                        });
                    }
                },
                {
                    message: game_1.GameMessage.WANT_TO_ATTACH_ONLY_FIGHTING_ENERGY,
                    action: () => {
                        return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.hand, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Fighting Energy' }, { allowCancel: true, min: 1, max: 1 }), transfers => {
                            transfers = transfers || [];
                            for (const transfer of transfers) {
                                const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                                const energyCard = transfer.card;
                                const attachEnergyEffect = new play_card_effects_1.AttachEnergyEffect(player, energyCard, target);
                                store.reduceEffect(state, attachEnergyEffect);
                            }
                            player.marker.addMarker(this.MUDDY_MAKER_MARKER, this);
                            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                                if (cardList.getPokemonCard() === this) {
                                    cardList.addSpecialCondition(card_types_1.SpecialCondition.ABILITY_USED);
                                }
                            });
                        });
                    }
                }
            ];
            return store.prompt(state, new game_1.SelectPrompt(player.id, game_1.GameMessage.CHOOSE_OPTION, options.map(opt => opt.message), { allowCancel: false }), choice => {
                const option = options[choice];
                option.action();
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.MUDDY_MAKER_MARKER, this);
        }
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.MUDDY_MAKER_MARKER, this);
            return state;
        }
        return state;
    }
}
exports.Swampert = Swampert;
