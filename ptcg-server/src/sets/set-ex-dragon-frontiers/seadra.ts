import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { StoreLike, State, StateUtils } from '../../game';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { ADD_MARKER, HAS_MARKER, REMOVE_MARKER, SIMULATE_COIN_FLIP, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Seadra extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Horsea';
  public cardType: CardType = F;
  public tags = [CardTag.DELTA_SPECIES];
  public hp: number = 70;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Smokescreen',
    cost: [C, C],
    damage: 20,
    text: 'If the Defending Pokémon tries to attack during your opponent\'s next turn, your opponent flips a coin.If tails, that attack does nothing.'
  },
  {
    name: 'Razor Wing',
    cost: [F, C, C],
    damage: 40,
    text: ''
  }];

  public set: string = 'DF';
  public name: string = 'Seadra';
  public fullName: string = 'Seadra DF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '22';

  public readonly DEFENDING_POKEMON_CANNOT_ATTACK_MARKER = 'DEFENDING_POKEMON_CANNOT_ATTACK_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    //Attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      ADD_MARKER(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, opponent.active, this);
    }

    if (effect instanceof AttackEffect && HAS_MARKER(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, effect.player.active, this)) {
      const player = effect.player;

      try {
        const coinFlip = new CoinFlipEffect(player);
        store.reduceEffect(state, coinFlip);
      } catch {
        return state;
      }

      const coinFlipResult = SIMULATE_COIN_FLIP(store, state, player);

      if (!coinFlipResult) {
        effect.preventDefault = true;
      }
    }

    //Marker remover
    if (effect instanceof EndTurnEffect) {
      if (HAS_MARKER(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, effect.player.active, this)) {
        REMOVE_MARKER(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, effect.player.active, this);
      }
    }

    return state;
  }

}