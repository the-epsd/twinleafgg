import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, BoardEffect } from '../../game/store/card/card-types';
import { StoreLike, State, ChoosePokemonPrompt, PlayerType, SlotType, StateUtils, GameError, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { GameMessage } from '../../game/game-message';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class Inteleon extends PokemonCard {

  public tags = [CardTag.RAPID_STRIKE];

  public regulationMark = 'E';

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Drizzile';

  public cardType: CardType = CardType.WATER;

  public hp: number = 150;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Quick Shooting',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may put 2 damage counters on 1 of your opponent\'s Pokémon.'
  }];

  public attacks = [
    {
      name: 'Waterfall',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 70,
      text: ''
    }
  ];

  public set: string = 'CRE';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '43';

  public name: string = 'Inteleon';

  public fullName: string = 'Inteleon CRE';

  public readonly DOUBLE_GUNNER_MARKER = 'DOUBLE_GUNNER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.DOUBLE_GUNNER_MARKER, this);
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.DOUBLE_GUNNER_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.marker.hasMarker(this.DOUBLE_GUNNER_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false },
      ), selected => {
        const targets = selected || [];
        targets.forEach(target => {
          target.damage += 20;
          player.marker.addMarker(this.DOUBLE_GUNNER_MARKER, this);
        });

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
