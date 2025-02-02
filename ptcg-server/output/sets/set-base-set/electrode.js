"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Electrode = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const check_effect_1 = require("../../game/store/effect-reducers/check-effect");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
class Electrode extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Electrode';
        this.set = 'BS';
        this.fullName = 'Electrode BS';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Voltorb';
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '21';
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [
            {
                powerType: pokemon_types_1.PowerType.POKEMON_POWER,
                useWhenInPlay: true,
                name: 'Buzzap',
                text: 'At any time during your turn (before your attack), you may Knock Out Electrode and attach it to 1 of your other Pokémon. If you do, choose a type of Energy. Electrode is now an Energy card (instead of a Pokémon) that provides 2 energy of that type. You can’t use this power if Electrode is Asleep, Confused, or Paralyzed.',
            }
        ];
        this.attacks = [
            {
                name: 'Electric Shock',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING],
                damage: 50,
                text: 'Flip a coin. If tails, Electrode does 10 damage to itself.'
            }
        ];
        this.provides = [];
        this.energyType = card_types_1.EnergyType.SPECIAL;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (cardList.specialConditions.includes(card_types_1.SpecialCondition.ASLEEP) ||
                cardList.specialConditions.includes(card_types_1.SpecialCondition.CONFUSED) ||
                cardList.specialConditions.includes(card_types_1.SpecialCondition.PARALYZED)) {
                return state;
            }
            cardList.damage = 999;
            state = check_effect_1.checkState(store, state);
            if (store.hasPrompts()) {
                state = store.waitPrompt(state, () => { });
            }
            // Then handle energy type selection and attachment
            const options = [
                { value: card_types_1.CardType.COLORLESS, message: 'Colorless' },
                { value: card_types_1.CardType.DARK, message: 'Dark' },
                { value: card_types_1.CardType.DRAGON, message: 'Dragon' },
                { value: card_types_1.CardType.FAIRY, message: 'Fairy' },
                { value: card_types_1.CardType.FIGHTING, message: 'Fighting' },
                { value: card_types_1.CardType.FIRE, message: 'Fire' },
                { value: card_types_1.CardType.GRASS, message: 'Grass' },
                { value: card_types_1.CardType.LIGHTNING, message: 'Lightning' },
                { value: card_types_1.CardType.METAL, message: 'Metal' },
                { value: card_types_1.CardType.PSYCHIC, message: 'Psychic' },
                { value: card_types_1.CardType.WATER, message: 'Water' }
            ];
            return store.prompt(state, new game_1.SelectPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGY_TYPE, options.map(c => c.message), { allowCancel: false }), choice => {
                // Inside PowerEffect block after selecting energy type
                const option = options[choice];
                if (!option) {
                    return state;
                }
                // Transform Electrode properties to act as energy
                this.chosenEnergyType = option.value;
                this.provides = [option.value, option.value];
                this.superType = card_types_1.SuperType.ENERGY;
                // Create energy list and add transformed Electrode
                const energyList = new game_1.CardList();
                energyList.cards.push(this);
                return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, energyList, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], {}, { allowCancel: true }), transfers => {
                    if (transfers && transfers.length > 0) {
                        const target = game_1.StateUtils.getTarget(state, player, transfers[0].to);
                        player.discard.moveCardTo(this, target);
                        target.cards.unshift(target.cards.splice(target.cards.length - 1, 1)[0]);
                    }
                    return state;
                });
            });
        }
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this) && effect.source.getPokemonCard() !== this) {
            effect.energyMap.push({ card: this, provides: this.chosenEnergyType ? [this.chosenEnergyType] : [] });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            return store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(effect.player.id, game_1.GameMessage.FLIP_COIN), (result) => {
                if (!result) {
                    const selfDamage = new attack_effects_1.DealDamageEffect(effect, 10);
                    selfDamage.target = effect.player.active;
                    store.reduceEffect(state, selfDamage);
                }
            });
        }
        return state;
    }
}
exports.Electrode = Electrode;
