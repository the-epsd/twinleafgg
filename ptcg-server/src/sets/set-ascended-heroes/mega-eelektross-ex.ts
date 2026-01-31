import { CardTag, CardType, GameMessage, PokemonCard, SlotType, Stage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_PARALYZED_TO_PLAYER_ACTIVE, CONFIRMATION_PROMPT, THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';

export class MegaEelektrossex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Eelektrik';
  public tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex];
  public cardType: CardType = L;
  public hp: number = 350;
  public weakness = [{ type: F }];
  public resistance = [];
  public retreat = [C, C];

  public attacks = [{
    name: 'Split Bomb',
    cost: [L, L],
    damage: 0,
    text: 'This attack does 60 damage to 2 of your opponent\'s Pokemon. (Don\'t apply Weakness and Resistance for Benched Pokemon.)'
  },
  {
    name: 'Disaster Shock',
    cost: [L, L, L],
    damage: 190,
    text: 'You may discard 2 [L] Energy from this Pokemon and make your opponent\'s Active Pokemon Paralyzed.'
  }];

  public regulationMark: string = 'I';
  public set: string = 'ASC';
  public setNumber: string = '61';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mega Eelektross ex';
  public fullName: string = 'Mega Eelektross ex M2a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      // Split Bomb: 60 damage to 2 opponent's Pokemon
      // Don't apply Weakness and Resistance for Benched Pokemon
      THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON(60, effect, store, state, 2, 2, false, [SlotType.ACTIVE, SlotType.BENCH]);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      // Disaster Shock: 190 damage, optionally discard 2 [L] Energy to Paralyze
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      CONFIRMATION_PROMPT(store, state, player, result => {
        if (result) {
          DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2, L);
          ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, opponent, this);
        }
      }, GameMessage.WANT_TO_USE_EFFECT_OF_ATTACK);
    }

    return state;
  }
}

