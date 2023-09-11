import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, ChooseCardsPrompt, ShuffleDeckPrompt, PowerType } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

function* useLeParfum(next: Function, store: StoreLike, state: State,
  self: Flamigo, effect: PlayPokemonEffect): IterableIterator<State> {
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
    { superType: SuperType.POKEMON, stage: Stage.BASIC, name: 'Flamigo' },
    { min: 0, max: 3, allowCancel: true }
  ), selected => {
    const cards = selected || [];
    player.deck.moveCardsTo(cards, player.hand);
    next();
  });
  
  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}


export class Flamigo extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 110;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Le Parfum',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokemon from your hand onto your ' +
      'Bench during your turn, you may search your deck for up ' +
      'to 3 Flamigo, reveal them, and put them into your hand.' +
      'Then, shuffle your deck.'
  }];

  public attacks = [

    {
      name: 'United Wings',
      cost: [ CardType.COLORLESS, CardType.COLORLESS ],
      damage: 20,
      text: 'This attack does 20 damage for each Pokémon in your ' +
        'in your discard pile that have the United Wings attack.'
    }
  ];

  public set: string = 'PAL';

  public name: string = 'Flamigo';

  public fullName: string = 'Flamigo PAL';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const generator = useLeParfum(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      let pokemonCount = 0;
      player.discard.cards.forEach(c => {
        if (c instanceof PokemonCard && c.attacks.some(a => a.name === 'United Wings')) {
          pokemonCount += 1;
        }
      });

      effect.damage = pokemonCount * 20;
    }

    return state;
  }

}
