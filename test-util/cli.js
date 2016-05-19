"use strict"

var path = require("path")
var minimatch = require("minimatch")
var interpret = require("interpret")
var State = require("../lib/cli/run.js").State
var methods = require("../lib/methods.js")

var hasOwn = Object.prototype.hasOwnProperty

exports.fixture = function (dir) {
    return path.resolve(__dirname, "../test-fixtures", dir)
}

function notFound(file) {
    var e = new Error("Cannot find module '" + file + "'")

    e.code = "MODULE_NOT_FOUND"
    return e
}

// Fake a Node `fs` errpr
function fsError(opts) {
    var message = opts.code + ": " + opts.message

    if (opts.syscall != null) message += ", " + opts.syscall
    if (opts.path != null) message += " '" + opts.path + "'"

    var e = new Error(message)

    if (opts.errno != null) e.errno = opts.errno
    if (opts.code != null) e.code = opts.code
    if (opts.syscall != null) e.syscall = opts.syscall
    if (opts.path != null) e.path = opts.path
    return e
}

function initTree(mock, file, entry) {
    if (entry == null) {
        throw new TypeError("value for entry " + file + " must exist")
    } else if (typeof entry === "string") {
        // Node tries to execute unknown extensions as JS, but this is better.
        mock._files[file] = function (type) {
            if (type === "read") return entry
            throw new Error(file + " is not executable!")
        }
        mock._listing.push(file)
    } else if (typeof entry === "function") {
        // Cache the load, like Node.
        var value

        mock._files[file] = function (type) {
            if (type === "load") {
                if (entry == null) return value
                return value = entry()
            }
            throw new Error(file + " shouldn't be read!")
        }
        mock._listing.push(file)
    } else {
        mock._files[file] = {type: "directory"}

        for (var key in entry) {
            if ({}.hasOwnProperty.call(entry, key)) {
                initTree(mock, path.resolve(file, key), entry[key])
            }
        }
    }
}

// Mock the node-interpret modules that are associated with a `register` method.
var interpretMocks = {
    "babel-register": function () {},
    "babel-core/register": function () {},
    "babel/register": function () {},
    "node-jsx": function () { return {install: function () {}} },
}

var interpretModules = {} // eslint-disable-line newline-after-var

;(function () {
    function addSingle(mod) {
        if (mod == null) {
            // do nothing - it's a native extension.
        } else if (typeof mod === "string") {
            interpretModules[mod] = true
        } else {
            interpretModules[mod.module] = true
        }
    }

    for (var key in interpret.jsVariants) {
        if ({}.hasOwnProperty.call(interpret.jsVariants, key)) {
            var mod = interpret.jsVariants[key]

            if (Array.isArray(mod)) {
                for (var i = 0; i < mod.length; i++) {
                    addSingle(mod[i])
                }
            } else {
                addSingle(mod)
            }
        }
    }
})()

function SingleMatcher(mock, glob) {
    var single

    if (glob[0] === "!") {
        single = "!" + mock.resolve(glob.slice(1))
    } else {
        single = mock.resolve(glob)
    }

    this.mm = new minimatch.Minimatch(single, {
        nocase: process.platform === "win32",
        nocomment: true,
    })
}

methods(SingleMatcher, {
    match: function (file) {
        return this.mm.match(file)
    },
})

function MultiMatcher(mock, globs) {
    this.ignores = []
    this.keeps = []

    for (var i = 0; i < globs.length; i++) {
        var raw = globs[i]
        var list

        if (raw[0] === "!") {
            raw = raw.slice(1)
            list = this.ignores
        } else {
            list = this.keeps
        }

        list.push(new minimatch.Minimatch(mock.resolve(raw), {
            nocase: process.platform === "win32",
            nocomment: true,
        }))
    }
}

methods(MultiMatcher, {
    match: function (file) {
        for (var i = 0; i < this.ignores.length; i++) {
            if (this.ignores[i].match(file)) return false
        }

        for (var j = 0; j < this.keeps.length; j++) {
            if (this.keeps[j].match(file)) return true
        }

        return false
    },
})

function Mock(tree) {
    this._tree = tree
    this._files = Object.create(null)
    this._listing = []
    this._cwd = process.platform === "win32" ? "C:\\" : "/"

    initTree(this, this._cwd, this._tree)

    var keys = Object.getOwnPropertyNames(Mock.prototype)

    for (var i = 0; i < keys.length; i++) {
        this[keys[i]] = Mock.prototype[keys[i]].bind(this)
    }
}

methods(Mock, {
    resolve: function (file) {
        return path.resolve(this._cwd, file)
    },

    load: function (file) {
        // Total hack, but it's easier than implementing Node's resolution
        // algorithm.
        if (file === "thallium") {
            return this.load("node_modules/thallium")
        }

        if (interpretMocks[file] != null) return interpretMocks[file]
        if (interpretModules[file]) return undefined

        var target = this.resolve(file)

        // Directories are initialized as objects.
        if (!hasOwn.call(this._files, target)) throw notFound(file)

        var func = this._files[target]

        if (typeof func !== "function") func = this._files[target + ".js"]

        if (typeof func !== "function") {
            func = this._files[path.join(target, "index.js")]
        }

        if (typeof func !== "function") throw notFound(file)

        return func("load")
    },

    readGlob: function (globs) {
        if (!Array.isArray(globs)) globs = [globs]

        var matcher

        if (globs.length === 1) {
            matcher = new SingleMatcher(this, globs[0])
        } else {
            matcher = new MultiMatcher(this, globs)
        }

        for (var i = 0; i < this._listing.length; i++) {
            var item = this._listing[i]

            if (matcher.match(item)) this.load(item)
        }
    },

    read: function (file) {
        var target = this.resolve(file)

        // Directories are initialized as objects.
        if (!hasOwn.call(this._files, target)) {
            throw fsError({
                path: file,
                message: "no such file or directory",
                code: "ENOENT",
                errno: -2,
                syscall: "open",
            })
        }

        var func = this._files[target]

        if (typeof func === "object") {
            throw fsError({
                message: "illegal operation on a directory",
                code: "EISDIR",
                errno: -21,
                syscall: "read",
            })
        }

        return func("read")
    },

    cwd: function () { return this._cwd },
    chdir: function (dir) { this._cwd = this.resolve(dir) },
    exists: function (file) {
        return typeof this._files[this.resolve(file)] === "function"
    },
})

exports.mock = function (tree) {
    return new Mock(tree)
}

exports.state = function (argv, util) {
    return new State({cwd: util.cwd(), argv: argv, util: util})
}

exports.Loader = Loader
function Loader(argv, util) {
    if (typeof argv === "string") {
        argv = argv.trim()
        argv = argv ? argv.split(/\s+/g) : []
    }

    this.state = new State({cwd: util.cwd(), argv: argv, util: util})
    this.load = util.load
}
