"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlolanExeggutorex = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class AlolanExeggutorex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [game_1.CardTag.POKEMON_ex, game_1.CardTag.POKEMON_TERA];
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Exeggcute';
        this.cardType = game_1.CardType.DRAGON;
        this.hp = 300;
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Tera',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'As long as this Pokemon is on your Bench, prevent all damage done to this Pokemon by attacks (both yours and your opponent\'s).'
            }];
        this.attacks = [
            {
                name: 'Tropical Fever',
                cost: [game_1.CardType.GRASS, game_1.CardType.WATER],
                damage: 150,
                text: 'Choose any number of Basic Energy cards from your hand and attach them to your Pokemon in any way you like.'
            },
            {
                name: 'Swinging Sphene',
                cost: [game_1.CardType.GRASS, game_1.CardType.WATER, game_1.CardType.FIGHTING],
                damage: 0,
                text: 'Flip a coin. If heads, Knock Out your opponent\'s Active Basic Pokemon. If tails, Knock Out 1 of your opponent\'s Benched Basic Pokemon.'
            }
        ];
        this.set = 'SV7a';
        this.setNumber = '40';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Alolan Exeggutor ex';
        this.fullName = 'Alolan Exeggutor ex SV7a';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const hasEnergyInHand = player.hand.cards.some(c => {
                return c instanceof game_1.EnergyCard
                    && c.energyType === game_1.EnergyType.BASIC;
            });
            if (!hasEnergyInHand) {
                return state;
            }
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.hand, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC }, { allowCancel: false }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    const energyCard = transfer.card;
                    const attachEnergyEffect = new play_card_effects_1.AttachEnergyEffect(player, energyCard, target);
                    store.reduceEffect(state, attachEnergyEffect);
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const blocked = [];
            const opponentActive = opponent.active.getPokemonCard();
            const opponentBench = opponent.bench.filter(card => { var _a; return ((_a = card.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.stage) === game_1.Stage.BASIC; });
            opponentBench.forEach(card => {
                if (card.stage !== game_1.Stage.BASIC) {
                    blocked.push();
                }
            });
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    if (opponentActive && opponentActive.stage !== game_1.Stage.BASIC) {
                        return state;
                    }
                    if (opponentActive && opponentActive.stage === game_1.Stage.BASIC) {
                        const dealDamage = new attack_effects_1.KnockOutOpponentEffect(effect, 999);
                        dealDamage.target = opponent.active;
                        store.reduceEffect(state, dealDamage);
                    }
                }
                if (!result) {
                    if (!opponentBench) {
                        return state;
                    }
                    if (opponentBench) {
                        return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false, blocked: blocked }), selected => {
                            const targets = selected || [];
                            targets.forEach(target => {
                                const dealDamage = new attack_effects_1.KnockOutOpponentEffect(effect, 999);
                                dealDamage.target = target;
                                store.reduceEffect(state, dealDamage);
                            });
                        });
                    }
                }
            });
        }
        return state;
    }
}
exports.AlolanExeggutorex = AlolanExeggutorex;
