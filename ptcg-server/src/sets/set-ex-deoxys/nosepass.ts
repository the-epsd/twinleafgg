import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, GameError, GameMessage, StateUtils, PlayerType, ChoosePokemonPrompt, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { ABILITY_USED, ADD_MARKER, COIN_FLIP_PROMPT, HAS_MARKER, REMOVE_MARKER, REMOVE_MARKER_AT_END_OF_TURN, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Nosepass extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 60;
  public weakness = [{ type: W }];
  public retreat = [C];

  public powers = [{
    name: 'Magnetic Reversal',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), if Nosepass is your Active Pokémon, you may flip a coin. If heads, switch 1 of your opponent\'s Benched Pokémon with 1 of the Defending Pokémon. Your opponent chooses the Defending Pokémon to switch. This power can\'t be used if Nosepass is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Sharpen',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public set: string = 'DX';
  public setNumber: string = '42';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Nosepass';
  public fullName: string = 'Nosepass DX';

  public readonly MAGNETIC_REVERSAL_MARKER = 'MAGNETIC_REVERSAL_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      REMOVE_MARKER(this.MAGNETIC_REVERSAL_MARKER, player, this);
      return state;
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.MAGNETIC_REVERSAL_MARKER, this);

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (HAS_MARKER(this.MAGNETIC_REVERSAL_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (player.active.cards[0] !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.active.specialConditions.length > 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const hasBench = opponent.bench.some(b => b.cards.length > 0);
    
      if (!hasBench) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      COIN_FLIP_PROMPT(store, state, effect.player, (result) => {
        if (result) {
          return store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_POKEMON_TO_SWITCH,
            PlayerType.TOP_PLAYER,
            [SlotType.BENCH],
            { allowCancel: false }
          ), result => {
            const cardList = result[0];
        
            if (cardList) {
              opponent.switchPokemon(cardList);
            }
          }
          );
        }
      });
      ADD_MARKER(this.MAGNETIC_REVERSAL_MARKER, player, this);
      ABILITY_USED(player, this);
    }
    return state;
  }
}