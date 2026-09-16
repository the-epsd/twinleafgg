import { Card } from '../../game/store/card/card';
import { TestEnergy } from './test-energy';
import { TestMoveCardsInterceptor } from './test-move-cards-interceptor';
import { TestPokemon } from './test-pokemon';
import { TestRevealTopDeck } from './test-reveal-top-deck';
import { TestStadium, TestStadium2, TestStadium3 } from './test-stadium';

export const setTest: Card[] = [
  new TestPokemon(),
  new TestStadium(),
  new TestStadium2(),
  new TestStadium3(),
  new TestEnergy(),
  new TestRevealTopDeck(),
  new TestMoveCardsInterceptor(),
];
