import { ConfirmPrompt, GameMessage, PowerType, StateUtils, StoreLike } from '../../../game';
import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import { AttachEnergyEffect } from '../../../game/store/effects/play-card-effects';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON } from '../../../game/store/prefabs/attack-effects';
import { GUST_OPPONENT_BENCHED_POKEMON_FROM_ABILITY } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { CONFIRMATION_PROMPT, IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { State } from '../../../game/store/state/state';

export class GenesectEX extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.POKEMON_EX, CardTag.TEAM_PLASMA];
  public cardType: CardType[] = [G];
  public hp: number = 170;
  public weakness = [{ type: R }];
  public retreat = [C];

  public powers = [{
    name: 'Red Signal',
    powerType: PowerType.ABILITY,
    text: "When you attach a Plasma Energy from your hand to this Pokémon, you may switch 1 of your opponent's Benched Pokémon with his or her Active Pokémon.",
  }];

  public attacks = [{
    name: 'Megalo Cannon',
    cost: [G, G, C],
    damage: 100,
    text: "Does 20 damage to 1 of your opponent's Benched Pokémon. (Don't apply Weakness and Resistance for Benched Pokémon.)",
  }];

  public set: string = 'PLB';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '11';
  public name: string = 'Genesect-EX';
  public fullName: string = 'Genesect EX PLB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Red Signal
    if (effect instanceof AttachEnergyEffect && effect.target.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasBench = opponent.bench.some((b) => b.cards.length > 0);

      if (!hasBench) {
        return state;
      }

      if (effect.energyCard.name === 'Plasma Energy') {
        if (IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
          return state;
        }
        CONFIRMATION_PROMPT(store, state, effect.player, (result) => {
          if (result) {
            state = store.prompt(
              state,
              new ConfirmPrompt(effect.player.id, GameMessage.WANT_TO_USE_ABILITY),
              (wantToUse) => {
                if (wantToUse) {
                  GUST_OPPONENT_BENCHED_POKEMON_FROM_ABILITY(
                    store,
                    state,
                    player,
                    this.powers[0],
                    this,
                    { allowCancel: false },
                  );
                }
              },
            );
          }
        });
      }
    }

    // Megalo Cannon
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(20, effect, store, state);
    }

    return state;
  }
}
