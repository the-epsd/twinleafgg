"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Houndoom = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Houndoom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.regulationMark = 'E';
        this.evolvesFrom = 'Houndour';
        this.tags = [card_types_1.CardTag.SINGLE_STRIKE];
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Single Strike Roar',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may search your deck for a ' +
                    'Single Strike Energy card and attach it to 1 of your Single ' +
                    'Strike Pokémon. Then, shuffle your deck. If you attached ' +
                    'Energy to a Pokémon in this way, put 2 damage counters ' +
                    'on that Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Darkness Fang',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: ''
            }
        ];
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '96';
        this.name = 'Houndoom';
        this.fullName = 'Houndoom BST';
        this.SINGLE_STRIKE_ROAR_MARKER = 'SINGLE_STRIKE_ROAR_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.SINGLE_STRIKE_ROAR_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.SPECIAL, name: 'Single Strike Energy' }, { allowCancel: true, min: 0, max: 1 }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    return;
                }
                player.marker.addMarker(this.SINGLE_STRIKE_ROAR_MARKER, this);
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.deck.moveCardTo(transfer.card, target);
                    target.damage += 20;
                }
            });
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.SINGLE_STRIKE_ROAR_MARKER, this)) {
            effect.player.marker.removeMarker(this.SINGLE_STRIKE_ROAR_MARKER, this);
        }
        return state;
    }
}
exports.Houndoom = Houndoom;
