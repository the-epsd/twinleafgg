import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { GameError, GameMessage, PokemonCardList, PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ABILITY_USED, ADD_MARKER, BLOCK_IF_HAS_SPECIAL_CONDITION, COIN_FLIP_PROMPT, HAS_MARKER, MOVE_CARDS, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class ToxicroakG extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_SP];
  public cardType: CardType = F;
  public hp: number = 90;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public powers = [{
    name: 'Leap Away',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), if Toxicroak G is your Active Pokémon, you may flip a coin. If heads, return Toxicroak G and all cards attached to it to your hand. This power can\'t be used if Toxicroak G is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Poison Revenge',
    cost: [P, C],
    damage: 20,
    damageCalculation: '+',
    text: 'If any of your Pokémon were Knocked Out by damage from an opponent\'s attack during his or her last turn, this attack does 20 damage plus 40 more damage and the Defending Pokémon is now Poisoned.'
  }];

  public set: string = 'DPP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '41';
  public name: string = 'Toxicroak G';
  public fullName: string = 'Toxicroak G DPP';

  public LEAP_AWAY_MARKER = 'LEAP_AWAY_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.LEAP_AWAY_MARKER, this);
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);

      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      if (player.active.getPokemonCard() !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (HAS_MARKER(this.LEAP_AWAY_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      ADD_MARKER(this.LEAP_AWAY_MARKER, player, this);
      ABILITY_USED(player, this);
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          const pokemonCardList = cardList as PokemonCardList;
          const tentacoolCard = pokemonCardList.getPokemonCard();
          if (!tentacoolCard) {
            return state;
          }

          const pokemons = pokemonCardList.getPokemons();
          const otherCards = cardList.cards.filter(card =>
            !(card instanceof PokemonCard) &&
            !pokemons.includes(card as PokemonCard) &&
            (!pokemonCardList.tools || !pokemonCardList.tools.includes(card))
          );
          const tools = [...pokemonCardList.tools];

          // Move tools to discard first
          if (tools.length > 0) {
            for (const tool of tools) {
              pokemonCardList.moveCardTo(tool, player.discard);
            }
          }

          // Move other cards to discard
          if (otherCards.length > 0) {
            MOVE_CARDS(store, state, cardList, player.discard, { cards: otherCards });
          }

          // Move Pokémon to hand
          if (pokemons.length > 0) {
            MOVE_CARDS(store, state, cardList, player.hand, { cards: pokemons });
          }
        }
      });
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.LEAP_AWAY_MARKER, this);

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.marker.hasMarker(MarkerConstants.REVENGE_MARKER)) {
        effect.damage += 40;
      }

      return state;
    }

    return state;
  }
}