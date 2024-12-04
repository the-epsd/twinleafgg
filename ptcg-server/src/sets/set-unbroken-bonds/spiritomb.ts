import { GameError, GameMessage, PlayerType, State, StoreLike } from '../../game';
import { BoardEffect, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PowerType } from '../../game/store/card/pokemon-types';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';


export class Spiritomb extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DARK;

  public hp: number = 60;

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Building Spite',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may put 1 damage counter on this Pokémon.'
  }];

  public attacks = [
    {
      name: 'Anguish Cry',
      cost: [CardType.DARK],
      damage: 10,
      damageCalculation: '+',
      text: 'This attack does 30 more damage for each damage counter on this Pokémon.'
    }
  ];

  public set: string = 'UNB';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '112';

  public name: string = 'Spiritomb';

  public fullName: string = 'Spiritomb UNB';

  public readonly BUILDING_SPITE_MARKER = 'BUILDING_SPITE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: AttackEffect): State {

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.abilityMarker.removeMarker(this.BUILDING_SPITE_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {

      const player = effect.player;
      if (player.abilityMarker.hasMarker(this.BUILDING_SPITE_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          cardList.damage += 10;
        }
      });

      player.abilityMarker.addMarker(this.BUILDING_SPITE_MARKER, this);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          cardList.addBoardEffect(BoardEffect.ABILITY_USED);
        }
      });

    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      // Get Spiritomb's damage
      const spiritombDamage = effect.player.active.damage;

      // Calculate 30 damage per counter
      const damagePerCounter = 30;
      effect.damage += (spiritombDamage * damagePerCounter / 10);

      return state;
    }

    return state;
  }
}
