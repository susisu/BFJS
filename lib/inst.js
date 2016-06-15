/*
 * BFJS / inst.js
 * copyright (c) 2016 Susisu
 */

"use strict";

function endModule() {
    module.exports = Object.freeze({
        Inst,
        Incr,
        Decr,
        Fwd,
        Bwd,
        In,
        Out,
        Loop
    });
}

const co = require("co");

class Inst {
    constructor(pos) {
        this.pos = pos;
    }

    toString() {
        return "?";
    }

    do(state, input, output) {
        throw new Error("not implemented");
    }
}

class Incr extends Inst {
    constructor(pos, num) {
        super(pos);
        this.num = num;
    }

    toString() {
        return "+".repeat(this.num);
    }

    do(state, input, output) {
        state.incr(this.num);
    }
}

class Decr extends Inst {
    constructor(pos, num) {
        super(pos);
        this.num = num;
    }

    toString() {
        return "-".repeat(this.num);
    }

    do(state, input, output) {
        state.decr(this.num);
    }
}

class Fwd extends Inst {
    constructor(pos, num) {
        super(pos);
        this.num = num;
    }

    toString() {
        return ">".repeat(this.num);
    }

    do(state, input, output) {
        state.moveFwd(this.num);
    }
}

class Bwd extends Inst {
    constructor(pos, num) {
        super(pos);
        this.num = num;
    }

    toString() {
        return "<".repeat(this.num);
    }

    do(state, input, output) {
        state.moveBwd(this.num);
    }
}

class In extends Inst {
    constructor(pos) {
        super(pos);
    }

    toString() {
        return ",";
    }

    do(state, input, output) {
        let res = input();
        if (res instanceof Promise) {
            return res.then(c => {
                state.write(c);
            });
        }
        else {
            state.write(res);
        }
    }
}

class Out extends Inst {
    constructor(pos) {
        super(pos);
    }

    toString() {
        return ".";
    }

    do(state, input, output) {
        output(state.read());
    }
}

class Loop extends Inst {
    constructor(pos, body) {
        super(pos);
        this.body = body;
    }

    toString() {
        return "[" + this.body.map(inst => inst.toString()).join("") + "]";
    }

    do(state, input, output) {
        return co(function * () {
            while (state.read() !== 0x00) {
                for (let inst of this.body) {
                    let res = inst.do(state, input, output);
                    if (res instanceof Promise) {
                        yield res;
                    }
                }
            }
        }.bind(this));
    }
}

endModule();
