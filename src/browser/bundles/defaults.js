import { version } from '../../defaults.js'

export const cdnHost = 'cdn.rollbar.com';
// concatenation over interpolation makes the minified file smaller
export const defaultRollbarJsUrl = 'https://' + cdnHost + '/rollbarjs/refs/tags/v' + version + '/rollbar.min.js';
