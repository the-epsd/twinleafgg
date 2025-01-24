import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

// SMP Lucario-GX 100 (https://limitlesstcg.com/cards/SMP/100)
export class LucarioGX extends PokemonCard {

  public tags = [CardTag.POKEMON_GX];

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Riolu';

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 210;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Aura Strike',
      cost: [CardType.FIGHTING],
      damage: 30,
      text: 'If this Pokémon evolved from Riolu during this turn, this attack does 90 more damage.'
    },
    {
      name: 'Cyclone Kick',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS],
      damage: 130,
      text: ''
    },
    {
      name: 'Cantankerous Beatdown-GX',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 30,
      text: 'This attack does 30 damage for each damage counter on this Pokémon. (You can\'t use more than 1 GX attack in a game.)'
    }
  ];

  public set: string = 'SMP';

  public setNumber = 'SM100';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Lucario-GX';

  public fullName: string = 'Lucario-GX FLI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Aura Strike
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      if (player.active.pokemonPlayedTurn === state.turn) {
        effect.damage += 90;
      }
    }

    // Cantankerous Beatdown-GX
    if (effect instanceof AttackEffect && effect.attack === this.attacks[2]) {
      const player = effect.player;

      // Check if player has used GX attack
      if (player.usedGX == true) {
        throw new GameError(GameMessage.LABEL_GX_USED);
      }
      // set GX attack as used for game
      player.usedGX = true;

      effect.damage = player.active.damage * 3;
    }

    return state;
  }
}