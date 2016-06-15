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

class State {
    constructor(memory, pointer) {
        this.memory  = memory;
        this.pointer = pointer;
    }

    read() {
        return this.memory[this.pointer] & 0xFF;
    }

    write(val) {
        this.memory[this.pointer] = val & 0xFF;
    }

    incr(num) {
        this.memory[this.pointer] = ((this.memory[this.pointer] & 0xFF) + num) % 0x100;
    }

    decr(num) {
        this.memory[this.pointer] = (((this.memory[this.pointer] & 0xFF) - num) % 0x100 + 0x100) % 0x100;
    }

    moveFwd(num) {
        this.pointer += num;
    }

    moveBwd(num) {
        this.pointer -= num;
    }
}

class VM {
    constructor(input, output) {
        this.input  = input;
        this.output = output;
        this.state  = new State([], 0);
    }

    run(prog) {
        return co(function * () {
            for (let inst of prog) {
                let res = inst.do(this.state, this.input, this.output);
                if (res instanceof Promise) {
                    yield res;
                }
            }
        }.bind(this));
    }
}

endModule();
