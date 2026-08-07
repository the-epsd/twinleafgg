import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DAMAGE_OPPONENT_POKEMON, DEAL_MORE_DAMAGE_IF_OPPONENT_ACTIVE_HAS_CARD_TAG, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class TeamAquasSealeo extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Team Aqua\'s Spheal';
  public tags = [CardTag.TEAM_AQUA];
  public hp: number = 90;
  public cardType: CardType = W;
  public weakness = [{ type: M }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Splatter',
    cost: [W, C],
    damage: 0,
    text: 'This attack does 20 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Hail Storm',
    cost: [W, C, C],
    damage: 60,
    damageCalculation: '+',
    text: 'If your opponent\'s Active Pokémon is a Team Magma Pokémon, this attack does 60 more damage.'
  }];

  public set: string = 'DCR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '4';
  public name: string = 'Team Aqua\'s Sealeo';
  public fullName: string = 'Team Aqua\'s Sealeo DCR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Splatter
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return store.prompt(state, new ChoosePokemonPrompt(
        effect.player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const targets = selected || [];
        DAMAGE_OPPONENT_POKEMON(store, state, effect, 20, targets);
      });
    }

    // Hail Storm
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DEAL_MORE_DAMAGE_IF_OPPONENT_ACTIVE_HAS_CARD_TAG(effect, state, 60, CardTag.TEAM_MAGMA);
    }

    return state;
  }
}
