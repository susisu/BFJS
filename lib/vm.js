/*
 * BFJS / vm.js
 * copyright (c) 2016 Susisu
 */

"use strict";

function endModule() {
    module.exports = Object.freeze({
        State,
        VM
    });
}

const co = require("co");

const error = require("./error.js");

class State {
    constructor(memory, index, options) {
        this.memory = memory;
        this.index  = index;
        this.autoResizing       = options.autoResizing;
        this.allowNegativeIndex = options.allowNegativeIndex;
    }

    read() {
        return this.memory[this.index] & 0xFF;
    }

    write(val) {
        this.memory[this.index] = val & 0xFF;
    }

    incr(num) {
        this.memory[this.index] = ((this.memory[this.index] & 0xFF) + num) % 0x100;
    }

    decr(num) {
        this.memory[this.index] = (((this.memory[this.index] & 0xFF) - num) % 0x100 + 0x100) % 0x100;
    }

    moveFwd(num) {
        if (!this.autoResizing && this.index + num >= this.memory.length) {
            throw new error.RuntimeError([], "index out of range");
        }
        this.index += num;
    }

    moveBwd(num) {
        if (!(this.autoResizing || this.allowNegativeIndex) && this.index - num < 0) {
            throw new error.RuntimeError([], "index out of range");
        }
        this.index -= num;
    }
}

class VM {
    constructor(memory, index, input, output, options) {
        this.input  = input;
        this.output = output;
        this.state  = new State(memory, index, {
            autoResizing      : !!options.autoResizing,
            allowNegativeIndex: !!options.allowNegativeIndex
        });
    }

    run(prog) {
        return co(function* () {
            for (const inst of prog) {
                const res = inst.do(this.state, this.input, this.output);
                if (res instanceof Promise) {
                    yield res;
                }
            }
        }.bind(this));
    }
}

endModule();
