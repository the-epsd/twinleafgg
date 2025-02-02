import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, PlayerType, SlotType, PokemonCardList, GameError, ChoosePokemonPrompt, ChooseEnergyPrompt, Card } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { StateUtils } from '../../game/store/state-utils';
import { AttackEffect } from '../../game/store/effects/game-effects';
import {SHUFFLE_DECK} from '../../game/store/prefabs/prefabs';
import {DiscardCardsEffect, PutDamageEffect} from '../../game/store/effects/attack-effects';

export class TapuFiniGX extends PokemonCard {
  public tags = [CardTag.POKEMON_GX];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 170;
  public retreat = [ C ];

  public attacks = [
    {
      name: 'Aqua Ring',
      cost: [ C ],
      damage: 20,
      text: 'You may switch this Pokémon with 1 of your Benched Pokémon.'
    },
    {
      name: 'Hydro Shot',
      cost: [ W, W, C ],
      damage: 0,
      text: 'Discard 2 [W] Energy from this Pokémon. This attack does 120 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'Tapu Storm-GX',
      cost: [ W ],
      damage: 0,
      gxAttack: true,
      text: 'Shuffle your opponent\'s Active Pokémon and all cards attached to it into their deck. If your opponent has no Benched Pokémon, this attack does nothing. (You can\'t use more than 1 GX attack in a game.)'
    }
  ];

  public set: string = 'BUS';
  public setNumber: string = '39';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Tapu Fini-GX';
  public fullName: string = 'Tapu Fini-GX BUS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Aqua Ring
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]){
      const player = effect.player;

      const hasBench = player.bench.some(b => b.cards.length > 0);
      
      if (hasBench === false) {
        return state;
      }
    
      let targets: PokemonCardList[] = [];
      store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), results => {
        targets = results || [];
          
        if (targets.length > 0) {
          player.active.clearEffects();
          player.switchPokemon(targets[0]);
        }
      });
    }

    // Hydro Shot
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]){
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_HAND,
        checkProvidedEnergy.energyMap,
        [ W, W],
        { allowCancel: false }
      ), energy => {
        const cards: Card[] = (energy || []).map(e => e.card);
        const discardEnergy = new DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;
        store.reduceEffect(state, discardEnergy);

        return store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { allowCancel: false }
        ), targets => {
          if (!targets || targets.length === 0) {
            return;
          }
          const damageEffect = new PutDamageEffect(effect, 120);
          damageEffect.target = targets[0];
          store.reduceEffect(state, damageEffect);
        });
      });
    }

    // Tapu Storm-GX
    if (effect instanceof AttackEffect && effect.attack === this.attacks[2]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check if player has used GX attack
      if (player.usedGX == true) {
        throw new GameError(GameMessage.LABEL_GX_USED);
      }
      // set GX attack as used for game
      player.usedGX = true;

      const hasBench = opponent.bench.some(b => b.cards.length > 0);
      if (hasBench === false) {
        return state;
      }

      opponent.active.clearEffects();
      opponent.active.damage = 0;
      opponent.active.moveTo(opponent.deck);

      SHUFFLE_DECK(store, state, opponent);
    }
    return state;
  }
} 