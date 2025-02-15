"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThundurusEX = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ThundurusEX extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = L;
        this.tags = [game_1.CardTag.POKEMON_EX, game_1.CardTag.TEAM_PLASMA];
        this.hp = 170;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Raiden Knuckle',
                cost: [L],
                damage: 30,
                text: 'Attach an Energy card from your discard pile to 1 of your Benched Team Plasma Pokémon.'
            }, {
                name: 'Thunderous Noise',
                cost: [L, L, C, C],
                damage: 90,
                text: 'If this Pokémon has any Plasma Energy attached to it, discard an Energy attached to the Defending Pokémon.'
            },
        ];
        this.set = 'PLF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '38';
        this.name = 'Thundurus EX';
        this.fullName = 'Thundurus EX PLF';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const hasEnergyInDiscard = player.discard.cards.some(c => c instanceof game_1.EnergyCard);
            let validTargets = false;
            const blockedTo = [];
            player.bench.forEach((bench, index) => {
                if (bench.cards.length === 0) {
                    return;
                }
                const benchPokemon = bench.getPokemonCard();
                if (benchPokemon && benchPokemon.tags.includes(game_1.CardTag.TEAM_PLASMA)) {
                    validTargets = true;
                }
                else {
                    const target = {
                        player: game_1.PlayerType.BOTTOM_PLAYER,
                        slot: game_1.SlotType.BENCH,
                        index
                    };
                    blockedTo.push(target);
                }
            });
            if (!hasEnergyInDiscard || !validTargets) {
                return state;
            }
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: game_1.SuperType.ENERGY }, { allowCancel: true, min: 1, max: 1, blockedTo }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                }
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const pokemon = player.active;
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, pokemon);
            store.reduceEffect(state, checkEnergy);
            let hasPlasmaEnergy = false;
            const defendingPokemonHasEnergy = opponent.active.cards.some(c => c instanceof game_1.EnergyCard);
            checkEnergy.energyMap.forEach(em => {
                const energyCard = em.card;
                if (energyCard instanceof game_1.EnergyCard && energyCard.name === 'Plasma Energy') {
                    hasPlasmaEnergy = true;
                }
            });
            if (hasPlasmaEnergy && defendingPokemonHasEnergy) {
                return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: game_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                    const card = selected[0];
                    opponent.active.moveCardTo(card, opponent.discard);
                    return state;
                });
            }
        }
        return state;
    }
}
exports.ThundurusEX = ThundurusEX;
