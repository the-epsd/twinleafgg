import { Attack, StateUtils } from '../../game';
import { CardType, Stage, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CheckPokemonAttacksEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class TechnicalMachineDevolution extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public regulationMark = 'G';

  public tags = [ ];

  public set: string = 'PAR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '177';

  public name: string = 'Technical Machine: Devolution';

  public fullName: string = 'Technical Machine: Devolution PAR';

  public attacks: Attack[] = [{
    name: 'Devolution',
    cost: [ CardType.COLORLESS ],
    damage: 0,
    text: 'Devolve each of your opponent\'s evolved Pokémon by putting the highest Stage Evolution card on it into your opponent\'s hand.' 
  }];
  
  public text: string =
    'The Pokémon this card is attached to can use the attack on this card. (You still need the necessary Energy to use this attack.) If this card is attached to 1 of your Pokémon, discard it at the end of your turn.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckPokemonAttacksEffect && effect.player.active.getPokemonCard()?.tools.includes(this) &&
!effect.attacks.includes(this.attacks[0])) {
      effect.attacks.push(this.attacks[0]);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);


      if (opponent.active?.getPokemonCard()?.stage != Stage.BASIC) {
        const latestEvolution = opponent.active.cards[opponent.active.cards.length - 1];
        opponent.active.moveCardsTo([latestEvolution], opponent.hand);
        opponent.active.clearEffects();
      }

      opponent.bench.forEach(benchSpot => {
        if (benchSpot.getPokemonCard()?.stage != Stage.BASIC) {
          const latestEvolution = benchSpot.cards[benchSpot.cards.length - 1];
          benchSpot.moveCardsTo([latestEvolution], opponent.hand);
          benchSpot.clearEffects();
        }
      });


      if (effect instanceof EndTurnEffect && effect.player.active.tool) {
        const player = effect.player;
        const tool = effect.player.active.tool;
        if (tool.name === this.name) {
          player.active.moveCardTo(tool, player.discard);
          player.active.tool = undefined;
        }

        return state;
      }

      return state;
    }
    return state;
  }
}
