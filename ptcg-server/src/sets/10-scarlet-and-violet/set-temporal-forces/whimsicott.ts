import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../../game/store/card/card-types';
import { StoreLike, State, PowerType, ConfirmPrompt, GameMessage } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { CheckPokemonTypeEffect } from '../../../game/store/effects/check-effects';
import { ABILITY_USED, IS_ABILITY_BLOCKED, MOVE_CARDS } from '../../../game/store/prefabs/prefabs';

export class Whimsicott extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Cottonee';
  public cardType: CardType = G;
  public hp: number = 100;
  public weakness = [{ type: R }];
  public retreat = [C];

  public powers = [{
    name: 'Wafting Heal',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may heal all damage from your Active [G] Pokémon. If you healed any damage in this way, discard all Energy from that Pokémon.'
  }];

  public attacks = [{
    name: 'Seed Bomb',
    cost: [G],
    damage: 40,
    text: ''
  }];

  public regulationMark = 'H';
  public set: string = 'TEF';
  public setNumber: string = '15';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Whimsicott';
  public fullName: string = 'Whimsicott TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-evolving-skies/ludicolo.ts (PlayPokemonEffect + ConfirmPrompt)
    // Ref: set-battle-styles/cheryl.ts (heal then discard all Energy)
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const checkType = new CheckPokemonTypeEffect(player.active);
      store.reduceEffect(state, checkType);

      if (!checkType.cardTypes.includes(CardType.GRASS)) {
        return state;
      }

      state = store.prompt(state, new ConfirmPrompt(
        player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (!wantToUse) {
          return;
        }

        const target = player.active;
        const damageBeforeHeal = target.damage;

        if (damageBeforeHeal > 0) {
          const healEffect = new HealEffect(player, target, damageBeforeHeal);
          store.reduceEffect(state, healEffect);

          const energyCards = target.cards.filter(c => c.superType === SuperType.ENERGY);
          MOVE_CARDS(store, state, target, player.discard, { cards: energyCards, sourceCard: this });
        }
        ABILITY_USED(player, this);
      });
    }

    return state;
  }
}
