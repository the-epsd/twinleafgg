import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { PokemonCardList, StoreLike, State, StateUtils, GameMessage, ConfirmPrompt, EnergyCard, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Flareon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Eevee';
  public cardType: CardType = R;
  public hp: number = 90;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Sand-Attack',
      cost: [C],
      damage: 20,
      text: 'If the Defending Pokémon tries to attack during your opponent\'s next turn, your opponent flips a coin. If tails, that attack does nothing.'
    },
    {
      name: 'Fire Slash',
      cost: [R, C, C],
      damage: 60,
      damageCalculation: '+',
      text: 'You may discard a [R] Energy attached to this Pokémon. If you do, this attack does 30 more damage.'
    }
  ];

  public set: string = 'DEX';
  public setNumber: string = '12';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Flareon';
  public fullName: string = 'Flareon DEX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sand-Attack - mark opponent's active
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.active.marker.addMarker(PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN, this);
      opponent.marker.addMarker(PokemonCardList.CLEAR_PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN, this);
    }

    // Block attacks if marked - coin flip
    if (effect instanceof AttackEffect && effect.player.active.marker.hasMarker(PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN, this)) {
      const coinFlipEffect = new CoinFlipEffect(effect.player, (result: boolean) => {
        if (result === false) {
          effect.preventDefault = true;
        }
      });
      return store.reduceEffect(state, coinFlipEffect);
    }

    // Clear marker at end of turn
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(PokemonCardList.CLEAR_PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN, this)) {
      effect.player.marker.removeMarker(PokemonCardList.CLEAR_PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN, this);
      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN, this);
      });
    }

    // Fire Slash - may discard Fire energy for +30
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      const hasFireEnergy = player.active.cards.some(c =>
        c.superType === SuperType.ENERGY &&
        (c as EnergyCard).provides?.includes(CardType.FIRE)
      );

      if (hasFireEnergy) {
        return store.prompt(state, new ConfirmPrompt(
          player.id,
          GameMessage.WANT_TO_DEAL_MORE_DAMAGE
        ), result => {
          if (result) {
            const fireEnergy = player.active.cards.find(c =>
              c.superType === SuperType.ENERGY &&
              (c as EnergyCard).provides?.includes(CardType.FIRE)
            );
            if (fireEnergy) {
              player.active.moveCardTo(fireEnergy, player.discard);
              effect.damage += 30;
            }
          }
        });
      }
    }

    return state;
  }
}
