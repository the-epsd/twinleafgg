"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gengar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const __1 = require("../..");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
function* useNightGate(next, store, state, effect) {
    const player = effect.player;
    const hasBench = player.bench.some(b => b.cards.length > 0);
    if (hasBench === false) {
        throw new __1.GameError(__1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    let targets = [];
    yield store.prompt(state, new __1.ChoosePokemonPrompt(player.id, __1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, __1.PlayerType.BOTTOM_PLAYER, [__1.SlotType.BENCH], { allowCancel: false }), results => {
        targets = results || [];
        next();
    });
    if (targets.length > 0) {
        player.active.clearEffects();
        player.switchPokemon(targets[0]);
    }
}
class Gengar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Haunter';
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Night Gate',
                powerType: __1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn, you may switch your Active Pokémon with 1 of your Benched Pokémon.'
            }];
        this.attacks = [{
                name: 'Nightmare',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS],
                damage: 100,
                text: 'Your opponent\'s Active Pokémon is now Asleep.'
            }];
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '57';
        this.set = 'PAF';
        this.name = 'Gengar';
        this.fullName = 'Gengar PAF';
        this.NIGHT_GATE_MARKER = 'NIGHT_GATE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.NIGHT_GATE_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.NIGHT_GATE_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const generator = useNightGate(() => generator.next(), store, state, effect);
            const player = effect.player;
            if (player.marker.hasMarker(this.NIGHT_GATE_MARKER, this)) {
                throw new __1.GameError(__1.GameMessage.POWER_ALREADY_USED);
            }
            effect.player.marker.addMarker(this.NIGHT_GATE_MARKER, this);
            player.forEachPokemon(__1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                }
            });
            return generator.next().value;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const specialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.ASLEEP]);
            store.reduceEffect(state, specialCondition);
            return state;
        }
        return state;
    }
}
exports.Gengar = Gengar;
