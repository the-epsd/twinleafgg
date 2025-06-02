import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { GameError, GameMessage, PokemonCard, PowerType } from '../../game';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { ABILITY_USED, ADD_MARKER, BLOCK_IF_HAS_SPECIAL_CONDITION, HAS_MARKER, REMOVE_MARKER, REMOVE_MARKER_AT_END_OF_TURN, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Nidoqueen extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Nidorina';
  public tags = [CardTag.DELTA_SPECIES];
  public hp = 100;
  public cardType: CardType = M;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public powers = [{
    name: 'Invitation',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may search your deck for a Basic Pokémon or Evolution card, show it to your opponent, and put it into your hand. Shuffle your deck afterward. This power can\'t be used if Nidoqueen is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Vengence',
    cost: [C, C, C],
    damage: 30,
    damageCalculation: '+',
    text: 'Does 30 damage plus 10 more damage for each Basic Pokémon and each Evolution card in your discard pile. You can\'t add more than 60 damage in this way.'
  }];

  public set: string = 'DF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '7';
  public name: string = 'Nidoqueen';
  public fullName: string = 'Nidoqueen DF';

  public readonly INVITATION_MARKER = 'INVITATION_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      REMOVE_MARKER(this.INVITATION_MARKER, effect.player, this);
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (HAS_MARKER(this.INVITATION_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(store, state, player, {}, { min: 0, max: 1, allowCancel: false });

      ADD_MARKER(this.INVITATION_MARKER, player, this);
      ABILITY_USED(player, this);
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.INVITATION_MARKER, this);

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      let pokemonCount = 0;
      player.discard.cards.forEach(c => {
        if (c instanceof PokemonCard)
          pokemonCount += 1;
      });

      pokemonCount = Math.min(pokemonCount, 6);
      effect.damage += pokemonCount * 10;
    }

    return state;
  }

}