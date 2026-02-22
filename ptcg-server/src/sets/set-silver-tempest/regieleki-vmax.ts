import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import {
  PowerType, StoreLike, State,
  PlayerType,
  StateUtils
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class RegielekiVMAX extends PokemonCard {

  public regulationMark = 'F';

  public tags = [CardTag.POKEMON_VMAX];

  public stage: Stage = Stage.VMAX;

  public evolvesFrom = 'Regieleki V';

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 310;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [];

  public powers = [{
    name: 'Transistor',
    powerType: PowerType.ABILITY,
    text: 'Your Basic [L] Pokémon\'s attacks do 30 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
  }];

  public attacks = [
    {
      name: 'Max Thunder and Lightning',
      cost: [CardType.LIGHTNING, CardType.COLORLESS, CardType.COLORLESS],
      damage: 220,
      text: 'During your next turn, this Pokémon can\'t attack.'
    }
  ];


  public set: string = 'SIT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '58';

  public name: string = 'Regieleki VMAX';

  public fullName: string = 'Regieleki VMAX SIT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Max Thunder and Lightning
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      player.active.cannotAttackNextTurnPending = true;
    }

    if (effect instanceof DealDamageEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const hasZapdosInPlay = player.bench.some(b => b.cards.includes(this)) || player.active.cards.includes(this);
      let numberOfRegielekiVMAXInPlay = 0;

      if (hasZapdosInPlay) {
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
          if (cardList.cards.includes(this)) {
            numberOfRegielekiVMAXInPlay++;
          }
        });
      }

      const checkPokemonTypeEffect = new CheckPokemonTypeEffect(player.active);
      store.reduceEffect(state, checkPokemonTypeEffect);

      if (checkPokemonTypeEffect.cardTypes.includes(CardType.LIGHTNING) && effect.target === opponent.active) {
        if (effect.player.active.getPokemonCard()?.stage === Stage.BASIC) {
          effect.damage += 30 * numberOfRegielekiVMAXInPlay;
        }
      }


    }

    return state;
  }
}