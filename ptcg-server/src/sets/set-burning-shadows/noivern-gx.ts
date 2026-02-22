import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, EnergyType, Stage } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameMessage, GameError, PlayerType, PokemonCardList } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AttachEnergyEffect, PlayItemEffect } from '../../game/store/effects/play-card-effects';
import { DAMAGE_OPPONENT_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class NoivernGX extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Noibat';
  public tags = [CardTag.POKEMON_GX];
  public cardType: CardType = N;
  public hp: number = 200;
  public weakness = [{ type: Y }];
  public retreat = [];

  public attacks = [
    {
      name: 'Distort',
      cost: [D, C],
      damage: 50,
      text: 'Your opponent can\'t play any Item cards from their hand during their next turn.',
    },
    {
      name: 'Sonic Volume',
      cost: [P, D, C],
      damage: 120,
      text: 'Your opponent can\'t play any Special Energy cards from their hand during their next turn.',
    },
    {
      name: 'Boomburst-GX',
      cost: [P, D, C],
      damage: 0,
      gxAttack: true,
      text: 'This attack does 50 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) (You can\'t use more than 1 GX attack in a game.)'
    }

  ];

  public set: string = 'BUS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '99';
  public name: string = 'Noivern-GX';
  public fullName: string = 'Noivern-GX BUS';

  public readonly OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER = 'OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER';
  public readonly OPPONENT_CANNOT_PLAY_SPECIAL_ENERGY_MARKER = 'OPPONENT_CANNOT_PLAY_SPECIAL_ENERGY_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Distort
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.marker.addMarker(this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, this);
    }

    if (effect instanceof PlayItemEffect) {
      const player = effect.player;
      if (player.marker.hasMarker(this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, this)) {
      effect.player.marker.removeMarker(this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, this);
    }

    // Sonic Volume
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.marker.addMarker(this.OPPONENT_CANNOT_PLAY_SPECIAL_ENERGY_MARKER, this);
    }

    if (effect instanceof AttachEnergyEffect && effect.energyCard.energyType === EnergyType.SPECIAL) {
      const player = effect.player;
      if (player.marker.hasMarker(this.OPPONENT_CANNOT_PLAY_SPECIAL_ENERGY_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.OPPONENT_CANNOT_PLAY_SPECIAL_ENERGY_MARKER, this)) {
      effect.player.marker.removeMarker(this.OPPONENT_CANNOT_PLAY_SPECIAL_ENERGY_MARKER, this);
    }

    // Boomburst-GX
    if (WAS_ATTACK_USED(effect, 2, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

      if (player.usedGX) {
        throw new GameError(GameMessage.LABEL_GX_USED);
      }
      player.usedGX = true;

      const targets: PokemonCardList[] = [];
      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        targets.push(cardList);
      });
      DAMAGE_OPPONENT_POKEMON(store, state, effect, 50, targets);
    }

    return state;
  }
}