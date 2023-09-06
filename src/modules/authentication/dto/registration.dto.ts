import { IsNotEmpty, IsEmail, MinLength, IsString} from 'class-validator';
import { IsStrongPassword } from './uservalidator'; 



export class RegistrationDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
 @IsStrongPassword()
  // @IsStrongPassword({
  //   minLength: 8,
  //   minLowercase: 1,
  //   minNumbers: 1,
  //   minSymbols: 1,
  //   minUppercase: 1
  // })
  password: string;

  @IsNotEmpty()
  @IsString()
  surname: string;

  @IsNotEmpty()
  @IsString()
  username:string;

  @IsNotEmpty()
  private:boolean
}
