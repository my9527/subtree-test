
import KCError from './base';

export default class RequiredParamsError extends KCError {
    constructor(message) {
        super(message || 'Params requried are missing', 400)
    }
}