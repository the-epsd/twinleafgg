import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import {StoreLike, State, GameMessage, PlayerType, SlotType, DamageMap, PutDamagePrompt, StateUtils} from '../../game';
import {Effect} from '../../game/store/effects/effect';
import {WAS_ATTACK_USED} from '../../game/store/prefabs/prefabs';
import {DealDamageEffect} from '../../game/store/effects/attack-effects';

export class Arbolivaex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Dolliv';
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = G;
  public hp: number = 310;
  public weakness = [{ type: R }];
  public retreat = [ C, C ];

  public attacks = [
    {
      name: 'Oil Machine Gun',
      cost: [G],
      damage: 0,
      text: 'Choose 1 of your opponent\'s Pokémon 6 times and do 20 damage to it. (You can choose the same Pokémon more than once.) This damage isn\'t affected by Weakness or Resistance.'
    },
    {
      name: 'Aroma Shot',
      cost: [C, C, C],
      damage: 160,
      text: 'This Pokémon recovers from all Special Conditions.'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'SV10';
  public setNumber: string = '12';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Arboliva ex';
  public fullName: string = 'Arboliva ex SV10';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Oil Machine Gun
    if (WAS_ATTACK_USED(effect, 0, this)){
      const player = effect.player;
      const opponent = effect.opponent;
    
      const maxAllowedDamage: DamageMap[] = [];
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        maxAllowedDamage.push({ target, damage: card.hp + 120 });
      });
    
      const damage = 120;
    
      return store.prompt(state, new PutDamagePrompt(
        effect.player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        damage,
        maxAllowedDamage,
        { allowCancel: false, damageMultiple: 20 }
      ), targets => {
        const results = targets || [];
        for (const result of results) {
          const target = StateUtils.getTarget(state, player, result.target);
          const putCountersEffect = new DealDamageEffect(effect, result.damage);
          putCountersEffect.target = target;
          store.reduceEffect(state, putCountersEffect);
        }
      });
    }
    
    return state;
  }
}
