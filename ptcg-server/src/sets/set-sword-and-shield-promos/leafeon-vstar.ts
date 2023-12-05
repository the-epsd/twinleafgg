import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameError, GameMessage, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class LeafeonVSTAR extends PokemonCard {

  public stage = Stage.STAGE_1;

  public evolvesFrom = 'Leafeon V';

  public cardType = CardType.GRASS;

  public hp = 260;

  public tags = [CardTag.POKEMON_VSTAR];

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Ivy Star',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'During your turn, you may switch 1 of your opponent\'s Benched Pokémon with their Active Pokémon. (You can\'t use more than 1 VSTAR Power in a game.)'
  }];

  public attacks = [{
    name: 'Leaf Guard',
    cost: [CardType.GRASS, CardType.GRASS, CardType.COLORLESS],
    damage: 180,
    text: 'During your opponent\'s next turn, this Pokémon takes 30 less damage from attacks (after applying Weakness and Resistance).'
  }];

  public regulationMark = 'G';

  public set = 'SWSH';

  public set2: string = 'swshpromos';

  public setNumber: string = '195';

  public name = 'Leafeon VSTAR';

  public fullName = 'Leafeon VSTAR SWSH';

  LEAF_GUARD_MARKER = 'LEAF_GUARD_MARKER';

  CLEAR_LEAF_GUARD_MARKER = 'CLEAR_LEAF_GUARD_MARKER';

  public readonly VSTAR_MARKER = 'VSTAR_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.VSTAR_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some(b => b.cards.length > 0);

      if (player.marker.hasMarker(this.VSTAR_MARKER)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (!hasBench) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        PlayerType.TOP_PLAYER,
        [ SlotType.BENCH ],
        { allowCancel: false }
      ), result => {
        const cardList = result[0];
        opponent.switchPokemon(cardList);
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      player.active.marker.addMarker(this.LEAF_GUARD_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_LEAF_GUARD_MARKER, this);

      if (effect instanceof PutDamageEffect
                    && effect.target.marker.hasMarker(this.LEAF_GUARD_MARKER)) {
        effect.damage -= 30;
        return state;
      }
      if (effect instanceof EndTurnEffect
                    && effect.player.marker.hasMarker(this.CLEAR_LEAF_GUARD_MARKER, this)) {
        effect.player.marker.removeMarker(this.CLEAR_LEAF_GUARD_MARKER, this);
        const opponent = StateUtils.getOpponent(state, effect.player);
        opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
          cardList.marker.removeMarker(this.LEAF_GUARD_MARKER, this);
        });
      }
      return state;
    }
    return state;
  }
}