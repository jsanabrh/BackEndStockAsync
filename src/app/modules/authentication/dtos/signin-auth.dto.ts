import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

//Dto are created for the authentication module

export class SignInDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'User identification or password invalid' })
  readonly userIdentification: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'User identification or Password invalid' })
  readonly password: string;
}
