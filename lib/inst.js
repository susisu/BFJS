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
        Right,
        Left,
        In,
        Out,
        Loop
    });
}

class Inst {
    constructor(pos) {
        this.pos = pos;
    }

    toString() {
        return "?";
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
}

class Decr extends Inst {
    constructor(pos, num) {
        super(pos);
        this.num = num;
    }

    toString() {
        return "-".repeat(this.num);
    }
}

class Right extends Inst {
    constructor(pos, num) {
        super(pos);
        this.num = num;
    }

    toString() {
        return ">".repeat(this.num);
    }
}

class Left extends Inst {
    constructor(pos, num) {
        super(pos);
        this.num = num;
    }

    toString() {
        return "<".repeat(this.num);
    }
}

class In extends Inst {
    constructor(pos) {
        super(pos);
    }

    toString() {
        return ",";
    }
}

class Out extends Inst {
    constructor(pos) {
        super(pos);
    }

    toString() {
        return ".";
    }
}

class Loop extends Inst {
    constructor(pos, body) {
        super(pos);
        this.body = body;
    }

    toString() {
        return `[${this.body.toString()}]`;
    }
}

endModule();
