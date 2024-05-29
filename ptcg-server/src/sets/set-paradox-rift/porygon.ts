import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, AttachEnergyPrompt, PlayerType, SlotType, StateUtils, CoinFlipPrompt } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';

export class Porygon extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 60;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Data Displacement',
      cost: [ CardType.COLORLESS ],
      damage: 10,
      text: 'Flip a coin. If heads, move an Energy from your opponent\'s Active Pokémon to 1 of their Benched Pokémon.'
    }
  ];

  public regulationMark = 'G';

  public set: string = 'PAR';

  public name: string = 'Porygon';

  public fullName: string = 'Porygon PAR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '142';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some(b => b.cards.length > 0);
      
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {

          if (hasBench === false) {
            return state;
          }
      
          return store.prompt(state, new AttachEnergyPrompt(
            player.id,
            GameMessage.ATTACH_ENERGY_TO_BENCH,
            opponent.active,
            PlayerType.TOP_PLAYER,
            [SlotType.BENCH],
            { superType: SuperType.ENERGY },
            { allowCancel: false, min: 0, max: 1 }
          ), transfers => {
            transfers = transfers || [];
            for (const transfer of transfers) {
              const target = StateUtils.getTarget(state, player, transfer.to);
              opponent.active.moveCardTo(transfer.card, target);
            }
          });
        }
      });
    }
    return state;
  }
}