"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Articuno = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Articuno extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 110;
        this.powers = [{
                name: 'Blizzard Veil',
                powerType: game_1.PowerType.ABILITY,
                text: 'As long as this Pokémon is your Active Pokémon, whenever your opponent plays a Supporter card from their hand, prevent all effects of that card done to your Benched [W] Pokémon.'
            }];
        this.attacks = [{
                name: 'Cold Cyclone',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER],
                damage: 70,
                text: 'Move 2 [W] Energy from this Pokémon to 1 of your Benched Pokémon.'
            }];
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.set = 'TEU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '32';
        this.name = 'Articuno';
        this.fullName = 'Articuno TEU';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const hasBench = player.bench.some(b => b.cards.length > 0);
            if (hasBench === false) {
                return state;
            }
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.active, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 2, max: 2, validCardTypes: [card_types_1.CardType.WATER, card_types_1.CardType.ANY, card_types_1.CardType.WLFM, card_types_1.CardType.GRW] }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.active.moveCardTo(transfer.card, target);
                }
            });
        }
        if (effect instanceof play_card_effects_1.SupporterEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const target = effect.target;
            let isArticunoInPlay = false;
            let targetIsWaterPokemon = false;
            if (opponent.active.cards.includes(this)) {
                isArticunoInPlay = true;
            }
            if (!!target && target instanceof game_1.PokemonCardList) {
                const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(target);
                store.reduceEffect(state, checkPokemonTypeEffect);
                targetIsWaterPokemon = checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.WATER);
            }
            if (!isArticunoInPlay || !targetIsWaterPokemon) {
                return state;
            }
            // Try reducing ability for opponent
            try {
                const stub = new game_effects_1.PowerEffect(opponent, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            effect.preventDefault = true;
        }
        return state;
    }
}
exports.Articuno = Articuno;
