import { Attack, CardType, ChooseCardsPrompt, CoinFlipPrompt, GameMessage, PokemonCard, Stage, State, StoreLike, SuperType, Weakness } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Steelix extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Onix';
  public cardType: CardType = M;
  public hp: number = 170;
  public weakness: Weakness[] = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat: CardType[] = [C, C, C, C];

  public attacks: Attack[] = [{
    name: 'Thumping Fall',
    cost: [C, C],
    damage: 50,
    damageCalculation: 'x',
    text: 'Discard any number of Pokémon with a Retreat Cost of exactly 4 from your hand. This attack does 50 damage for each card you discarded in this way.',
  },
  {
    name: 'Iron Tail',
    cost: [M, C, C, C],
    damage: 100,
    damageCalculation: 'x',
    text: 'Flip a coin until you get tails. This attack does 100 damage for each heads.'
  }];

  public set: string = 'CEC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '139';
  public name: string = 'Steelix';
  public fullName: string = 'Steelix CEC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      let bigBoys = player.hand.cards.filter(c => c instanceof PokemonCard && c.retreat.length === 4);
      let blocked: number[] = [];
      player.hand.cards.forEach((card, index) => {
        if (card instanceof PokemonCard && card.retreat.length === 4) {
          return;
        } else {
          blocked.push(index);
        }
      });

      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        { superType: SuperType.POKEMON },
        { allowCancel: true, min: 0, max: bigBoys.length, blocked }
      ), cards => {
        cards = cards || [];
        if (cards.length === 0) {
          return;
        }

        player.hand.moveCardsTo(cards, player.discard);
        const monsDiscarded = cards.length;
        effect.damage = monsDiscarded * 50;
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      const flipCoin = (heads: number = 0): State => {
        return store.prompt(state, [
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
        ], result => {
          if (result === true) {
            return flipCoin(heads + 1);
          }
          effect.damage = 100 * heads;
          return state;
        });
      };
      return flipCoin();
    }

    return state;
  }
}
