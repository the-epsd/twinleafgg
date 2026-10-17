import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { GameError, GameMessage, PlayerType, PokemonCardList, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { CheckPokemonTypeEffect } from '../../../game/store/effects/check-effects';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { ABILITY_USED, ADD_CONFUSION_TO_PLAYER_ACTIVE, ADD_MARKER, HAS_MARKER, IS_POKEPOWER_BLOCKED, MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class Sunflora extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Sunkern';
  public hp: number = 80;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +20 }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Grass Whistle',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may remove 1 damage counter from each of your Grass Pokémon. You can\'t use more than 1 Grass Whistle Poké-Power each turn. This power can\'t be used if Sunflora is affected by a Special Condition.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Petal Dance',
    cost: [G, G],
    damage: 30,
    damageCalculation: 'x',
    text: 'Flip 3 coins. This attack does 30 damage times the number of heads. If you get 2 or more heads, Sunflora is now Confused.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '38';
  public name: string = 'Sunflora';
  public fullName: string = 'Sunflora SW';

  public readonly GRASS_WHISTLE_MARKER = 'GRASS_WHISTLE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Grass Whistle
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;
      if (cardList.specialConditions.length > 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (HAS_MARKER(this.GRASS_WHISTLE_MARKER, player)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      ADD_MARKER(this.GRASS_WHISTLE_MARKER, player, this);
      ABILITY_USED(player, this);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list) => {
        const checkType = new CheckPokemonTypeEffect(list);
        store.reduceEffect(state, checkType);
        if (checkType.cardTypes.includes(CardType.GRASS) && list.damage > 0) {
          const healEffect = new HealEffect(player, list, 10);
          store.reduceEffect(state, healEffect);
        }
      });
      return state;
    }

    // Petal Dance
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 3, results => {
        const heads = results.filter(r => r).length;
        effect.damage = 30 * heads;
        if (heads >= 2) {
          ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, player, this);
        }
      });
    }

    if (effect instanceof EndTurnEffect && HAS_MARKER(this.GRASS_WHISTLE_MARKER, effect.player)) {
      effect.player.marker.removeMarker(this.GRASS_WHISTLE_MARKER);
    }

    return state;
  }
}
