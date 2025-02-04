import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType, Power, PowerType, Attack, StateUtils, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ATTACH_ENERGY_FROM_DISCARD, CONFIRMATION_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { EvolveEffect } from '../../game/store/effects/game-effects';

export class Lycanroc extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Rockruff';
  public regulationMark = 'I';
  public cardType: CardType = F;
  public hp: number = 120;
  public weakness = [{ type: G }];
  public resistance = [];
  public retreat = [C, C];

  public powers: Power[] = [{
    name: 'Spike Cloak',
    powerType: PowerType.ABILITY,
    text: 'You may use this Ability when you play this Pokémon from your hand to evolve 1 of your Pokémon. ' +
      'Attach up to 2 Spike Energy cards from your discard pile to this Pokémon.'
  }];

  public attacks: Attack[] = [
    {
      name: 'Clutch Fang',
      cost: [C, C, C],
      damage: 40,
      damageCalculation: '+',
      text: 'This attack does 40 more damage for each damage counter on your opponent\'s Active Pokémon.'
    },
  ];

  public set: string = 'SV9';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '52';
  public name: string = 'Lycanroc';
  public fullName: string = 'Lycanroc SV9';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EvolveEffect && effect.pokemonCard === this) {
      CONFIRMATION_PROMPT(store, state, effect.player, (result) => {
        if (!result)
          return;
        ATTACH_ENERGY_FROM_DISCARD(
          store, state, effect.player, PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE],
          { energyType: EnergyType.SPECIAL, name: 'Spike Energy' },
          { min: 0, max: 2 },
        );
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.active.damage > 0)
        effect.damage += (opponent.active.damage * 4);
    }
    return state;
  }
}