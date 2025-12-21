import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, PlayerType, StateUtils, ChoosePokemonPrompt, GameMessage, SlotType, EnergyCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import {CONFIRMATION_PROMPT, IS_ABILITY_BLOCKED, WAS_ATTACK_USED} from '../../game/store/prefabs/prefabs';
import {PutCountersEffect} from '../../game/store/effects/attack-effects';
import {PlayPokemonEffect} from '../../game/store/effects/play-card-effects';

export class AlakazamEx extends PokemonCard {
  public tags = [ CardTag.POKEMON_EX ];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 160;
  public weakness = [{ type: P }];
  public retreat = [ C, C ];

  public powers = [{
    name: 'Kinesis',
    powerType: PowerType.ABILITY,
    text: 'When you play M Alakazam-EX from your hand to evolve this Pokémon, before it evolves, you may put 2 damage counters on your opponent\'s Active Pokémon and 3 damage counters on 1 of your opponent\'s Benched Pokémon.'
  }];

  public attacks = [
    {
      name: 'Suppression',
      cost: [ P, C ],
      damage: 0,
      text: 'Put 3 damage counters on each of your opponent\'s Pokémon that has any Energy attached to it.'
    }
  ];

  public set: string = 'FCO';
  public name: string = 'Alakazam-EX';
  public fullName: string = 'Alakazam EX FCO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '25';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Kinesis
    if (effect instanceof PlayPokemonEffect && effect.target.getPokemonCard() === this){
      const opponent = StateUtils.getOpponent(state, effect.player);

      if (effect.pokemonCard.name === 'M Alakazam-EX'){

        if (IS_ABILITY_BLOCKED(store, state, effect.player, this)){ return state; }

        CONFIRMATION_PROMPT(store, state, effect.player, result => {
          if (result){
            
            opponent.active.damage += 20;

            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
              return state;
            }
      
            return store.prompt(state, new ChoosePokemonPrompt(
              effect.player.id,
              GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
              PlayerType.TOP_PLAYER,
              [SlotType.BENCH],
              { allowCancel: false }
            ), targets => {
              if (!targets || targets.length === 0) {
                return;
              }

              targets[0].damage += 30;
            });

          }
        });
      }
    }
    
    // Suppression
    if (WAS_ATTACK_USED(effect, 0, this)){
      const opponent = effect.opponent;

      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, card => {
        const goodEnergy = card.cards.filter(card =>
          card instanceof EnergyCard
        );

        if (goodEnergy.length > 0){
          const damage = new PutCountersEffect(effect, 30);
          damage.target = card;
          store.reduceEffect(state, damage);
        }
      });
    }

    return state;
  }

}
