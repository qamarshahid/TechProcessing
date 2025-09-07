import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

// List of known temporary/disposable email domains
const DISPOSABLE_EMAIL_DOMAINS = [
  '10minutemail.com',
  'tempmail.org',
  'guerrillamail.com',
  'mailinator.com',
  'temp-mail.org',
  'throwaway.email',
  'getnada.com',
  'maildrop.cc',
  'sharklasers.com',
  'grr.la',
  'guerrillamailblock.com',
  'pokemail.net',
  'spam4.me',
  'bccto.me',
  'chacuo.net',
  'dispostable.com',
  'mailnesia.com',
  'mailcatch.com',
  'inboxalias.com',
  'mailmetrash.com',
  'trashmail.net',
  'trashmail.com',
  'mytrashmail.com',
  'spamgourmet.com',
  'spam.la',
  'binkmail.com',
  'bobmail.info',
  'chammy.info',
  'devnullmail.com',
  'letthemeatspam.com',
  'mailin8r.com',
  'mailinator2.com',
  'notmailinator.com',
  'reallymymail.com',
  'reconmail.com',
  'safetymail.info',
  'sogetthis.com',
  'spamhereplease.com',
  'superrito.com',
  'thisisnotmyrealemail.com',
  'tradermail.info',
  'veryrealemail.com',
  'wegwerfmail.de',
  'wegwerfmail.net',
  'wegwerfmail.org',
  'wegwerpmailadres.nl',
  'wetrainbayarea.com',
  'wetrainbayarea.org',
  'wh4f.org',
  'whyspam.me',
  'willselfdestruct.com',
  'wuzup.net',
  'wuzupmail.net',
  'yeah.net',
  'yopmail.com',
  'yopmail.net',
  'yopmail.org',
  'ypmail.webarnak.fr.eu.org',
  'cool.fr.nf',
  'jetable.fr.nf',
  'nospam.ze.tc',
  'nomail.xl.cx',
  'mega.zik.dj',
  'speed.1s.fr',
  'courriel.fr.nf',
  'moncourrier.fr.nf',
  'monemail.fr.nf',
  'monmail.fr.nf',
  'test.com',
  'example.com',
  'example.org',
  'example.net',
  'invalid.com',
  'fake.com',
  'dummy.com'
];

export function IsNotDisposableEmail(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNotDisposableEmail',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }

          const email = value.toLowerCase();
          const domain = email.split('@')[1];

          if (!domain) {
            return false;
          }

          // Check if domain is in the disposable email list
          return !DISPOSABLE_EMAIL_DOMAINS.includes(domain);
        },
        defaultMessage(args: ValidationArguments) {
          return 'Please use a real email address. Temporary or disposable email addresses are not allowed.';
        },
      },
    });
  };
}
