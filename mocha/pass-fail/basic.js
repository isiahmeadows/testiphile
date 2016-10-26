"use strict"

var fail = require("../../assert").fail

function fail() {
    t.fail("fail")
}

describe("core (basic)", function () {
    it("has `base()`", function () {})
    it("has `test()`", function () {})
    it("has `parent()`", function () {})
    it("can accept a string + function", function () {})
    it("can accept a string", function () {})
    it("returns the current instance when given a callback", fail)
    it("returns a prototypal clone when not given a callback", fail)
    it("runs block tests within tests", function () {})
    it("runs successful inline tests within tests", function () {})
    it("accepts a callback with `t.run()`", function () {})
})
