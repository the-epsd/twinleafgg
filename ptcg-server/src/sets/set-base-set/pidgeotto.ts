import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { GameMessage, PlayerType, PokemonCardList, SlotType, StateUtils } from '../..';
import { AbstractAttackEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Pidgeotto extends PokemonCard {
  
  public set = 'BS';
  
  public fullName = 'Pidgeotto BS';

  public name = 'Pidgeotto';

  public stage = Stage.STAGE_1;
  
  public evolvesFrom = 'Pidgey';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '22';

  public hp = 60;
  
  public cardType = CardType.COLORLESS;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS];
  
  private mirrorMoveEffects: AbstractAttackEffect[] = [];

  public attacks: Attack[] = [
    {
      name: 'Whirlwind',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 20,
      text: 'If your opponent has any Benched Pokémon, he or she chooses 1 of them and switches it with the Defending Pokémon. (Do the damage before switching the Pokémon.)'
    },
    {
      name: 'Mirror Move',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 0,
      text: 'If Pidgeotto was attacked last turn, do the final result of that attack on Pidgeotto to the Defending Pokémon.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      
      const opponent = StateUtils.getOpponent(state, effect.player);
      const opponentHasBench = opponent.bench.some(b => b.cards.length > 0);

      if (!opponentHasBench) {
        return state;
      }

      let targets: PokemonCardList[] = [];
      
      if (opponentHasBench) {
        store.prompt(state, new ChoosePokemonPrompt(
          opponent.id,
          GameMessage.CHOOSE_POKEMON_TO_SWITCH,
          PlayerType.BOTTOM_PLAYER,
          [ SlotType.BENCH ],
          { allowCancel: false }
        ), results => {
          targets = results || [];
        });

        if (targets.length > 0) {
          opponent.active.clearEffects();
          opponent.switchPokemon(targets[0]);
        }
      }
    }
    
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;      
      const opponent = StateUtils.getOpponent(state, effect.player);      
      
      this.mirrorMoveEffects.forEach(effect => {
        effect.target = opponent.active;
        effect.opponent;
        effect.player = player;
        effect.source = player.active;
        // eslint-disable-next-line no-self-assign
        effect.attackEffect = effect.attackEffect;
        
        store.reduceEffect(state, effect.attackEffect);
      });
    }
    
    if (effect instanceof AbstractAttackEffect && effect.target.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();
  
      if (pokemonCard !== this) {
        return state;
      }
  
      this.mirrorMoveEffects.push(effect);
      
      return state;
    }
    
    if (effect instanceof EndTurnEffect) {
      if (effect.player.active.cards.includes(this) || effect.player.bench.some(b => b.cards.includes(this))) {
        this.mirrorMoveEffects = [];
      }
      
      return state;
    }
    
    return state;
  }

}
