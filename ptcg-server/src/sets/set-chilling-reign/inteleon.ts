import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, BoardEffect } from '../../game/store/card/card-types';
import { StoreLike, State, ChoosePokemonPrompt, PlayerType, SlotType, GameError, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EffectOfAbilityEffect, PowerEffect } from '../../game/store/effects/game-effects';
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

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

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
          const damageEffect = new EffectOfAbilityEffect(player, this.powers[0], this, targets[0]);
          store.reduceEffect(state, damageEffect);
          if (damageEffect.target) {
            damageEffect.target.damage += 20;
          }
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
