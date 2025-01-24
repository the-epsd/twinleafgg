import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, ChoosePokemonPrompt, GameMessage, SlotType } from '../../game';
import { ApplyWeaknessEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { PlayerType } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class HitmonleeMEW extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 120;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    { 
      name: 'Twister Kick', 
      cost: [CardType.FIGHTING], 
      damage: 0,
      text: 'This attack does 10 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) Switch this Pokémon with 1 of your Benched Pokémon.' },
    { 
      name: 'Low Kick', 
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.FIGHTING], 
      damage: 100, 
      text: '' }
  ];

  public set: string = 'MEW';

  public setNumber = '106';

  public cardImage = 'assets/cardback.png';

  public regulationMark: string = 'H';

  public name: string = 'Hitmonlee';

  public fullName: string = 'Hitmonlee MEW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Twister Kick
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]){
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
  
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        let kickDamage = 10;

        if (cardList === opponent.active){
          const applyWeakness = new ApplyWeaknessEffect(effect, kickDamage);
          store.reduceEffect(state, applyWeakness);
          kickDamage = applyWeakness.damage;
        }

        const damageEffect = new PutDamageEffect(effect, kickDamage);
        damageEffect.target = cardList;
        store.reduceEffect(state, damageEffect);
      });

      const hasBenched = player.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        PlayerType.BOTTOM_PLAYER,
        [ SlotType.BENCH ],
        { allowCancel: false }
      ), result => {
        const cardList = result[0];
        player.switchPokemon(cardList);
      });
    }

    return state;
  }
}