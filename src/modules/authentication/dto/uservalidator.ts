import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from "class-validator";

@ValidatorConstraint({name:'isStrongPassword',async:false})
export class IsStrongPasswordConstraint implements ValidatorConstraintInterface{
    validate(password: string, _args: ValidationArguments){
        const strongPasswordRegex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/;
        return strongPasswordRegex.test(password);
    }
    defaultMessage(_args: ValidationArguments): string {
       return 'Password is not strong enough';
    }
    
}

export function IsStrongPassword() {
    return function (object: Record<string, any>, propertyName: string) {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: {},
        constraints: [],
        validator: IsStrongPasswordConstraint,
      });
    };
  }