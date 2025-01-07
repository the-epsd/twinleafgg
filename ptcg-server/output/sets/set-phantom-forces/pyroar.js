"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pyroar = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Pyroar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Litleo';
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Flare Command',
                powerType: pokemon_types_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may discard a [R] Energy attached to this Pokémon. If you do, switch 1 of your opponent\'s Benched Pokémon with his or her Active Pokémon.'
            }];
        this.attacks = [{
                name: 'Inferno Onrush',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS],
                damage: 110,
                text: 'This Pokémon does 30 damage to itself.'
            }];
        this.set = 'PHF';
        this.name = 'Pyroar';
        this.fullName = 'Pyroar PHF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '12';
        this.FLARE_COMMAND_MARKER = 'FLARE_COMMAND_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 30);
            dealDamage.target = player.active;
            return store.reduceEffect(state, dealDamage);
        }
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.FLARE_COMMAND_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.FLARE_COMMAND_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (player.marker.hasMarker(this.FLARE_COMMAND_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            const hasEnergyAttached = cardList.cards.some(c => {
                return c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC && c.name === 'Fire Energy';
            });
            if (!hasEnergyAttached) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.active, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Fire Energy' }, { min: 1, max: 1, allowCancel: false }), selected => {
                selected || [];
                if (selected.length === 0) {
                    return;
                }
                player.active.moveCardsTo(selected, player.discard);
                player.marker.addMarker(this.FLARE_COMMAND_MARKER, this);
                const opponent = game_1.StateUtils.getOpponent(state, player);
                const hasBench = opponent.bench.some(b => b.cards.length > 0);
                if (!hasBench) {
                    return state;
                }
                return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                    const cardList = result[0];
                    opponent.switchPokemon(cardList);
                    return state;
                });
            });
        }
        return state;
    }
}
exports.Pyroar = Pyroar;
