import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, PlayerType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class FalinksV extends PokemonCard {
  public tags = [CardTag.POKEMON_V];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 160;
  public weakness = [{ type: P }];
  public resistance = [];
  public retreat = [C, C];

  public powers = [{
    name: 'Iron Defense Formation',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'All of your Pokémon that have "Falinks" in their name take 20 less damage from your opponent\'s attacks (after applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Giga Impact',
    cost: [F, F, C],
    damage: 210,
    text: 'During your next turn, this Pokémon can\'t attack.'
  }];

  public regulationMark = 'D';
  public set: string = 'RCL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '110';
  public name: string = 'Falinks V';
  public fullName: string = 'Falinks V RCL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect) {
      const cardList = StateUtils.findCardList(state, this);
      const player = StateUtils.findOwner(state, cardList);
      let falinksVCount = 0;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_cardList, card) => {
        if (card.name && card.name.indexOf('Falinks V') !== -1) {
          falinksVCount++;
        }
      });

      if (falinksVCount === 0) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const targetPokemon = effect.target.getPokemonCard();
      if (targetPokemon && StateUtils.findOwner(state, effect.target) === player && targetPokemon.name && targetPokemon.name.indexOf('Falinks') !== -1) {
        effect.reduceDamage(20 * falinksVCount, this.powers[0].name);
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      player.active.cannotAttackNextTurnPending = true;
    }

    return state;
  }
}
