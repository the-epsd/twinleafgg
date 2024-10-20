import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Nidoqueen extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 90;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public evolvesFrom = 'Nidorina';

  public attacks = [{
    name: 'Boyfriends',
    cost: [CardType.GRASS, CardType.COLORLESS],
    damage: 20,
    text: 'Does 20 damage plus 20 more damage for each Nidoking you have in play.'
  },
  {
    name: 'Mega Punch',
    cost: [CardType.GRASS, CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 50,
    text: ''
  }];

  public set: string = 'JU';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '7';

  public name: string = 'Nidoqueen';

  public fullName: string = 'Nidoqueen JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      let benchPokemon: PokemonCard[] = [];
      const nidokingInPlay: PokemonCard[] = [];


      if (player.bench.some(b => b.cards.length > 0)) {
        try {
          benchPokemon = player.bench.map(b => b.getPokemonCard()).filter(card => card !== undefined) as PokemonCard[];
          nidokingInPlay.push(...benchPokemon.filter(card => card.name === 'Nidoking'));
        } catch {
          // no Nidoking on bench
        }
      }

      const numberOfNidokings = nidokingInPlay.length;
      effect.damage += numberOfNidokings * 20;
    }

    return state;
  }
}