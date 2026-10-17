import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import { ConfirmPrompt } from '../../../game/store/prompts/confirm-prompt';
import { GameMessage, PowerType, StateUtils, StoreLike, State } from '../../../game';
import { APPLY_SPECIAL_CONDITIONS_FROM_ABILITY } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Amoonguss extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Foongus';
  public hp: number = 100;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public powers = [{
    name: 'Bursting Spores',
    powerType: PowerType.ABILITY,
    text: 'Whenever you play a Pokémon that has the Spore attack from your hand during your turn, you may leave your opponent\'s Active Pokémon Asleep and Poisoned.'
  }];

  public attacks = [{
    name: 'Venoshock',
    cost: [C, C],
    damage: 20,
    damageCalculation: '+',
    text: 'If your opponent\'s Active Pokémon is Poisoned, this attack does 70 more damage.'
  }];

  public set: string = 'UNM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '14';
  public name: string = 'Amoonguss';
  public fullName: string = 'Amoonguss UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Bursting Spores
    if (effect instanceof PlayPokemonEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (player !== owner) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const playedCard = effect.pokemonCard;
      if (playedCard instanceof PokemonCard && playedCard.attacks.some(a => a.name === 'Spore')) {
        const opponent = StateUtils.getOpponent(state, player);

        store.prompt(state, new ConfirmPrompt(
          player.id,
          GameMessage.WANT_TO_USE_ABILITY,
        ), wantToUse => {
          if (wantToUse) {
            APPLY_SPECIAL_CONDITIONS_FROM_ABILITY(
              store,
              state,
              owner,
              this.powers[0],
              this,
              opponent.active,
              [SpecialCondition.ASLEEP, SpecialCondition.POISONED],
            );
          }
        });
      }
    }

    // Venoshock
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.active.specialConditions.includes(SpecialCondition.POISONED)) {
        effect.damage += 70;
      }
    }

    return state;
  }
}
