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

const error = require("./error.js");

class Inst {
    constructor(pos) {
        this.pos = pos;
    }

    toString() {
        return "?";
    }

    do() {
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

    do(state) {
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

    do(state) {
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

    do(state) {
        try {
            state.moveFwd(this.num);
        }
        catch (err) {
            if (err instanceof error.RuntimeError) {
                throw err.addTrace([this.pos]);
            }
            else {
                throw err;
            }
        }
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

    do(state) {
        try {
            state.moveBwd(this.num);
        }
        catch (err) {
            if (err instanceof error.RuntimeError) {
                throw err.addTrace([this.pos]);
            }
            else {
                throw err;
            }
        }
    }
}

class In extends Inst {
    constructor(pos) {
        super(pos);
    }

    toString() {
        return ",";
    }

    do(state, input) {
        const res = input();
        if (res instanceof Promise) {
            return res.then(
                c => {
                    state.write(c);
                },
                () => {
                    throw new error.RuntimeError([this.pos], "EOF");
                }
            );
        }
        else if (res !== undefined) {
            state.write(res);
            return undefined;
        }
        else {
            throw new error.RuntimeError([this.pos], "EOF");
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
        return co(function* () {
            while (state.read() !== 0x00) {
                for (const inst of this.body) {
                    const res = inst.do(state, input, output);
                    if (res instanceof Promise) {
                        yield res;
                    }
                }
            }
        }.bind(this));
    }
}

endModule();
