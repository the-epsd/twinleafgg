import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType, GameMessage, SlotType, ChoosePokemonPrompt, PowerType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';

export class Farigirafex extends PokemonCard {
  public tags = [ CardTag.POKEMON_ex, CardTag.POKEMON_TERA ];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Girafarig';
  public cardType: CardType = CardType.DARK;
  public hp: number = 260;
  public weakness = [{ type: CardType.GRASS }];
  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Armor Tail',
    powerType: PowerType.ABILITY,
    text: 'Prevent all damage done to this Pokémon by attacks from your opponent\'s Basic Pokémon ex.'
  }];

  public attacks = [
    { 
      name: 'Dirty Beam', 
      cost: [ CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS ], 
      damage: 160, 
      text: 'This attack also does 30 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)' 
    }
  ];

  public set: string = 'TEF';
  public regulationMark = 'H';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '108';

  public name: string = 'Farigiraf ex';
  public fullName: string = 'Farigiraf ex TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)){
      const player = effect.player;

      // i love checking for ability lock woooo
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      if (effect.source.getPokemonCard()?.tags.includes(CardTag.POKEMON_ex) && effect.source.getPokemonCard()?.stage === Stage.BASIC){
        effect.preventDefault = true;
      }
    }
    
    // Dirty Beam
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]){
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
  
      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }
  
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [ SlotType.BENCH ],
        { allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const damageEffect = new PutDamageEffect(effect, 30);
        damageEffect.target = targets[0];
        store.reduceEffect(state, damageEffect);
      });
    }

    return state;
  }
  
}