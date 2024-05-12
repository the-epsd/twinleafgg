import { CardTarget, ChoosePokemonPrompt, GameError, GameMessage, PlayerType, PokemonCardList, SelectPrompt, SlotType, StateUtils } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Attack, Power, PowerType } from '../../game/store/card/pokemon-types';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, KnockOutEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Electrode extends PokemonCard {

  public name = 'Electrode';

  public set = 'BS';
  
  public fullName = 'Electrode BS';
  
  public stage = Stage.STAGE_1;
  
  public evolvesFrom = 'Voltorb';

  public cardType = CardType.LIGHTNING;

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '21';
  
  public hp = 80;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public powers: Power[] = [
    {
      useWhenInPlay: true,
      powerType: PowerType.POKEPOWER,
      name: 'Buzzap',
      text: 'At any time during your turn (before your attack), you may Knock Out Electrode and attach it to 1 of your other Pokémon. If you do, choose a type of Energy. Electrode is now an Energy card (instead of a Pokémon) that provides 2 energy of that type. You can’t use this power if Electrode is Asleep, Confused, or Paralyzed.',
      
    }
  ];

  public attacks: Attack[] = [
    {
      name: 'Electric Shock',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.LIGHTNING],
      damage: 50,
      text: 'Flip a coin. If tails, Electrode does 10 damage to itself.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;

      if (cardList.specialConditions.length > 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER); 
      }
      
      const options = [
        { value: CardType.COLORLESS, message: 'Colorless' },
        { value: CardType.DARK, message: 'Dark' },
        { value: CardType.DRAGON, message: 'Dragon' },
        { value: CardType.FAIRY, message: 'Fairy' },
        { value: CardType.FIGHTING, message: 'Fighting' },
        { value: CardType.FIRE, message: 'Fire' },
        { value: CardType.GRASS, message: 'Grass' },
        { value: CardType.LIGHTNING, message: 'Lightning' },
        { value: CardType.METAL, message: 'Metal' },
        { value: CardType.PSYCHIC, message: 'Psychic' },
        { value: CardType.WATER, message: 'Water' }
      ];
      
      return store.prompt(state, new SelectPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGY_TYPE,
        options.map(c => c.message),
        { allowCancel: false }
      ), choice => {
        const option = options[choice];
    
        if (!option) {
          return state;
        }
        
        const blocked: CardTarget[] = [];
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
          if (card === this) {
            blocked.push(target);
          }
        });
        
        return store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS,
          PlayerType.BOTTOM_PLAYER,
          [ SlotType.ACTIVE, SlotType.BENCH ],
          { allowCancel: true, blocked }
        ), targets => {
          if (targets && targets.length > 0) {
            
            const cardList = StateUtils.findCardList(state, this);
            const benchIndex = player.bench.indexOf(cardList as PokemonCardList);
            
            if (benchIndex !== -1) {
              
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const pokemonCard = player.bench[benchIndex].getPokemonCard()!;              
              (<any>pokemonCard)['provides'] = [option.value, option.value];
              
              player.bench[benchIndex].moveCardTo(pokemonCard, targets[0]);
        
              // Discard other cards
              player.bench[benchIndex].moveTo(player.discard);
              player.bench[benchIndex].clearEffects();              
              
              const opponent = StateUtils.getOpponent(state, player);
              const knockOutEffect = new KnockOutEffect(opponent, player.bench[benchIndex]);
              
              store.reduceEffect(state, knockOutEffect);
            } else {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const pokemonCard = player.active.getPokemonCard()!;        
              (<any>pokemonCard)['provides'] = [option.value, option.value];      
              
              player.active.moveCardTo(pokemonCard, targets[0]);
        
              // Discard other cards
              player.active.moveTo(player.discard);
              player.active.clearEffects();             
              
              const opponent = StateUtils.getOpponent(state, player);
              const knockOutEffect = new KnockOutEffect(opponent, player.active);
              
              store.reduceEffect(state, knockOutEffect); 
            }            
          }
        });
      });
    }
    
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      
      return store.prompt(state, new CoinFlipPrompt(
        effect.player.id, GameMessage.FLIP_COIN
      ), (result) => {
        if (!result) {
          const selfDamage = new DealDamageEffect(effect, 10);
          selfDamage.target = effect.player.active;
          store.reduceEffect(state, selfDamage);
        }
      });
    }
    
    return state;
  }

}