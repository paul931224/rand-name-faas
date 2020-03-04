["^ ","~:resource-id",["~:shadow.build.classpath/resource","goog/async/run.js"],"~:js","goog.provide(\"goog.async.run\");\ngoog.require(\"goog.async.WorkQueue\");\ngoog.require(\"goog.async.nextTick\");\ngoog.require(\"goog.async.throwException\");\n/** @define {boolean} */ goog.define(\"goog.ASSUME_NATIVE_PROMISE\", false);\n/**\n @param {function(this:THIS)} callback\n @param {THIS=} opt_context\n @template THIS\n */\ngoog.async.run = function(callback, opt_context) {\n  if (!goog.async.run.schedule_) {\n    goog.async.run.initializeRunner_();\n  }\n  if (!goog.async.run.workQueueScheduled_) {\n    goog.async.run.schedule_();\n    goog.async.run.workQueueScheduled_ = true;\n  }\n  goog.async.run.workQueue_.add(callback, opt_context);\n};\n/** @private */ goog.async.run.initializeRunner_ = function() {\n  if (goog.ASSUME_NATIVE_PROMISE || goog.global.Promise && goog.global.Promise.resolve) {\n    var promise = goog.global.Promise.resolve(undefined);\n    goog.async.run.schedule_ = function() {\n      promise.then(goog.async.run.processWorkQueue);\n    };\n  } else {\n    goog.async.run.schedule_ = function() {\n      goog.async.nextTick(goog.async.run.processWorkQueue);\n    };\n  }\n};\n/**\n @param {function(function())=} opt_realSetTimeout\n */\ngoog.async.run.forceNextTick = function(opt_realSetTimeout) {\n  goog.async.run.schedule_ = function() {\n    goog.async.nextTick(goog.async.run.processWorkQueue);\n    if (opt_realSetTimeout) {\n      opt_realSetTimeout(goog.async.run.processWorkQueue);\n    }\n  };\n};\n/** @private @type {function()} */ goog.async.run.schedule_;\n/** @private @type {boolean} */ goog.async.run.workQueueScheduled_ = false;\n/** @private @type {!goog.async.WorkQueue} */ goog.async.run.workQueue_ = new goog.async.WorkQueue;\nif (goog.DEBUG) {\n  goog.async.run.resetQueue = function() {\n    goog.async.run.workQueueScheduled_ = false;\n    goog.async.run.workQueue_ = new goog.async.WorkQueue;\n  };\n}\ngoog.async.run.processWorkQueue = function() {\n  var item = null;\n  while (item = goog.async.run.workQueue_.remove()) {\n    try {\n      item.fn.call(item.scope);\n    } catch (e) {\n      goog.async.throwException(e);\n    }\n    goog.async.run.workQueue_.returnUnused(item);\n  }\n  goog.async.run.workQueueScheduled_ = false;\n};\n","~:source","// Copyright 2013 The Closure Library Authors. All Rights Reserved.\n//\n// Licensed under the Apache License, Version 2.0 (the \"License\");\n// you may not use this file except in compliance with the License.\n// You may obtain a copy of the License at\n//\n//      http://www.apache.org/licenses/LICENSE-2.0\n//\n// Unless required by applicable law or agreed to in writing, software\n// distributed under the License is distributed on an \"AS-IS\" BASIS,\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n// See the License for the specific language governing permissions and\n// limitations under the License.\n\ngoog.provide('goog.async.run');\n\ngoog.require('goog.async.WorkQueue');\ngoog.require('goog.async.nextTick');\ngoog.require('goog.async.throwException');\n\n/**\n * @define {boolean} If true, use the global Promise to implement goog.async.run\n * assuming either the native, or polyfill version will be used. Does still\n * permit tests to use forceNextTick.\n */\ngoog.define('goog.ASSUME_NATIVE_PROMISE', false);\n\n/**\n * Fires the provided callback just before the current callstack unwinds, or as\n * soon as possible after the current JS execution context.\n * @param {function(this:THIS)} callback\n * @param {THIS=} opt_context Object to use as the \"this value\" when calling\n *     the provided function.\n * @template THIS\n */\ngoog.async.run = function(callback, opt_context) {\n  if (!goog.async.run.schedule_) {\n    goog.async.run.initializeRunner_();\n  }\n  if (!goog.async.run.workQueueScheduled_) {\n    // Nothing is currently scheduled, schedule it now.\n    goog.async.run.schedule_();\n    goog.async.run.workQueueScheduled_ = true;\n  }\n\n  goog.async.run.workQueue_.add(callback, opt_context);\n};\n\n\n/**\n * Initializes the function to use to process the work queue.\n * @private\n */\ngoog.async.run.initializeRunner_ = function() {\n  if (goog.ASSUME_NATIVE_PROMISE ||\n      (goog.global.Promise && goog.global.Promise.resolve)) {\n    // Use goog.global.Promise instead of just Promise because the relevant\n    // externs may be missing, and don't alias it because this could confuse the\n    // compiler into thinking the polyfill is required when it should be treated\n    // as optional.\n    var promise = goog.global.Promise.resolve(undefined);\n    goog.async.run.schedule_ = function() {\n      promise.then(goog.async.run.processWorkQueue);\n    };\n  } else {\n    goog.async.run.schedule_ = function() {\n      goog.async.nextTick(goog.async.run.processWorkQueue);\n    };\n  }\n};\n\n\n/**\n * Forces goog.async.run to use nextTick instead of Promise.\n *\n * This should only be done in unit tests. It's useful because MockClock\n * replaces nextTick, but not the browser Promise implementation, so it allows\n * Promise-based code to be tested with MockClock.\n *\n * However, we also want to run promises if the MockClock is no longer in\n * control so we schedule a backup \"setTimeout\" to the unmocked timeout if\n * provided.\n *\n * @param {function(function())=} opt_realSetTimeout\n */\ngoog.async.run.forceNextTick = function(opt_realSetTimeout) {\n  goog.async.run.schedule_ = function() {\n    goog.async.nextTick(goog.async.run.processWorkQueue);\n    if (opt_realSetTimeout) {\n      opt_realSetTimeout(goog.async.run.processWorkQueue);\n    }\n  };\n};\n\n\n/**\n * The function used to schedule work asynchronousely.\n * @private {function()}\n */\ngoog.async.run.schedule_;\n\n\n/** @private {boolean} */\ngoog.async.run.workQueueScheduled_ = false;\n\n\n/** @private {!goog.async.WorkQueue} */\ngoog.async.run.workQueue_ = new goog.async.WorkQueue();\n\n\nif (goog.DEBUG) {\n  /**\n   * Reset the work queue. Only available for tests in debug mode.\n   */\n  goog.async.run.resetQueue = function() {\n    goog.async.run.workQueueScheduled_ = false;\n    goog.async.run.workQueue_ = new goog.async.WorkQueue();\n  };\n}\n\n\n/**\n * Run any pending goog.async.run work items. This function is not intended\n * for general use, but for use by entry point handlers to run items ahead of\n * goog.async.nextTick.\n */\ngoog.async.run.processWorkQueue = function() {\n  // NOTE: additional work queue items may be added while processing.\n  var item = null;\n  while (item = goog.async.run.workQueue_.remove()) {\n    try {\n      item.fn.call(item.scope);\n    } catch (e) {\n      goog.async.throwException(e);\n    }\n    goog.async.run.workQueue_.returnUnused(item);\n  }\n\n  // There are no more work items, allow processing to be scheduled again.\n  goog.async.run.workQueueScheduled_ = false;\n};\n","~:compiled-at",1582904379419,"~:source-map-json","{\n\"version\":3,\n\"file\":\"goog.async.run.js\",\n\"lineCount\":65,\n\"mappings\":\"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\",\n\"sources\":[\"goog/async/run.js\"],\n\"sourcesContent\":[\"// Copyright 2013 The Closure Library Authors. All Rights Reserved.\\n//\\n// Licensed under the Apache License, Version 2.0 (the \\\"License\\\");\\n// you may not use this file except in compliance with the License.\\n// You may obtain a copy of the License at\\n//\\n//      http://www.apache.org/licenses/LICENSE-2.0\\n//\\n// Unless required by applicable law or agreed to in writing, software\\n// distributed under the License is distributed on an \\\"AS-IS\\\" BASIS,\\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\\n// See the License for the specific language governing permissions and\\n// limitations under the License.\\n\\ngoog.provide('goog.async.run');\\n\\ngoog.require('goog.async.WorkQueue');\\ngoog.require('goog.async.nextTick');\\ngoog.require('goog.async.throwException');\\n\\n/**\\n * @define {boolean} If true, use the global Promise to implement goog.async.run\\n * assuming either the native, or polyfill version will be used. Does still\\n * permit tests to use forceNextTick.\\n */\\ngoog.define('goog.ASSUME_NATIVE_PROMISE', false);\\n\\n/**\\n * Fires the provided callback just before the current callstack unwinds, or as\\n * soon as possible after the current JS execution context.\\n * @param {function(this:THIS)} callback\\n * @param {THIS=} opt_context Object to use as the \\\"this value\\\" when calling\\n *     the provided function.\\n * @template THIS\\n */\\ngoog.async.run = function(callback, opt_context) {\\n  if (!goog.async.run.schedule_) {\\n    goog.async.run.initializeRunner_();\\n  }\\n  if (!goog.async.run.workQueueScheduled_) {\\n    // Nothing is currently scheduled, schedule it now.\\n    goog.async.run.schedule_();\\n    goog.async.run.workQueueScheduled_ = true;\\n  }\\n\\n  goog.async.run.workQueue_.add(callback, opt_context);\\n};\\n\\n\\n/**\\n * Initializes the function to use to process the work queue.\\n * @private\\n */\\ngoog.async.run.initializeRunner_ = function() {\\n  if (goog.ASSUME_NATIVE_PROMISE ||\\n      (goog.global.Promise && goog.global.Promise.resolve)) {\\n    // Use goog.global.Promise instead of just Promise because the relevant\\n    // externs may be missing, and don't alias it because this could confuse the\\n    // compiler into thinking the polyfill is required when it should be treated\\n    // as optional.\\n    var promise = goog.global.Promise.resolve(undefined);\\n    goog.async.run.schedule_ = function() {\\n      promise.then(goog.async.run.processWorkQueue);\\n    };\\n  } else {\\n    goog.async.run.schedule_ = function() {\\n      goog.async.nextTick(goog.async.run.processWorkQueue);\\n    };\\n  }\\n};\\n\\n\\n/**\\n * Forces goog.async.run to use nextTick instead of Promise.\\n *\\n * This should only be done in unit tests. It's useful because MockClock\\n * replaces nextTick, but not the browser Promise implementation, so it allows\\n * Promise-based code to be tested with MockClock.\\n *\\n * However, we also want to run promises if the MockClock is no longer in\\n * control so we schedule a backup \\\"setTimeout\\\" to the unmocked timeout if\\n * provided.\\n *\\n * @param {function(function())=} opt_realSetTimeout\\n */\\ngoog.async.run.forceNextTick = function(opt_realSetTimeout) {\\n  goog.async.run.schedule_ = function() {\\n    goog.async.nextTick(goog.async.run.processWorkQueue);\\n    if (opt_realSetTimeout) {\\n      opt_realSetTimeout(goog.async.run.processWorkQueue);\\n    }\\n  };\\n};\\n\\n\\n/**\\n * The function used to schedule work asynchronousely.\\n * @private {function()}\\n */\\ngoog.async.run.schedule_;\\n\\n\\n/** @private {boolean} */\\ngoog.async.run.workQueueScheduled_ = false;\\n\\n\\n/** @private {!goog.async.WorkQueue} */\\ngoog.async.run.workQueue_ = new goog.async.WorkQueue();\\n\\n\\nif (goog.DEBUG) {\\n  /**\\n   * Reset the work queue. Only available for tests in debug mode.\\n   */\\n  goog.async.run.resetQueue = function() {\\n    goog.async.run.workQueueScheduled_ = false;\\n    goog.async.run.workQueue_ = new goog.async.WorkQueue();\\n  };\\n}\\n\\n\\n/**\\n * Run any pending goog.async.run work items. This function is not intended\\n * for general use, but for use by entry point handlers to run items ahead of\\n * goog.async.nextTick.\\n */\\ngoog.async.run.processWorkQueue = function() {\\n  // NOTE: additional work queue items may be added while processing.\\n  var item = null;\\n  while (item = goog.async.run.workQueue_.remove()) {\\n    try {\\n      item.fn.call(item.scope);\\n    } catch (e) {\\n      goog.async.throwException(e);\\n    }\\n    goog.async.run.workQueue_.returnUnused(item);\\n  }\\n\\n  // There are no more work items, allow processing to be scheduled again.\\n  goog.async.run.workQueueScheduled_ = false;\\n};\\n\"],\n\"names\":[\"goog\",\"provide\",\"require\",\"define\",\"async\",\"run\",\"goog.async.run\",\"callback\",\"opt_context\",\"schedule_\",\"initializeRunner_\",\"workQueueScheduled_\",\"workQueue_\",\"add\",\"goog.async.run.initializeRunner_\",\"ASSUME_NATIVE_PROMISE\",\"global\",\"Promise\",\"resolve\",\"promise\",\"undefined\",\"goog.async.run.schedule_\",\"then\",\"processWorkQueue\",\"nextTick\",\"forceNextTick\",\"goog.async.run.forceNextTick\",\"opt_realSetTimeout\",\"WorkQueue\",\"DEBUG\",\"resetQueue\",\"goog.async.run.resetQueue\",\"goog.async.run.processWorkQueue\",\"item\",\"remove\",\"fn\",\"call\",\"scope\",\"e\",\"throwException\",\"returnUnused\"]\n}\n"]