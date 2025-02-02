"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZeraoraVSTAR = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
function* useLightningStormStar(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    if (player.usedVSTAR) {
        throw new game_1.GameError(game_1.GameMessage.LABEL_VSTAR_USED);
    }
    player.usedVSTAR = true;
    const maxAllowedDamage = [];
    opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
        maxAllowedDamage.push({ target, damage: card.hp + 240 });
    });
    const damage = 240;
    return store.prompt(state, new game_1.PutDamagePrompt(effect.player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], damage, maxAllowedDamage, { allowCancel: false, damageMultiple: 60 }), targets => {
        const results = targets || [];
        for (const result of results) {
            const target = game_1.StateUtils.getTarget(state, player, result.target);
            const putCountersEffect = new attack_effects_1.PutCountersEffect(effect, result.damage);
            putCountersEffect.target = target;
            store.reduceEffect(state, putCountersEffect);
        }
    });
}
class ZeraoraVSTAR extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.VSTAR;
        this.tags = [game_1.CardTag.POKEMON_VSTAR];
        this.evolvesFrom = 'Zeraora V';
        this.cardType = game_1.CardType.LIGHTNING;
        this.hp = 270;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [];
        this.regulationMark = 'F';
        this.attacks = [
            {
                name: 'Crushing Beat',
                cost: [game_1.CardType.LIGHTNING, game_1.CardType.LIGHTNING, game_1.CardType.COLORLESS],
                damage: 190,
                text: 'You may discard a Stadium in play.'
            },
            {
                name: 'Lightning Storm Star',
                cost: [game_1.CardType.LIGHTNING, game_1.CardType.LIGHTNING, game_1.CardType.LIGHTNING, game_1.CardType.COLORLESS],
                damage: 0,
                text: 'Choose 1 of your opponent\'s Pokémon 4 times. (You can choose the same Pokémon more than once.) For each time you chose a Pokémon, do 60 damage to it. This damage isn\'t affected by Weakness or Resistance. (You can\'t use more than 1 VSTAR Power in a game.)'
            }
        ];
        this.set = 'CRZ';
        this.name = 'Zeraora VSTAR';
        this.fullName = 'Zeraora VSTAR CRZ';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '55';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (stadiumCard !== undefined) {
                state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_DISCARD_STADIUM), wantToUse => {
                    if (wantToUse) {
                        // Discard Stadium
                        const cardList = game_1.StateUtils.findCardList(state, stadiumCard);
                        const player = game_1.StateUtils.findOwner(state, cardList);
                        cardList.moveTo(player.discard);
                        return state;
                    }
                    return state;
                });
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const generator = useLightningStormStar(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.ZeraoraVSTAR = ZeraoraVSTAR;
