import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import { AttachPokemonToolEffect } from '../../../game/store/effects/play-card-effects';
import { ConfirmPrompt } from '../../../game/store/prompts/confirm-prompt';
import { GameMessage, PowerType, StateUtils, StoreLike, State } from '../../../game';
import { APPLY_SPECIAL_CONDITIONS_FROM_ABILITY } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { IS_ABILITY_BLOCKED } from '../../../game/store/prefabs/prefabs';

export class TapuLele extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 110;
  public cardType: CardType[] = [Y];
  public weakness = [{ type: M }];
  public resistance = [{ type: D, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Charmed Charm',
    powerType: PowerType.ABILITY,
    text: 'Whenever you attach a Pokémon Tool card that has "Fairy Charm" in its name from your hand to this Pokémon during your turn, you may leave your opponent\'s Active Pokémon Confused.'
  }];

  public attacks = [{
    name: 'Magical Shot',
    cost: [Y, C, C],
    damage: 70,
    text: ''
  }];

  public set: string = 'LOT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '150';
  public name: string = 'Tapu Lele';
  public fullName: string = 'Tapu Lele LOT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Charmed Charm
    if (effect instanceof AttachPokemonToolEffect && effect.target.getPokemonCard() === this) {
      const player = effect.player;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      if (!effect.trainerCard.name.includes('Fairy Charm')) {
        return state;
      }

      const opponent = StateUtils.getOpponent(state, player);

      store.prompt(state, new ConfirmPrompt(
        player.id,
        GameMessage.WANT_TO_USE_ABILITY
      ), wantToUse => {
        if (wantToUse) {
          APPLY_SPECIAL_CONDITIONS_FROM_ABILITY(
            store,
            state,
            player,
            this.powers[0],
            this,
            opponent.active,
            [SpecialCondition.CONFUSED],
          );
        }
      });
    }

    return state;
  }
}
