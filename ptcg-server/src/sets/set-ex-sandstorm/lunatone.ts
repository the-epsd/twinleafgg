import { GameError, GameMessage, PlayerType, PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { ABILITY_USED, ADD_MARKER, BLOCK_IF_HAS_SPECIAL_CONDITION, DRAW_CARDS, HAS_MARKER, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Lunatone extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness = [{ type: P }];
  public retreat = [C];

  public powers = [{
    name: 'Lunar Eclipse',
    powerType: PowerType.POKEPOWER,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), if Solrock is in play, you may use this power. Until the end of your turn, Lunatone\'s type is [D]. This power can\'t be used if Lunatone is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Cosmic Draw',
    cost: [C],
    damage: 0,
    text: 'If your opponent has any Evolved Pokémon in play, draw 3 cards.'
  },
  {
    name: 'Lunar Blast',
    cost: [P, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'SS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '8';
  public name: string = 'Lanturn';
  public fullName: string = 'Lunatone SS';

  public readonly LUNAR_ECLIPSE_MARKER = 'LUNAR_ECLIPSE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.LUNAR_ECLIPSE_MARKER, this);

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
      if (HAS_MARKER(this.LUNAR_ECLIPSE_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
      let isSolrockInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.name === 'Solrock') {
          isSolrockInPlay = true;
        }
      });
      if (!isSolrockInPlay) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      ABILITY_USED(player, this);
      ADD_MARKER(this.LUNAR_ECLIPSE_MARKER, player, this);
    }

    if (effect instanceof CheckPokemonTypeEffect && effect.target.getPokemonCard() === this) {
      const player = StateUtils.findOwner(state, effect.target);

      if (HAS_MARKER(this.LUNAR_ECLIPSE_MARKER, player, this)) {
        effect.cardTypes = [CardType.DARK];
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      let hasEvolvedPokemonInPlay = false;
      effect.opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (cardList.isEvolved()) {
          hasEvolvedPokemonInPlay = true;
        }
      });
      if (hasEvolvedPokemonInPlay) {
        DRAW_CARDS(effect.player, 3);
      }
    }

    return state;
  }
}