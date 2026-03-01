import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils } from '../../game';
import { Effect, PowerEffect } from '../../game/store/effects/game-effects';
import { CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Eeveeex extends PokemonCard {

  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 200;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Rainbow DNA',
    powerType: PowerType.ABILITY,
    text: 'You can play Pokemon ex that evolve from Eevee onto this Pokemon to evolve it. (You can\'t evolve this Pokemon during your first turn or during the turn you play it.)'
  }];

  public attacks = [
    {
      name: 'Coruscating Quartz',
      cost: [CardType.FIRE, CardType.WATER, CardType.LIGHTNING],
      damage: 200,
      text: ''
    }
  ];

  public regulationMark: string = 'H';
  public set: string = 'PRE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '75';
  public name: string = 'Eevee ex';
  public fullName: string = 'Eevee ex PRE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Rainbow DNA - allow Pokemon that evolve from Eevee to be dragged onto this
    if (effect instanceof CheckTableStateEffect) {
      const slot = StateUtils.findPokemonSlot(state, this);
      if (!slot) {
        this.evolvesFromBase = [];
        return state;
      }

      let owner;
      try {
        owner = StateUtils.findOwner(state, slot);
      } catch {
        owner = undefined;
      }

      if (!owner) {
        this.evolvesFromBase = [];
        return state;
      }

      // First turn restriction
      // if (state.turn <= 2) {
      //   this.evolvesFromBase = [];
      //   return state;
      // }

      // Can't evolve during the turn this Pokemon was put into play
      // if (slot.pokemonPlayedTurn >= state.turn) {
      //   this.evolvesFromBase = [];
      //   return state;
      // }

      try {
        const stub = new PowerEffect(owner, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
        this.evolvesFromBase = ['Eevee'];
      } catch {
        this.evolvesFromBase = [];
      }
    }

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Target is not Active
      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      effect.preventDefault = true;
    }
    return state;
  }
}
