'use strict'

# This is a basic TAP-generating reporter.

tty = require 'tty'
{inspect} = require 'util'

windowWidth = unless tty.isatty(1) and tty.isatty(2)
    75
else if process.stdout.columns?
    process.stdout.columns
else if process.stdout.getWindowSize?
    process.stdout.getWindowSize(1)[0]
else if tty.getWindowSize?
    tty.getWindowSize()[1]
else
    75

counter = 0
tests = 0
pass = 0
fail = 0
skip = 0

reset = ->
    counter = 0
    tests = 0
    pass = 0
    fail = 0
    skip = 0

joinPath = (ev) -> (i.name for i in ev.path).join ' '

template = (ev, tmpl, skip) ->
    counter++ unless skip

    console.log tmpl.replace(/%c/g, counter)
                    .replace(/%p/g, joinPath(ev).replace(/\$/g, '$$$$'))

printLines = (value, skipFirst) ->
    lines = value.replace(/^/gm, '    ').split(/\r?\n/g)

    for line in (if skipFirst then lines[1..] else lines)
        console.log line

printRaw = (key, str) ->
    if str.length > windowWidth - key.length or /\r?\n|[:?-]/.test(str)
        console.log "  #{key}: |-"
        printLines str, no
    else
        console.log "  #{key}: #{str}"

printError = ({value: err}) ->
    unless err instanceof Error
        printRaw 'value', inspect(err)
    else if err.name isnt 'AssertionError'
        # Let's *not* depend on the constructor being Thallium's...
        console.log '  stack: |-'
        printLines err.stack, no
    else
        printRaw 'expected', inspect(err.expected)
        printRaw 'actual', inspect(err.actual)
        printRaw 'message', err.message
        console.log '  stack: |-'

        message = err.message
        err.message = ''
        printLines err.stack, yes
        err.message = message

module.exports = (ev, done) ->
    switch ev.type
        when 'start'
            console.log 'TAP version 13'

        when 'enter'
            tests++
            pass++
            # Print a leading comment, to make some TAP formatters prettier.
            template ev, '# %p', yes
            template ev, 'ok %c'

        # This is meaningless for the output.
        when 'leave' then

        when 'pass'
            tests++
            pass++
            template ev, 'ok %c %p'

        when 'fail'
            tests++
            fail++
            template ev, 'not ok %c %p'
            console.log '  ---'
            printError ev
            console.log '  ...'

        when 'skip'
            skip++
            template ev, 'ok %c # skip %p'

        when 'extra'
            template ev, 'not ok %c %p # extra'
            console.log '  ---'
            printRaw 'count', inspect(ev.value.count)
            printRaw 'value', inspect(ev.value.value)
            console.log '  ...'

        when 'end'
            console.log "1..#{counter}"
            console.log "# tests #{tests}"
            console.log "# pass #{pass}" if pass
            console.log "# fail #{fail}" if fail
            console.log "# skip #{skip}" if skip
            reset()

        when 'error'
            console.log 'Bail out!'
            console.log '  ---'
            printError ev
            console.log '  ...'
            reset()

        else throw new RangeError("Unexpected type: #{ev.type}")

    done()