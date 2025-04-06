import { PokemonCard, Stage, CardType, PowerType, State, StoreLike, StateUtils, ConfirmPrompt, GameMessage, CardTag, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerTargetEffect } from '../../game/store/effects/play-card-effects';
import { DISCARD_A_STADIUM_CARD_IN_PLAY, IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Cetitanex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Cetoddle';
  public tags = [ CardTag.POKEMON_ex ];
  public cardType: CardType = W;
  public hp: number = 300;
  public weakness = [{ type: M }];
  public retreat = [ C, C, C, C ];

  public powers = [{
    name: 'Snow Cover',
    powerType: PowerType.ABILITY,
    text: 'Whenever your opponent plays an Item or Supporter card from their hand, prevent all effects of that card done to this Pokémon.'
  }];

  public attacks = [{
    name: 'Crush Press',
    cost: [ W, W, W ,C ],
    damage: 140,
    damageCalculation: '+',
    text: 'You may discard a Stadium in play. If you do, this attack does 140 more damage.'
  }];

  public set: string = 'SV10';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '32';
  public name: string = 'Cetitan ex';
  public fullName: string = 'Cetitan ex SV10';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Snow Cover
    if (effect instanceof TrainerTargetEffect && effect.target?.cards.includes(this)){
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      
      if (IS_ABILITY_BLOCKED(store, state, effect.player, this)){ return state; }

      // finding if the owner of the card is playing the trainer or if the opponent is
      let isCetitanOnOpponentsSide = false;
      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this){ isCetitanOnOpponentsSide = true; }
      });
      if (!isCetitanOnOpponentsSide){ return state; }
      
      effect.preventDefault = true;
    }
    
    // Crush Press
    if (WAS_ATTACK_USED(effect, 0, this)){
      if (StateUtils.getStadiumCard(state) === undefined){ return state; }

      return store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {
          DISCARD_A_STADIUM_CARD_IN_PLAY(state);
          effect.damage += 140;
        }
      });
    }
    
    return state;
  }
}
