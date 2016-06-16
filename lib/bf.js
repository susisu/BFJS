/*
 * BFJS / bf.js
 * copyright (c) 2016 Susisu
 */

"use strict";

function endModule() {
    module.exports = Object.freeze({
        error,
        inst,
        parser,
        vm
    });
}

const error  = require("./error.js");
const inst   = require("./inst.js");
const parser = require("./parser.js");
const vm     = require("./vm.js");

endModule();
