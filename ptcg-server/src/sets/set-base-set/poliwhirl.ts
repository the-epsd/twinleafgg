import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { ChooseAttackPrompt, GameError, GameLog, GameMessage, PlayerType, PokemonCardList, StateUtils } from '../../game';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Poliwhirl extends PokemonCard {

  public name = 'Poliwhirl';
  
  public set = 'BS';
  
  public fullName = 'Poliwhirl BS';
  
  public cardType = CardType.WATER;

  public stage = Stage.STAGE_1;

  public evolvesFrom = 'Poliwag';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '38';

  public hp = 60;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS];

  public forgottenAttack: Attack | null = null;
  
  public attacks: Attack[] = [
    {
      name: 'Amnesia',
      cost: [CardType.WATER, CardType.WATER],
      text: 'Choose 1 of the Defending Pokémon’s attacks. That Pokémon can’t use that attack during your opponent’s next turn.',
      damage: 0
    },
    {
      name: 'Doubleslap',
      cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS],
      damage: 30,
      text: 'Flip 2 coins. This attack does 30 damage times the number of heads.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const pokemonCard = opponent.active.getPokemonCard();
        
      if (pokemonCard === undefined || pokemonCard.attacks.length === 0) {
        return state;
      }
        
      let selected: any;
      return store.prompt(state, new ChooseAttackPrompt(
        player.id,
        GameMessage.CHOOSE_ATTACK_TO_DISABLE,
        [ pokemonCard ],
        { allowCancel: false }
      ), result => {
        selected = result;
        
        if (selected === null) {
          return state;
        }
        
        opponent.active.marker.addMarker(PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this);
        this.forgottenAttack = selected;
        
          
        store.log(state, GameLog.LOG_PLAYER_DISABLES_ATTACK, {
          name: player.name,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          attack: this.forgottenAttack!.name
        });
        
        return state;
      });
    }
    
    if (effect instanceof AttackEffect && effect.attack === this.forgottenAttack &&
        effect.player.active.marker.hasMarker(PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }
    
    if (effect instanceof EndTurnEffect && 
        effect.player.active.marker.hasMarker(PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this)) {

      effect.player.active.marker.removeMarker(PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this);

      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        cardList.marker.removeMarker(PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this);
      });
      
      this.forgottenAttack = null;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return store.prompt(state, [
        new CoinFlipPrompt(effect.player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(effect.player.id, GameMessage.COIN_FLIP)
      ], (results) => {
        const heads = results.filter(r => !!r).length;
        effect.damage = heads * 30;
      });
    }
    
    return state;
  }

}
