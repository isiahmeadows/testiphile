"use strict"

/* eslint-disable max-len */

var t = require("thallium")

t.test("cli common isObjectLike() passes for objects and functions", function () {})
t.test("cli common isObjectLike() fails for other things", function () {})
t.test("cli common resolveDefault() gets CJS default functions", function () {})
t.test("cli common resolveDefault() gets CJS default functions with `default` property", function () {})
t.test("cli common resolveDefault() gets CJS default arrays with `default` property", function () {})
t.test("cli common resolveDefault() gets CJS default objects", function () {})
t.test("cli common resolveDefault() gets CJS default primitives", function () {})
t.test("cli common resolveDefault() gets ES6 default functions", function () {})
t.test("cli common resolveDefault() gets ES6 default objects", function () {})
t.test("cli common resolveDefault() gets ES6 default arrays", function () {})
t.test("cli common resolveDefault() gets ES6 default objects with `default` property", function () {})
t.test("cli common resolveDefault() gets ES6 default functions with `default` property", function () {})
t.test("cli common resolveDefault() gets ES6 default arrays with `default` property", function () {})
t.test("cli common resolveDefault() gets ES6 default primitives", function () {})
t.test("cli common normalizeGlob() current directory normalizes a file", function () {})
t.test("cli common normalizeGlob() current directory normalizes a glob", function () {})
t.test("cli common normalizeGlob() current directory retains trailing slashes", function () {})
t.test("cli common normalizeGlob() current directory retains negative", function () {})
t.test("cli common normalizeGlob() current directory retains negative + trailing slashes", function () {})
t.test("cli common normalizeGlob() absolute directory normalizes a file", function () {})
t.test("cli common normalizeGlob() absolute directory normalizes a glob", function () {})
t.test("cli common normalizeGlob() absolute directory retains trailing slashes", function () {})
t.test("cli common normalizeGlob() absolute directory retains negative", function () {})
t.test("cli common normalizeGlob() absolute directory retains negative + trailing slashes", function () {})
t.test("cli common normalizeGlob() relative directory normalizes a file", function () {})
t.test("cli common normalizeGlob() relative directory normalizes a glob", function () {})
t.test("cli common normalizeGlob() relative directory retains trailing slashes", function () {})
t.test("cli common normalizeGlob() relative directory retains negative", function () {})
t.test("cli common normalizeGlob() relative directory retains negative + trailing slashes", function () {})
t.test("cli common normalizeGlob() edge cases normalizes `.` with a cwd of `.`", function () {})
t.test("cli common normalizeGlob() edge cases normalizes `..` with a cwd of `.`", function () {})
t.test("cli common normalizeGlob() edge cases normalizes `.` with a cwd of `..`", function () {})
t.test("cli common normalizeGlob() edge cases normalizes directories with a cwd of `..`", function () {})
t.test("cli common normalizeGlob() edge cases removes excess `.`", function () {})
t.test("cli common normalizeGlob() edge cases removes excess `..`", function () {})
t.test("cli common normalizeGlob() edge cases removes excess combined junk", function () {})
t.test("cli common globParent() strips glob magic to return parent path", function () {})
t.test("cli common globParent() returns parent dirname from non-glob paths", function () {})
t.test("cli common globParent() gets a base name", function () {})
t.test("cli common globParent() gets a base name from a nested glob", function () {})
t.test("cli common globParent() gets a base name from a flat file", function () {})
t.test("cli common globParent() gets a base name from character class pattern", function () {})
t.test("cli common globParent() gets a base name from brace , expansion", function () {})
t.test("cli common globParent() gets a base name from brace .. expansion", function () {})
t.test("cli common globParent() gets a base name from extglob", function () {})
t.test("cli common globParent() gets a base name from a complex brace glob", function () {})
