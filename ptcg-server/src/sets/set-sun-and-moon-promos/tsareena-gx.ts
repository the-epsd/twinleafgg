import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, PlayerType, SlotType, GameError, ChoosePokemonPrompt, ChooseCardsPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game/store/state-utils';
import { BLOCK_IF_GX_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class TsareenaGX extends PokemonCard {

  public tags = [CardTag.POKEMON_GX];

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = ' Steenee';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 230;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Side Eye',
      cost: [G],
      damage: 0,
      text: 'Switch 1 of your opponent\'s Benched Pokémon with their Active Pokémon. The new Active Pokémon is now Confused.'
    },
    {
      name: 'Jumping Side Kick',
      cost: [G, C, C],
      damage: 90,
      damagecalculation: '+',
      text: 'If your opponent\'s Active Pokémon is Confused, this attack does 90 more damage.'
    },
    {
      name: 'Queen\'s Command-GX',
      cost: [G, G, C],
      damage: 0,
      text: 'Your opponent discards 4 cards from their hand. (You can\'t use more than 1 GX attack in a game.)'
    }
  ];

  public set: string = 'SMP';

  public setNumber = '56';

  public cardImage: string = 'assets/cardback.png';

  public name: string = 'Tsareena-GX';

  public fullName: string = 'Tsareena-GX SMP';
   
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    

       if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
         const player = effect.player;
         const opponent = StateUtils.getOpponent(state, player);
         const hasBench = opponent.bench.some(b => b.cards.length > 0);
   
         if (!hasBench) {
           throw new GameError(GameMessage.CANNOT_USE_POWER);
         }
   
         return store.prompt(state, new ChoosePokemonPrompt(
           player.id,
           GameMessage.CHOOSE_POKEMON_TO_SWITCH,
           PlayerType.TOP_PLAYER,
           [SlotType.BENCH],
           { allowCancel: false }
         ), result => {
           const cardList = result[0];
           opponent.switchPokemon(cardList);
           opponent.active.specialConditions.push(SpecialCondition.CONFUSED);
         });
       }
       if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      let damage = 90;
      if (effect.opponent.active.specialConditions.includes(SpecialCondition.CONFUSED)) {
        damage += 90;
      }
      effect.damage = damage;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[2]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      BLOCK_IF_GX_ATTACK_USED(player);
      player.usedGX = true;

      if (opponent.hand.cards.length <= 4) {
        const cards = opponent.hand.cards;
        opponent.hand.moveCardsTo(cards, opponent.discard);
        return state;
      }

      return store.prompt(state, new ChooseCardsPrompt(
        opponent,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        opponent.hand,
        {},
        { allowCancel: false, min: 4, max: 4 }
      ), selected => {
        const cards = selected || [];
        opponent.hand.moveCardsTo(cards, opponent.discard);
        return state;
      });
    }

    return state;
   }
  } 
