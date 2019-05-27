/** 
 * Original program by Ben Burrill
 * https://www.khanacademy.org/cs/i/5522928629252096
 */

// jshint ignore: start

const NAME = 'Project Samaritan Bootstrap',
    VERSION = '0.0.1',
    AUTHOR = 'Aliquis';

/** Magic variables:
 * __requirements__:
  * An object of requirements to be imported and passed into the second argument
  * of export_module.  See import_multiple for more info on the requirements 
  * object.
 * __environment__:
  * The name of the environment you want to use for importing.  Currently, the 
  * options are 'ka-pjs' and 'js'.  If not given, your environment will be 
  * automatically determined.
 * __bmsmi__:
  * The ID of the module index you wish to use by default.  If not given, it will
  * be set to the module index at 
  * https://www.khanacademy.org/computer-programming/mi/5111168422477824.  All 
  * functions that look things up in a module index also take an optional 
  * argument to override this value.
 *
 **/

// More documentation can be found in each function that is part of BMS

var export_module, importer_context;

var to_event_handlers = function(callback) {
    /** to_event_handlers: defines what a callback is
     * Returns an object of event handlers based on callback, which can be any 
     * of the following:
      * A function, which becomes a 'done' event
      * An object of event handlers, which is returned
      * Or undefined, which is a callback that does not listen to ANY events
     *
     **/
    
    if (!callback) {
        return {};
    } else if (typeof callback === 'function') {
        return {
            done: callback
        };
    }

    return callback;
};

var trigger_event = function(callback, event, this_object, args, default_handler) {
    /** trigger_event: call the handler for a given event
     * Call the handler for `event` on `callback` with the given arguments
     * 
     * arguments:
      * callback <{callback}>:
       * See to_event_handlers
      * event <string>:
       * The event being triggered
      * this_object:
       * The context with which to call the event handler
      * args <array>:
       * The arguments to pass into the event handler
      * default_handler? <function>:
       * Called when `callback` does not listen to `event` events, No-op by 
       * default.
     **/
    return (to_event_handlers(callback)[event] || 
            default_handler || function() {}).apply(this_object, args);
};

var override_callback = function(callback, override) {
    /** override_callback: override events in one callback with another's
     * Create a new callback that overrides the events of `callback` with the
     * events of `override`.
     * 
     * arguments:
      * callback <{callback}>:
       * Base callback
      * override <{callback}>:
       * Overrides
     **/
    var new_handlers = Object.create(to_event_handlers(callback));
    
    var override_handlers = to_event_handlers(override);
    Object.keys(override_handlers).forEach(function(event) {
        new_handlers[event] = override_handlers[event];
    });

    return new_handlers;
};

var DURING_LOAD = 'during-load';
var DURING_IMPORT = 'during-import';
var DURING_UNKNOWN; // undefined

var raise = function(err) {
    // functional version of throw, a good default event handler for fail events
    throw err;
};

var new_abc = function() {
    // Really stupid abc maker, just lets you know when you are 
    // constructing a class which is supposed to be an abc.
    return function() {
        throw {message: 'Cannot create an instance of an abstract base class'};
    };
};

var ModuleLoadError = function(module, event) {
    this.module = module;
    this.event = event;
};
ModuleLoadError.prototype = Object.create(window.Error.prototype);

Object.defineProperty(ModuleLoadError.prototype, 'message', {
    get: function() {
        return 'The module at ' + this.module.source() + ' could not be loaded due to an HTTP or network error';
    }
});

var ModuleNotInIndexError = function(module) {
    this.module = module;
};
ModuleNotInIndexError.prototype = Object.create(window.Error.prototype);

Object.defineProperty(ModuleNotInIndexError.prototype, 'message', {
    get: function() {
        return 'The module \'' + this.module.name + '\' was not defined in the module index at ' + this.module.module_index.source();
    }
});


// BaseModule - defines the OO module interface
var BaseModule = new_abc();

// BaseModule::import(callback) - imports the module asynchronously.
BaseModule.prototype.import = null;

// BaseModule::reload(callback) - clears the module's cache and imports the 
// module asynchronously.
BaseModule.prototype.reload = null;

// BaseModule::source() - Synchronous human-readable representation of where 
// the module came from.
BaseModule.prototype.source = null;

// BaseModule::getpid - Asynchronously get a program id usable in PIDModule.
BaseModule.prototype.getpid = null;
// That alignment!  It's so pretty!

var PIDModule = function(program_id) {
    /** PIDModule: represents a module defined by its program id
     * 
     * arguments:
      * program_id <string>:
       * The program id of the module, see `import_module`
     *
     **/
     
    this.program_id = program_id;
};
PIDModule.prototype = Object.create(BaseModule.prototype);

var import_module;
PIDModule.prototype.import = function(callback) {
    import_module(this.program_id, callback);
};

PIDModule.prototype.reload = function(callback) {
    delete import_module.cache[this.program_id];
    this.import(callback);
};

PIDModule.prototype.source = function(short) {
    return (short ? '#' : 'https://www.khanacademy.org/cs/i/') + this.program_id;
};

PIDModule.prototype.getpid = function(callback) {
    // give it to the callback to properly implement BaseModule
    trigger_event(callback, 'done', null, [this.program_id]);
};


var MODULE_INDEX = '5111168422477824';
var NamedModule = function(name, module_index) {
    /** NamedModule: represents a module named in a BMSMI-style index
     * 
     * arguments:
      * name <string>:
       * The name of the module, see `import_named_module`
      * module_index? <string|BaseModule>:
       * The index this module is defined in.
     **/

    this.name = name;

    if (typeof module_index === 'object') {
        this.module_index = module_index;
    } else {
        this.module_index = new PIDModule(module_index || MODULE_INDEX);
    }
};
NamedModule.prototype = Object.create(BaseModule.prototype);

NamedModule.prototype.import = function(callback) {
    this.getpid(override_callback(callback, function(pid) {
        new PIDModule(pid).import(callback);
    }));
    // import_named_module(this.name, callback, this.module_index);
};

NamedModule.prototype.reload = function(callback) {
    this.module_index.reload(override_callback(callback, function(index) {
        if (this.name in index) {
            delete import_module.cache[index[this.name]];
        }
        
        this.import(callback);
    }.bind(this)));
};

NamedModule.prototype.source = function(short) {
    return this.module_index.source(short) + ' -> ' + this.name;
};

NamedModule.prototype.getpid = function(callback) {
    this.module_index.import(override_callback(callback, function(modules) {
        if (modules[this.name]) {
            return trigger_event(callback, 'done', null, [String(modules[this.name])]);
        }
        
        trigger_event(callback, 'fail', null, [
            new ModuleNotInIndexError(this), 
            DURING_LOAD
        ], raise);
    }.bind(this)));
};


var sandbox = {
    create_sandbox: function(context) {
        // Protect the module from overwriting the globals
        return Object.create(context);
    },
    
    transform: function(code, context) {
        var ast = window.esprima.parse(code);
        window.walkAST(ast, null, [window.ASTTransforms.rewriteContextVariables('module_context', context)]);
        return window.escodegen.generate(ast);
    },

    pre_import: function() {
        // 'Style' also includes the matrix state
        importer_context.pushStyle();
    },

    post_import: function() {
        importer_context.popStyle();
    }
};

// var create_sandbox = function(context) {
//     // Protect the module from overwriting the globals
//     return Object.create(context);
// };
// var transform = function(code, context) {
//     var ast = window.esprima.parse(code);
//     window.walkAST(ast, null, [window.ASTTransforms.rewriteContextVariables('module_context', context)]);
//     return window.escodegen.generate(ast);
// };
// var pre_import = function() {
//     // 'Style' also includes the matrix state
//     importer_context.pushStyle();
// };
// var post_import = function() {
//     importer_context.popStyle();
// };

var import_module = function(program_id, callback) {
    /** import_module: import a BMS module by program id
     * Asynchronously loads a BMS module, running `callback` on success.
     * 
     * arguments:
      * program_id <string>:
       * `program_id` is that number you see at the end of a program url.  For
       * example, the program https://www.khanacademy.org/computer-programming/evaluate/5072407066968064  
       * has the program id '5072407066968064'.  It is recommended that you use
       * a string in case it is possible for the id to start with a 0, but ints
       * work too.
      * callback <{callback}>:
       * In its simplest form a callback is a function which is called when the
       * module loads.  The function's signature depends on how `export_module`
       * is used in the imported module, but typically takes one argument: the
       * module you are importing.  In this case, the name of the parameter
       * should reflect the name of the module you are importing for
       * readability purposes.
       *
       * A callback may also be an event listener object which contains
       * callback functions for events.  Following is a list of events that
       * import_module may trigger:
        * 'done':
         * 'done' events are the same thing that a simple function callback
         * will listen to and take the same arguments.
        * 'fail':
         * 'fail' events which are triggered when the module was not
         * successfully loaded.  'fail' events are called with the following
         * signature: `callback.fail(error, when)`.  `error` describes what
         * went wrong, being either a ModuleLoadError object or an error thrown
         * when the module was run.  `when` describes at what point during the
         * import process the failure occurred.  Possible `when` values can be
         * found in `BMS.during`.
     *
     **/

    var cache = import_module.cache[program_id];
    if (cache) {
        return void trigger_event(callback, 'done', cache.this, cache.arguments);
    }

    // Create a convenient alias for the document object.
    var doc = window[['document']];
    var module_metadata = doc[['createElement']]('script');
    
    // Define a name to temporarily store the callback
    var callback_name = 'BMS_callback_' + program_id;
    doc[callback_name] = function(data) {
        delete doc[callback_name];
        module_metadata.parentNode.removeChild(module_metadata);
        
        var cleanup = _.once(sandbox.post_import.bind(sandbox, sandbox.pre_import()));
        
        // We use our importer_context because the bootstrap is meant to be 
        // used as a pseudo-module, so we need to escape the sandbox we made 
        // for ourselves.
        var context = sandbox.create_sandbox(importer_context);
        context.importer_context = importer_context;
        context.export_module = function() {
            cleanup();

            import_module.cache[program_id] = {
                'this': this,
                'arguments': arguments
            };
            
            return trigger_event(callback, 'done', this, arguments);
        };
        
        // ...and RUN!
        try {
            Object.constructor(
                'module_context', sandbox.transform(data.revision.code, context)
            ).call(context, context);
        } catch(error) {
            trigger_event(callback, 'fail', null, [error, DURING_IMPORT], raise);
        } finally {
            // Even if the module hasn't called export_module yet, cleanup now
            // because we don't know if or when export_module will be called.
            cleanup();
        }
    };

    module_metadata.addEventListener('error', function(event) {
        // TODO: verify this handler picks up all errors we need it to.
        // From tests, I think it does but I'm still not 100% sure.  It only
        // picks up http/network errors, not script errors, but that's not a
        // problem because you should only get a 200 code if you've got some
        // valid jsonp.  There may be some browser differences though, I'll
        // want to look into this a bit more.
        
        delete doc[callback_name];
        module_metadata.parentNode.removeChild(module_metadata);
        
        trigger_event(callback, 'fail', null, [
            new ModuleLoadError(new PIDModule(program_id), event), DURING_LOAD
        ], raise);
    });

    module_metadata.setAttribute('src',
        'https://www.khanacademy.org/api/labs/scratchpads/' + program_id +

        // JSONP stuff.  We use document instead of window directly because
        // window is non-extensible in some browsers in the KA PJS environment.
        '?callback=document.' + callback_name
    );
    
    doc.head.appendChild(module_metadata);
};

import_module.cache = {};

// I think this is redundant with cached_bootstrapper:
// // Includes invalid variable name characters so that it shouldn't possibly
// // interfere with anyone's code.
// var cache_key = '@@BMS_MODULE_CACHE@@';

// // Has the global cache been set in the past?
// if (importer_context && !(cache_key in importer_context)) {
//     try {
//         importer_context[cache_key] = {};
//     } catch(e) {
//         // We'll handle this later, so it can be safely ignored here.
//     }
// }

// // Is the global cache set now?
// if (importer_context && (cache_key in importer_context)) {
//     Object.defineProperty(import_module, 'cache', {
//         'get': function() {
//             return importer_context[cache_key];
//         },
        
//         'set': function(new_cache) {
//             importer_context[cache_key] = new_cache;
//         }
//     });
// } else {
//     // The global cache cannot be set, use a local version instead.
//     import_module.cache = {};
// }

var import_named_module = function(name, callback, module_index) {
    /** import_named_module: import a module from a BMSMI-style index
     * A BMSMI-style index is a BMS module that consists of an object that maps
     * a module name to an index.  This function imports a module by name from
     * a module index.
     *
     * arguments:
      * name <string>:
       * The module name being looked up
      * callback <{callback}>:
       * See `import_module` for more information.  Note that error events may
       * receive a ModuleNotInIndexError during load if module_index does not
       * contain the requested module name.
      * module_index? <string|BaseModule>:
       * The BMSMI-style index module used to look up the requested module
       * name.  By default this is the index at 
       * https://www.khanacademy.org/computer-programming/bmsmi/4834075599
     *
     **/
    
    return new NamedModule(name, module_index).import(callback);
};


var module_from_short_name = function(short_name, default_module_index) {
    /** module_from_short_name: 
     * A convenient syntax for creating BaseModule objects.  There are 2 basic ways to define a module:
      * '#{id}', example '#34934312': defines a module by ID
      * '{name}', example 'iter': defines a module by name in `default_module_index`
     * In addition, modules can be chained with '->' to represent module index
     * lookups, for example '#4242 -> potato-index -> actual-module' looks up a
     * module called potato-index inside #4242, then looks up actual-module
     * inside that index.
     *
     * arguments:
      * short_name <string>:
       * See above for a description of the short name syntax.
      * default_module_index? <string|BaseModule>:
       * Default module index to use when no module id is indicated by `short_name`
     *
     **/
    var module;
    var parts = short_name.split('->').map(function(part) {
        // Allow some flexibility with whitespace.
        return part.trim();
    });

    if (parts[0][0] === '#') {
        module = new PIDModule(parts[0].slice(1));
        
        if (parts.length === 1) {
            return module;
        }
    } else {
        module = new NamedModule(parts[0], default_module_index);
    }
    
    parts.slice(1).forEach(function(next_stop) {
        module = new NamedModule(next_stop, module);
    });

    return module;
};

var KV_KEY = 0, KV_VALUE = 1;
var kvpairs = function(obj) {
    return Object.keys(obj).map(function(key) {
        return [key, obj[key]];
    });
};

var _import_multiple = function(requirements, into, callback, default_module_index, module_count) {
    // Recursive helper for import_module
    // Note: mutates `requirements` and `into`
    
    if (!requirements.length) {
        return void trigger_event(callback, 'done', null, [into]);
    }
    
    if (module_count === undefined) {
        module_count = requirements.length;
    }

    var completed = module_count - requirements.length;
    
    var kv = requirements.shift();
    
    var module = kv[KV_VALUE];
    if (typeof module === 'string') {
        module = module_from_short_name(module, default_module_index);
    }
    
    trigger_event(callback, 'progress', null, [{
        completed: completed,
        total: module_count,
        current: module
    }]);

    module.import(override_callback(callback, function(module) {
        into[kv[KV_KEY]] = module;
        _import_multiple(requirements, into, callback, default_module_index, module_count);
    }));
};

var import_multiple = function(requirements, callback, default_module_index) {
    /** import_multiple: import many modules at once
     * Somewhat alleviates callback hell, giving you an object of requested
     * modules through a single callback.
     *
     * arguments:
      * requirements <object:<string|BaseModule>>:
       * Maps module names to a representation of the module, either a short
       * name as defined in `module_from_short_name` or an object implementing
       * the BaseModule interface.
      * callback <{callback}>:
       * Similar to the callbacks found in import_module and
       * import_named_module.  This callback's 'done' event (or the callback
       * itself if it is a function) has one argument which will be an object
       * with the same keys as requirements, but with modules instead of module
       * representations as values.
       * 
       * `callback` will listen to any other events that are triggered by
       * importing the modules.
       *
       * In addition, callback will listen to the 'progress' event which has
       * one argument, an object representing how much progress has been made
       * in importing all the modules.  This object has `completed` and `total`
       * properties which are the number of modules that have been imported so
       * far and the number in total respectively.  It also has a `current`
       * property which is an instance of BaseModule.
      * default_module_index? <string|BaseModule>:
       * The default module index to use for string representations of modules.
     *
     **/

    return _import_multiple(kvpairs(requirements), {}, callback, default_module_index);
};

var to_camel = function(snake_case_name) {
    // Converts a snake_case name to a camelCase name
    
    // We match a 'before' character so that _example_name doesn't become
    // ExampleName -- it should be _exampleName
    return snake_case_name.replace(/([a-zA-Z0-9\$])_([a-zA-Z0-9\$])/g, function(match, before, after) {
        return before + after.toUpperCase();
    });
};

var camelify_obj = function(obj) {
    // Creates camelCase references to all properties in an object
    // Note: mutates `obj`
    
    Object.keys(obj).forEach(function(key) {
        var cameled_key = to_camel(key);
        if (!(cameled_key in obj)) { // don't overwrite existing camel-case names
            obj[cameled_key] = obj[key];
        }
    });
    return obj;
};


if (export_module) {
    var BMS = camelify_obj({
        'import_module': import_module,
        'import_named_module': import_named_module,
        'import_multiple': import_multiple,
        'module_from_short_name': module_from_short_name,
        'cached_bootstrapper': function(callback) {
            // This is a function compatible with the normal
            // bootstrapper, but uses this version of BMS instead of
            // importing a new one.  This is faster, and will also 
            // make other imports faster because import_module.cache
            // will be shared.
            trigger_event(callback, 'done', null, [BMS]);
        },
        'types': {
            // Direct access to the OO API
            'BaseModule': BaseModule,
            'PIDModule': PIDModule,
            'NamedModule': NamedModule
        },
        'errors': {
            'ModuleLoadError': ModuleLoadError,
            'ModuleNotInIndexError': ModuleNotInIndexError
        },
        'during': {
            'LOAD': DURING_LOAD,
            'IMPORT': DURING_IMPORT,
            'UNKNOWN': DURING_UNKNOWN
        },
        'event': camelify_obj({
            // Expose the api for dealing wih bms-style event handlers
            'to_event_handlers': to_event_handlers,
            'trigger_event': trigger_event,
            'override_callback': override_callback
        })
    });
    
    if (!importer_context.__bmslib__) {
        try {
            importer_context.__bmslib__ = BMS;
        } catch(e) {
            // Failures here don't matter
        }
    }
    
    var reqs = importer_context.__requirements__;
    if (reqs) {
        import_multiple(reqs, override_callback(export_module, function(modules) {
            return trigger_event(export_module, 'done', null, [BMS, modules]);
        }));
    } else {
        // Deal with callbacks of all kinds
        trigger_event(export_module, 'done', null, [BMS]);
    }
}

if(!importer_context) {
    background(255);
    fill(0);
    textAlign(CENTER);
    textFont(createFont('monospace'), 15);
    text(NAME + '\nVersion ' + VERSION, width / 2, height / 2);
}
