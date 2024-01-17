import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, Card, ChooseEnergyPrompt, GameMessage, StateUtils } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class IceRiderCalyrexVMAX extends PokemonCard {

  public stage: Stage = Stage.VMAX;

  public evolvesFrom = 'Ice Rider Calyrex V';

  public regulationMark = 'E';

  public cardType: CardType = CardType.WATER;

  public tags = [ CardTag.POKEMON_VMAX ];

  public hp: number = 320;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Ride of the High King',
      cost: [ CardType.COLORLESS, CardType.COLORLESS ],
      damage: 10,
      text: 'This attack does 30 more damage for each of your opponent\'s Benched Pokémon.'
    },
    {
      name: 'Max Lance',
      cost: [ CardType.WATER, CardType.WATER ],
      damage: 10,
      text: 'You may discard up to 2 Energy from this Pokémon. If you do, this attack does 120 more damage for each card you discarded in this way.'
    },
  ];

  public set: string = 'CRE';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '46';

  public name: string = 'Ice Rider Calyrex VMAX';

  public fullName: string = 'Ice Rider Calyrex VMAX CRE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      
      const opponentBenched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
        
      const totalBenched = opponentBenched;
      
      effect.damage = 10 + totalBenched * 30;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
  
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);
  
      state = store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [ CardType.COLORLESS, CardType.COLORLESS],
        { allowCancel: false }
      ), energy => {
        const cards: Card[] = (energy || []).map(e => e.card);
        const discardEnergy = new DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;

        effect.damage += 120 * cards.length;
        store.reduceEffect(state, discardEnergy);
      });
    }
    return state;
  }
}