import { ProfessorsResearch } from '../set-scarlet-and-violet/professors-research';
import { Pikachu } from '../set-evolutions/pikachu';
import { HereComesTeamRocket } from '../set-team-rocket/here-comes-team-rocket';
import { Mew } from './mew';
import { RocketsAdmin } from '../set-ex-team-rocket-returns/rockets-admin';
import { Reshiram } from '../set-black-and-white/reshiram';
import { Zekrom } from '../set-black-and-white/zekrom';

export class ProfessorsResearchCEL extends ProfessorsResearch {
  public fullName = 'Professor\'s Research CEL';
  public set = 'CEL';
  public setNumber = '23';
}

export class ProfessorsResearchCELFA extends ProfessorsResearch {
  public fullName = 'Professor\'s Research CEL FA';
  public set = 'CEL';
  public setNumber = '24';
}

export class PikachuCEL extends Pikachu {
  public set: string = 'CEL';
  public setNumber: string = '5';
  public fullName: string = 'Pikachu CEL';
}

export class HereComesTeamRocketCEL extends HereComesTeamRocket {
  public set: string = 'CEL';
  public setNumber: string = '15A2';
  public fullName: string = 'Here Comes Team Rocket! CEL';
}

export class Mew2 extends Mew {
  public set: string = 'CEL';
  public setNumber: string = '25';
  public fullName: string = 'Mew CEL 25';
}

export class RocketsAdminCEL extends RocketsAdmin {
  public set: string = 'CEL';
  public setNumber: string = '86A';
  public fullName: string = 'Rocket\'s Admin. CEL';
}

export class ReshiramCEL extends Reshiram {
  public set: string = 'CEL';
  public setNumber: string = '113A';
  public fullName: string = 'Reshiram CEL';
}

export class ZekromCEL extends Zekrom {
  public set: string = 'CEL';
  public setNumber: string = '114A';
  public fullName: string = 'Zekrom CEL';
}
