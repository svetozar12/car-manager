import { buildOpenAPIDocument } from './utils/openAPI/spec';
import { writeFileSync, mkdirSync } from 'fs';
import { stringify } from 'yaml';

const doc = buildOpenAPIDocument();
mkdirSync('openapi', { recursive: true });
writeFileSync('openapi/openapi.json', JSON.stringify(doc, null, 2));
writeFileSync('openapi/openapi.yaml', stringify(doc));
console.log('Wrote openapi/openapi.{json,yaml}');
