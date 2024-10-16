import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import {
  StoreLike, State,
  PlayerType,
  StateUtils
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Electrode extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolevesFrom = 'Voltorb';

  public cardType: CardType = L;

  public hp: number = 80;

  public weakness = [{ type: F }];

  public retreat = [C];

  public attacks = [
    {
      name: 'Tackle',
      cost: [C, C],
      damage: 20,
      text: ''
    },
    {
      name: 'Chain Lightning',
      cost: [L, L, L],
      damage: 20,
      text: 'If the Defending Pokémon isn\'t Colorless, this attack does 10 damage to each Benched Pokémon of the same type as the Defending Pokémon (including your own).'
    },
  ];

  public set: string = 'FO';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '2';

  public name: string = 'Electrode';

  public fullName: string = 'Electrode FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const defendingPokemon = opponent.active;

      if (defendingPokemon.cards.length > 0) {
        const defendingCard = defendingPokemon.cards[0] as PokemonCard;
        const defendingType = defendingCard.cardType;

        if (defendingType !== CardType.COLORLESS) {
          // Apply damage to all Pokémon of the same type as the defending Pokémon
          [player, opponent].forEach(p => {
            p.forEachPokemon(PlayerType.TOP_PLAYER | PlayerType.BOTTOM_PLAYER, (cardList) => {
              if (cardList !== defendingPokemon && cardList.cards.length > 0) {
                const card = cardList.cards[0] as PokemonCard;
                if (card.cardType === defendingType) {
                  const damageEffect = new PutDamageEffect(effect, 10);
                  damageEffect.target = cardList;
                  state = store.reduceEffect(state, damageEffect);
                }
              }
            });
          });
        }
      }
    }

    return state;
  }

}