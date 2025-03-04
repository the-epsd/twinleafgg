import { Attack, CardType, PokemonCard, Stage, State, StateUtils, StoreLike, Weakness } from '../../game';
import { KnockOutOpponentEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Annihilape extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Primeape';
  public cardType: CardType = F;
  public hp: number = 140;
  public weakness: Weakness[] = [{ type: P }];
  public retreat: CardType[] = [C, C];

  public attacks: Attack[] = [
    { name: 'Tantrum', cost: [F], damage: 130, text: 'This Pokémon is now Confused.' },
    { name: 'Destined Fight', cost: [F, C], damage: 0, text: 'Both Active Pokémon are Knocked Out.' },
  ];

  public set: string = 'SSP';
  public regulationMark: string = 'H';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '100';
  public name: string = 'Annihilape';
  public fullName: string = 'Annihilape SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.player, this);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Knock out both active Pokemon
      player.active.damage += 999;

      const dealDamage = new KnockOutOpponentEffect(effect, 999);
      dealDamage.target = opponent.active;
      store.reduceEffect(state, dealDamage);
    }

    return state;
  }
}