import {
  CardTag,
  ConfirmPrompt,
  GameMessage,
  PlayerType,
  PowerType,
  SlotType,
  Stage,
  StateUtils,
  StoreLike,
  State,
} from '../../../game';
import { CardType } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import { PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import { PutDamagePrompt } from '../../../game/store/prompts/put-damage-prompt';
import { DamageMap } from '../../../game/store/prompts/move-damage-prompt';
import {
  YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP,
  YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED,
} from '../../../game/store/prefabs/attack-effects';
import { IS_ABILITY_BLOCKED, JUST_EVOLVED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Gengar extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Haunter';
  public hp: number = 130;
  public cardType: CardType[] = [P];
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [];

  public powers = [{
    name: 'Shadow Pain',
    powerType: PowerType.ABILITY,
    text: "When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may put 6 damage counters on your opponent's Pokémon-GX and Pokémon-EX in any way you like.",
  }];

  public attacks = [{
    name: 'Twilight Poison',
    cost: [C, C, C],
    damage: 70,
    text: "Your opponent's Active Pokémon is now Asleep and Poisoned.",
  }];

  public set: string = 'UNB';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '70';
  public name: string = 'Gengar';
  public fullName: string = 'Gengar UNB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Shadow Pain
    if (JUST_EVOLVED(effect, this)) {
      const player = effect.player;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const opponent = StateUtils.getOpponent(state, player);

      let hasGxEx = false;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card.hasTag(CardTag.POKEMON_GX) || card.hasTag(CardTag.POKEMON_EX)) {
          hasGxEx = true;
        }
      });

      if (!hasGxEx) {
        return state;
      }

      store.prompt(
        state,
        new ConfirmPrompt(player.id, GameMessage.WANT_TO_USE_ABILITY),
        (wantToUse) => {
          if (wantToUse) {
            const maxAllowedDamage: DamageMap[] = [];
            opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
              if (card.hasTag(CardTag.POKEMON_GX) || card.hasTag(CardTag.POKEMON_EX)) {
                maxAllowedDamage.push({ target, damage: 9999 });
              } else {
                maxAllowedDamage.push({ target, damage: 0 });
              }
            });

            store.prompt(
              state,
              new PutDamagePrompt(
                player.id,
                GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
                PlayerType.TOP_PLAYER,
                [SlotType.ACTIVE, SlotType.BENCH],
                60,
                maxAllowedDamage,
                { allowCancel: false },
              ),
              (targets) => {
                const results = targets || [];
                for (const result of results) {
                  const target = StateUtils.getTarget(state, player, result.target);
                  store.reduceEffect(
                    state,
                    new PlaceDamageCountersEffect(player, target, result.damage, this, this.powers[0]),
                  );
                }
              },
            );
          }
        },
      );

      return state;
    }

    // Twilight Poison
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
    }

    return state;
  }
}
