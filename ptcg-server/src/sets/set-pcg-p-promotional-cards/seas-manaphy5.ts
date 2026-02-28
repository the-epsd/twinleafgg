import { ADD_SLEEP_TO_PLAYER_ACTIVE, AFTER_ATTACK, IS_POKEBODY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { PowerType, State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
export class SeasManaphy5 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness = [{ type: L }];
  public retreat = [C];

  public powers = [{
    name: 'Natural Cure',
    useWhenInPlay: false,
    powerType: PowerType.POKEBODY,
    text: 'Whenever you attach a [W] Energy card from your hand to Sea\'s Manaphy, remove all Special Conditions from Sea\'s Manaphy.'
  }];

  public attacks = [{
    name: 'Water Pulse',
    cost: [W, C],
    damage: 20,
    text: 'The Defending Pokémon is now Asleep.'
  }];

  public set: string = 'PCGP';
  public name: string = 'Sea\'s Manaphy';
  public fullName: string = 'Sea\'s Manaphy PCGP 154';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '154';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttachEnergyEffect && effect.target.cards.includes(this)) {
      const player = effect.player;

      if (effect.target.specialConditions.length === 0) {
        return state;
      }

      if (!effect.energyCard.provides.includes(CardType.WATER)) {
        return state;
      }

      const pokemonCard = effect.target.getPokemonCard();
      if (pokemonCard !== this) {
        return state;
      }

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const conditions = effect.target.specialConditions.slice();
      conditions.forEach(condition => {
        effect.target.removeSpecialCondition(condition);
      });
    }

    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    return state;
  }

}
