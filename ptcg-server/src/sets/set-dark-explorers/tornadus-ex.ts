import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, Card, CoinFlipPrompt, ChooseCardsPrompt } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

function* usePowerBlast(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;

  // Active Pokemon has no energy cards attached
  if (!player.active.energies.cards.some(c => c.superType === SuperType.ENERGY)) {
    return state;
  }

  let flipResult = false;
  yield store.prompt(state, new CoinFlipPrompt(
    player.id, GameMessage.COIN_FLIP
  ), result => {
    flipResult = result;
    next();
  });

  if (flipResult) {
    return state;
  }

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_DISCARD,
    player.active,
    { superType: SuperType.ENERGY },
    { min: 1, max: 1, allowCancel: false }
  ), selected => {
    cards = selected || [];
    next();
  });

  const discardEnergy = new DiscardCardsEffect(effect, cards);
  discardEnergy.target = player.active;
  return store.reduceEffect(state, discardEnergy);
}


export class TornadusEx extends PokemonCard {

  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = C;

  public hp: number = 170;

  public weakness = [{ type: L }];

  public resistance = [{ type: F, value: -20 }];

  public retreat = [C];

  public attacks = [
    {
      name: 'Blow Through',
      cost: [C, C],
      damage: 30,
      text: 'If there is any Stadium card in play, this attack does 30 ' +
        'more damage.'
    }, {
      name: 'Power Blast',
      cost: [C, C, C],
      damage: 100,
      text: 'Flip a coin. If tails, discard an Energy attached to this Pokémon.'
    },
  ];

  public set: string = 'DEX';

  public name: string = 'Tornadus-EX';

  public fullName: string = 'Tornadus EX DEX';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '90';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (StateUtils.getStadiumCard(state) !== undefined) {
        effect.damage += 30;
      }
      return state;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const generator = usePowerBlast(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
