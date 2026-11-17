// Dizionario inglese: frase italiana esatta → traduzione. Un file per zona, più interfaccia e personaggi.
// Per trovare le frasi ancora da tradurre: node tools/i18n-strings.mjs
import ui from './en-ui.js';
import meta from './en-meta.js';
import extra from './en-extra.js';
import f01 from './en-f01.js';
import f02 from './en-f02.js';
import f03 from './en-f03.js';
import m01 from './en-m01.js';
import m02 from './en-m02.js';
import m03 from './en-m03.js';
import m04 from './en-m04.js';
import m05 from './en-m05.js';
import d01 from './en-d01.js';
import tools from './en-tools.js';

export default { ...ui, ...meta, ...extra, ...f01, ...f02, ...f03, ...m01, ...m02, ...m03, ...m04, ...m05, ...d01, ...tools };
