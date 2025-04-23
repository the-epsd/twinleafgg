import { CardTag, CardType, ChooseCardsPrompt, GameMessage, PokemonCard, Stage, State, StateUtils, StoreLike, SuperType, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { BLOCK_IF_GX_ATTACK_USED, COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';


export class SlowpokePsyduckGX extends PokemonCard {
  public tags = [CardTag.POKEMON_GX, CardTag.TAG_TEAM];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 250;
  public weakness = [{ type: G }];
  public retreat = [ C, C ];

  public attacks = [
    {
      name: 'Ditch and Splash',
      cost: [ W, W ],
      damage: 40,
      damageCalculation: 'x',
      text: 'Discard any number of Supporter cards from your hand. This attack does 40 damage for each card you discarded in this way.'
    },
    {
      name: 'Thrilling Times-GX',
      cost: [ W, W ],
      damage: 10,
      damageCalculation: '+',
      gxAttack: true,
      text: 'Flip a coin. If heads, this attack does 100 more damage. If this Pokémon has at least 6 extra [W] Energy attached to it (in addition to this attack\'s cost), flip 10 coins instead, and this attack does 100 more damage for each heads. (You can\'t use more than 1 GX attack in a game.)'
    },
  ];

  public set = 'UNM';
  public setNumber = '35';
  public cardImage = 'assets/cardback.png';
  public name = 'Slowpoke & Psyduck-GX';
  public fullName = 'Slowpoke & Psyduck-GX UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ditch and Splash
    if (WAS_ATTACK_USED(effect, 0, this)){
      const player = effect.player;

      // Prompt player to choose cards to discard 
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER },
        { allowCancel: false, min: 0 }
      ), cards => {
        cards = cards || [];
        if (cards.length === 0) {
          return;
        }
        const discardSupporters = new DiscardCardsEffect(effect, cards);
        discardSupporters.target = player.active;
        store.reduceEffect(state, discardSupporters);
        player.hand.moveCardsTo(cards, player.discard);

        effect.damage = cards.length * 40;
        return state;
      });
    }

    // Thrilling Times-GX
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      BLOCK_IF_GX_ATTACK_USED(player);
      player.usedGX = true;

      let coinFlips = 1;

      const extraEffectCost: CardType[] = [W, W, W, W, W, W, W, W];
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergy);
      const meetsExtraEffectCost = StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);

      if (meetsExtraEffectCost) {
        coinFlips = 10;
      }
      let heads = 0;

      for (let i = 0; i < coinFlips; i++){
        COIN_FLIP_PROMPT(store, state, player, result => {
          if (result){ heads++; }
        })
      }

      effect.damage = heads * 100;
    }

    return state;
  }
}