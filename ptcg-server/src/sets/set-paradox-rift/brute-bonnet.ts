import { GameError, PlayerType, PowerType, State, StateUtils, StoreLike } from '../../game';
import { GameMessage } from '../../game/game-message';
import { BoardEffect, CardTag, CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { AddSpecialConditionsPowerEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

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

    if (effect instanceof EndTurnEffect && effect.player.attackMarker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
      const player = effect.player;
      player.attackMarker.removeMarker(this.ATTACK_USED_MARKER, this);
      player.attackMarker.removeMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('marker cleared');
    }

    if (effect instanceof EndTurnEffect && effect.player.attackMarker.hasMarker(this.ATTACK_USED_MARKER, this)) {
      const player = effect.player;
      player.attackMarker.addMarker(this.ATTACK_USED_2_MARKER, this);
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

      const specialConditionEffect = new AddSpecialConditionsPowerEffect(
        player,
        this.powers[0], // the Power object
        this,  // the PokemonCard
        player.active, // target PokemonCardList
        [SpecialCondition.POISONED]
      );
      store.reduceEffect(state, specialConditionEffect);

      const opponentSpecialConditionEffect = new AddSpecialConditionsPowerEffect(
        opponent,
        this.powers[0],
        this,
        opponent.active,
        [SpecialCondition.POISONED]
      );
      store.reduceEffect(state, opponentSpecialConditionEffect);


      player.marker.addMarker(this.TOXIC_POWDER_MARKER, this);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          cardList.addBoardEffect(BoardEffect.ABILITY_USED);
        }
      });
    }


    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      // Check marker
      if (effect.player.attackMarker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        console.log('attack blocked');
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      effect.player.attackMarker.addMarker(this.ATTACK_USED_MARKER, this);
      console.log('marker added');
    }
    return state;

  }
}
