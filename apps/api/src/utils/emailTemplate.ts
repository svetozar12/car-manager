import { readFileSync } from 'node:fs';
import { logger } from './logger';

export enum templateEnum {
  SEND_CODE,
}
import { pathToFileURL } from 'url';
const importMetaUrl = pathToFileURL(__filename).href;

export async function importTemplate(
  templateType: templateEnum,
  mapValues: Record<string, any>,
) {
  const templateDir = getTemplateDir(templateType);
  logger.debug(['Loading dir', templateDir]);
  const template = readFileSync(new URL(templateDir, importMetaUrl), 'utf8');

  const output = template.replace(/\{([^}]+)\}/g, (_, key) =>
    Object.prototype.hasOwnProperty.call(mapValues, key)
      ? String(mapValues[key])
      : `{${key}}`,
  );
  logger.info(output);
  return output;
}

function getTemplateDir(templateType: templateEnum): string {
  const sendCodeDir = '../emailTemplate/sendCode.html';

  if (templateType === templateEnum.SEND_CODE) return sendCodeDir;
  return sendCodeDir;
}
