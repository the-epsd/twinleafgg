import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StoreLike } from '../../game';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';

import { DAMAGE_OPPONENT_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class RagingBolt extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [CardTag.ANCIENT];

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 130;

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Thunderburst Storm',
      cost: [CardType.LIGHTNING, CardType.FIGHTING],
      damage: 0,
      text: 'This attack does 30 damage to 1 of your opponent\'s Pokémon for each Energy attached to this Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'Dragon Headbutt',
      cost: [CardType.LIGHTNING, CardType.FIGHTING, CardType.COLORLESS],
      damage: 130,
      text: ''
    }
  ];

  public set: string = 'SCR';

  public regulationMark = 'H';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '111';

  public name: string = 'Raging Bolt';

  public fullName: string = 'Raging Bolt SCR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const targets = selected || [];

        const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, player.active);
        store.reduceEffect(state, checkProvidedEnergyEffect);

        const providedEnergy = checkProvidedEnergyEffect.energyMap.reduce((acc, curr) => acc + curr.provides.length, 0);
        const damage = providedEnergy * 30;

        DAMAGE_OPPONENT_POKEMON(store, state, effect, damage, targets);

      });
    }
    return state;
  }
}
