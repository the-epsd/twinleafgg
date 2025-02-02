import { CardType, CoinFlipPrompt, GameMessage, PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, HealEffect } from '../../game/store/effects/game-effects';

export class Fuecoco extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIRE;
  public hp: number = 90;
  public weakness = [{ type: CardType.WATER }];
  public resistance = [];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Spacing Out',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'Flip a coin. If heads, heal 30 damage from this Pokémon.'
  }, {
    name: 'Flare',
    cost: [CardType.FIRE, CardType.COLORLESS],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'G';
  public set: string = 'PAL';
  public setNumber: string = '35';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Fuecoco';
  public fullName: string = 'Fuecoco PAL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      return store.prompt(state, new CoinFlipPrompt(
        player.id,
        GameMessage.COIN_FLIP
      ), flipResult => {
        if (flipResult) {
          const healEffect = new HealEffect(effect.player, effect.source, 30);
          store.reduceEffect(state, healEffect);
        }
      });
    }
    
    return state;
  }
}
