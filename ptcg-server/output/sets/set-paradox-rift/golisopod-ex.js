"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Golisopodex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Golisopodex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Wimpod';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = W;
        this.hp = 270;
        this.weakness = [{ type: L }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Aqua Blade',
                cost: [C, C],
                damage: 70,
                text: ''
            },
            {
                name: 'Swing and Skedaddle',
                cost: [W, C, C],
                damage: 170,
                text: 'Discard an Energy from this Pokémon. If you do, switch it with 1 of your Benched Pokémon.'
            },
        ];
        this.set = 'PAR';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '50';
        this.name = 'Golisopod ex';
        this.fullName = 'Golisopod ex PAR';
    }
    reduceEffect(store, state, effect) {
        // Swing and Skedaddle
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            if (!player.active.cards.some(c => c instanceof game_1.EnergyCard)) {
                return state;
            }
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            state = store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [card_types_1.CardType.COLORLESS], { allowCancel: false }), energy => {
                const cards = (energy || []).map(e => e.card);
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                discardEnergy.target = player.active;
                store.reduceEffect(state, discardEnergy);
            });
            const hasBenched = player.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                const cardList = result[0];
                player.switchPokemon(cardList);
            });
        }
        return state;
    }
}
exports.Golisopodex = Golisopodex;
