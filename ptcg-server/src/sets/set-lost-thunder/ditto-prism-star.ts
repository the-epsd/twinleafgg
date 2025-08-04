import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, CardTag } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect, PowerEffect } from '../../game/store/effects/game-effects';
import { CheckTableStateEffect } from '../../game/store/effects/check-effects';

export class DittoPrismStar extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.COLORLESS;
  public hp: number = 40;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS];
  public tags = [CardTag.PRISM_STAR];

  public powers = [{
    name: 'Almighty Evolution',
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may put any Stage 1 card from your hand onto this Pokémon to evolve it. You can\'t use this Ability during your first turn or the turn this Pokémon was put into play.'
  }];

  public cardImage: string = 'assets/cardback.png';
  public set: string = 'LOT';
  public name: string = 'Ditto Prism Star';
  public fullName: string = 'Ditto Prism Star LOT';
  public setNumber: string = '154';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckTableStateEffect && StateUtils.isPokemonInPlay(effect.player, this)) {
      const player = effect.player;
      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }
      this.evolvesToStage = [Stage.STAGE_1];
    }
    return state;
  }
}