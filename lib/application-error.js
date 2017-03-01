'use strict';

/**
 * ApplicationError
 */
module.exports =
    class ApplicationError extends Error {
        constructor(...args) {
            super(args);
        }
    };
