"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Charizardex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const attach_energy_prompt_1 = require("../../game/store/prompts/attach-energy-prompt");
class Charizardex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        //public evolvesFrom = 'Charmeleon';
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 330;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Infernal Reign',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'When you play this Pokémon from your hand to evolve ' +
                    '1 of your Pokémon during your turn, you may search your ' +
                    'deck for up to 3 Basic F Energy cards and attach them to ' +
                    'your Pokémon in any way you like. Then, shuffle your deck. '
            }];
        this.attacks = [
            {
                name: 'Burning Darkness',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE],
                damage: 180,
                text: 'This attack does 30 more damage for each Prize card your ' +
                    'opponent has taken.'
            }
        ];
        this.set = 'OBF';
        this.name = 'Charizard ex';
        this.fullName = 'Charizard ex OBF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                return state;
            }
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    state = store.prompt(state, new attach_energy_prompt_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Fire Energy' }, { allowCancel: true, min: 0, max: 3 }), transfers => {
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
            const prizesTaken = opponent.prizes.length;
            const damagePerPrize = 30;
            effect.damage = this.attacks[0].damage; // base damage
            effect.damage += prizesTaken * damagePerPrize; // add bonus damage
        }
        return state;
    }
}
exports.Charizardex = Charizardex;
