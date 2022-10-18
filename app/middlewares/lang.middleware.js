import path from 'path';
import i18n from 'i18n'

import env from '../helper/env.js';

const __dirname = path.resolve();

i18n.configure({
    directory: path.join(__dirname, '/app/locales'),
    defaultLocale: env("DEFAULT_LANGUAGE"),
    objectNotation: true
})

export default i18n