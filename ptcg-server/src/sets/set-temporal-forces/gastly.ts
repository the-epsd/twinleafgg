import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, Card, ChooseCardsPrompt, CoinFlipPrompt, EnergyCard, StateUtils } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';

function* useMysteriousBeam(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  
  // Active Pokemon has no energy cards attached
  if (!player.active.cards.some(c => c instanceof EnergyCard)) {
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
    opponent.active,
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

export class Gastly extends PokemonCard {

  public regulationMark = 'H';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DARK;

  public hp: number = 60;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Mysterious Beam',
      cost: [CardType.DARK],
      damage: 0,
      text: 'Flip a coin. If heads, discard an Energy attached to your opponent’s Active Pokémon.'
    },
    {
      name: 'Suffocating Gas',
      cost: [CardType.DARK, CardType.DARK],
      damage: 30,
      text: ''
    }
  ];

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '102';

  public name: string = 'Gastly';

  public fullName: string = 'Gastly TEF';

  public reduceEffect(store: StoreLike, state: State, effect: AttackEffect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useMysteriousBeam(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
  
    return state;
  }
  
}
  