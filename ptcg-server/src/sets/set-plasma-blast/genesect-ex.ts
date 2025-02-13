import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { PowerType, StoreLike, State, StateUtils, ConfirmPrompt, GameMessage, ChoosePokemonPrompt, PlayerType, SlotType } from '../../game';
import {CONFIRMATION_PROMPT, IS_ABILITY_BLOCKED, WAS_ATTACK_USED} from '../../game/store/prefabs/prefabs';
import {THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON} from '../../game/store/prefabs/attack-effects';

export class GenesectEX extends PokemonCard {
  public tags = [CardTag.POKEMON_EX, CardTag.TEAM_PLASMA];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 170;
  public weakness = [{ type: R }];
  public retreat = [ C ];

  public powers = [{
    name: 'Red Signal',
    powerType: PowerType.ABILITY,
    text: 'When you attach a Plasma Energy from your hand to this Pokémon, you may switch 1 of your opponent\'s Benched Pokémon with his or her Active Pokémon.'
  }];

  public attacks = [
    {
      name: 'Megalo Cannon',
      cost: [G, G, C],
      damage: 100,
      text: 'Does 20 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public set: string = 'PLB';
  public name: string = 'Genesect EX';
  public fullName: string = 'Genesect EX PLB';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '11';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Red Signal
    if (effect instanceof AttachEnergyEffect && effect.target.cards.includes(this)){
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasBench = opponent.bench.some(b => b.cards.length > 0);

      if (!hasBench) {
        return state;
      }

      if (effect.energyCard.name === 'Plasma Energy'){

        const abilityLock = IS_ABILITY_BLOCKED(store, state, effect.player, this);
        if (!abilityLock){
          CONFIRMATION_PROMPT(store, state, effect.player, result => {
            if (result){
        
              state = store.prompt(state, new ConfirmPrompt(
                effect.player.id,
                GameMessage.WANT_TO_USE_ABILITY,
              ), wantToUse => {
                if (wantToUse) {
                  return store.prompt(state, new ChoosePokemonPrompt(
                    player.id,
                    GameMessage.CHOOSE_POKEMON_TO_SWITCH,
                    PlayerType.TOP_PLAYER,
                    [SlotType.BENCH],
                    { allowCancel: false }
                  ), result => {
                    const cardList = result[0];
                    opponent.switchPokemon(cardList);
                  });
                }
              });
            }
          });
        }
      }
    }

    // Megalo Cannon
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(20, effect, store, state);
    }

    return state;
  }

}
