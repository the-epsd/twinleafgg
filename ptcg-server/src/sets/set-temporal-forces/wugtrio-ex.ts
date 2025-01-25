import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, StateUtils, GameError, ChooseCardsPrompt, ChoosePokemonPrompt, PlayerType, SlotType } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Wugtrioex extends PokemonCard {
  public tags = [ CardTag.POKEMON_ex, CardTag.POKEMON_TERA ];  
  public stage: Stage = Stage.STAGE_1;  
  public evolvesFrom = 'Wiglett';  
  public cardType: CardType = CardType.LIGHTNING;  
  public hp: number = 250;  
  public weakness = [{ type: CardType.FIGHTING }];  
  public retreat = [ CardType.COLORLESS ];  
  
  public attacks = [
    { 
      name: 'Tricolor Pump', 
      cost: [ CardType.WATER ], 
      damage: 0, 
      text: 'Discard up to 3 Energy cards from your hand. This attack does 60 damage to 1 of your opponent\'s Pokémon for each Energy card you discarded in this way. (Don\'t apply Weakness and Resistance for Benched Pokémon.)' 
    },
    { 
      name: 'Numbing Hold', 
      cost: [ CardType.WATER, CardType.WATER ], 
      damage: 120, 
      text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.' 
    },
              
  ];

  public set: string = 'TEF'; 
  public name: string = 'Wugtrio ex'; 
  public fullName: string = 'Wugtrio ex TEF'; 
  public regulationMark = 'H'; 
  public cardImage: string = 'assets/cardback.png'; 
  public setNumber: string = '60'; 
  public readonly NUMBING_HOLD_MARKER = 'NUMBING_HOLD_MARKER';
  
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Tricolor Pump
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]){
      const player = effect.player;
      let watersCount = 0;

      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        { superType: SuperType.ENERGY },
        { allowCancel: false, min: 0, max: 3 }
      ), cards => {
        cards = cards || [];
        watersCount = cards.length;
        player.hand.moveCardsTo(cards, player.discard);
      });

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [ SlotType.ACTIVE, SlotType.BENCH ],
        { allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const damageEffect = new PutDamageEffect(effect, 60 * watersCount);
        damageEffect.target = targets[0];
        store.reduceEffect(state, damageEffect);
      });
    }

    // Numbing Hold
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.active.marker.addMarker(this.NUMBING_HOLD_MARKER, this);
    }

    if (effect instanceof CheckRetreatCostEffect && effect.player.active.marker.hasMarker(this.NUMBING_HOLD_MARKER, this)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.active.marker.removeMarker(this.NUMBING_HOLD_MARKER, this);
    }

    return state;
  }
  
}