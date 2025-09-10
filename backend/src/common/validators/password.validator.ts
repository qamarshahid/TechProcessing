import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export interface PasswordStrengthOptions {
  minLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumbers?: boolean;
  requireSpecialChars?: boolean;
  maxLength?: number;
  preventCommonPasswords?: boolean;
  preventUserInfo?: boolean;
  userInfoFields?: string[];
}

const COMMON_PASSWORDS = [
  'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
  'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'password1',
  'qwerty123', 'dragon', 'master', 'hello', 'freedom', 'whatever',
  'qazwsx', 'trustno1', '654321', 'jordan23', 'harley', 'password1',
  '1234', 'robert', 'matthew', 'jordan', 'asshole', 'daniel',
  'andrew', 'charles', 'michael', 'james', 'william', 'david',
  'richard', 'joseph', 'thomas', 'christopher', 'daniel', 'paul',
  'mark', 'donald', 'george', 'kenneth', 'steven', 'edward',
  'brian', 'ronald', 'anthony', 'kevin', 'jason', 'matthew',
  'gary', 'timothy', 'jose', 'larry', 'jeffrey', 'frank',
  'scott', 'eric', 'stephen', 'andrew', 'raymond', 'gregory',
  'joshua', 'jerry', 'dennis', 'walter', 'patrick', 'peter',
  'harold', 'douglas', 'henry', 'carl', 'arthur', 'ryan',
  'roger', 'joe', 'juan', 'jack', 'albert', 'jonathan',
  'justin', 'terry', 'gerald', 'keith', 'samuel', 'willie',
  'ralph', 'lawrence', 'nicholas', 'roy', 'benjamin', 'bruce',
  'brandon', 'adam', 'harry', 'fred', 'wayne', 'billy',
  'steve', 'louis', 'jeremy', 'aaron', 'randy', 'howard',
  'eugene', 'carlos', 'russell', 'bobby', 'victor', 'martin',
  'ernest', 'phillip', 'todd', 'jesse', 'craig', 'alan',
  'shawn', 'clarence', 'sean', 'philip', 'chris', 'johnny',
  'earl', 'jimmy', 'antonio', 'danny', 'bryan', 'tony',
  'luis', 'mike', 'stanley', 'leonard', 'nathan', 'dale',
  'manuel', 'rodney', 'curtis', 'norman', 'allen', 'marvin',
  'vincent', 'glenn', 'jeffery', 'travis', 'jeff', 'chad',
  'jacob', 'lee', 'melvin', 'alfred', 'kyle', 'francis',
  'bradley', 'jesus', 'herbert', 'frederick', 'ray', 'joel',
  'edwin', 'don', 'eddie', 'ricky', 'troy', 'randall',
  'barry', 'alexander', 'bernard', 'mario', 'leroy', 'francisco',
  'marcus', 'micheal', 'theodore', 'clifford', 'miguel', 'oscar',
  'jay', 'jim', 'tom', 'calvin', 'alex', 'jon',
  'ronnie', 'bill', 'lloyd', 'tommy', 'leon', 'derek',
  'warren', 'darrell', 'jerome', 'floyd', 'leo', 'alvin',
  'tim', 'wesley', 'gordon', 'dean', 'greg', 'jorge',
  'dustin', 'pedro', 'derrick', 'dan', 'lewis', 'zachary',
  'corey', 'herman', 'maurice', 'vernon', 'roberto', 'clyde',
  'glen', 'hector', 'shane', 'ricardo', 'sam', 'rick',
  'lester', 'brent', 'ramon', 'charlie', 'tyler', 'gilbert',
  'gene', 'marc', 'reginald', 'ruben', 'brett', 'angel',
  'nathaniel', 'rafael', 'leslie', 'edgar', 'milton', 'raul',
  'ben', 'chester', 'cecil', 'duane', 'franklin', 'andre',
  'elmer', 'brad', 'gabriel', 'ron', 'mitchell', 'roland',
  'arnold', 'harvey', 'jared', 'adrian', 'karl', 'cory',
  'claude', 'erik', 'darryl', 'jamie', 'neil', 'jessie',
  'christian', 'javier', 'fernando', 'clinton', 'ted', 'mathew',
  'tyrone', 'darren', 'lonnie', 'lance', 'cody', 'julio',
  'kelly', 'kurt', 'allan', 'nelson', 'guy', 'clayton',
  'hugh', 'max', 'dwayne', 'dwight', 'armando', 'felix',
  'jimmie', 'everett', 'jordan', 'ian', 'wallace', 'ken',
  'bob', 'jaime', 'casey', 'alfredo', 'alberto', 'dave',
  'ivan', 'johnnie', 'sidney', 'byron', 'julian', 'isaac',
  'morris', 'clifton', 'willard', 'daryl', 'ross', 'virgil',
  'andy', 'marshall', 'salvador', 'perry', 'kirk', 'sergio',
  'marion', 'tracy', 'seth', 'kent', 'terrance', 'rene',
  'eduardo', 'terrence', 'enrique', 'freddie', 'wade'
];

export function IsStrongPassword(options: PasswordStrengthOptions = {}, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }

          const {
            minLength = 12,
            requireUppercase = true,
            requireLowercase = true,
            requireNumbers = true,
            requireSpecialChars = true,
            maxLength = 128,
            preventCommonPasswords = true,
            preventUserInfo = true,
            userInfoFields = []
          } = options;

          // Check length
          if (value.length < minLength || value.length > maxLength) {
            return false;
          }

          // Check for uppercase letters
          if (requireUppercase && !/[A-Z]/.test(value)) {
            return false;
          }

          // Check for lowercase letters
          if (requireLowercase && !/[a-z]/.test(value)) {
            return false;
          }

          // Check for numbers
          if (requireNumbers && !/\d/.test(value)) {
            return false;
          }

          // Check for special characters
          if (requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(value)) {
            return false;
          }

          // Check against common passwords
          if (preventCommonPasswords) {
            const lowerValue = value.toLowerCase();
            if (COMMON_PASSWORDS.some(common => lowerValue.includes(common))) {
              return false;
            }
          }

          // Check against user information
          if (preventUserInfo && userInfoFields.length > 0) {
            const lowerValue = value.toLowerCase();
            for (const field of userInfoFields) {
              if (field && lowerValue.includes(field.toLowerCase())) {
                return false;
              }
            }
          }

          // Check for repeated characters (more than 3 in a row)
          if (/(.)\1{3,}/.test(value)) {
            return false;
          }

          // Check for sequential characters (like 123, abc, etc.)
          if (/(?:012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(value)) {
            return false;
          }

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          const {
            minLength = 12,
            requireUppercase = true,
            requireLowercase = true,
            requireNumbers = true,
            requireSpecialChars = true,
            maxLength = 128
          } = options;

          const requirements = [];
          
          if (minLength) {
            requirements.push(`at least ${minLength} characters`);
          }
          if (maxLength && maxLength < 128) {
            requirements.push(`no more than ${maxLength} characters`);
          }
          if (requireUppercase) {
            requirements.push('one uppercase letter');
          }
          if (requireLowercase) {
            requirements.push('one lowercase letter');
          }
          if (requireNumbers) {
            requirements.push('one number');
          }
          if (requireSpecialChars) {
            requirements.push('one special character');
          }

          return `Password must contain ${requirements.join(', ')} and cannot contain common passwords or sequential characters`;
        }
      }
    });
  };
}

export function IsNotCommonPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNotCommonPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') {
            return false;
          }
          
          const lowerValue = value.toLowerCase();
          return !COMMON_PASSWORDS.some(common => lowerValue.includes(common));
        },
        defaultMessage() {
          return 'Password cannot contain common passwords or dictionary words';
        }
      }
    });
  };
}

export function IsNotUserInfo(userInfoFields: string[], validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNotUserInfo',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') {
            return false;
          }
          
          const lowerValue = value.toLowerCase();
          return !userInfoFields.some(field => 
            field && lowerValue.includes(field.toLowerCase())
          );
        },
        defaultMessage() {
          return 'Password cannot contain your personal information';
        }
      }
    });
  };
}
