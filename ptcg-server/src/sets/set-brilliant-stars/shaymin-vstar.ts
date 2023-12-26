import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PowerType, GameError, GameMessage, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, HealEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class ShayminVSTAR extends PokemonCard {

  public regulationMark = 'F';

  public tags = [ CardTag.POKEMON_V ];

  public stage: Stage = Stage.VSTAR;

  public evolvesFrom = 'Shaymin V';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 250;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Star Bloom',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'During your turn, you may heal 120 damage from each of your Benched [G] Pokémon. (You can\'t use more than 1 VSTAR Power in a game.)'

  }];

  public attacks = [
    {
      name: 'Revenge Blast',
      cost: [ CardType.GRASS, CardType.COLORLESS ],
      damage: 120,
      text: 'This attack does 40 more damage for each Prize card your opponent has taken.'
    }
  ];

  public set: string = 'BRS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '14';

  public name: string = 'Shaymin VSTAR';

  public fullName: string = 'Shaymin VSTAR BRS';

  public readonly VSTAR_MARKER = 'VSTAR_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.VSTAR_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {

      const player = effect.player;
      //Already used this turn
      if (player.marker.hasMarker(this.VSTAR_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      // Heal each Pokemon by 10 damage
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        const pokemonCard = cardList.getPokemonCard();
        if (pokemonCard && pokemonCard.cardType === CardType.GRASS) {
          const healEffect = new HealEffect(player, cardList, 120);
          state = store.reduceEffect(state, healEffect);
          player.marker.addMarker(this.VSTAR_MARKER, this);
        }
      });

    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const prizesTaken = 6 - opponent.getPrizeLeft();

      const damagePerPrize = 40;

      effect.damage = this.attacks[0].damage + (prizesTaken * damagePerPrize);
    }

    return state;
  }


}