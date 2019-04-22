// jshint ignore: start

const console = (function() {
    return this.console;
})();

let setup = (function() {
    scope = this;
})();
let objects = ["$", "_", "Backbone"];
for(i in objects) {
    try {
        scope[i] = this[objects[i]];
    } catch(error) {
        console.error(error);
    }
}

/**
 * Capitalizes the first letter of each word of string.
 * 
 * @param  {string}  str  String to be converted.
 * 
 * @returns  {string}  String in title case convention. * 
 */
String.prototype.toTitleCase = function() {
    return this.replace(/\w\S*/g, function(word) {
		// For every word, set the beginning letter to upper case and the rest to lower case
        return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
    });
};

/**
 * Tries to invoke function with arguments.
 * 
 * @link  https://github.com/30-seconds/30-seconds-of-code#attempt
 * 
 * @param  {function}  fn  Function to be invoked.
 */
const attempt = function(fn) {
    try {
        let args = _.rest(Array.from(arguments));
        fn.apply(null, args);
    } catch (error) {
        console.error(error);
    }
};

/**
 * Runs multiple functions asynchronously.
 * 
 * @link  https://github.com/30-seconds/30-seconds-of-code#chainasync
 * 
 * @param  {array}  fns  Contains functions.
 */
const chainAsync = function(fns) {
    let current = 0;
    let last = _.last(fns);
    
    let next = function() {
        let fn = fns[current++];
        fn === last ? fn() : fn(next);
    };
    next();
};

/**
 * Converts milliseconds to readable format.
 * 
 * @link  https://github.com/30-seconds/30-seconds-of-code#attempt
 * 
 * @param  {number}  ms  Duration in milliseconds.
 * 
 * @returns  {string}  Readable format of duration. 
 */
const formatDuration = function(ms) {
    println(typeof ms)
    let time = {
        day: Math.floor(ms / 86400000),
        hour: Math.floor(ms / 3600000) % 24,
        minute: Math.floor(ms / 60000) % 60,
        second: Math.floor(ms / 1000) % 60,
        millisecond: Math.floor(ms) % 1000
    };
    return Object.entries(time)
        .filter(function (value) {
            return value[1] !== 0;
        })
        .map(function (entry) {
                let key = entry[0],
                    value = entry[1];
                return value + " " + key + (value !== 1 ? 's' : '');
          })
        .join(', ');
};

/**
 * Calculates number of times function can run per second.
 * 
 * @link  https://github.com/30-seconds/30-seconds-of-code#hz
 * 
 * @param  {function}   fn              Function to be measured.
 * @param  {number}     [iterations]    Number of times function should be invoked.
 * 
 * @returns  {number}  Function performance in hertz - cycles per second.
 */
var hertz = function(fn, iterations) {
    iterations = iterations || 10000;
    var before = performance.now();
    for (var i = 0; i < iterations; i++) {
        fn();
    }
    return round(1000 * iterations / (performance.now() - before));
};

/**
 * Calculates fastest function.
 * 
 * @link https://github.com/30-seconds/30-seconds-of-code#mostperformant
 * 
 * @param  {array}      fns             Funtions to be compared.
 * @param  {number}     [iterations]    Number of times function should be invoked.
 * 
 * @returns  {number}  Index of function which performed fastest.
 */
var mostPerformant = function(fns, iterations) {
    iterations = iterations || 10000;
    var times = fns.map(function(fn) {
        var before = performance.now();
        for (var i = 0; i < iterations; i++) {
            fn();
        }
        return performance.now() - before;
    });
    return times.indexOf(min.apply(null, times));
};

/**
 * Prints HTML to canvas console.
 * 
 * @param  {string}  HTML  Text to be printed to canvas console. 
 */
const printHTML = function(HTML) {
    println(HTML);
    let latestLog = _.last(externals.canvas[['ownerDocument']]
        .body
        .childNodes[0]
        .childNodes[1].childNodes)
        .childNodes[0];
    latestLog.innerHTML = HTML;
};

// const logEvent = function(event, type) {
//     type = type || "log";
//     try {
//         // Try using any specified log types
//         console[type](event);
//     } catch(error) {
//         if(error instanceof TypeError) {
//             new Event("Invalid Event type '" + type + "'", "warn");
//             // Log event to console regardless
//             console.log(event);
//         } else {
//             new Event("Error creating event: " + error, "error");
//         }
//     }
//     return {
//         event: event,
//         type: type,
//         createdAt: new Date()
//     };
// };

var exports = [console, $, _, Backbone, String.prototype.toTitleCase, chainAsync, attempt, formatDuration, hertz, mostPerformant, printHTML];

var importer_context, export_module;
if(importer_context && export_module) {
    for(var i in exports) {
        importer_context.i = exports[i];
    }
    export_module(null);
}
