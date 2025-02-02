"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MewtwoVUNIONTopLeft = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const mewtwo_v_union_tr_1 = require("./mewtwo-v-union-tr");
const mewtwo_v_union_bl_1 = require("./mewtwo-v-union-bl");
const mewtwo_v_union_br_1 = require("./mewtwo-v-union-br");
class MewtwoVUNIONTopLeft extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.VUNION;
        this.tags = [card_types_1.CardTag.POKEMON_VUNION];
        this.cardType = P;
        this.hp = 310;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C];
        this.powers = [
            {
                name: 'Mewtwo V-UNION Assembly',
                text: 'Once per game during your turn, combine 4 different Mewtwo V-UNION from your discard pile and put them onto your bench.',
                useFromDiscard: true,
                exemptFromAbilityLock: true,
                powerType: game_1.PowerType.ABILITY
            },
            {
                name: 'Photon Barrier',
                text: 'Prevent all effects of attacks from your opponent\'s Pokémon done to this Pokémon. (Damage is not an effect.)',
                powerType: game_1.PowerType.ABILITY
            }
        ];
        this.attacks = [
            {
                name: 'Union Gain',
                cost: [C],
                damage: 0,
                text: 'Attach up to 2 [P] Energy cards from your discard pile to this Pokémon.'
            },
            {
                name: 'Super Regeneration',
                cost: [P, P, C],
                damage: 0,
                text: 'Heal 200 damage from this Pokémon.'
            },
            {
                name: 'Psyplosion',
                cost: [P, P, C],
                damage: 0,
                text: 'Put 16 damage counters on your opponent\'s Pokémon in any way you like.'
            },
            {
                name: 'Final Burn',
                cost: [P, P, P, C],
                damage: 300,
                text: ''
            }
        ];
        this.set = 'SP';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '308';
        this.name = 'Mewtwo V-UNION';
        this.fullName = 'Mewtwo V-UNION (Top Left) SP';
        this.MEWTWO_ASSEMBLED = 'MEWTWO_ASSEMBLED';
    }
    reduceEffect(store, state, effect) {
        // assemblin the v-union
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const slots = player.bench.filter(b => b.cards.length === 0);
            if (player.assembledMewtwo) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            if (slots.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            let topLeftPiece = false;
            let topRightPiece = false;
            let bottomLeftPiece = false;
            let bottomRightPiece = false;
            player.discard.cards.forEach(card => {
                if (card instanceof MewtwoVUNIONTopLeft) {
                    topLeftPiece = true;
                }
                if (card instanceof mewtwo_v_union_tr_1.MewtwoVUNIONTopRight) {
                    topRightPiece = true;
                }
                if (card instanceof mewtwo_v_union_bl_1.MewtwoVUNIONBottomLeft) {
                    bottomLeftPiece = true;
                }
                if (card instanceof mewtwo_v_union_br_1.MewtwoVUNIONBottomRight) {
                    bottomRightPiece = true;
                }
            });
            if (topLeftPiece && topRightPiece && bottomLeftPiece && bottomRightPiece) {
                if (slots.length > 0) {
                    player.discard.cards.forEach(card => { if (card instanceof mewtwo_v_union_tr_1.MewtwoVUNIONTopRight) {
                        player.discard.moveCardTo(card, slots[0]);
                    } });
                    player.discard.cards.forEach(card => { if (card instanceof mewtwo_v_union_bl_1.MewtwoVUNIONBottomLeft) {
                        player.discard.moveCardTo(card, slots[0]);
                    } });
                    player.discard.cards.forEach(card => { if (card instanceof mewtwo_v_union_br_1.MewtwoVUNIONBottomRight) {
                        player.discard.moveCardTo(card, slots[0]);
                    } });
                    // gotta make sure the actual mon ends up on top
                    player.discard.cards.forEach(card => { if (card instanceof MewtwoVUNIONTopLeft) {
                        player.discard.moveCardTo(card, slots[0]);
                    } });
                    player.assembledMewtwo = true;
                    slots[0].pokemonPlayedTurn = state.turn;
                }
            }
            else {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
        }
        // Photon Barrier
        if (effect instanceof attack_effects_1.AbstractAttackEffect && effect.target.cards.includes(this)) {
            const sourceCard = effect.source.getPokemonCard();
            if (sourceCard) {
                // Allow Weakness & Resistance
                if (effect instanceof attack_effects_1.ApplyWeaknessEffect) {
                    return state;
                }
                // Allow damage
                if (effect instanceof attack_effects_1.PutDamageEffect) {
                    return state;
                }
                if (effect instanceof attack_effects_1.DealDamageEffect) {
                    return state;
                }
                effect.preventDefault = true;
            }
        }
        // Union Gain
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let psychicsInDiscard = 0;
            // checking for energies in the discard
            player.discard.cards.forEach(card => {
                if (card instanceof game_1.EnergyCard && card.energyType === card_types_1.EnergyType.BASIC && card.name === 'Psychic Energy') {
                    psychicsInDiscard++;
                }
            });
            if (psychicsInDiscard > 0) {
                const blocked = [];
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                    if (card !== this) {
                        blocked.push(target);
                    }
                });
                state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Psychic Energy' }, { allowCancel: false, min: 0, max: Math.min(2, psychicsInDiscard), blockedTo: blocked }), transfers => {
                    transfers = transfers || [];
                    // cancelled by user
                    if (transfers.length === 0) {
                        return;
                    }
                    for (const transfer of transfers) {
                        const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                        player.discard.moveCardTo(transfer.card, target);
                    }
                });
            }
        }
        // Super Regeneration
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const healing = new attack_effects_1.HealTargetEffect(effect, 200);
            healing.target = player.active;
            store.reduceEffect(state, healing);
        }
        // Psyplosion
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[2]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const maxAllowedDamage = [];
            let damageLeft = 0;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                const checkHpEffect = new check_effects_1.CheckHpEffect(opponent, cardList);
                store.reduceEffect(state, checkHpEffect);
                damageLeft += checkHpEffect.hp - cardList.damage;
                maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
            });
            const damage = Math.min(160, damageLeft);
            return store.prompt(state, new game_1.PutDamagePrompt(effect.player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], damage, maxAllowedDamage, { allowCancel: false }), targets => {
                const results = targets || [];
                for (const result of results) {
                    const target = game_1.StateUtils.getTarget(state, player, result.target);
                    const putCountersEffect = new attack_effects_1.PutCountersEffect(effect, result.damage);
                    putCountersEffect.target = target;
                    store.reduceEffect(state, putCountersEffect);
                }
            });
        }
        return state;
    }
}
exports.MewtwoVUNIONTopLeft = MewtwoVUNIONTopLeft;
