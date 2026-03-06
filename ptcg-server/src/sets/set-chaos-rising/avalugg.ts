import { CardType, EnergyType, Stage } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, StoreLike, State } from '../../game';
import { EnergyCard } from '../../game/store/card/energy-card';
import { MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Avalugg extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Bergmite';
  public hp: number = 160;
  public cardType: CardType = W;
  public weakness = [{ type: M }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Iceberg Destruction',
    cost: [W],
    damage: 60,
    damageCalculation: 'x' as 'x',
    text: 'Discard the top 6 cards of your deck. This attack does 60 damage for each Basic [W] Energy discarded in this way.'
  },
  {
    name: 'Frost Stomp',
    cost: [W, W, C, C],
    damage: 160,
    text: ''
  }];

  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '24';
  public name: string = 'Avalugg';
  public fullName: string = 'Avalugg M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const count = Math.min(6, player.deck.cards.length);
      const topCards = player.deck.cards.slice(0, count);
      const basicWCount = topCards.filter(c =>
        c instanceof EnergyCard && c.energyType === EnergyType.BASIC && c.provides.includes(W)
      ).length;
      state = MOVE_CARDS(store, state, player.deck, player.discard, {
        cards: topCards,
        sourceCard: this,
        sourceEffect: effect
      });
      effect.damage = basicWCount * 60;
    }
    return state;
  }
}
