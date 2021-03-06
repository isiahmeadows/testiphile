"use strict"

var t = require("thallium")
var assert = require("thallium/assert")

function fail() {
    assert.match(
        {propertyOne: 1, propertyTwo: 2, propertyThree: 5, propertyFour: 4},
        {propertyOne: 1, propertyTwo: 2, propertyThree: 3, propertyFour: 4}
    )
}

t.test("core (basic)", function () {
    t.test("has `base()`", function () {})
    t.test("has `test()`", function () {})
    t.test("has `parent()`", function () {})
    t.test("can accept a string + function", function () {})
    t.test("can accept a string", function () {})
    t.test("returns the current instance when given a callback", fail)
    t.test("returns a prototypal clone when not given a callback", fail)
    t.test("runs block tests within tests", function () {})
    t.test("runs successful inline tests within tests", function () {})
    t.test("accepts a callback with `t.run()`", function () { t.skip() })
})
