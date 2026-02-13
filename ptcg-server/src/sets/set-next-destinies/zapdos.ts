import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameMessage, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';

export class Zapdos extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 120;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Thunder Claw',
      cost: [L, C],
      damage: 30,
      text: 'Flip a coin. If heads, this attack does 20 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'Random Spark',
      cost: [L, L, C],
      damage: 50,
      text: 'This attack does 50 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public set: string = 'NXD';
  public setNumber: string = '41';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Zapdos';
  public fullName: string = 'Zapdos NXD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Thunder Claw - flip for benched damage
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const benchedPokemon = opponent.bench.filter(b => b.cards.length > 0);

      if (benchedPokemon.length > 0) {
        return COIN_FLIP_PROMPT(store, state, player, result => {
          if (result) {
            return store.prompt(state, new ChoosePokemonPrompt(
              player.id,
              GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
              PlayerType.TOP_PLAYER,
              [SlotType.BENCH],
              { min: 1, max: 1, allowCancel: false }
            ), targets => {
              if (targets && targets.length > 0) {
                const damageEffect = new PutDamageEffect(effect, 20);
                damageEffect.target = targets[0];
                store.reduceEffect(state, damageEffect);
              }
            });
          }
        });
      }
    }

    // Random Spark - 50 damage to chosen benched Pokémon
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const benchedPokemon = opponent.bench.filter(b => b.cards.length > 0);

      if (benchedPokemon.length > 0) {
        return store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH],
          { min: 1, max: 1, allowCancel: false }
        ), targets => {
          if (targets && targets.length > 0) {
            const damageEffect = new PutDamageEffect(effect, 50);
            damageEffect.target = targets[0];
            store.reduceEffect(state, damageEffect);
          }
        });
      }
    }

    return state;
  }
}
