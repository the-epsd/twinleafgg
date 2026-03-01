import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { ADD_PARALYZED_TO_PLAYER_ACTIVE, AFTER_ATTACK, COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CardType, Stage } from '../../game/store/card/card-types';
import { StateUtils } from '../../game/store/state-utils';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { PlayerType, State, StoreLike } from '../../game';
export class Bronzong extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Bronzor';
  public cardType: CardType = M;
  public hp: number = 110;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Psy Bolt',
      cost: [M],
      damage: 20,
      text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
    },
    {
      name: 'Psychic Resonance',
      cost: [M, C, C],
      damage: 60,
      damageCalculation: '+' as '+',
      text: 'If your opponent has any Psychic Pokémon in play, this attack does 60 more damage.'
    }
  ];

  public set: string = 'UPR';
  public setNumber: string = '87';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Bronzong';
  public fullName: string = 'Bronzong UPR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Psy Bolt
    // Ref: AGENTS-patterns.md (coin flip + paralyzed)
    if (AFTER_ATTACK(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
      });
    }

    // Attack 2: Psychic Resonance
    // Ref: set-guardians-rising/honchkrow.ts (Raven's Claw - checking opponent's Pokemon)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let hasPsychic = false;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        const checkType = new CheckPokemonTypeEffect(cardList);
        store.reduceEffect(state, checkType);
        if (checkType.cardTypes.includes(CardType.PSYCHIC)) {
          hasPsychic = true;
        }
      });

      if (hasPsychic) {
        effect.damage += 60;
      }
    }

    return state;
  }
}
