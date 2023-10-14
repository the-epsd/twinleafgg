import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType, TrainerType } from '../../game/store/card/card-types';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { PowerType, StoreLike, State, GameMessage, ChooseCardsPrompt,
  ShuffleDeckPrompt } from '../../game';


function* useLuminousSign(next: Function, store: StoreLike, state: State,
  self: LumineonV, effect: PlayPokemonEffect): IterableIterator<State> {
  const player = effect.player;

  if (player.deck.cards.length === 0) {
    return state;
  }

  // Try to reduce PowerEffect, to check if something is blocking our ability
  try {
    const powerEffect = new PowerEffect(player, self.powers[0], self);
    store.reduceEffect(state, powerEffect);
  } catch {
    return state;
  }

  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER },
    { min: 1, max: 1, allowCancel: true }
  ), selected => {
    const cards = selected || [];
    player.deck.moveCardsTo(cards, player.hand);
    next();
  });

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class LumineonV extends PokemonCard {

  public tags = [ CardTag.POKEMON_V ];

  public regulationMark = 'F';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 170;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Luminous Sign',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokemon from your hand onto your ' +
      'Bench during your turn, you may search your deck for a ' +
      'Supporter card, reveal it, and put it into your hand. Then, ' +
      'shuffle your deck.'
  }];

  public attacks = [
    {
      name: 'Aqua Return',
      cost: [ CardType.WATER, CardType.WATER, CardType.COLORLESS ],
      damage: 120,
      text: 'Shuffle this Pokémon and all attached cards into your deck.'
    }
  ];

  public set: string = 'BRS';

  public set2: string = 'brilliantstars';

  public setNumber: string = '40';

  public name: string = 'Lumineon V';

  public fullName: string = 'Lumineon V BRS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const generator = useLuminousSign(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      player.active.moveTo(player.deck);
      player.active.clearEffects();
  
      return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
      });
    }
  
    return state;
  }
  
}
