import { CONFIRMATION_PROMPT, JUST_EVOLVED, SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CardTag, CardType, Stage, SuperType, TrainerType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage, PowerType, State, StoreLike, TrainerCard } from '../../game';

export class Quagsire extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Wooper';
  public tags = [CardTag.DELTA_SPECIES];
  public cardType: CardType = G;
  public hp: number = 80;
  public weakness = [{ type: G }];
  public retreat = [C];

  public powers = [{
    name: 'Dig Up',
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, when you play Quagsire from your hand to evolve 1 of your Pokémon, you may search your discard pile for up to 2 Pokémon Tool cards, show them to your opponent, and put them into your hand.'
  }];

  public attacks = [{
    name: 'Pump Out',
    cost: [G, C, C],
    damage: 50,
    damageCalculation: '+',
    text: 'If Quagsire has a Pokémon Tool card attached to it, this attack does 50 damage plus 20 more damage.'
  }];

  public set: string = 'DF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '21';
  public name: string = 'Quagsire';
  public fullName: string = 'Quagsire DF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (JUST_EVOLVED(effect, this)) {
      const player = effect.player;

      const blocked: number[] = [];
      player.discard.cards.forEach((card, index) => {
        if (!(card instanceof TrainerCard && card.trainerType === TrainerType.TOOL)) {
          blocked.push(index);
        }
      });

      if (blocked.length === player.discard.cards.length) {
        return state;
      }

      CONFIRMATION_PROMPT(store, state, effect.player, (result) => {
        if (!result) {
          return state;
        }

        SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND(store, state, player, this, { superType: SuperType.TRAINER }, { min: 0, max: 2, blocked });
      }, GameMessage.WANT_TO_USE_ABILITY);
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (effect.source.tools.length > 0) {
        effect.damage += 20;
      }
    }

    return state;
  }
}