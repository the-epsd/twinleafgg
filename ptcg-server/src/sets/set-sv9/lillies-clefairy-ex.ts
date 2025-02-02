import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, StateUtils, PlayerType } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { CheckPokemonStatsEffect } from '../../game/store/effects/check-effects';

export class LilliesClefairyex extends PokemonCard {

  public tags = [CardTag.POKEMON_ex, CardTag.LILLIES];

  public regulationMark = 'I';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 190;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Fairy Zone',
    powerType: PowerType.ABILITY,
    text: 'The weakness of each of your opponent\'s D Pokémon in play is now P. (Apply Weakness as x2.)',
  }];

  public attacks = [
    {
      name: 'Full Moon Rondo',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: 20,
      damageCalculation: '+',
      text: 'This attack does 20 more damage for each Benched ' +
        'Pokémon (both yours and your opponent\'s).'
    }
  ];

  public set: string = 'SV9';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '33';

  public name: string = 'Lillie\'s Clefairy ex';

  public fullName: string = 'Lillie\'s Clefairy ex SV9';

  public readonly DRAGON_VULNERABILITY_MARKER = 'DRAGON_VULNERABILITY_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckPokemonStatsEffect) {
      // const cardList = StateUtils.findCardList(state, this);
      // const owner = StateUtils.findOwner(state, cardList);
      const player = state.players[state.activePlayer];
      const opponent = StateUtils.getOpponent(state, player);
      const pokemonCard = effect.target;

      let isClefairyexInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isClefairyexInPlay = true;
        }
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card === this) {
          isClefairyexInPlay = true;
        }
      });

      if (!isClefairyexInPlay) {
        return state;
      }

      if (isClefairyexInPlay) {
        player.marker.addMarker(this.DRAGON_VULNERABILITY_MARKER, this);
        console.log('marker added');
      }

      if (pokemonCard.getPokemonCard()?.cardType === CardType.DRAGON && player.marker.hasMarker(this.DRAGON_VULNERABILITY_MARKER, this)) {
        effect.weakness.push({ type: CardType.PSYCHIC });
      }
    }


    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      //Get number of benched pokemon
      const playerBenched = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
      const opponentBenched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);

      const totalBenched = playerBenched + opponentBenched;

      effect.damage = 20 + totalBenched * 20;
    }
    return state;
  }
}