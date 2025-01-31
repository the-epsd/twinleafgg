import { GameError, PlayerType, PowerType, State, StateUtils, StoreLike } from '../../game';
import { GameMessage } from '../../game/game-message';
import { BoardEffect, CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { ADD_POISON_TO_PLAYER_ACTIVE } from '../../game/store/prefabs/prefabs';

export class BruteBonnet extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [CardTag.ANCIENT];

  public cardType: CardType = CardType.DARK;

  public hp: number = 120;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [
    {
      name: 'Toxic Powder',
      useWhenInPlay: true,
      powerType: PowerType.ABILITY,
      text: 'Once during your turn, if this Pokémon has an Ancient Booster Energy Capsule attached, you may make both Active Pokémon Poisoned.'
    }
  ];

  public attacks = [
    {
      name: 'Rampaging Hammer',
      cost: [CardType.DARK, CardType.DARK, CardType.COLORLESS],
      damage: 120,
      text: 'During your next turn, this Pokémon can\'t attack.'
    }
  ];

  public set: string = 'PAR';

  public regulationMark = 'G';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '123';

  public name: string = 'Brute Bonnet';

  public fullName: string = 'Brute Bonnet PAR';

  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public readonly TOXIC_POWDER_MARKER = 'TOXIC_POWDER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.TOXIC_POWDER_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
      const player = effect.player;
      player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
      player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('marker cleared');
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
      const player = effect.player;
      player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('second marker added');
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.TOXIC_POWDER_MARKER, this);
      console.log('toxic powder marker cleared');
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let isBruteBonnetWithAncientBooster = false;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this && cardList.tool && cardList.tool.name === 'Ancient Booster Energy Capsule') {
          isBruteBonnetWithAncientBooster = true;
        }
      });

      if (!isBruteBonnetWithAncientBooster) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.marker.hasMarker(this.TOXIC_POWDER_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      ADD_POISON_TO_PLAYER_ACTIVE(store, state, player, this);
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, opponent, this);

      player.marker.addMarker(this.TOXIC_POWDER_MARKER, this);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          cardList.addBoardEffect(BoardEffect.ABILITY_USED);
        }
      });
    }


    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      // Check marker
      if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        console.log('attack blocked');
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
      console.log('marker added');
    }
    return state;

  }
}
