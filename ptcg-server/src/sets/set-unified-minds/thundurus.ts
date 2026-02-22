import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Thundurus extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.LIGHTNING;
  public hp: number = 120;
  public weakness = [{ type: CardType.FIGHTING }];
  public resistance = [{ type: CardType.METAL, value: -20 }];
  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Thunderous Gale',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 20,
      damageCalculation: '+',
      text: 'If Tornadus is on your Bench, this attack does 50 more damage.'
    },
    {
      name: 'Raging Thunder',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
      damage: 120,
      text: 'This attack does 40 damage to 1 of your Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public set: string = 'UNM';
  public setNumber: string = '68';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Thundurus';
  public fullName: string = 'Thundurus UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Thunderous Gale
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      // Check for Tornadus on your Bench
      const hasTornadus = player.bench.some(
        b => b.cards.length > 0 && b.cards[0].name.toLowerCase().includes('tornadus')
      );
      if (hasTornadus) {
        effect.damage += 50;
      }
      return state;
    }

    // Raging Thunder
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const benched = player.bench.filter(b => b.cards.length > 0);
      if (benched.length === 0) {
        return state;
      }
      state = store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const damageEffect = new PutDamageEffect(effect, 40);
        damageEffect.target = targets[0];
        store.reduceEffect(state, damageEffect);
      });
      return state;
    }
    return state;
  }
}
