import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, StateUtils, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, GameError } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class HisuianSamurottVSTAR extends PokemonCard {

  public stage: Stage = Stage.VSTAR;

  public cardType: CardType = CardType.DARK;

  public hp: number = 270;

  public evolvesFrom = 'Hisuian Samurott V';

  public tags = [CardTag.POKEMON_VSTAR];

  public powers = [
    {
      name: 'Moon Cleave Star',
      useWhenInPlay: true,
      powerType: PowerType.ABILITY,
      text: 'During your turn, you may put 4 damage counters on 1 of your opponent\'s Pokémon. (You can\'t use more than 1 VSTAR Power in a game.)'
    }
  ];

  public attacks = [
    {
      name: 'Merciless Blade',
      cost: [CardType.DARK, CardType.DARK],
      damage: 110,
      text: 'If your opponent\'s Active Pokémon already has any damage counters on it, this attack does 110 more damage.'
    }
  ];

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '102';

  public name: string = 'Hisuian Samurott VSTAR';

  public fullName: string = 'Hisuian Samurott VSTAR ASR';

  public readonly VSTAR_MARKER = 'VSTAR_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.VSTAR_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      if (player.marker.hasMarker(this.VSTAR_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [ SlotType.BENCH ],
        { min: 1, max: 1, allowCancel: true },
      ), selected => {
        const targets = selected || [];
        targets.forEach(target => {
          target.damage += 40;
          player.marker.addMarker(this.VSTAR_MARKER, this);
        });

        if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
          const player = effect.player;
          const opponent = StateUtils.getOpponent(state, player);
          if (opponent.active.damage > 0) {
            effect.damage += 110;
          }
        }
      }
      );
    }
    return state;
  }
}