import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, BoardEffect } from '../../game/store/card/card-types';
import { StoreLike, State, ChoosePokemonPrompt, PlayerType, SlotType, GameError, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { GameMessage } from '../../game/game-message';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class DarkGolbat extends PokemonCard {
  public tags = [CardTag.DARK];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Zubat';
  public cardType: CardType = G;
  public hp: number = 50;
  public weakness = [{ type: P }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Sneak Attack',
    powerType: PowerType.POKEMON_POWER,
    text: 'When you play Dark Golbat from your hand, you may choose 1 of your opponent\'s Pokémon. If you do, Dark Golbat does 10 damage to that Pokémon. Apply Weakness and Resistance.'
  }];

  public attacks = [{
    name: 'Flitter',
    cost: [G, G],
    damage: 0,
    text: 'Choose 1 of your opponent\'s Pokémon. This attack does 20 damage to that Pokémon. Don\'t apply Weakness and Resistance for this attack. (Any other effects that would happen after applying Weakness and Resistance still happen.)'
  }];

  public set: string = 'TR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '7';
  public name: string = 'Dark Golbat';
  public fullName: string = 'Dark Golbat TR';

  public readonly QUICK_SHOOTING_MARKER = 'QUICK_SHOOTING_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.QUICK_SHOOTING_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.QUICK_SHOOTING_MARKER, this)) {
      const player = effect.player;
      player.marker.removeMarker(this.QUICK_SHOOTING_MARKER, this);
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      //const opponent = StateUtils.getOpponent(state, player);

      if (player.marker.hasMarker(this.QUICK_SHOOTING_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false },

      ), selected => {
        const targets = selected || [];

        if (targets.length > 0) {
          //const damageEffect = new PutDamageEffect(effect, 10);
          //store.reduceEffect(state, damageEffect);
        }
        player.marker.addMarker(this.QUICK_SHOOTING_MARKER, this);
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) {
            cardList.addBoardEffect(BoardEffect.ABILITY_USED);
          }
        });
      });
    }
    return state;
  }

}
