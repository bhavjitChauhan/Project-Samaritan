// jshint ignore: start

const NAME = "Project Samaritan Core Library",
      VERSION = "0.0.3",
      AUTHOR = "Aliquis";

console.time("Import Core Library");

// Functions {

/**
 * Capitalizes the first letter of each word of string.
 * 
 * @param {string}  str  String to be converted.
 * 
 * @returns {string}  String in title case convention.
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
 * @link https://github.com/30-seconds/30-seconds-of-code#attempt
 * 
 * @param {function}  fn  Function to be invoked.
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
 * @link https://github.com/30-seconds/30-seconds-of-code#chainasync
 * 
 * @param {array}  fns  Contains functions.
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
 * Removes Khan Academy's loop protection from functions.
 * 
 * @link https://khanacademy.org/cs/i/5594326276014080
 * 
 * @param {function}  fn  Function to be cleaned.
 * 
 * @returns {function}  Cleaned function.
 */
const clean = function(fn) {
    let string = fn.toString()
        .replace(/__env__\.KAInfiniteLoopCount\+\+;/g, '')
        .replace(/if \(__env__\.KAInfiniteLoopCount > 1000\) {[\s]+__env__\.KAInfiniteLoopProtect\(\'[^']*'\);[^}]+}/g, '')
        .replace(/__env__\.PJSOutput\.applyInstance\((__env__\.\S+), '\S+'\)/g, 'new $1');
    return Object.constructor('return (function(__env__) {return ' + string + ';});')()(this);
};

/**
 * Copies data to clipboard.
 * 
 * @param {string}  data  Data to be copied.
 */
const copyToClipboard = function(data) {
    let doc = eval("document");
	let textArea = doc["createElement"]("textarea");
	textArea.value = data;
	textArea.setAttribute("style", "height:0px");
	doc.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
	try {
		doc.execCommand("copy");
	} catch (error) {
		println("Error copying data to clipboard.\n\n"+ error);
	}
	doc.body.removeChild(textArea);
};

/**
 * Converts milliseconds to readable format.
 * 
 * @link https://github.com/30-seconds/30-seconds-of-code#attempt
 * 
 * @param {number}  ms  Duration in milliseconds.
 * 
 * @returns {string}  Readable format of duration. 
 */
const formatDuration = function(ms) {
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
 * @link https://github.com/30-seconds/30-seconds-of-code#hz
 * 
 * @param {function}   fn              Function to be measured.
 * @param {number}     [iterations]    Number of times function should be invoked.
 * 
 * @returns {number}  Function performance in hertz - cycles per second.
 */
const hertz = function(fn, iterations) {
    iterations = iterations || 10000;
    let before = performance.now();
    for (let i = 0; i < iterations; i++) {
        fn();
    }
    return Math.round(1000 * iterations / (performance.now() - before));
};

/**
 * Calculates fastest function.
 * 
 * @link https://github.com/30-seconds/30-seconds-of-code#mostperformant
 * 
 * @param {array}      fns             Funtions to be compared.
 * @param {number}     [iterations]    Number of times function should be invoked.
 * 
 * @returns {Object}  Index of function which performed fastest and times recorded.
 */
const mostPerformant = function(fns, iterations) {
    iterations = iterations || 10000;
    let times = fns.map(function(fn) {
        let before = performance.now();
        for (let i = 0; i < iterations; i++) {
            fn();
        }
        return performance.now() - before;
    });
    return {
        winner: times.indexOf(Math.round.apply(null, times)),
        times: times
    };
};

/**
 * Prints HTML to canvas console.
 * 
 * @param {string}  data  Text to be printed to canvas console. 
 */
const printHTML = function(data) {
    println(data);
    let latestLog = _.last(eval('document')
        .body
        .childNodes[0]
        .childNodes[1].childNodes)
        .childNodes[0];
    latestLog.innerHTML = data;
};
// }
// Exporting {

// Using BMS, see www.khanacademy.org/cs/i/6070976254115840
const bootstrapper = function(callback) {
    let doc = Object.constructor("return this.document")();
    let jsonp = doc[["createElement"]]("script");
    doc.BMS_bootstrap_loader = function(data) {
        delete doc.BMS_bootstrap_loader; jsonp.parentNode.removeChild(jsonp);
        Object.constructor("importer_context", "export_module", data.revision.code)(this, callback);
    }.bind(this);
    jsonp.setAttribute("src", "https://www.khanacademy.org/api/labs/scratchpads/5522928629252096?callback=document.BMS_bootstrap_loader");
    doc.head.appendChild(jsonp);
};

// Functions to be imported from other programs
const __requirements__ = {
    "centeredObjectText": "#5244695642996736",
    "highlightText": "#6710182776242176",
    "multiColoredText": "#6037261762265088",
    "outlineText": "#4933300921925632"
};

// Check if program is being imported or running by itself
let importer_context;
let standalone = !importer_context;

bootstrapper({
    done: function(BMS, modules) {
        // Dynamically define imported functions
        for(module in modules) {
            window[module] = modules[module];
        }
        let exports = {
            // For testing if variables were defined properly in importer's context
            "IMPORTED_CORE": true,
            "String.prototype.toTitleCase": String.prototype.toTitleCase,
            "attempt": attempt,
            "centeredObjectText": centeredObjectText,
            "chainAsync": chainAsync,
            "clean": clean,
            "copyToClipboard": copyToClipboard,
            "formatDuration": formatDuration,
            "hertz": hertz,
            "highlightText": highlightText,
            "mostPerformant": mostPerformant,
            "multiColoredText": multiColoredText,
            "outlineText": outlineText,
            "printHTML": printHTML
        };
        if(standalone) {
            background(255);
            fill(0);
            textAlign(CENTER);
            textFont(createFont("monospace"), 15);
            text(NAME + "\nVersion " + VERSION, width / 2, height / 2);
        } else {
            console.log("Defining library functions...");
            for(let i in exports) {
                // Dynamically define functions in importer's context
                importer_context[i] = exports[i];
            }
            // Add library information in exports module
            exports.NAME = NAME;
            exports.AUTHOR = AUTHOR;
            exports.VERSION = VERSION;
            console.log("Importing library object...")
            export_module(exports);
            console.timeEnd("Import Core Library");
        }
    },
    progress: function(progress) {
        background(255);
        if(standalone) {
            fill(0);
            textAlign(CENTER); 
            textFont(createFont("monospace"), 15);
            text((progress.completed / progress.total) * 100 + "%", width / 2, height / 2);
        } else {
            console.log("Fetching module " + Object.keys(__requirements__)[progress.completed] + "...");
        }
    }
});

// }
