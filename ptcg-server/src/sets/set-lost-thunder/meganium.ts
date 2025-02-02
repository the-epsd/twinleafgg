import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { EvolveEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { Card, CardManager, CardTarget, ChooseCardsPrompt, ChoosePokemonPrompt, PlayerType, PokemonCardList, SlotType } from '../../game';

function isMatchingStage2(stage1: PokemonCard[], basic: PokemonCard, stage2: PokemonCard): boolean {
  for (const card of stage1) {
    if (card.name === stage2.evolvesFrom && basic.name === card.evolvesFrom) {
      return true;
    }
  }
  return false;
}

function* playCard(next: Function, store: StoreLike, state: State, effect: PowerEffect): IterableIterator<State> {
  const player = effect.player;

  // Create list of non - Pokemon SP slots
  const blocked: CardTarget[] = [];
  let hasBasicPokemon: boolean = false;

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  const stage2 = player.hand.cards.filter(c => {
    return c instanceof PokemonCard && c.stage === Stage.STAGE_2;
  }) as PokemonCard[];

  if (stage2.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // Look through all known cards to find out if it's a valid Stage 2
  const cm = CardManager.getInstance();
  const stage1 = cm.getAllCards().filter(c => {
    return c instanceof PokemonCard && c.stage === Stage.STAGE_1;
  }) as PokemonCard[];

  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
    if (card.stage === Stage.BASIC && stage2.some(s => isMatchingStage2(stage1, card, s))) {

      hasBasicPokemon = true;
      return;
    }
    blocked.push(target);
  });

  if (!hasBasicPokemon) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  let targets: PokemonCardList[] = [];
  yield store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_POKEMON_TO_EVOLVE,
    PlayerType.BOTTOM_PLAYER,
    [SlotType.ACTIVE, SlotType.BENCH],
    { allowCancel: false, blocked }
  ), selection => {
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

  const blocked2: number[] = [];
  player.hand.cards.forEach((c, index) => {
    if (c instanceof PokemonCard && c.stage === Stage.STAGE_2) {
      if (!isMatchingStage2(stage1, pokemonCard, c)) {
        blocked2.push(index);
      }
    }
  });

  let cards: Card[] = [];
  return store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_EVOLVE,
    player.hand,
    { superType: SuperType.POKEMON, stage: Stage.STAGE_2 },
    { min: 1, max: 1, allowCancel: true, blocked: blocked2 }
  ), selected => {
    cards = selected || [];

    if (cards.length > 0) {
      const pokemonCard = cards[0] as PokemonCard;
      const evolveEffect = new EvolveEffect(player, targets[0], pokemonCard);
      store.reduceEffect(state, evolveEffect);
    }
  });
}
export class Meganium extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public cardType: CardType = CardType.GRASS;
  public hp: number = 150;
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public weakness = [{ type: CardType.FIRE }];
  public evolvesFrom: string = 'Bayleef';

  public powers = [{
    name: 'Quick-Ripening Herb',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may use this Ability. Choose 1 of your Basic Pokémon in play. If you have a Stage 2 card in your hand that evolves from that Pokémon, put that card onto the Basic Pokémon to evolve it. You can use this Ability during your first turn or on a Pokémon that was put into play this turn.'
  }];

  public attacks = [
    {
      name: 'Solar Beam',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 110,
      text: ''
    }];

  public set: string = 'LOT';
  public name: string = 'Meganium';
  public fullName: string = 'Meganium LOT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '8';

  public readonly QUICK_RIPENING_HERB_MARKER = 'QUICK_RIPENING_HERB_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.QUICK_RIPENING_HERB_MARKER, this);
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.QUICK_RIPENING_HERB_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      // Check to see if anything is blocking our Ability
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      if (player.marker.hasMarker(this.QUICK_RIPENING_HERB_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;

    }
    return state;
  }

}