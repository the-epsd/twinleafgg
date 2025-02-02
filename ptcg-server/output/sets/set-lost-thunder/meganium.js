"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meganium = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const game_1 = require("../../game");
function isMatchingStage2(stage1, basic, stage2) {
    for (const card of stage1) {
        if (card.name === stage2.evolvesFrom && basic.name === card.evolvesFrom) {
            return true;
        }
    }
    return false;
}
function* playCard(next, store, state, effect) {
    const player = effect.player;
    // Create list of non - Pokemon SP slots
    const blocked = [];
    let hasBasicPokemon = false;
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    const stage2 = player.hand.cards.filter(c => {
        return c instanceof pokemon_card_1.PokemonCard && c.stage === card_types_1.Stage.STAGE_2;
    });
    if (stage2.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // Look through all known cards to find out if it's a valid Stage 2
    const cm = game_1.CardManager.getInstance();
    const stage1 = cm.getAllCards().filter(c => {
        return c instanceof pokemon_card_1.PokemonCard && c.stage === card_types_1.Stage.STAGE_1;
    });
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (card.stage === card_types_1.Stage.BASIC && stage2.some(s => isMatchingStage2(stage1, card, s))) {
            hasBasicPokemon = true;
            return;
        }
        blocked.push(target);
    });
    if (!hasBasicPokemon) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    let targets = [];
    yield store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_EVOLVE, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, blocked }), selection => {
        targets = selection || [];
        next();
    });
    if (targets.length === 0) {
        return state; // canceled by user
    }
    const pokemonCard = targets[0].getPokemonCard();
    if (pokemonCard === undefined) {
        return state; // invalid target?
    }
    const blocked2 = [];
    player.hand.cards.forEach((c, index) => {
        if (c instanceof pokemon_card_1.PokemonCard && c.stage === card_types_1.Stage.STAGE_2) {
            if (!isMatchingStage2(stage1, pokemonCard, c)) {
                blocked2.push(index);
            }
        }
    });
    let cards = [];
    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_EVOLVE, player.hand, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.STAGE_2 }, { min: 1, max: 1, allowCancel: true, blocked: blocked2 }), selected => {
        cards = selected || [];
        if (cards.length > 0) {
            const pokemonCard = cards[0];
            const evolveEffect = new game_effects_1.EvolveEffect(player, targets[0], pokemonCard);
            store.reduceEffect(state, evolveEffect);
        }
    });
}
class Meganium extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 150;
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.evolvesFrom = 'Bayleef';
        this.powers = [{
                name: 'Quick-Ripening Herb',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may use this Ability. Choose 1 of your Basic Pokémon in play. If you have a Stage 2 card in your hand that evolves from that Pokémon, put that card onto the Basic Pokémon to evolve it. You can use this Ability during your first turn or on a Pokémon that was put into play this turn.'
            }];
        this.attacks = [
            {
                name: 'Solar Beam',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 110,
                text: ''
            }
        ];
        this.set = 'LOT';
        this.name = 'Meganium';
        this.fullName = 'Meganium LOT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '8';
        this.QUICK_RIPENING_HERB_MARKER = 'QUICK_RIPENING_HERB_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.QUICK_RIPENING_HERB_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.QUICK_RIPENING_HERB_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            // Check to see if anything is blocking our Ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: pokemon_types_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            if (player.marker.hasMarker(this.QUICK_RIPENING_HERB_MARKER, this)) {
                throw new game_error_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Meganium = Meganium;
