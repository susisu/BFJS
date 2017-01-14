/*
 * BFJS / error.js
 * copyright (c) 2016 Susisu
 */

"use strict";

function endModule() {
    module.exports = Object.freeze({
        RuntimeError
    });
}

class RuntimeError extends Error {
    constructor(trace, message) {
        super(message);
        this.trace = trace;
    }

    addTrace(trace) {
        return new RuntimeError(trace.concat(this.trace), this.message);
    }

    toString() {
        const traceStr = this.trace.map(t => t.toString() + ":\n").join("");
        return traceStr + this.message;
    }
}

endModule();
