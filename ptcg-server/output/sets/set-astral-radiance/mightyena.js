"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mightyena = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Mightyena extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Poochyena';
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Hustle Bark',
                powerType: game_1.PowerType.ABILITY,
                text: 'If your opponent has any Pokémon VMAX in play, this Pokémon\'s attacks cost [C][C][C] less.'
            }];
        this.attacks = [{
                name: 'Wild Tackle',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 160,
                text: 'This Pokémon also does 50 damage to itself.'
            }];
        this.regulationMark = 'F';
        this.set = 'ASR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '96';
        this.name = 'Mightyena';
        this.fullName = 'Mightyena ASR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                console.log(effect.cost);
                return state;
            }
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            let hasVmaxPokemon = false;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                const pokemonCard = cardList.getPokemonCard();
                if (pokemonCard && pokemonCard.tags.includes(card_types_1.CardTag.POKEMON_VMAX)) {
                    hasVmaxPokemon = true;
                }
            });
            if (hasVmaxPokemon) {
                const costToRemove = 3;
                for (let i = 0; i < costToRemove; i++) {
                    const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
                    if (index !== -1) {
                        effect.cost.splice(index, 1);
                    }
                }
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 50);
            dealDamage.target = player.active;
            return store.reduceEffect(state, dealDamage);
        }
        return state;
    }
}
exports.Mightyena = Mightyena;
