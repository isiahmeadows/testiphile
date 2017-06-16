"use strict"

/* eslint-env mocha */
/* global assert */

/**
 * Global settings. These are also configurable in Node via the environment.
 */
var settings = {
    migrate: false,
    release: false,
}

if (global.process != null && global.process.env != null) {
    if (!settings.migrate) settings.migrate = !!global.process.env.MIGRATE
    if (!settings.release) global.process.env.NODE_ENV = "development"
} else {
    // Polyfill Promise
    require("es6-promise/auto") // eslint-disable-line global-require
}

/**
 * This exports everything as globals, and it is Browserified as well.
 */
require("../lib/browser-bundle")
/* eslint-disable global-require */

var Util = global.Util = {
    Tests: require("../lib/core/tests"),
    Reports: require("../lib/core/reports"),
    ReportsTree: require("../lib/core/reports-tree"),
    DOM: require("./dom"),

    // Various dependencies used throughout the tests, minus the CLI tests. It's
    // easier to inject them into this bundle rather than to try to implement a
    // module loader.
    peach: require("../lib/util").peach,
    methods: require("../lib/methods"),
    R: require("../lib/reporter"),

    /* eslint-enable global-require */

    // Chrome complains of an illegal invocation without a bound `this`.
    setTimeout: global.setTimeout.bind(global),
}

// Because PhantomJS sucks - Some tests are fails due to PhantomJS oddities, and
// I can't get a reliable repro to work around them within clean-match or
// clean-assert, despite significant efforts to avoid them within clean-match.
// This adds a `Util.phantomFix` to wrap `it` and friends, used in the few cases
// PhantomJS misbehaves. It returns a possible proxy to the `it` argument.
//
// Note: `Util.phantomFix` should *only* be used on the tests where PhantomJS
// actually fails, and it will log an error if the issue no longer appears.
;(function () {
    var isPhantom = (function () {
        if (global.window == null) return false
        if (global.window.navigator == null) return false
        if (global.window.navigator.userAgent == null) return false
        return /phantomjs/i.test(global.window.navigator.userAgent)
    })()

    function fixErrors(key, value) {
        if (value instanceof Error) {
            return {name: value.name, message: value.message}
        } else {
            return value
        }
    }

    function runWrapped(test, name, func) {
        return new Promise(function (resolve, reject) {
            if (func.length === 0) {
                resolve(func())
            } else {
                func(function (e) { return e != null ? reject(e) : resolve() })
            }
        })
        .then(
            // So these will eventually get caught when they work again. (Don't
            // fail the build, though.)
            function () {
                global.console.error("Test now passing: " + test.fullTitle())
            },
            // Incorrect match failures will output identical JSON. Also,
            // the issues only present themselves with objects, making
            // things easier to check.
            function (e) {
                if (e instanceof assert.AssertionError ||
                    e.expected == null || typeof e.expected !== "object" ||
                    e.actual == null || typeof e.actual !== "object" ||
                    JSON.stringify(e.expected, fixErrors) !==
                        JSON.stringify(e.actual, fixErrors)
                ) {
                    throw e
                }
            })
    }

    Util.phantomFix = !isPhantom
        ? function (it) { return it }
        : function (it) {
            return function (name, func) {
                it(name + " (wrapped)", /** @this */ function () {
                    return runWrapped(this.test, name, func)
                })
            }
        }
})()

Util.report = require("./reports")

if (settings.migrate) {
    require("../migrate") // eslint-disable-line global-require
}
