import { AutoMap } from '@automapper/classes';

export class UserInHeaderResponseDto {
  @AutoMap()
  id: number;

  @AutoMap()
  username: string;

  @AutoMap()
  email: string;

  @AutoMap()
  phoneNumber: string;

  @AutoMap()
  isHavePet: string;
}
