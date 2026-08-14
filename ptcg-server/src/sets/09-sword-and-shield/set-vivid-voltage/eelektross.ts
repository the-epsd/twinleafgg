import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, StoreLike, State, StateUtils } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_TAKES_DAMAGE_ON_ENERGY_ATTACH_FROM_HAND_NEXT_TURN } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Eelektross extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Eelektrik';
  public cardType: CardType = L;
  public hp: number = 160;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Electrified Bite Mark',
      cost: [L],
      damage: 60,
      text: 'During your opponent\'s next turn, if they attach an Energy card from their hand to the Defending Pokémon, put 6 damage counters on that Pokémon.'
    },
    {
      name: 'Electro Sprinkler',
      cost: [L, C, C],
      damage: 120,
      text: 'This attack also does 30 damage to 1 of your Benched Pokémon and 30 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public regulationMark: string = 'D';
  public set: string = 'VIV';
  public setNumber: string = '59';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Eelektross';
  public fullName: string = 'Eelektross VIV';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Electrified Bite Mark
    // Ref: set-mega-evolution/pachirisu.ts (Electrified Incisors)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_TAKES_DAMAGE_ON_ENERGY_ATTACH_FROM_HAND_NEXT_TURN(store, state, effect, this, 60);
    }

    // Electro Sprinkler
    // Ref: set-vivid-voltage/barraskewda.ts (PutDamageEffect for bench damage)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasOwnBench = player.bench.some(b => b.cards.length > 0);
      const hasOpponentBench = opponent.bench.some(b => b.cards.length > 0);

      if (hasOwnBench) {
        store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          { min: 1, max: 1, allowCancel: false }
        ), selected => {
          const targets = selected || [];
          targets.forEach(target => {
            const dmg = new PutDamageEffect(effect, 30);
            dmg.target = target;
            store.reduceEffect(state, dmg);
          });
        });
      }

      if (hasOpponentBench) {
        store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH],
          { min: 1, max: 1, allowCancel: false }
        ), selected => {
          const targets = selected || [];
          targets.forEach(target => {
            const dmg = new PutDamageEffect(effect, 30);
            dmg.target = target;
            store.reduceEffect(state, dmg);
          });
        });
      }
    }

    return state;
  }
}
