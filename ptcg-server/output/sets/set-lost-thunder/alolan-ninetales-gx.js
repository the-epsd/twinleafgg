"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlolanNinetalesGX = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
// LOT Alolan Ninetales-GX 132 (https://limitlesstcg.com/cards/LOT/132)
class AlolanNinetalesGX extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [game_1.CardTag.POKEMON_GX];
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Alolan Vulpix';
        this.cardType = game_1.CardType.FAIRY;
        this.hp = 200;
        this.weakness = [{ type: game_1.CardType.METAL }];
        this.resistance = [{ type: game_1.CardType.DARK, value: -20 }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Mysterious Guidance',
                useWhenInPlay: false,
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may search your deck for up to 2 Item cards, reveal them, and put them into your hand. Then, shuffle your deck.'
            }];
        this.attacks = [
            {
                name: 'Snowy Wind',
                cost: [game_1.CardType.FAIRY, game_1.CardType.COLORLESS],
                damage: 70,
                text: 'This attack does 30 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Sublimation-GX',
                cost: [game_1.CardType.FAIRY, game_1.CardType.COLORLESS],
                damage: 0,
                gxAttack: true,
                text: 'If your opponent\'s Active Pokémon is an Ultra Beast, it is Knocked Out. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'LOT';
        this.name = 'Alolan Ninetales-GX';
        this.fullName = 'Alolan Ninetales-GX LOT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '132';
    }
    reduceEffect(store, state, effect) {
        // Mysterious Guidance
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
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
                    return store.prompt(state, [
                        new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: game_1.SuperType.TRAINER, trainerType: game_1.TrainerType.ITEM }, { min: 0, max: 2, allowCancel: false })
                    ], selected => {
                        const cards = selected || [];
                        player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                            if (cardList.getPokemonCard() === this) {
                                cardList.addBoardEffect(game_1.BoardEffect.ABILITY_USED);
                            }
                        });
                        player.deck.moveCardsTo(cards, player.hand);
                        return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                            player.deck.applyOrder(order);
                        });
                    });
                }
            });
        }
        // Snowy Wind
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 30);
                damageEffect.target = targets[0];
                store.reduceEffect(state, damageEffect);
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Check if player has used GX attack
            if (player.usedGX == true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            // set GX attack as used for game
            player.usedGX = true;
            const pokemon = opponent.active.getPokemonCard();
            if (pokemon && pokemon.tags.includes(game_1.CardTag.ULTRA_BEAST)) {
                const dealDamage = new attack_effects_1.KnockOutOpponentEffect(effect, 999);
                dealDamage.target = opponent.active;
                store.reduceEffect(state, dealDamage);
            }
        }
        return state;
    }
}
exports.AlolanNinetalesGX = AlolanNinetalesGX;
