import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType, ChoosePokemonPrompt, GameMessage, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Exeggutor extends PokemonCard {
  public tags = [CardTag.DELTA_SPECIES];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Exeggcute';
  public cardType: CardType = F;
  public hp: number = 50;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Delta Circle',
    cost: [C, C],
    damage: 10,
    damageCalculation: '+',
    text: 'Does 10 damage plus 10 more damage for each Pokémon you have in play that has delta on its card.'
  },
  {
    name: 'Split Bomb',
    cost: [F, C, C],
    damage: 0,
    text: 'Choose 2 of your opponent\'s Pokémon. This attack does 30 damage to each of them. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'HP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '41';
  public name: string = 'Exeggutor';
  public fullName: string = 'Exeggutor HP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      // Count Delta Pokemon in play
      const player = effect.player;
      let deltaCount = 0;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card) => {
        if (card.tags.includes(CardTag.DELTA_SPECIES)) {
          deltaCount++;
        }
      });

      // Modify damage based on count
      effect.damage += 10 * deltaCount;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const max = Math.min(2);

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: max, allowCancel: false }
      ), selected => {
        const targets = selected || [];

        targets.forEach(target => {
          const damageEffect = new PutDamageEffect(effect, 30);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        });
        return state;
      });
    }

    return state;
  }
}