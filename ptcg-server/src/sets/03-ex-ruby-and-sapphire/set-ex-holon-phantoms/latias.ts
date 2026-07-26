import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { PowerType } from '../../../game/store/card/pokemon-types';
import { StoreLike, State, GameMessage, StateUtils, PlayerType, Player } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AFTER_ATTACK, DRAW_CARDS } from '../../../game/store/prefabs/prefabs';
import { PokemonCardList } from '../../../game/store/state/pokemon-card-list';
import {
  HANDLE_ABILITY_BLOCK,
  POKEBODY_TYPES,
} from '../../../game/store/prefabs/ability-lock';

export class Latias extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.DELTA_SPECIES];
  public cardType: CardType = R;
  public hp: number = 70;
  public weakness = [{ type: C }];
  public resistance = [{ type: P, value: -30 }, { type: F, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Dual Aura',
    powerType: PowerType.POKEBODY,
    text: 'As long as you have Latios or Latios ex in play, each player\'s Evolved Pokémon (excluding Pokémon-ex) can\'t use any Poké-Bodies.'
  }];

  public attacks = [{
    name: 'Spearhead',
    cost: [C],
    damage: 0,
    text: 'Draw a card.'
  },
  {
    name: 'Dragon Claw',
    cost: [R, C, C],
    damage: 40,
    text: ''
  }];

  public set: string = 'HP';
  public name: string = 'Latias';
  public fullName: string = 'Latias HP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '11';

  private hasLatiasLatiosCombo(player: Player): boolean {
    let isLatiosInPlay = false;
    let isThisInPlay = false;
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
      if (card.name === 'Latios' || card.name === 'Latios ex') {
        isLatiosInPlay = true;
      }
      if (card === this) {
        isThisInPlay = true;
      }
    });
    return isLatiosInPlay && isThisInPlay;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    HANDLE_ABILITY_BLOCK(effect, ({ player, card }) => {
      const opponent = StateUtils.getOpponent(state, player);
      if (!this.hasLatiasLatiosCombo(player) && !this.hasLatiasLatiosCombo(opponent)) {
        return false;
      }
      if (card.tags.includes(CardTag.POKEMON_ex)) {
        return false;
      }
      try {
        const cardList = StateUtils.findCardList(state, card);
        if (cardList instanceof PokemonCardList) {
          return cardList.getPokemons().length > 1;
        }
      } catch {
        return false;
      }
      return false;
    }, {
      powerTypes: POKEBODY_TYPES,
      error: GameMessage.BLOCKED_BY_EFFECT,
    });

    if (AFTER_ATTACK(effect, 0, this)) {
      DRAW_CARDS(store, state, effect.player, 1);
    }

    return state;
  }

}
