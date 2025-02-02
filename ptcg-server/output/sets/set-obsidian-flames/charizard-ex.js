"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Charizardex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attach_energy_prompt_1 = require("../../game/store/prompts/attach-energy-prompt");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Charizardex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.POKEMON_TERA];
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Charmeleon';
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 330;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Infernal Reign',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand to evolve ' +
                    '1 of your Pokémon during your turn, you may search your ' +
                    'deck for up to 3 Basic [R] Energy cards and attach them to ' +
                    'your Pokémon in any way you like. Then, shuffle your deck. '
            }];
        this.attacks = [
            {
                name: 'Burning Darkness',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE],
                damage: 180,
                damageCalculation: '+',
                text: 'This attack does 30 more damage for each Prize card your ' +
                    'opponent has taken.'
            }
        ];
        this.set = 'OBF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '125';
        this.name = 'Charizard ex';
        this.fullName = 'Charizard ex OBF';
    }
    reduceEffect(store, state, effect) {
        if ((effect instanceof game_effects_1.EvolveEffect) && effect.pokemonCard === this) {
            const player = effect.player;
            // Try to reduce PowerEffect, to check if something is blocking our ability
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
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    const player = effect.player;
                    return store.prompt(state, new attach_energy_prompt_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Fire Energy' }, { allowCancel: false, min: 0, max: 3 }), transfers => {
                        transfers = transfers || [];
                        // cancelled by user
                        if (transfers.length === 0) {
                            return state;
                        }
                        for (const transfer of transfers) {
                            const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                            player.deck.moveCardTo(transfer.card, target);
                        }
                        state = store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                            player.deck.applyOrder(order);
                        });
                    });
                }
                return state;
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const prizesTaken = 6 - opponent.getPrizeLeft();
            const damagePerPrize = 30;
            effect.damage = this.attacks[0].damage + (prizesTaken * damagePerPrize);
        }
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Target is not Active
            if (effect.target === player.active || effect.target === opponent.active) {
                return state;
            }
            // Target is this Pokemon
            if (effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
                effect.preventDefault = true;
            }
        }
        return state;
    }
}
exports.Charizardex = Charizardex;
