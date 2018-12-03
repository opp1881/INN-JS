import { IConfig } from '../types';
import { RequiredOptions, Mode, Flow } from '../enums';

const REQUIRED_TEXT_OPTIONS = [RequiredOptions.APP_NAME];
const REQUIRED_TYPE_OPTIONS = [RequiredOptions.MODE, RequiredOptions.FLOW];
const optionToEnum = {
  mode: Mode,
  flow: Flow
};

interface ValidationResult {
  valid: boolean;
  text?: string;
}

function createValidationResult(valid: boolean, text?: string) {
  return {
    valid,
    text
  };
}

const isValidOption = (
  config: IConfig,
  option: RequiredOptions
): ValidationResult => {
  if (!Object.values(optionToEnum[option]).includes(config[option])) {
    return createValidationResult(
      false,
      `${config[option]} is not a valid '${option}' option. 
    Valid values are '${Object.values(optionToEnum[option])}'`
    );
  }
  return createValidationResult(true);
};

const verifyPresence = (
  newConfig: IConfig,
  option: string
): ValidationResult => {
  const valueToTest = newConfig[option];
  if (!(typeof valueToTest === 'string' && valueToTest.length > 0)) {
    return createValidationResult(
      false,
      `Missing value for required option '${valueToTest}'`
    );
  }
  return createValidationResult(true);
};

export const verifyRequiredConfig = (
  newConfig: IConfig
): ValidationResult[] => {
  const requiredTypeResult = REQUIRED_TYPE_OPTIONS.map(
    (option: RequiredOptions): ValidationResult =>
      isValidOption(newConfig, option)
  );
  const requiredTextResult = REQUIRED_TEXT_OPTIONS.map(
    (option: RequiredOptions): ValidationResult =>
      verifyPresence(newConfig, option)
  );
  return requiredTypeResult.concat(requiredTextResult);
};
