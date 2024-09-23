import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, CoinFlipPrompt, StateUtils, ChoosePokemonPrompt, PlayerType, SlotType, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Froslassex extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public regulationMark = 'G';

  public tags = [CardTag.POKEMON_ex];

  public evolvesFrom = 'Snorunt';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 250;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Evanescent',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon in the Active Spot and is Knocked Out, flip a coin. If heads, your opponent takes 1 fewer Prize card.'
  }
  ];

  public attacks = [{
    name: 'Frost Bullet',
    cost: [CardType.WATER, CardType.WATER],
    damage: 140,
    text: 'This attack does 20 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }
  ];

  public set: string = 'PAR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '3';

  public name: string = 'Froslass ex';

  public fullName: string = 'Froslass ex PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof KnockOutEffect && effect.target.cards.includes(this)) {

      return store.prompt(state, new CoinFlipPrompt(effect.player.id, GameMessage.COIN_FLIP), result => {

        if (result) {
          // Reduce prizes by 1
          effect.prizeCount -= 1;
        }
        return state;
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const targets = opponent.bench.filter(b => b.cards.length > 0);
      if (targets.length === 0) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
      ), selected => {
        const target = selected[0];
        const damageEffect = new PutDamageEffect(effect, 20);
        damageEffect.target = target;
        store.reduceEffect(state, damageEffect);
      });

    }
    return state;
  }
}
