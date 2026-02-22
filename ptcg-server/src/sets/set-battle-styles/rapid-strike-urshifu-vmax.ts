import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, ChoosePokemonPrompt, PlayerType, SlotType, Card } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { GameMessage } from '../../game/game-message';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { DAMAGE_OPPONENT_POKEMON, MOVED_TO_ACTIVE_THIS_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class RapidStrikeUrshifuVMAX extends PokemonCard {

  public tags = [CardTag.POKEMON_VMAX, CardTag.RAPID_STRIKE];

  public regulationMark = 'E';

  public stage: Stage = Stage.VMAX;

  public evolvesFrom = 'Rapid Strike Urshifu V';

  public cardType: CardType = F;

  public hp: number = 330;

  public weakness = [{ type: P }];

  public retreat = [C, C];

  public attacks = [
    {
      name: 'Gale Thrust',
      cost: [F],
      damage: 30,
      text: 'If this Pokémon moved from your Bench to the Active Spot this turn, this attack does 120 more damage.'
    },
    {
      name: 'G-Max Rapid Flow',
      cost: [F, F, C],
      damage: 0,
      text: 'Discard all Energy from this Pokémon. This attack does 120 damage to 2 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public set: string = 'BST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '88';

  public name: string = 'Rapid Strike Urshifu VMAX';

  public fullName: string = 'Rapid Strike Urshifu VMAX BST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (MOVED_TO_ACTIVE_THIS_TURN(effect.player, this)) {
        effect.damage += 120;
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      const cards: Card[] = checkProvidedEnergy.energyMap.map(e => e.card);
      const discardEnergy = new DiscardCardsEffect(effect, cards);
      discardEnergy.target = player.active;
      store.reduceEffect(state, discardEnergy);

      const max = Math.min(2);
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max, allowCancel: false }
      ), selected => {
        const targets = selected || [];
        DAMAGE_OPPONENT_POKEMON(store, state, effect, 120, targets);
      });
    }
    return state;
  }
}