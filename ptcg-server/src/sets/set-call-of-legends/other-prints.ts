import { Cleffa } from "../set-heartgold-and-soulsilver/cleffa";
import { Copycat } from "../set-evolving-skies/copycat";
import { ProfessorElmsTrainingMethod } from "../set-ex-unseen-forces/professors-elm-training-method";
import { Smeargle } from "../set-undaunted/smeargle";

export class CleffaCL extends Cleffa {
  public fullName = 'Cleffa CL';
  public set = 'CL';
  public setNumber = '24';
}

export class CopycatCL extends Copycat {
  public fullName = 'Copycat CL';
  public set = 'CL';
  public setNumber = '77';
  public text = 'Shuffle your hand into your deck. Then, draw a card for each card in your opponent\'s hand.';
}

export class ProfessorElmsTrainingMethodCL extends ProfessorElmsTrainingMethod {
  public fullName = 'Professor Elm\'s Training Method CL';
  public set = 'CL';
  public setNumber = '82';
  public text = 'Search your deck for an Evolution card, show it to your opponent, and put it into your hand. Shuffle your deck afterward.';
}

export class SmeargleCL extends Smeargle {
  public fullName = 'Smeargle CL';
  public set = 'CL';
  public setNumber = '21';
}
