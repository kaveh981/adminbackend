interface IBusinessLayerHelper {
    hashPassword(password): any;
    isPasswordCorrect(savedHash, savedSalt, passwordAttempt, savedIterations, keylen, digest): boolean
}
export { IBusinessLayerHelper };
