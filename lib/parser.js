/*
 * BFJS / parser.js
 * copyright (c) 2016 Susisu
 */

"use strict";

function endModule() {
    module.exports = Object.freeze({
        parse
    });
}

const lq = require("loquat");

const error = require("./error.js");
const inst  = require("./inst.js");

const whiteSpace = lq.noneOf("+-><.,[]").skipMany();

function lexeme(p) {
    return p.left(whiteSpace);
}

function symbol(c) {
    return lexeme(lq.char(c));
}

const plus     = symbol("+");
const minus    = symbol("-");
const rangle   = symbol(">");
const langle   = symbol("<");
const comma    = symbol(",");
const dot      = symbol(".");
const lbracket = symbol("[");
const rbracket = symbol("]");

const expr = lq.lazy(() => lq.choice([
    incr,
    decr,
    fwd,
    bwd,
    input,
    output,
    loop
]));

const incr = lq.gen(function* () {
    const pos = yield lq.getPosition;
    const num = (yield plus.many1()).length;
    return new inst.Incr(pos, num);
});
const decr = lq.gen(function* () {
    const pos = yield lq.getPosition;
    const num = (yield minus.many1()).length;
    return new inst.Decr(pos, num);
});
const fwd = lq.gen(function* () {
    const pos = yield lq.getPosition;
    const num = (yield rangle.many1()).length;
    return new inst.Fwd(pos, num);
});
const bwd = lq.gen(function* () {
    const pos = yield lq.getPosition;
    const num = (yield langle.many1()).length;
    return new inst.Bwd(pos, num);
});
const input = lq.gen(function* () {
    const pos = yield lq.getPosition;
    yield comma;
    return new inst.In(pos);
});
const output = lq.gen(function* () {
    const pos = yield lq.getPosition;
    yield dot;
    return new inst.Out(pos);
});
const loop = lq.gen(function* () {
    const pos = yield lq.getPosition;
    yield lbracket;
    const body = yield expr.many();
    yield rbracket;
    return new inst.Loop(pos, body);
});

const prog = lq.gen(function* () {
    yield whiteSpace;
    const insts = yield expr.many();
    yield lq.eof;
    return insts;
});

function parse(name, src) {
    const res = lq.parse(prog, name, src, 8);
    if (res.succeeded) {
        return res.value;
    }
    else {
        throw new error.ParseError(res.error);
    }
}

endModule();
