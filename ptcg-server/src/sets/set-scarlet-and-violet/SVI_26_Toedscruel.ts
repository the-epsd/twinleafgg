import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt, GameMessage, StateUtils, AttachEnergyPrompt, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Toedscruel extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = CardType.GRASS;
  public hp: number = 120;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public evolvesFrom = 'Toedscool';

  public attacks = [{
    name: 'Eerie Tentacles',
    cost: [CardType.GRASS],
    damage: 30,
    text: ' You may move an Energy from your opponent\'s Active Pokémon to 1 of their Benched Pokémon.'
  },
  {
    name: 'Triple Smash',
    cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 80,
    damageCalculation: 'x',
    text: ' Flip 3 coins. This attack does 80 damage for each heads. '
  }];

  public set: string = 'SVI';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public fullName: string = 'Toedscruel SVI';
  public name: string = 'Toedscruel';
  public setNumber: string = '26';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some(b => b.cards.length > 0);

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

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      state = store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage = 80 * heads;
      });
      return state;
    }

    return state;
  }

}