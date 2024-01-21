import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType, 
  PokemonCardList, EnergyCard, ChoosePokemonPrompt, GameMessage, SlotType } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import {HealTargetEffect, PutCountersEffect} from '../../game/store/effects/attack-effects';


export class Cresselia extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 120;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Moonglow Reverse',
      cost: [ CardType.PSYCHIC ],
      damage: 0,
      text: 'Move 2 damage counters from each of your Pokémon to 1 of your opponent\'s Pokémon.'
    },
    {
      name: 'Lunar Blast',
      cost: [ CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS ],
      damage: 110,
      text: ''
    }
  ];

  public set: string = 'LOR';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '74';

  public name: string = 'Cresselia';

  public fullName: string = 'Cresselia LOR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const targets: PokemonCardList[] = [];

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        const hasEnergy = cardList.cards.some(c => c instanceof EnergyCard);
        if (hasEnergy && cardList.damage > 0) {
          targets.push(cardList);
        }
      });

      let totalHealed = 0;

      targets.forEach(target => {
        totalHealed++;
        const healEffect = new HealTargetEffect(effect, 20);
        healEffect.target = target;
        store.reduceEffect(state, healEffect);
      });

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [ SlotType.BENCH, SlotType.ACTIVE ],
        { min: 1, max: 1, allowCancel: false },
      ), selected => {
        const targets = selected || [];
        targets.forEach(target => {
          target.damage = totalHealed * 20;
          const putCountersEffect = new PutCountersEffect(effect, target.damage);
          putCountersEffect.target = target;
          store.reduceEffect(state, putCountersEffect);
        });
        return state;
      });
    }
    return state;
  }
}