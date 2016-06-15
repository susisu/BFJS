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

const inst = require("./inst.js");

let whiteSpace = lq.noneOf("+-><.,[]").skipMany();

function lexeme(p) {
    return p.left(whiteSpace);
}

function symbol(c) {
    return lexeme(lq.char(c));
}

let plus     = symbol("+");
let minus    = symbol("-");
let rangle   = symbol(">");
let langle   = symbol("<");
let comma    = symbol(",");
let dot      = symbol(".");
let lbracket = symbol("[");
let rbracket = symbol("]");

let expr = lq.lazy(() => lq.choice([
    incr,
    decr,
    fwd,
    bwd,
    input,
    output,
    loop
]));

let incr = lq.gen(function * () {
    let pos = yield lq.getPosition;
    let num = (yield plus.many1()).length;
    return new inst.Incr(pos, num);
});
let decr = lq.gen(function * () {
    let pos = yield lq.getPosition;
    let num = (yield minus.many1()).length;
    return new inst.Decr(pos, num);
});
let fwd = lq.gen(function * () {
    let pos = yield lq.getPosition;
    let num = (yield rangle.many1()).length;
    return new inst.Fwd(pos, num);
});
let bwd = lq.gen(function * () {
    let pos = yield lq.getPosition;
    let num = (yield langle.many1()).length;
    return new inst.Bwd(pos, num);
});
let input = lq.gen(function * () {
    let pos = yield lq.getPosition;
    let num = yield comma;
    return new inst.In(pos);
});
let output = lq.gen(function * () {
    let pos = yield lq.getPosition;
    let num = yield dot;
    return new inst.Out(pos);
});
let loop = lq.gen(function * () {
    let pos = yield lq.getPosition;
    yield lbracket;
    let body = yield expr.many();
    yield rbracket;
    return new inst.Loop(pos, body);
});

let prog = lq.gen(function * () {
    yield whiteSpace;
    let insts = yield expr.many();
    yield lq.eof;
    return insts;
});

function parse(name, src) {
    let res = lq.parse(prog, name, src, 8);
    if (res.succeeded) {
        return res.value;
    }
    else {
        throw res.error;
    }
}

endModule();
