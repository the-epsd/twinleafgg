import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, PlayerType, SlotType, PowerType, GameError } from '../../game';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { PokemonCardList } from '../../game';
import { AbstractAttackEffect } from '../../game/store/effects/attack-effects';
import { StateUtils } from '../../game';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';

// UPR Dawn Wings Necrozma-GX 63 (https://limitlesstcg.com/cards/UPR/63)
export class DawnWingsNecrozmaGX extends PokemonCard {

  public tags = [CardTag.POKEMON_GX, CardTag.ULTRA_BEAST];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 190;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -20 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Invasion',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), if this Pokémon is on your Bench, you may switch it with your Active Pokémon.'
  }];

  public attacks = [
    {
      name: 'Dark Flash',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.PSYCHIC],
      damage: 120,
      text: 'This attack\'s damage isn\'t affected by Resistance.'
    },
    {
      name: 'Moon\'s Eclipse-GX',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.PSYCHIC],
      damage: 180,
      text: 'You can use this attack only if you have more Prize cards remaining than your opponent. Prevent all effects of attacks, including damage, done to this Pokémon during your opponent\'s next turn. (You can\'t use more than 1 GX attack in a game.)'
    }
  ];

  public readonly INVASION_MARKER = 'INVASION_MARKER';
  public readonly ECLIPSE_MARKER = 'ECLIPSE_MARKER';
  public readonly CLEAR_ECLIPSE_MARKER = 'CLEAR_ECLIPSE_MARKER';


  public set: string = 'UPR';

  public setNumber = '63';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Dawn Wings Necrozma-GX';

  public fullName: string = 'Dawn Wings Necrozma-GX UPR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.INVASION_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      let bench: PokemonCardList | undefined;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (card === this && target.slot === SlotType.BENCH) {
          bench = cardList;
        }
      });

      if (bench === undefined) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.marker.hasMarker(this.INVASION_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      player.marker.addMarker(this.INVASION_MARKER, this);
      player.switchPokemon(bench);
      return state;
    }

    // Dark Flash
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.ignoreResistance = true;
      return state;
    }

    // Moon's Eclipse-GX
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.getPrizeLeft() <= opponent.getPrizeLeft()) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      // Check if player has used GX attack
      if (player.usedGX == true) {
        throw new GameError(GameMessage.LABEL_GX_USED);
      }
      // set GX attack as used for game
      player.usedGX = true;

      player.active.marker.addMarker(this.ECLIPSE_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_ECLIPSE_MARKER, this);
    }

    if (effect instanceof AbstractAttackEffect
      && effect.target.marker.hasMarker(this.ECLIPSE_MARKER)) {
      effect.preventDefault = true;
      return state;
    }


    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.INVASION_MARKER, this);

      if (effect.player.marker.hasMarker(this.CLEAR_ECLIPSE_MARKER, this)) {

        effect.player.marker.removeMarker(this.CLEAR_ECLIPSE_MARKER, this);

        const opponent = StateUtils.getOpponent(state, effect.player);
        opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
          cardList.marker.removeMarker(this.ECLIPSE_MARKER, this);
        });
      }
    }

    return state;
  }
}