import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, CoinFlipPrompt, Card, ChooseCardsPrompt,
  EnergyCard } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';


function* useTrickCape(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {

  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  // Defending Pokemon has no energy cards attached
  if (!opponent.active.cards.some(c => c instanceof EnergyCard)) {
    return state;
  }

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_HAND,
    opponent.active,
    { superType: SuperType.ENERGY },
    { min: 1, max: 1, allowCancel: false }
  ), selected => {
    cards = selected || [];
    next();
  });

  const discardEnergy = new DiscardCardsEffect(effect, cards);
  return store.reduceEffect(state, discardEnergy);
}


export class Meowscarada extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Floragato';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 160;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Trick Cape',
      cost: [ CardType.COLORLESS ],
      damage: 40,
      text: 'You may put an Energy attached to your opponent\'s Active ' +
      'Pokémon into their hand. ';
    },
    {
      name: 'Flower Blast',
      cost: [ CardType.GRASS, CardType.COLORLESS ],
      damage: 130,
      text: ''
    }
  ];

  public set: string = 'SVI';

  public name: string = 'Meowscarada';

  public fullName: string = 'Meowscarada SVI 15';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useTrickCape(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
