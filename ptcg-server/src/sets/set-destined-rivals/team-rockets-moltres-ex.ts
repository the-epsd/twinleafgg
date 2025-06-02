import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, PlayerType, StateUtils, ChooseCardsPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class TeamRocketsMoltresex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex, CardTag.TEAM_ROCKET];
  public cardType: CardType = R;
  public hp: number = 220;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Flame Screen',
      cost: [R, C, C],
      damage: 110,
      text: 'During your opponent\'s next turn, this Pokémon takes 50 less damage from attacks (after applying Weakness and Resistance).'
    },
    {
      name: 'Evil Burn',
      cost: [R, C, C, C],
      damage: 0,
      text: 'Discard a Team Rocket\'s Energy from this Pokémon. If you do, discard your opponent\'s Active Pokémon and all attached cards.'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'DRI';
  public setNumber: string = '31';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Team Rocket\'s Moltres ex';
  public fullName: string = 'Team Rocket\'s Moltres ex DRI';
  public readonly FLAME_SCREEN_MARKER = 'FLAME_SCREEN_MARKER';
  public readonly CLEAR_FLAME_SCREEN_MARKER = 'CLEAR_FLAME_SCREEN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Flame Screen
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

      player.active.marker.addMarker(this.FLAME_SCREEN_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_FLAME_SCREEN_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_FLAME_SCREEN_MARKER, this)) {
      const opponent = effect.player;
      const player = StateUtils.getOpponent(state, opponent);

      opponent.marker.removeMarker(this.CLEAR_FLAME_SCREEN_MARKER, this);
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, card => {
        if (card.getPokemonCard() === this) {
          card.marker.removeMarker(this.FLAME_SCREEN_MARKER, this);
        }
      });
    }

    // Evil Burn
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

      if (!player.active.cards.some(c => c.superType === SuperType.ENERGY && c.name === 'Team Rocket Energy')) {
        return state;
      }

      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_ENERGY_TO_DISCARD,
        player.active,
        { superType: SuperType.ENERGY, energyType: EnergyType.SPECIAL, name: 'Team Rocket Energy' },
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const cards = selected || [];

        player.active.moveCardsTo(cards, player.discard);
        opponent.active.clearEffects();
        MOVE_CARDS(store, state, opponent.active, opponent.discard);
      });
    }

    return state;
  }
}
