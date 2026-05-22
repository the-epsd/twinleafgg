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
    if (effect instanceof CheckTableStateEffect) {
      // Ensure this card is actually in play (active or bench)
      const slot = StateUtils.findPokemonSlot(state, this);
      if (!slot) {
        this.evolvesToStage = [];
        return state;
      }

      // Resolve the owning player to validate if ability is blocked
      let owner;
      try {
        owner = StateUtils.findOwner(state, slot);
      } catch {
        owner = undefined;
      }

      if (!owner) {
        this.evolvesToStage = [];
        return state;
      }

      // Try to reduce PowerEffect to check if something blocks our ability
      try {
        const stub = new PowerEffect(owner, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
        this.evolvesToStage = [Stage.STAGE_1];
      } catch {
        this.evolvesToStage = [];
      }
    }
    return state;
  }
}