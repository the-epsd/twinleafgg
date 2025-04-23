import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, StateUtils, ConfirmPrompt, GameMessage, ChoosePokemonPrompt, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { EffectOfAbilityEffect } from '../../game/store/effects/game-effects';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Frogadier extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = CardType.WATER;
  public hp: number = 80;
  public retreat = [CardType.COLORLESS];
  public weakness = [{ type: CardType.GRASS }];
  public evolvesFrom = 'Froakie';

  public powers = [{
    name: 'Gale Shuriken',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may put 2 damage counters on 1 of your opponent\'s Pokémon.'
  }];

  public attacks = [{
    name: 'Water Drip',
    cost: [CardType.WATER],
    damage: 20,
    text: ''
  }];

  public set: string = 'FLI';
  public name: string = 'Frogadier';
  public fullName: string = 'Frogadier FLI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '23';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = StateUtils.findOwner(state, effect.target);
      const opponent = StateUtils.getOpponent(state, player);

      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {
          if (IS_ABILITY_BLOCKED(store, state, player, this)) return state;

          return store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
            PlayerType.TOP_PLAYER,
            [SlotType.ACTIVE, SlotType.BENCH],
            { min: 1, max: 1, allowCancel: false },
          ), selected => {
            const targets = selected || [];

            if (targets.length > 0) {
              // Check if ability can target selected Pokemon
              const canApplyAbility = new EffectOfAbilityEffect(player, this.powers[0], this, targets[0]);
              store.reduceEffect(state, canApplyAbility);
              if (canApplyAbility.target) {
                canApplyAbility.target.damage += 20;
              }
            }
          });
        }

        return state;
      });

    }

    return state;
  }

}