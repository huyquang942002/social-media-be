import { ConfigService } from '@nestjs/config';
import * as awsConfig from 'aws-sdk';
import * as moment from 'moment';

export const getSkip = ({ page, take }): number => {
  return (page - 1) * take;
};

export interface ReturnMessage {
  statusCode?: number;
  message?: string;
  data?: any;
}

export const successMessage = ({
  statusCode,
  message,
  data,
}: ReturnMessage) => {
  return {
    statusCode: statusCode || 200,
    message: message || 'success',
    ...(data ? { data } : {}),
  };
};

export const errorMessage = ({ statusCode, message, data }: ReturnMessage) => {
  return {
    statusCode: statusCode || 500,
    message:
      message || 'Please contact the administrator to verify this error.',
    ...(data ? { data } : {}),
  };
};

export const randomString = ({ length }): string => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const randomCharacter = ({ length }): string => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const randomNumber = ({ length }): string => {
  let result = '';
  const characters = '0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const getS3Presigned = (
  fileName: string,
  privatePath: string | null,
  configService: ConfigService,
) => {
  const s3 = new awsConfig.S3({
    apiVersion: '2006-03-01',
    signatureVersion: 'v4',
  });
  const signedUrlExpireSeconds = 60 * 5; // 5 minutes

  return s3.getSignedUrl('putObject', {
    Bucket: privatePath
      ? `${configService.get<string>('AWS_BUCKET')}/${privatePath}`
      : configService.get<string>('AWS_BUCKET'),
    Key: fileName,
    Expires: signedUrlExpireSeconds,
  });
};

const isObject = (o) => {
  return o === Object(o) && !isArray(o) && typeof o !== 'function';
};

const isArray = (a) => {
  return Array.isArray(a);
};

export const keysToCamel = (o) => {
  if (isObject(o)) {
    const n = {};

    Object.keys(o).forEach((k) => {
      n[toCamel(k)] = keysToCamel(o[k]);
    });

    return n;
  } else if (isArray(o)) {
    return o.map((i) => {
      return keysToCamel(i);
    });
  }

  return o;
};

const toCamel = (s) => {
  return s.replace(/([-_][a-z])/gi, ($1) => {
    return $1.toUpperCase().replace('-', '').replace('_', '');
  });
};

export const yyyymmddPattern =
  /^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/i;

export const encryptCard = (input: string, key: string) => {
  let result = '';
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    const keyChar = key.charCodeAt(i % key.length);
    const encryptedChar = char ^ keyChar;
    result += String.fromCharCode(encryptedChar);
  }
  return result;
};

export const decryptCard = (input: string, key: string) => {
  return encryptCard(input, key);
};

export const convertCardExpirationToDate = (expirationText: string) => {
  try {
    const formatedText = `20${expirationText?.slice(
      -2,
      expirationText?.length,
    )}-${expirationText?.slice(0, 2)}`;
    return new Date(formatedText);
  } catch (ex) {
    return null;
  }
};

export const generateOrderNumber = (orderId: string) => {
  return `${moment().format('YYYYMMDD')}ORBS${orderId
    ?.toString()
    ?.padStart(6, '0')}`;
};
