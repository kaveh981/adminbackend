const crypto = require('crypto');
import { inject, injectable } from 'inversify';
import {IBusinessLayerHelper} from './helper.infc';

@injectable()
class BusinessLayerHelper implements IBusinessLayerHelper {

    hashPassword(password) {
        let salt = crypto.randomBytes(128).toString('base64');
        let iterations = 10000;
        let keylen = 48;
        let digest = 'sha1';
        let hash = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest);
        return {
            salt: salt,
            hash: hash.toString('base64'),
            iterations: iterations,
            keylen: keylen,
            digest: digest
        };
    }

    isPasswordCorrect(savedHash, savedSalt, passwordAttempt, savedIterations = 10000, keylen = 48, digest = 'sha1') {
        return savedHash === crypto.pbkdf2Sync(passwordAttempt, savedSalt, savedIterations, keylen, digest).toString('base64');
    }

}
export { BusinessLayerHelper };
