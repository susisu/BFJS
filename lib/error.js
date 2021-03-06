/*
 * BFJS / error.js
 * copyright (c) 2016 Susisu
 */

"use strict";

function endModule() {
    module.exports = Object.freeze({
        ParseError,
        RuntimeError
    });
}

class ParseError extends Error {
    constructor(error) {
        super(error.toString());
        this.name  = this.constructor.name;
        this.error = error;
    }

    get pos() {
        return this.error.pos;
    }
}

class RuntimeError extends Error {
    constructor(trace, message) {
        super(message);
        this.name  = this.constructor.name;
        this.trace = trace;
    }

    addTrace(trace) {
        return new RuntimeError(trace.concat(this.trace), this.message);
    }

    toString() {
        const traceStr = this.trace.map(t => t.toString() + ":\n").join("");
        return this.name + ": " + traceStr + this.message;
    }
}

endModule();
