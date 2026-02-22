import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { DEAL_MORE_DAMAGE_FOR_EACH_PRIZE_CARD_TAKEN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class ShayminVSTAR extends PokemonCard {

  public regulationMark = 'F';

  public tags = [CardTag.POKEMON_V];

  public stage: Stage = Stage.VSTAR;

  public evolvesFrom = 'Shaymin V';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 250;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Star Bloom',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'During your turn, you may heal 120 damage from each of your Benched [G] Pokémon. (You can\'t use more than 1 VSTAR Power in a game.)'
  }];

  public attacks = [
    {
      name: 'Revenge Blast',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: 120,
      damageCalculation: '+',
      text: 'This attack does 40 more damage for each Prize card your opponent has taken.'
    }
  ];

  public set: string = 'BRS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '14';

  public name: string = 'Shaymin VSTAR';

  public fullName: string = 'Shaymin VSTAR BRS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {

      const player = effect.player;

      if (player.usedVSTAR === true) {
        throw new GameError(GameMessage.LABEL_VSTAR_USED);
      }

      // Heal each Benched Grass Pokemon by 120 damage
      player.bench.forEach(benchSpot => {
        const pokemonCard = benchSpot.getPokemonCard();
        if (pokemonCard && pokemonCard.cardType === CardType.GRASS) {
          const healEffect = new HealEffect(player, benchSpot, 120);
          state = store.reduceEffect(state, healEffect);
          player.usedVSTAR = true;
        }
      });

    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      DEAL_MORE_DAMAGE_FOR_EACH_PRIZE_CARD_TAKEN(effect, state, 40);
    }

    return state;
  }


}