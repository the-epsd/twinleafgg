import {
  Directive,
  ElementRef,
  Inject,
  Injectable,
  InjectionToken,
  Input,
  NgModule,
  NgZone,
  setClassMetadata,
  ɵɵInheritDefinitionFeature,
  ɵɵNgOnChangesFeature,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵgetInheritedFactory,
  ɵɵinject
} from "./chunk-JWP5VVKN.js";
import {
  BehaviorSubject,
  ReplaySubject,
  Subscriber,
  Subscription,
  distinctUntilChanged,
  map,
  switchMap,
  take
} from "./chunk-Q3Q6CVA2.js";

// node_modules/redux/es/redux.js
var $$observable = function() {
  return typeof Symbol === "function" && Symbol.observable || "@@observable";
}();
var randomString = function randomString2() {
  return Math.random().toString(36).substring(7).split("").join(".");
};
var ActionTypes = {
  INIT: "@@redux/INIT" + randomString(),
  REPLACE: "@@redux/REPLACE" + randomString(),
  PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
    return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
  }
};
function isPlainObject(obj) {
  if (typeof obj !== "object" || obj === null) return false;
  var proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(obj) === proto;
}
function miniKindOf(val) {
  if (val === void 0) return "undefined";
  if (val === null) return "null";
  var type = typeof val;
  switch (type) {
    case "boolean":
    case "string":
    case "number":
    case "symbol":
    case "function": {
      return type;
    }
  }
  if (Array.isArray(val)) return "array";
  if (isDate(val)) return "date";
  if (isError(val)) return "error";
  var constructorName = ctorName(val);
  switch (constructorName) {
    case "Symbol":
    case "Promise":
    case "WeakMap":
    case "WeakSet":
    case "Map":
    case "Set":
      return constructorName;
  }
  return type.slice(8, -1).toLowerCase().replace(/\s/g, "");
}
function ctorName(val) {
  return typeof val.constructor === "function" ? val.constructor.name : null;
}
function isError(val) {
  return val instanceof Error || typeof val.message === "string" && val.constructor && typeof val.constructor.stackTraceLimit === "number";
}
function isDate(val) {
  if (val instanceof Date) return true;
  return typeof val.toDateString === "function" && typeof val.getDate === "function" && typeof val.setDate === "function";
}
function kindOf(val) {
  var typeOfVal = typeof val;
  if (true) {
    typeOfVal = miniKindOf(val);
  }
  return typeOfVal;
}
function createStore(reducer, preloadedState, enhancer) {
  var _ref2;
  if (typeof preloadedState === "function" && typeof enhancer === "function" || typeof enhancer === "function" && typeof arguments[3] === "function") {
    throw new Error(false ? formatProdErrorMessage(0) : "It looks like you are passing several store enhancers to createStore(). This is not supported. Instead, compose them together to a single function. See https://redux.js.org/tutorials/fundamentals/part-4-store#creating-a-store-with-enhancers for an example.");
  }
  if (typeof preloadedState === "function" && typeof enhancer === "undefined") {
    enhancer = preloadedState;
    preloadedState = void 0;
  }
  if (typeof enhancer !== "undefined") {
    if (typeof enhancer !== "function") {
      throw new Error(false ? formatProdErrorMessage(1) : "Expected the enhancer to be a function. Instead, received: '" + kindOf(enhancer) + "'");
    }
    return enhancer(createStore)(reducer, preloadedState);
  }
  if (typeof reducer !== "function") {
    throw new Error(false ? formatProdErrorMessage(2) : "Expected the root reducer to be a function. Instead, received: '" + kindOf(reducer) + "'");
  }
  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;
  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }
  function getState() {
    if (isDispatching) {
      throw new Error(false ? formatProdErrorMessage(3) : "You may not call store.getState() while the reducer is executing. The reducer has already received the state as an argument. Pass it down from the top reducer instead of reading it from the store.");
    }
    return currentState;
  }
  function subscribe(listener) {
    if (typeof listener !== "function") {
      throw new Error(false ? formatProdErrorMessage(4) : "Expected the listener to be a function. Instead, received: '" + kindOf(listener) + "'");
    }
    if (isDispatching) {
      throw new Error(false ? formatProdErrorMessage(5) : "You may not call store.subscribe() while the reducer is executing. If you would like to be notified after the store has been updated, subscribe from a component and invoke store.getState() in the callback to access the latest state. See https://redux.js.org/api/store#subscribelistener for more details.");
    }
    var isSubscribed = true;
    ensureCanMutateNextListeners();
    nextListeners.push(listener);
    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }
      if (isDispatching) {
        throw new Error(false ? formatProdErrorMessage(6) : "You may not unsubscribe from a store listener while the reducer is executing. See https://redux.js.org/api/store#subscribelistener for more details.");
      }
      isSubscribed = false;
      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
      currentListeners = null;
    };
  }
  function dispatch(action) {
    if (!isPlainObject(action)) {
      throw new Error(false ? formatProdErrorMessage(7) : "Actions must be plain objects. Instead, the actual type was: '" + kindOf(action) + "'. You may need to add middleware to your store setup to handle dispatching other values, such as 'redux-thunk' to handle dispatching functions. See https://redux.js.org/tutorials/fundamentals/part-4-store#middleware and https://redux.js.org/tutorials/fundamentals/part-6-async-logic#using-the-redux-thunk-middleware for examples.");
    }
    if (typeof action.type === "undefined") {
      throw new Error(false ? formatProdErrorMessage(8) : 'Actions may not have an undefined "type" property. You may have misspelled an action type string constant.');
    }
    if (isDispatching) {
      throw new Error(false ? formatProdErrorMessage(9) : "Reducers may not dispatch actions.");
    }
    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }
    var listeners = currentListeners = nextListeners;
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }
    return action;
  }
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== "function") {
      throw new Error(false ? formatProdErrorMessage(10) : "Expected the nextReducer to be a function. Instead, received: '" + kindOf(nextReducer));
    }
    currentReducer = nextReducer;
    dispatch({
      type: ActionTypes.REPLACE
    });
  }
  function observable() {
    var _ref;
    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe2(observer) {
        if (typeof observer !== "object" || observer === null) {
          throw new Error(false ? formatProdErrorMessage(11) : "Expected the observer to be an object. Instead, received: '" + kindOf(observer) + "'");
        }
        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }
        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return {
          unsubscribe
        };
      }
    }, _ref[$$observable] = function() {
      return this;
    }, _ref;
  }
  dispatch({
    type: ActionTypes.INIT
  });
  return _ref2 = {
    dispatch,
    subscribe,
    getState,
    replaceReducer
  }, _ref2[$$observable] = observable, _ref2;
}

// node_modules/@react-dnd/invariant/dist/index.js
function invariant(condition, format, ...args) {
  if (isProduction()) {
    if (format === void 0) {
      throw new Error("invariant requires an error message argument");
    }
  }
  if (!condition) {
    let error;
    if (format === void 0) {
      error = new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");
    } else {
      let argIndex = 0;
      error = new Error(format.replace(/%s/g, function() {
        return args[argIndex++];
      }));
      error.name = "Invariant Violation";
    }
    error.framesToPop = 1;
    throw error;
  }
}
function isProduction() {
  return typeof process !== "undefined" && false;
}

// node_modules/dnd-core/dist/utils/js_utils.js
function get(obj, path, defaultValue) {
  return path.split(".").reduce(
    (a, c) => a && a[c] ? a[c] : defaultValue || null,
    obj
  );
}
function without(items, item) {
  return items.filter(
    (i) => i !== item
  );
}
function isObject(input) {
  return typeof input === "object";
}
function xor(itemsA, itemsB) {
  const map2 = /* @__PURE__ */ new Map();
  const insertItem = (item) => {
    map2.set(item, map2.has(item) ? map2.get(item) + 1 : 1);
  };
  itemsA.forEach(insertItem);
  itemsB.forEach(insertItem);
  const result = [];
  map2.forEach((count, key) => {
    if (count === 1) {
      result.push(key);
    }
  });
  return result;
}
function intersection(itemsA, itemsB) {
  return itemsA.filter(
    (t) => itemsB.indexOf(t) > -1
  );
}

// node_modules/dnd-core/dist/actions/dragDrop/types.js
var INIT_COORDS = "dnd-core/INIT_COORDS";
var BEGIN_DRAG = "dnd-core/BEGIN_DRAG";
var PUBLISH_DRAG_SOURCE = "dnd-core/PUBLISH_DRAG_SOURCE";
var HOVER = "dnd-core/HOVER";
var DROP = "dnd-core/DROP";
var END_DRAG = "dnd-core/END_DRAG";

// node_modules/dnd-core/dist/actions/dragDrop/local/setClientOffset.js
function setClientOffset(clientOffset, sourceClientOffset) {
  return {
    type: INIT_COORDS,
    payload: {
      sourceClientOffset: sourceClientOffset || null,
      clientOffset: clientOffset || null
    }
  };
}

// node_modules/dnd-core/dist/actions/dragDrop/beginDrag.js
var ResetCoordinatesAction = {
  type: INIT_COORDS,
  payload: {
    clientOffset: null,
    sourceClientOffset: null
  }
};
function createBeginDrag(manager) {
  return function beginDrag(sourceIds = [], options = {
    publishSource: true
  }) {
    const { publishSource = true, clientOffset, getSourceClientOffset: getSourceClientOffset2 } = options;
    const monitor = manager.getMonitor();
    const registry = manager.getRegistry();
    manager.dispatch(setClientOffset(clientOffset));
    verifyInvariants(sourceIds, monitor, registry);
    const sourceId = getDraggableSource(sourceIds, monitor);
    if (sourceId == null) {
      manager.dispatch(ResetCoordinatesAction);
      return;
    }
    let sourceClientOffset = null;
    if (clientOffset) {
      if (!getSourceClientOffset2) {
        throw new Error("getSourceClientOffset must be defined");
      }
      verifyGetSourceClientOffsetIsFunction(getSourceClientOffset2);
      sourceClientOffset = getSourceClientOffset2(sourceId);
    }
    manager.dispatch(setClientOffset(clientOffset, sourceClientOffset));
    const source = registry.getSource(sourceId);
    const item = source.beginDrag(monitor, sourceId);
    if (item == null) {
      return void 0;
    }
    verifyItemIsObject(item);
    registry.pinSource(sourceId);
    const itemType = registry.getSourceType(sourceId);
    return {
      type: BEGIN_DRAG,
      payload: {
        itemType,
        item,
        sourceId,
        clientOffset: clientOffset || null,
        sourceClientOffset: sourceClientOffset || null,
        isSourcePublic: !!publishSource
      }
    };
  };
}
function verifyInvariants(sourceIds, monitor, registry) {
  invariant(!monitor.isDragging(), "Cannot call beginDrag while dragging.");
  sourceIds.forEach(function(sourceId) {
    invariant(registry.getSource(sourceId), "Expected sourceIds to be registered.");
  });
}
function verifyGetSourceClientOffsetIsFunction(getSourceClientOffset2) {
  invariant(typeof getSourceClientOffset2 === "function", "When clientOffset is provided, getSourceClientOffset must be a function.");
}
function verifyItemIsObject(item) {
  invariant(isObject(item), "Item must be an object.");
}
function getDraggableSource(sourceIds, monitor) {
  let sourceId = null;
  for (let i = sourceIds.length - 1; i >= 0; i--) {
    if (monitor.canDragSource(sourceIds[i])) {
      sourceId = sourceIds[i];
      break;
    }
  }
  return sourceId;
}

// node_modules/dnd-core/dist/actions/dragDrop/drop.js
function _defineProperty2(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);
    if (typeof Object.getOwnPropertySymbols === "function") {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }
    ownKeys.forEach(function(key) {
      _defineProperty2(target, key, source[key]);
    });
  }
  return target;
}
function createDrop(manager) {
  return function drop(options = {}) {
    const monitor = manager.getMonitor();
    const registry = manager.getRegistry();
    verifyInvariants2(monitor);
    const targetIds = getDroppableTargets(monitor);
    targetIds.forEach((targetId, index) => {
      const dropResult = determineDropResult(targetId, index, registry, monitor);
      const action = {
        type: DROP,
        payload: {
          dropResult: _objectSpread({}, options, dropResult)
        }
      };
      manager.dispatch(action);
    });
  };
}
function verifyInvariants2(monitor) {
  invariant(monitor.isDragging(), "Cannot call drop while not dragging.");
  invariant(!monitor.didDrop(), "Cannot call drop twice during one drag operation.");
}
function determineDropResult(targetId, index, registry, monitor) {
  const target = registry.getTarget(targetId);
  let dropResult = target ? target.drop(monitor, targetId) : void 0;
  verifyDropResultType(dropResult);
  if (typeof dropResult === "undefined") {
    dropResult = index === 0 ? {} : monitor.getDropResult();
  }
  return dropResult;
}
function verifyDropResultType(dropResult) {
  invariant(typeof dropResult === "undefined" || isObject(dropResult), "Drop result must either be an object or undefined.");
}
function getDroppableTargets(monitor) {
  const targetIds = monitor.getTargetIds().filter(monitor.canDropOnTarget, monitor);
  targetIds.reverse();
  return targetIds;
}

// node_modules/dnd-core/dist/actions/dragDrop/endDrag.js
function createEndDrag(manager) {
  return function endDrag() {
    const monitor = manager.getMonitor();
    const registry = manager.getRegistry();
    verifyIsDragging(monitor);
    const sourceId = monitor.getSourceId();
    if (sourceId != null) {
      const source = registry.getSource(sourceId, true);
      source.endDrag(monitor, sourceId);
      registry.unpinSource();
    }
    return {
      type: END_DRAG
    };
  };
}
function verifyIsDragging(monitor) {
  invariant(monitor.isDragging(), "Cannot call endDrag while not dragging.");
}

// node_modules/dnd-core/dist/utils/matchesType.js
function matchesType(targetType, draggedItemType) {
  if (draggedItemType === null) {
    return targetType === null;
  }
  return Array.isArray(targetType) ? targetType.some(
    (t) => t === draggedItemType
  ) : targetType === draggedItemType;
}

// node_modules/dnd-core/dist/actions/dragDrop/hover.js
function createHover(manager) {
  return function hover(targetIdsArg, { clientOffset } = {}) {
    verifyTargetIdsIsArray(targetIdsArg);
    const targetIds = targetIdsArg.slice(0);
    const monitor = manager.getMonitor();
    const registry = manager.getRegistry();
    const draggedItemType = monitor.getItemType();
    removeNonMatchingTargetIds(targetIds, registry, draggedItemType);
    checkInvariants(targetIds, monitor, registry);
    hoverAllTargets(targetIds, monitor, registry);
    return {
      type: HOVER,
      payload: {
        targetIds,
        clientOffset: clientOffset || null
      }
    };
  };
}
function verifyTargetIdsIsArray(targetIdsArg) {
  invariant(Array.isArray(targetIdsArg), "Expected targetIds to be an array.");
}
function checkInvariants(targetIds, monitor, registry) {
  invariant(monitor.isDragging(), "Cannot call hover while not dragging.");
  invariant(!monitor.didDrop(), "Cannot call hover after drop.");
  for (let i = 0; i < targetIds.length; i++) {
    const targetId = targetIds[i];
    invariant(targetIds.lastIndexOf(targetId) === i, "Expected targetIds to be unique in the passed array.");
    const target = registry.getTarget(targetId);
    invariant(target, "Expected targetIds to be registered.");
  }
}
function removeNonMatchingTargetIds(targetIds, registry, draggedItemType) {
  for (let i = targetIds.length - 1; i >= 0; i--) {
    const targetId = targetIds[i];
    const targetType = registry.getTargetType(targetId);
    if (!matchesType(targetType, draggedItemType)) {
      targetIds.splice(i, 1);
    }
  }
}
function hoverAllTargets(targetIds, monitor, registry) {
  targetIds.forEach(function(targetId) {
    const target = registry.getTarget(targetId);
    target.hover(monitor, targetId);
  });
}

// node_modules/dnd-core/dist/actions/dragDrop/publishDragSource.js
function createPublishDragSource(manager) {
  return function publishDragSource() {
    const monitor = manager.getMonitor();
    if (monitor.isDragging()) {
      return {
        type: PUBLISH_DRAG_SOURCE
      };
    }
    return;
  };
}

// node_modules/dnd-core/dist/actions/dragDrop/index.js
function createDragDropActions(manager) {
  return {
    beginDrag: createBeginDrag(manager),
    publishDragSource: createPublishDragSource(manager),
    hover: createHover(manager),
    drop: createDrop(manager),
    endDrag: createEndDrag(manager)
  };
}

// node_modules/dnd-core/dist/classes/DragDropManagerImpl.js
var DragDropManagerImpl = class {
  receiveBackend(backend) {
    this.backend = backend;
  }
  getMonitor() {
    return this.monitor;
  }
  getBackend() {
    return this.backend;
  }
  getRegistry() {
    return this.monitor.registry;
  }
  getActions() {
    const manager = this;
    const { dispatch } = this.store;
    function bindActionCreator(actionCreator) {
      return (...args) => {
        const action = actionCreator.apply(manager, args);
        if (typeof action !== "undefined") {
          dispatch(action);
        }
      };
    }
    const actions = createDragDropActions(this);
    return Object.keys(actions).reduce((boundActions, key) => {
      const action = actions[key];
      boundActions[key] = bindActionCreator(action);
      return boundActions;
    }, {});
  }
  dispatch(action) {
    this.store.dispatch(action);
  }
  constructor(store, monitor) {
    this.isSetUp = false;
    this.handleRefCountChange = () => {
      const shouldSetUp = this.store.getState().refCount > 0;
      if (this.backend) {
        if (shouldSetUp && !this.isSetUp) {
          this.backend.setup();
          this.isSetUp = true;
        } else if (!shouldSetUp && this.isSetUp) {
          this.backend.teardown();
          this.isSetUp = false;
        }
      }
    };
    this.store = store;
    this.monitor = monitor;
    store.subscribe(this.handleRefCountChange);
  }
};

// node_modules/dnd-core/dist/utils/coords.js
function add(a, b) {
  return {
    x: a.x + b.x,
    y: a.y + b.y
  };
}
function subtract(a, b) {
  return {
    x: a.x - b.x,
    y: a.y - b.y
  };
}
function getSourceClientOffset(state) {
  const { clientOffset, initialClientOffset, initialSourceClientOffset } = state;
  if (!clientOffset || !initialClientOffset || !initialSourceClientOffset) {
    return null;
  }
  return subtract(add(clientOffset, initialSourceClientOffset), initialClientOffset);
}
function getDifferenceFromInitialOffset(state) {
  const { clientOffset, initialClientOffset } = state;
  if (!clientOffset || !initialClientOffset) {
    return null;
  }
  return subtract(clientOffset, initialClientOffset);
}

// node_modules/dnd-core/dist/utils/dirtiness.js
var NONE = [];
var ALL = [];
NONE.__IS_NONE__ = true;
ALL.__IS_ALL__ = true;
function areDirty(dirtyIds, handlerIds) {
  if (dirtyIds === NONE) {
    return false;
  }
  if (dirtyIds === ALL || typeof handlerIds === "undefined") {
    return true;
  }
  const commonIds = intersection(handlerIds, dirtyIds);
  return commonIds.length > 0;
}

// node_modules/dnd-core/dist/classes/DragDropMonitorImpl.js
var DragDropMonitorImpl = class {
  subscribeToStateChange(listener, options = {}) {
    const { handlerIds } = options;
    invariant(typeof listener === "function", "listener must be a function.");
    invariant(typeof handlerIds === "undefined" || Array.isArray(handlerIds), "handlerIds, when specified, must be an array of strings.");
    let prevStateId = this.store.getState().stateId;
    const handleChange = () => {
      const state = this.store.getState();
      const currentStateId = state.stateId;
      try {
        const canSkipListener = currentStateId === prevStateId || currentStateId === prevStateId + 1 && !areDirty(state.dirtyHandlerIds, handlerIds);
        if (!canSkipListener) {
          listener();
        }
      } finally {
        prevStateId = currentStateId;
      }
    };
    return this.store.subscribe(handleChange);
  }
  subscribeToOffsetChange(listener) {
    invariant(typeof listener === "function", "listener must be a function.");
    let previousState = this.store.getState().dragOffset;
    const handleChange = () => {
      const nextState = this.store.getState().dragOffset;
      if (nextState === previousState) {
        return;
      }
      previousState = nextState;
      listener();
    };
    return this.store.subscribe(handleChange);
  }
  canDragSource(sourceId) {
    if (!sourceId) {
      return false;
    }
    const source = this.registry.getSource(sourceId);
    invariant(source, `Expected to find a valid source. sourceId=${sourceId}`);
    if (this.isDragging()) {
      return false;
    }
    return source.canDrag(this, sourceId);
  }
  canDropOnTarget(targetId) {
    if (!targetId) {
      return false;
    }
    const target = this.registry.getTarget(targetId);
    invariant(target, `Expected to find a valid target. targetId=${targetId}`);
    if (!this.isDragging() || this.didDrop()) {
      return false;
    }
    const targetType = this.registry.getTargetType(targetId);
    const draggedItemType = this.getItemType();
    return matchesType(targetType, draggedItemType) && target.canDrop(this, targetId);
  }
  isDragging() {
    return Boolean(this.getItemType());
  }
  isDraggingSource(sourceId) {
    if (!sourceId) {
      return false;
    }
    const source = this.registry.getSource(sourceId, true);
    invariant(source, `Expected to find a valid source. sourceId=${sourceId}`);
    if (!this.isDragging() || !this.isSourcePublic()) {
      return false;
    }
    const sourceType = this.registry.getSourceType(sourceId);
    const draggedItemType = this.getItemType();
    if (sourceType !== draggedItemType) {
      return false;
    }
    return source.isDragging(this, sourceId);
  }
  isOverTarget(targetId, options = {
    shallow: false
  }) {
    if (!targetId) {
      return false;
    }
    const { shallow } = options;
    if (!this.isDragging()) {
      return false;
    }
    const targetType = this.registry.getTargetType(targetId);
    const draggedItemType = this.getItemType();
    if (draggedItemType && !matchesType(targetType, draggedItemType)) {
      return false;
    }
    const targetIds = this.getTargetIds();
    if (!targetIds.length) {
      return false;
    }
    const index = targetIds.indexOf(targetId);
    if (shallow) {
      return index === targetIds.length - 1;
    } else {
      return index > -1;
    }
  }
  getItemType() {
    return this.store.getState().dragOperation.itemType;
  }
  getItem() {
    return this.store.getState().dragOperation.item;
  }
  getSourceId() {
    return this.store.getState().dragOperation.sourceId;
  }
  getTargetIds() {
    return this.store.getState().dragOperation.targetIds;
  }
  getDropResult() {
    return this.store.getState().dragOperation.dropResult;
  }
  didDrop() {
    return this.store.getState().dragOperation.didDrop;
  }
  isSourcePublic() {
    return Boolean(this.store.getState().dragOperation.isSourcePublic);
  }
  getInitialClientOffset() {
    return this.store.getState().dragOffset.initialClientOffset;
  }
  getInitialSourceClientOffset() {
    return this.store.getState().dragOffset.initialSourceClientOffset;
  }
  getClientOffset() {
    return this.store.getState().dragOffset.clientOffset;
  }
  getSourceClientOffset() {
    return getSourceClientOffset(this.store.getState().dragOffset);
  }
  getDifferenceFromInitialOffset() {
    return getDifferenceFromInitialOffset(this.store.getState().dragOffset);
  }
  constructor(store, registry) {
    this.store = store;
    this.registry = registry;
  }
};

// node_modules/dnd-core/node_modules/@react-dnd/asap/dist/makeRequestCall.js
var scope = typeof global !== "undefined" ? global : self;
var BrowserMutationObserver = scope.MutationObserver || scope.WebKitMutationObserver;
function makeRequestCallFromTimer(callback) {
  return function requestCall() {
    const timeoutHandle = setTimeout(handleTimer, 0);
    const intervalHandle = setInterval(handleTimer, 50);
    function handleTimer() {
      clearTimeout(timeoutHandle);
      clearInterval(intervalHandle);
      callback();
    }
  };
}
function makeRequestCallFromMutationObserver(callback) {
  let toggle = 1;
  const observer = new BrowserMutationObserver(callback);
  const node = document.createTextNode("");
  observer.observe(node, {
    characterData: true
  });
  return function requestCall() {
    toggle = -toggle;
    node.data = toggle;
  };
}
var makeRequestCall = typeof BrowserMutationObserver === "function" ? (
  // reliably everywhere they are implemented.
  // They are implemented in all modern browsers.
  //
  // - Android 4-4.3
  // - Chrome 26-34
  // - Firefox 14-29
  // - Internet Explorer 11
  // - iPad Safari 6-7.1
  // - iPhone Safari 7-7.1
  // - Safari 6-7
  makeRequestCallFromMutationObserver
) : (
  // task queue, are implemented in Internet Explorer 10, Safari 5.0-1, and Opera
  // 11-12, and in web workers in many engines.
  // Although message channels yield to any queued rendering and IO tasks, they
  // would be better than imposing the 4ms delay of timers.
  // However, they do not work reliably in Internet Explorer or Safari.
  // Internet Explorer 10 is the only browser that has setImmediate but does
  // not have MutationObservers.
  // Although setImmediate yields to the browser's renderer, it would be
  // preferrable to falling back to setTimeout since it does not have
  // the minimum 4ms penalty.
  // Unfortunately there appears to be a bug in Internet Explorer 10 Mobile (and
  // Desktop to a lesser extent) that renders both setImmediate and
  // MessageChannel useless for the purposes of ASAP.
  // https://github.com/kriskowal/q/issues/396
  // Timers are implemented universally.
  // We fall back to timers in workers in most engines, and in foreground
  // contexts in the following browsers.
  // However, note that even this simple case requires nuances to operate in a
  // broad spectrum of browsers.
  //
  // - Firefox 3-13
  // - Internet Explorer 6-9
  // - iPad Safari 4.3
  // - Lynx 2.8.7
  makeRequestCallFromTimer
);

// node_modules/dnd-core/node_modules/@react-dnd/asap/dist/AsapQueue.js
var AsapQueue = class {
  // Use the fastest means possible to execute a task in its own turn, with
  // priority over other events including IO, animation, reflow, and redraw
  // events in browsers.
  //
  // An exception thrown by a task will permanently interrupt the processing of
  // subsequent tasks. The higher level `asap` function ensures that if an
  // exception is thrown by a task, that the task queue will continue flushing as
  // soon as possible, but if you use `rawAsap` directly, you are responsible to
  // either ensure that no exceptions are thrown from your task, or to manually
  // call `rawAsap.requestFlush` if an exception is thrown.
  enqueueTask(task) {
    const { queue: q, requestFlush } = this;
    if (!q.length) {
      requestFlush();
      this.flushing = true;
    }
    q[q.length] = task;
  }
  constructor() {
    this.queue = [];
    this.pendingErrors = [];
    this.flushing = false;
    this.index = 0;
    this.capacity = 1024;
    this.flush = () => {
      const { queue: q } = this;
      while (this.index < q.length) {
        const currentIndex = this.index;
        this.index++;
        q[currentIndex].call();
        if (this.index > this.capacity) {
          for (let scan = 0, newLength = q.length - this.index; scan < newLength; scan++) {
            q[scan] = q[scan + this.index];
          }
          q.length -= this.index;
          this.index = 0;
        }
      }
      q.length = 0;
      this.index = 0;
      this.flushing = false;
    };
    this.registerPendingError = (err) => {
      this.pendingErrors.push(err);
      this.requestErrorThrow();
    };
    this.requestFlush = makeRequestCall(this.flush);
    this.requestErrorThrow = makeRequestCallFromTimer(() => {
      if (this.pendingErrors.length) {
        throw this.pendingErrors.shift();
      }
    });
  }
};

// node_modules/dnd-core/node_modules/@react-dnd/asap/dist/RawTask.js
var RawTask = class {
  call() {
    try {
      this.task && this.task();
    } catch (error) {
      this.onError(error);
    } finally {
      this.task = null;
      this.release(this);
    }
  }
  constructor(onError, release) {
    this.onError = onError;
    this.release = release;
    this.task = null;
  }
};

// node_modules/dnd-core/node_modules/@react-dnd/asap/dist/TaskFactory.js
var TaskFactory = class {
  create(task) {
    const tasks = this.freeTasks;
    const t1 = tasks.length ? tasks.pop() : new RawTask(
      this.onError,
      (t) => tasks[tasks.length] = t
    );
    t1.task = task;
    return t1;
  }
  constructor(onError) {
    this.onError = onError;
    this.freeTasks = [];
  }
};

// node_modules/dnd-core/node_modules/@react-dnd/asap/dist/asap.js
var asapQueue = new AsapQueue();
var taskFactory = new TaskFactory(asapQueue.registerPendingError);
function asap(task) {
  asapQueue.enqueueTask(taskFactory.create(task));
}

// node_modules/dnd-core/dist/actions/registry.js
var ADD_SOURCE = "dnd-core/ADD_SOURCE";
var ADD_TARGET = "dnd-core/ADD_TARGET";
var REMOVE_SOURCE = "dnd-core/REMOVE_SOURCE";
var REMOVE_TARGET = "dnd-core/REMOVE_TARGET";
function addSource(sourceId) {
  return {
    type: ADD_SOURCE,
    payload: {
      sourceId
    }
  };
}
function addTarget(targetId) {
  return {
    type: ADD_TARGET,
    payload: {
      targetId
    }
  };
}
function removeSource(sourceId) {
  return {
    type: REMOVE_SOURCE,
    payload: {
      sourceId
    }
  };
}
function removeTarget(targetId) {
  return {
    type: REMOVE_TARGET,
    payload: {
      targetId
    }
  };
}

// node_modules/dnd-core/dist/contracts.js
function validateSourceContract(source) {
  invariant(typeof source.canDrag === "function", "Expected canDrag to be a function.");
  invariant(typeof source.beginDrag === "function", "Expected beginDrag to be a function.");
  invariant(typeof source.endDrag === "function", "Expected endDrag to be a function.");
}
function validateTargetContract(target) {
  invariant(typeof target.canDrop === "function", "Expected canDrop to be a function.");
  invariant(typeof target.hover === "function", "Expected hover to be a function.");
  invariant(typeof target.drop === "function", "Expected beginDrag to be a function.");
}
function validateType(type, allowArray) {
  if (allowArray && Array.isArray(type)) {
    type.forEach(
      (t) => validateType(t, false)
    );
    return;
  }
  invariant(typeof type === "string" || typeof type === "symbol", allowArray ? "Type can only be a string, a symbol, or an array of either." : "Type can only be a string or a symbol.");
}

// node_modules/dnd-core/dist/interfaces.js
var HandlerRole;
(function(HandlerRole2) {
  HandlerRole2["SOURCE"] = "SOURCE";
  HandlerRole2["TARGET"] = "TARGET";
})(HandlerRole || (HandlerRole = {}));

// node_modules/dnd-core/dist/utils/getNextUniqueId.js
var nextUniqueId = 0;
function getNextUniqueId() {
  return nextUniqueId++;
}

// node_modules/dnd-core/dist/classes/HandlerRegistryImpl.js
function getNextHandlerId(role) {
  const id = getNextUniqueId().toString();
  switch (role) {
    case HandlerRole.SOURCE:
      return `S${id}`;
    case HandlerRole.TARGET:
      return `T${id}`;
    default:
      throw new Error(`Unknown Handler Role: ${role}`);
  }
}
function parseRoleFromHandlerId(handlerId) {
  switch (handlerId[0]) {
    case "S":
      return HandlerRole.SOURCE;
    case "T":
      return HandlerRole.TARGET;
    default:
      throw new Error(`Cannot parse handler ID: ${handlerId}`);
  }
}
function mapContainsValue(map2, searchValue) {
  const entries = map2.entries();
  let isDone = false;
  do {
    const { done, value: [, value] } = entries.next();
    if (value === searchValue) {
      return true;
    }
    isDone = !!done;
  } while (!isDone);
  return false;
}
var HandlerRegistryImpl = class {
  addSource(type, source) {
    validateType(type);
    validateSourceContract(source);
    const sourceId = this.addHandler(HandlerRole.SOURCE, type, source);
    this.store.dispatch(addSource(sourceId));
    return sourceId;
  }
  addTarget(type, target) {
    validateType(type, true);
    validateTargetContract(target);
    const targetId = this.addHandler(HandlerRole.TARGET, type, target);
    this.store.dispatch(addTarget(targetId));
    return targetId;
  }
  containsHandler(handler) {
    return mapContainsValue(this.dragSources, handler) || mapContainsValue(this.dropTargets, handler);
  }
  getSource(sourceId, includePinned = false) {
    invariant(this.isSourceId(sourceId), "Expected a valid source ID.");
    const isPinned = includePinned && sourceId === this.pinnedSourceId;
    const source = isPinned ? this.pinnedSource : this.dragSources.get(sourceId);
    return source;
  }
  getTarget(targetId) {
    invariant(this.isTargetId(targetId), "Expected a valid target ID.");
    return this.dropTargets.get(targetId);
  }
  getSourceType(sourceId) {
    invariant(this.isSourceId(sourceId), "Expected a valid source ID.");
    return this.types.get(sourceId);
  }
  getTargetType(targetId) {
    invariant(this.isTargetId(targetId), "Expected a valid target ID.");
    return this.types.get(targetId);
  }
  isSourceId(handlerId) {
    const role = parseRoleFromHandlerId(handlerId);
    return role === HandlerRole.SOURCE;
  }
  isTargetId(handlerId) {
    const role = parseRoleFromHandlerId(handlerId);
    return role === HandlerRole.TARGET;
  }
  removeSource(sourceId) {
    invariant(this.getSource(sourceId), "Expected an existing source.");
    this.store.dispatch(removeSource(sourceId));
    asap(() => {
      this.dragSources.delete(sourceId);
      this.types.delete(sourceId);
    });
  }
  removeTarget(targetId) {
    invariant(this.getTarget(targetId), "Expected an existing target.");
    this.store.dispatch(removeTarget(targetId));
    this.dropTargets.delete(targetId);
    this.types.delete(targetId);
  }
  pinSource(sourceId) {
    const source = this.getSource(sourceId);
    invariant(source, "Expected an existing source.");
    this.pinnedSourceId = sourceId;
    this.pinnedSource = source;
  }
  unpinSource() {
    invariant(this.pinnedSource, "No source is pinned at the time.");
    this.pinnedSourceId = null;
    this.pinnedSource = null;
  }
  addHandler(role, type, handler) {
    const id = getNextHandlerId(role);
    this.types.set(id, type);
    if (role === HandlerRole.SOURCE) {
      this.dragSources.set(id, handler);
    } else if (role === HandlerRole.TARGET) {
      this.dropTargets.set(id, handler);
    }
    return id;
  }
  constructor(store) {
    this.types = /* @__PURE__ */ new Map();
    this.dragSources = /* @__PURE__ */ new Map();
    this.dropTargets = /* @__PURE__ */ new Map();
    this.pinnedSourceId = null;
    this.pinnedSource = null;
    this.store = store;
  }
};

// node_modules/dnd-core/dist/utils/equality.js
var strictEquality = (a, b) => a === b;
function areCoordsEqual(offsetA, offsetB) {
  if (!offsetA && !offsetB) {
    return true;
  } else if (!offsetA || !offsetB) {
    return false;
  } else {
    return offsetA.x === offsetB.x && offsetA.y === offsetB.y;
  }
}
function areArraysEqual(a, b, isEqual = strictEquality) {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; ++i) {
    if (!isEqual(a[i], b[i])) {
      return false;
    }
  }
  return true;
}

// node_modules/dnd-core/dist/reducers/dirtyHandlerIds.js
function reduce(_state = NONE, action) {
  switch (action.type) {
    case HOVER:
      break;
    case ADD_SOURCE:
    case ADD_TARGET:
    case REMOVE_TARGET:
    case REMOVE_SOURCE:
      return NONE;
    case BEGIN_DRAG:
    case PUBLISH_DRAG_SOURCE:
    case END_DRAG:
    case DROP:
    default:
      return ALL;
  }
  const { targetIds = [], prevTargetIds = [] } = action.payload;
  const result = xor(targetIds, prevTargetIds);
  const didChange = result.length > 0 || !areArraysEqual(targetIds, prevTargetIds);
  if (!didChange) {
    return NONE;
  }
  const prevInnermostTargetId = prevTargetIds[prevTargetIds.length - 1];
  const innermostTargetId = targetIds[targetIds.length - 1];
  if (prevInnermostTargetId !== innermostTargetId) {
    if (prevInnermostTargetId) {
      result.push(prevInnermostTargetId);
    }
    if (innermostTargetId) {
      result.push(innermostTargetId);
    }
  }
  return result;
}

// node_modules/dnd-core/dist/reducers/dragOffset.js
function _defineProperty3(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _objectSpread3(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);
    if (typeof Object.getOwnPropertySymbols === "function") {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }
    ownKeys.forEach(function(key) {
      _defineProperty3(target, key, source[key]);
    });
  }
  return target;
}
var initialState = {
  initialSourceClientOffset: null,
  initialClientOffset: null,
  clientOffset: null
};
function reduce2(state = initialState, action) {
  const { payload } = action;
  switch (action.type) {
    case INIT_COORDS:
    case BEGIN_DRAG:
      return {
        initialSourceClientOffset: payload.sourceClientOffset,
        initialClientOffset: payload.clientOffset,
        clientOffset: payload.clientOffset
      };
    case HOVER:
      if (areCoordsEqual(state.clientOffset, payload.clientOffset)) {
        return state;
      }
      return _objectSpread3({}, state, {
        clientOffset: payload.clientOffset
      });
    case END_DRAG:
    case DROP:
      return initialState;
    default:
      return state;
  }
}

// node_modules/dnd-core/dist/reducers/dragOperation.js
function _defineProperty4(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _objectSpread4(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);
    if (typeof Object.getOwnPropertySymbols === "function") {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }
    ownKeys.forEach(function(key) {
      _defineProperty4(target, key, source[key]);
    });
  }
  return target;
}
var initialState2 = {
  itemType: null,
  item: null,
  sourceId: null,
  targetIds: [],
  dropResult: null,
  didDrop: false,
  isSourcePublic: null
};
function reduce3(state = initialState2, action) {
  const { payload } = action;
  switch (action.type) {
    case BEGIN_DRAG:
      return _objectSpread4({}, state, {
        itemType: payload.itemType,
        item: payload.item,
        sourceId: payload.sourceId,
        isSourcePublic: payload.isSourcePublic,
        dropResult: null,
        didDrop: false
      });
    case PUBLISH_DRAG_SOURCE:
      return _objectSpread4({}, state, {
        isSourcePublic: true
      });
    case HOVER:
      return _objectSpread4({}, state, {
        targetIds: payload.targetIds
      });
    case REMOVE_TARGET:
      if (state.targetIds.indexOf(payload.targetId) === -1) {
        return state;
      }
      return _objectSpread4({}, state, {
        targetIds: without(state.targetIds, payload.targetId)
      });
    case DROP:
      return _objectSpread4({}, state, {
        dropResult: payload.dropResult,
        didDrop: true,
        targetIds: []
      });
    case END_DRAG:
      return _objectSpread4({}, state, {
        itemType: null,
        item: null,
        sourceId: null,
        dropResult: null,
        didDrop: false,
        isSourcePublic: null,
        targetIds: []
      });
    default:
      return state;
  }
}

// node_modules/dnd-core/dist/reducers/refCount.js
function reduce4(state = 0, action) {
  switch (action.type) {
    case ADD_SOURCE:
    case ADD_TARGET:
      return state + 1;
    case REMOVE_SOURCE:
    case REMOVE_TARGET:
      return state - 1;
    default:
      return state;
  }
}

// node_modules/dnd-core/dist/reducers/stateId.js
function reduce5(state = 0) {
  return state + 1;
}

// node_modules/dnd-core/dist/reducers/index.js
function _defineProperty5(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _objectSpread5(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);
    if (typeof Object.getOwnPropertySymbols === "function") {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }
    ownKeys.forEach(function(key) {
      _defineProperty5(target, key, source[key]);
    });
  }
  return target;
}
function reduce6(state = {}, action) {
  return {
    dirtyHandlerIds: reduce(state.dirtyHandlerIds, {
      type: action.type,
      payload: _objectSpread5({}, action.payload, {
        prevTargetIds: get(state, "dragOperation.targetIds", [])
      })
    }),
    dragOffset: reduce2(state.dragOffset, action),
    refCount: reduce4(state.refCount, action),
    dragOperation: reduce3(state.dragOperation, action),
    stateId: reduce5(state.stateId)
  };
}

// node_modules/dnd-core/dist/createDragDropManager.js
function createDragDropManager(backendFactory, globalContext = void 0, backendOptions = {}, debugMode = false) {
  const store = makeStoreInstance(debugMode);
  const monitor = new DragDropMonitorImpl(store, new HandlerRegistryImpl(store));
  const manager = new DragDropManagerImpl(store, monitor);
  const backend = backendFactory(manager, globalContext, backendOptions);
  manager.receiveBackend(backend);
  return manager;
}
function makeStoreInstance(debugMode) {
  const reduxDevTools = typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION__;
  return createStore(reduce6, debugMode && reduxDevTools && reduxDevTools({
    name: "dnd-core",
    instanceId: "dnd-core"
  }));
}

// node_modules/@ng-dnd/core/fesm2022/ng-dnd-core.mjs
function invariant2(assertion, msg) {
  if (!assertion) {
    throw new Error(msg);
  }
}
var explanation = "You can only pass exactly one connection object to [dropTarget]. There is only one of each source/target/preview allowed per DOM element.";
var _AbstractDndDirective = class _AbstractDndDirective {
  /** @ignore */
  constructor(elRef, ngZone) {
    this.elRef = elRef;
    this.ngZone = ngZone;
    this.deferredRequest = new Subscription();
  }
  ngOnChanges() {
    invariant2(typeof this.connection === "object" && !Array.isArray(this.connection), explanation);
    this.ngZone.runOutsideAngular(() => {
      this.deferredRequest.unsubscribe();
      if (this.connection) {
        this.deferredRequest = this.callHooks(this.connection);
      }
    });
  }
  ngOnDestroy() {
    this.deferredRequest.unsubscribe();
  }
  callHooks(_conn) {
    return new Subscription();
  }
};
_AbstractDndDirective.ɵfac = function AbstractDndDirective_Factory(t) {
  return new (t || _AbstractDndDirective)(ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
};
_AbstractDndDirective.ɵdir = ɵɵdefineDirective({
  type: _AbstractDndDirective,
  features: [ɵɵNgOnChangesFeature]
});
var AbstractDndDirective = _AbstractDndDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AbstractDndDirective, [{
    type: Directive
  }], () => [{
    type: ElementRef
  }, {
    type: NgZone
  }], null);
})();
var _DropTargetDirective = class _DropTargetDirective extends AbstractDndDirective {
  /** Reduce typo confusion by allowing non-plural version of dropTargetTypes */
  set dropTargetType(t) {
    this.dropTargetTypes = t;
  }
  ngOnChanges() {
    this.connection = this.dropTarget;
    if (this.connection && this.dropTargetTypes != null) {
      this.connection.setTypes(this.dropTargetTypes);
    }
    super.ngOnChanges();
  }
  callHooks(conn) {
    return conn.connectDropTarget(this.elRef.nativeElement);
  }
};
_DropTargetDirective.ɵfac = /* @__PURE__ */ (() => {
  let ɵDropTargetDirective_BaseFactory;
  return function DropTargetDirective_Factory(t) {
    return (ɵDropTargetDirective_BaseFactory || (ɵDropTargetDirective_BaseFactory = ɵɵgetInheritedFactory(_DropTargetDirective)))(t || _DropTargetDirective);
  };
})();
_DropTargetDirective.ɵdir = ɵɵdefineDirective({
  type: _DropTargetDirective,
  selectors: [["", "dropTarget", ""]],
  inputs: {
    dropTarget: "dropTarget",
    dropTargetTypes: "dropTargetTypes",
    dropTargetType: "dropTargetType"
  },
  standalone: true,
  features: [ɵɵInheritDefinitionFeature, ɵɵNgOnChangesFeature]
});
var DropTargetDirective = _DropTargetDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DropTargetDirective, [{
    type: Directive,
    args: [{
      selector: "[dropTarget]",
      standalone: true
    }]
  }], null, {
    dropTarget: [{
      type: Input,
      args: ["dropTarget"]
    }],
    dropTargetTypes: [{
      type: Input,
      args: ["dropTargetTypes"]
    }],
    dropTargetType: [{
      type: Input,
      args: ["dropTargetType"]
    }]
  });
})();
var _DragSourceDirective = class _DragSourceDirective extends AbstractDndDirective {
  constructor() {
    super(...arguments);
    this.noHTML5Preview = false;
  }
  ngOnChanges() {
    this.connection = this.dragSource;
    if (this.connection && this.dragSourceType != null) {
      this.connection.setType(this.dragSourceType);
    }
    super.ngOnChanges();
  }
  callHooks(conn) {
    const sub = new Subscription();
    sub.add(conn.connectDragSource(this.elRef.nativeElement, this.dragSourceOptions));
    if (this.noHTML5Preview) {
      sub.add(conn.connectDragPreview(getEmptyImage()));
    }
    return sub;
  }
};
_DragSourceDirective.ɵfac = /* @__PURE__ */ (() => {
  let ɵDragSourceDirective_BaseFactory;
  return function DragSourceDirective_Factory(t) {
    return (ɵDragSourceDirective_BaseFactory || (ɵDragSourceDirective_BaseFactory = ɵɵgetInheritedFactory(_DragSourceDirective)))(t || _DragSourceDirective);
  };
})();
_DragSourceDirective.ɵdir = ɵɵdefineDirective({
  type: _DragSourceDirective,
  selectors: [["", "dragSource", ""]],
  inputs: {
    dragSource: "dragSource",
    dragSourceType: "dragSourceType",
    dragSourceOptions: "dragSourceOptions",
    noHTML5Preview: "noHTML5Preview"
  },
  standalone: true,
  features: [ɵɵInheritDefinitionFeature, ɵɵNgOnChangesFeature]
});
var DragSourceDirective = _DragSourceDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DragSourceDirective, [{
    type: Directive,
    args: [{
      selector: "[dragSource]",
      standalone: true
    }]
  }], null, {
    dragSource: [{
      type: Input,
      args: ["dragSource"]
    }],
    dragSourceType: [{
      type: Input,
      args: ["dragSourceType"]
    }],
    dragSourceOptions: [{
      type: Input,
      args: ["dragSourceOptions"]
    }],
    noHTML5Preview: [{
      type: Input,
      args: ["noHTML5Preview"]
    }]
  });
})();
var _DragPreviewDirective = class _DragPreviewDirective extends AbstractDndDirective {
  ngOnChanges() {
    this.connection = this.dragPreview;
    super.ngOnChanges();
  }
  callHooks(conn) {
    return conn.connectDragPreview(this.elRef.nativeElement, this.dragPreviewOptions);
  }
};
_DragPreviewDirective.ɵfac = /* @__PURE__ */ (() => {
  let ɵDragPreviewDirective_BaseFactory;
  return function DragPreviewDirective_Factory(t) {
    return (ɵDragPreviewDirective_BaseFactory || (ɵDragPreviewDirective_BaseFactory = ɵɵgetInheritedFactory(_DragPreviewDirective)))(t || _DragPreviewDirective);
  };
})();
_DragPreviewDirective.ɵdir = ɵɵdefineDirective({
  type: _DragPreviewDirective,
  selectors: [["", "dragPreview", ""]],
  inputs: {
    dragPreview: "dragPreview",
    dragPreviewOptions: "dragPreviewOptions"
  },
  standalone: true,
  features: [ɵɵInheritDefinitionFeature, ɵɵNgOnChangesFeature]
});
var DragPreviewDirective = _DragPreviewDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DragPreviewDirective, [{
    type: Directive,
    args: [{
      selector: "[dragPreview]",
      standalone: true
    }]
  }], null, {
    dragPreview: [{
      type: Input,
      args: ["dragPreview"]
    }],
    dragPreviewOptions: [{
      type: Input,
      args: ["dragPreviewOptions"]
    }]
  });
})();
var emptyImage;
function getEmptyImage() {
  if (!emptyImage) {
    emptyImage = new Image();
    emptyImage.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
  }
  return emptyImage;
}
var DRAG_DROP_BACKEND = new InjectionToken("dnd-core compatible backend");
var DRAG_DROP_BACKEND_FACTORY = new InjectionToken("dnd-core compatible backend");
var DRAG_DROP_BACKEND_OPTIONS = new InjectionToken("options for dnd-core compatible backend");
var DRAG_DROP_BACKEND_DEBUG_MODE = new InjectionToken("should dnd-core run in debug mode?");
var DRAG_DROP_MANAGER = new InjectionToken("dnd-core DragDropManager");
var DRAG_DROP_GLOBAL_CONTEXT = new InjectionToken("dnd-core context");
var TYPE_DYNAMIC = Symbol("no type specified, you must provide one with setType/setTypes");
function unpackBackendForEs5Users(backendOrModule) {
  let backend = backendOrModule;
  if (typeof backend === "object" && typeof backend.default === "function") {
    backend = backend.default;
  }
  invariant2(typeof backend === "function", "Expected the backend to be a function or an ES6 module exporting a default function. Read more: http://react-dnd.github.io/react-dnd/docs-drag-drop-context.html");
  return backend;
}
function managerFactory(backendFactory, ngZone, context, backendOptions, debugMode) {
  backendFactory = unpackBackendForEs5Users(backendFactory);
  return ngZone.runOutsideAngular(() => createDragDropManager(backendFactory, context, backendOptions, debugMode));
}
function getBackend(manager) {
  return manager.getBackend();
}
function getGlobalContext() {
  return typeof global !== "undefined" ? global : window;
}
var EXPORTS = [DragSourceDirective, DropTargetDirective, DragPreviewDirective];
var _DndModule = class _DndModule {
  static forRoot(backendInput) {
    return {
      ngModule: _DndModule,
      providers: [provideDnd(backendInput)]
    };
  }
};
_DndModule.ɵfac = function DndModule_Factory(t) {
  return new (t || _DndModule)();
};
_DndModule.ɵmod = ɵɵdefineNgModule({
  type: _DndModule,
  imports: [DragSourceDirective, DropTargetDirective, DragPreviewDirective],
  exports: [DragSourceDirective, DropTargetDirective, DragPreviewDirective]
});
_DndModule.ɵinj = ɵɵdefineInjector({});
var DndModule = _DndModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DndModule, [{
    type: NgModule,
    args: [{
      imports: EXPORTS,
      exports: EXPORTS
    }]
  }], null, null);
})();
function provideDnd(backendInput) {
  return [{
    provide: DRAG_DROP_BACKEND_FACTORY,
    useValue: backendInput.backend
  }, {
    provide: DRAG_DROP_BACKEND_OPTIONS,
    useValue: backendInput.options
  }, {
    provide: DRAG_DROP_BACKEND_DEBUG_MODE,
    useValue: backendInput.debug
  }, {
    provide: DRAG_DROP_GLOBAL_CONTEXT,
    useFactory: getGlobalContext
  }, {
    provide: DRAG_DROP_MANAGER,
    useFactory: managerFactory,
    deps: [DRAG_DROP_BACKEND_FACTORY, NgZone, DRAG_DROP_GLOBAL_CONTEXT, DRAG_DROP_BACKEND_OPTIONS, DRAG_DROP_BACKEND_DEBUG_MODE]
  }, {
    provide: DRAG_DROP_BACKEND,
    deps: [DRAG_DROP_MANAGER],
    useFactory: getBackend
  }];
}
function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true;
  }
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) {
    return false;
  }
  const hasOwn = Object.prototype.hasOwnProperty;
  for (let i = 0; i < keysA.length; i += 1) {
    if (!hasOwn.call(objB, keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }
    const valA = objA[keysA[i]];
    const valB = objB[keysA[i]];
    if (valA !== valB) {
      return false;
    }
  }
  return true;
}
function areOptionsEqual(nextOptions, currentOptions) {
  if (currentOptions === nextOptions) {
    return true;
  }
  return currentOptions !== null && nextOptions !== null && shallowEqual(currentOptions, nextOptions);
}
var Reconnector = class {
  constructor(backendConnector) {
    this.backendConnector = backendConnector;
    this.reconnect = (parentHandlerId) => {
      if (this.disconnect) {
        this.disconnect();
        this.disconnect = null;
      }
      this.handlerId = parentHandlerId;
      if (this.handlerId && this.node) {
        this.disconnect = this.backendConnector(this.handlerId, this.node, this.options);
      }
    };
    this.hook = (nativeElement, options) => {
      if (nativeElement === this.node && areOptionsEqual(options, this.options)) {
        return;
      }
      this.node = nativeElement;
      this.options = options;
      this.reconnect(this.handlerId);
    };
  }
};
var TargetConnector = class {
  constructor(backend) {
    this.backend = backend;
    this.dropTarget = new Reconnector((handlerId, node, options) => {
      return this.backend.connectDropTarget(handlerId, node, options);
    });
    this.hooks = {
      dropTarget: this.dropTarget.hook
    };
  }
  receiveHandlerId(handlerId) {
    if (handlerId === this.currentHandlerId) {
      return;
    }
    this.currentHandlerId = handlerId;
    this.dropTarget.reconnect(handlerId);
  }
  reconnect() {
    this.dropTarget.reconnect(this.currentHandlerId);
  }
};
function createTargetConnector(backend) {
  return new TargetConnector(backend);
}
function registerTarget(type, target, manager) {
  const registry = manager.getRegistry();
  const targetId = registry.addTarget(type, target);
  function unregisterTarget() {
    registry.removeTarget(targetId);
  }
  return {
    handlerId: targetId,
    unregister: unregisterTarget
  };
}
var SourceConnector = class {
  constructor(backend) {
    this.backend = backend;
    this.dragSource = new Reconnector((handlerId, node, options) => {
      return this.backend.connectDragSource(handlerId, node, options);
    });
    this.dragPreview = new Reconnector((handlerId, node, options) => {
      return this.backend.connectDragPreview(handlerId, node, options);
    });
    this.hooks = {
      dragSource: this.dragSource.hook,
      dragPreview: this.dragPreview.hook
    };
  }
  receiveHandlerId(handlerId) {
    if (handlerId === this.currentHandlerId) {
      return;
    }
    this.currentHandlerId = handlerId;
    this.dragSource.reconnect(handlerId);
    this.dragPreview.reconnect(handlerId);
  }
  reconnect() {
    this.dragSource.reconnect(this.currentHandlerId);
    this.dragPreview.reconnect(this.currentHandlerId);
  }
};
function createSourceConnector(backend) {
  return new SourceConnector(backend);
}
function registerSource(type, source, manager) {
  const registry = manager.getRegistry();
  const sourceId = registry.addSource(type, source);
  function unregisterSource() {
    registry.removeSource(sourceId);
  }
  return {
    handlerId: sourceId,
    unregister: unregisterSource
  };
}
function areCollectsEqual(a, b) {
  if (a == null || b == null) {
    return false;
  }
  if (typeof a !== "object" || typeof b !== "object") {
    return a === b;
  }
  return shallowEqual(a, b);
}
function scheduleMicroTaskAfter(zone, uTask) {
  return (source) => {
    return source.lift(new RunInZoneOperator(zone, uTask));
  };
}
var ZoneSubscriber = class extends Subscriber {
  constructor(destination, zone, uTask = () => {
  }) {
    super(destination);
    this.zone = zone;
    this.uTask = uTask;
  }
  _next(val) {
    this.destination.next?.(val);
    this.zone.scheduleMicroTask("ZoneSubscriber", this.uTask);
  }
};
var RunInZoneOperator = class {
  constructor(zone, uTask) {
    this.zone = zone;
    this.uTask = uTask;
  }
  call(subscriber, source) {
    return source.subscribe(new ZoneSubscriber(subscriber, this.zone, this.uTask));
  }
};
var Connection = class {
  constructor(factoryArgs, manager, dndZone, initialType) {
    this.factoryArgs = factoryArgs;
    this.manager = manager;
    this.dndZone = dndZone;
    this.resolvedType$ = new ReplaySubject(1);
    this.subscriptionConnectionLifetime = new Subscription();
    this.onUpdate = () => {
      this.handlerConnector.reconnect();
    };
    this.handleChange = () => {
      this.collector$.next(this.handlerMonitor);
    };
    invariant2(
      typeof manager === "object",
      // TODO: update this mini-documentation
      "Could not find the drag and drop manager in the context of %s. Make sure to wrap the top-level component of your app with DragDropContext. "
      // 'Read more: ',
    );
    NgZone.assertNotInAngularZone();
    this.handlerMonitor = this.factoryArgs.createMonitor(this.manager);
    this.collector$ = new BehaviorSubject(this.handlerMonitor);
    this.handler = this.factoryArgs.createHandler(this.handlerMonitor);
    this.handlerConnector = this.factoryArgs.createConnector(this.manager.getBackend());
    this.subscriptionConnectionLifetime.add(() => this.handlerConnector.receiveHandlerId(null));
    if (initialType && initialType !== TYPE_DYNAMIC) {
      this.setTypes(initialType);
    }
  }
  listen(mapFn) {
    return this.resolvedType$.pipe(
      // this ensures we don't start emitting values until there is a type resolved
      take(1),
      // switch our attention to the incoming firehose of 'something changed' events
      switchMap(() => this.collector$),
      // turn them into 'interesting state' via the monitor and a user-provided function
      map(mapFn),
      // don't emit EVERY time the firehose says something changed, only when the interesting state changes
      distinctUntilChanged(areCollectsEqual),
      // this schedules a single batch change detection run after all the listeners have heard their newest value
      // thus all changes resulting from subscriptions to this are caught by the
      // change detector.
      scheduleMicroTaskAfter(this.dndZone, this.onUpdate)
    );
  }
  connect(fn) {
    const subscription = this.resolvedType$.pipe(take(1)).subscribe(() => {
      this.dndZone.run(() => {
        fn(this.handlerConnector.hooks);
      });
    });
    this.subscriptionConnectionLifetime.add(subscription);
    return subscription;
  }
  connectDropTarget(node) {
    return this.connect((c) => c.dropTarget(node));
  }
  connectDragSource(node, options) {
    return this.connect((c) => c.dragSource(node, options));
  }
  connectDragPreview(node, options) {
    return this.connect((c) => c.dragPreview(node, options));
  }
  setTypes(type) {
    this.dndZone.run(() => {
      this.receiveType(type);
      this.resolvedType$.next(1);
    });
  }
  setType(type) {
    this.setTypes(type);
  }
  getHandlerId() {
    return this.handlerId;
  }
  receiveType(type) {
    if (type === this.currentType) {
      return;
    }
    NgZone.assertNotInAngularZone();
    this.currentType = type;
    if (this.subscriptionTypeLifetime) {
      this.subscriptionTypeLifetime.unsubscribe();
    }
    this.subscriptionTypeLifetime = new Subscription();
    const {
      handlerId,
      unregister
    } = this.factoryArgs.registerHandler(type, this.handler, this.manager);
    this.handlerId = handlerId;
    this.handlerMonitor.receiveHandlerId(handlerId);
    this.handlerConnector.receiveHandlerId(handlerId);
    const globalMonitor = this.manager.getMonitor();
    const unsubscribe = globalMonitor.subscribeToStateChange(this.handleChange, {
      handlerIds: [handlerId]
    });
    this.subscriptionTypeLifetime.add(unsubscribe);
    this.subscriptionTypeLifetime.add(unregister);
  }
  unsubscribe() {
    if (this.subscriptionTypeLifetime) {
      this.subscriptionTypeLifetime.unsubscribe();
    }
    this.subscriptionConnectionLifetime.unsubscribe();
  }
  add(teardown) {
    return this.subscriptionConnectionLifetime.add(teardown);
  }
  get closed() {
    return this.subscriptionConnectionLifetime && this.subscriptionConnectionLifetime.closed;
  }
};
var TargetConnection = Connection;
var SourceConnection = Connection;
var DragLayerConnectionClass = class {
  constructor(manager, zone) {
    this.manager = manager;
    this.zone = zone;
    this.subscription = new Subscription();
    this.isTicking = false;
    this.handleStateChange = () => {
      const monitor2 = this.manager.getMonitor();
      this.collector$.next(monitor2);
    };
    this.handleOffsetChange = () => {
      const monitor2 = this.manager.getMonitor();
      this.collector$.next(monitor2);
    };
    const monitor = this.manager.getMonitor();
    this.collector$ = new BehaviorSubject(monitor);
    this.unsubscribeFromOffsetChange = monitor.subscribeToOffsetChange(this.handleOffsetChange);
    this.unsubscribeFromStateChange = monitor.subscribeToStateChange(this.handleStateChange);
    this.subscription.add(() => {
      this.unsubscribeFromOffsetChange();
      this.unsubscribeFromStateChange();
    });
    this.handleStateChange();
  }
  listen(mapFn) {
    return this.collector$.pipe(map(mapFn), distinctUntilChanged(areCollectsEqual), scheduleMicroTaskAfter(this.zone));
  }
  unsubscribe() {
    this.collector$.complete();
    this.subscription.unsubscribe();
  }
  add(teardown) {
    return this.subscription.add(teardown);
  }
  get closed() {
    return this.subscription.closed;
  }
};
var Source = class {
  constructor(spec, zone, monitor) {
    this.spec = spec;
    this.zone = zone;
    this.monitor = monitor;
  }
  withChangeDetection(fn) {
    const x = fn();
    this.zone.scheduleMicroTask("DragSource", () => {
    });
    return x;
  }
  canDrag() {
    if (!this.spec.canDrag) {
      return true;
    }
    return this.withChangeDetection(() => {
      return this.spec.canDrag?.(this.monitor) || false;
    });
  }
  isDragging(globalMonitor, sourceId) {
    if (!this.spec.isDragging) {
      return sourceId === globalMonitor.getSourceId();
    }
    return this.spec.isDragging(this.monitor);
  }
  beginDrag() {
    return this.withChangeDetection(() => {
      return this.spec.beginDrag(this.monitor);
    });
  }
  endDrag() {
    if (!this.spec.endDrag) {
      return;
    }
    return this.withChangeDetection(() => {
      this.spec.endDrag?.(this.monitor);
    });
  }
};
function createSourceFactory(spec, zone) {
  return function createSource(monitor) {
    return new Source(spec, zone, monitor);
  };
}
var isCallingCanDrag = false;
var isCallingIsDragging = false;
var DragSourceMonitorClass = class {
  constructor(manager) {
    this.internalMonitor = manager.getMonitor();
  }
  receiveHandlerId(sourceId) {
    this.sourceId = sourceId;
  }
  canDrag() {
    invariant2(!isCallingCanDrag, "You may not call monitor.canDrag() inside your canDrag() implementation. Read more: http://react-dnd.github.io/react-dnd/docs-drag-source-monitor.html");
    try {
      isCallingCanDrag = true;
      return this.internalMonitor.canDragSource(this.sourceId);
    } finally {
      isCallingCanDrag = false;
    }
  }
  isDragging() {
    invariant2(!isCallingIsDragging, "You may not call monitor.isDragging() inside your isDragging() implementation. Read more: http://react-dnd.github.io/react-dnd/docs-drag-source-monitor.html");
    try {
      isCallingIsDragging = true;
      return this.internalMonitor.isDraggingSource(this.sourceId);
    } finally {
      isCallingIsDragging = false;
    }
  }
  getItemType() {
    return this.internalMonitor.getItemType();
  }
  getItem() {
    return this.internalMonitor.getItem();
  }
  getDropResult() {
    return this.internalMonitor.getDropResult();
  }
  didDrop() {
    return this.internalMonitor.didDrop();
  }
  getInitialClientOffset() {
    return this.internalMonitor.getInitialClientOffset();
  }
  getInitialSourceClientOffset() {
    return this.internalMonitor.getInitialSourceClientOffset();
  }
  getSourceClientOffset() {
    return this.internalMonitor.getSourceClientOffset();
  }
  getClientOffset() {
    return this.internalMonitor.getClientOffset();
  }
  getDifferenceFromInitialOffset() {
    return this.internalMonitor.getDifferenceFromInitialOffset();
  }
};
function createSourceMonitor(manager) {
  return new DragSourceMonitorClass(manager);
}
var Target = class {
  constructor(spec, zone, monitor) {
    this.spec = spec;
    this.zone = zone;
    this.monitor = monitor;
    this.monitor = monitor;
  }
  withChangeDetection(fn) {
    const x = fn();
    this.zone.scheduleMicroTask("DropTarget", () => {
    });
    return x;
  }
  receiveMonitor(monitor) {
    this.monitor = monitor;
  }
  canDrop() {
    if (!this.spec.canDrop) {
      return true;
    }
    return this.spec.canDrop(this.monitor);
  }
  hover() {
    if (!this.spec.hover) {
      return;
    }
    this.withChangeDetection(() => {
      this.spec.hover?.(this.monitor);
    });
  }
  drop() {
    if (!this.spec.drop) {
      return void 0;
    }
    return this.withChangeDetection(() => {
      return this.spec.drop?.(this.monitor);
    });
  }
};
function createTargetFactory(spec, zone) {
  return function createTarget(monitor) {
    return new Target(spec, zone, monitor);
  };
}
var isCallingCanDrop = false;
var DropTargetMonitorClass = class {
  constructor(manager) {
    this.internalMonitor = manager.getMonitor();
  }
  receiveHandlerId(targetId) {
    this.targetId = targetId;
  }
  canDrop() {
    invariant2(!isCallingCanDrop, "You may not call monitor.canDrop() inside your canDrop() implementation. Read more: http://react-dnd.github.io/react-dnd/docs-drop-target-monitor.html");
    try {
      isCallingCanDrop = true;
      return this.internalMonitor.canDropOnTarget(this.targetId);
    } finally {
      isCallingCanDrop = false;
    }
  }
  isOver(options = {
    shallow: false
  }) {
    return this.internalMonitor.isOverTarget(this.targetId, options);
  }
  getItemType() {
    return this.internalMonitor.getItemType();
  }
  getItem() {
    return this.internalMonitor.getItem();
  }
  getDropResult() {
    return this.internalMonitor.getDropResult();
  }
  didDrop() {
    return this.internalMonitor.didDrop();
  }
  getInitialClientOffset() {
    return this.internalMonitor.getInitialClientOffset();
  }
  getInitialSourceClientOffset() {
    return this.internalMonitor.getInitialSourceClientOffset();
  }
  getSourceClientOffset() {
    return this.internalMonitor.getSourceClientOffset();
  }
  getClientOffset() {
    return this.internalMonitor.getClientOffset();
  }
  getDifferenceFromInitialOffset() {
    return this.internalMonitor.getDifferenceFromInitialOffset();
  }
};
function createTargetMonitor(manager) {
  return new DropTargetMonitorClass(manager);
}
var _DndService = class _DndService {
  /** @ignore */
  constructor(manager, ngZone) {
    this.manager = manager;
    this.ngZone = ngZone;
    this.dndZone = Zone.root.fork({
      name: "dndZone",
      onHasTask: (_parentZoneDelegate, _currentZone, _targetZone, state) => {
        if (!state[state.change]) {
          this.ngZone.run(() => {
          });
        }
      }
      // onInvokeTask: (zoneDelegate, currentZone, targetZone, task, applyThis, applyArgs) => {
      // }
      // onScheduleTask(parentZoneDelegate, currentZone, targetZone, task) {
      //   return parentZoneDelegate.scheduleTask(targetZone, task);
      // },
      // onInvoke: (parentZoneDelegate, currentZone, targetZone, delegate, applyThis, applyArgs, source) => {
      // }
    });
  }
  /**
   * This drop target will only react to the items produced by the drag sources
   * of the specified type or types.
   *
   * If you want a dynamic type, pass `null` as the type; and call
   * {@link DropTarget#setTypes} in a lifecycle hook.
   */
  dropTarget(types, spec, subscription) {
    return this.dndZone.run(() => {
      const createTarget = createTargetFactory(spec, this.dndZone);
      const conn = new TargetConnection({
        createHandler: createTarget,
        registerHandler: registerTarget,
        createMonitor: createTargetMonitor,
        createConnector: createTargetConnector
      }, this.manager, this.dndZone, types || TYPE_DYNAMIC);
      if (subscription) {
        subscription.add(conn);
      }
      return conn;
    });
  }
  /**
   * This method creates a {@link DragSource} object. It represents a drag
   * source and its behaviour, and can be connected to a DOM element by
   * assigning it to the `[dragSource]` directive on that element in your
   * template.
   *
   * It is the corollary of [`react-dnd`'s
   * `DragSource`](http://react-dnd.github.io/react-dnd/docs-drag-source.html).
   *
   * The `spec` argument ({@link DragSourceSpec}) is a set of _queries_ and
   * _callbacks_ that are called at appropriate times by the internals. The
   * queries are for asking your component whether to drag/listen and what
   * item data to hoist up; the callback (just 1) is for notifying you when
   * the drag ends.
   *
   * Only the drop targets registered for the same type will
   * react to the items produced by this drag source. If you want a dynamic
   * type, pass `null` as the type; and call {@link DragSource#setType} in
   * a lifecycle hook.
   *
   * @param subscription An RxJS Subscription to tie the lifetime of the
   * connection to.
   */
  dragSource(type, spec, subscription) {
    return this.dndZone.run(() => {
      const createSource = createSourceFactory(spec, this.dndZone);
      const conn = new SourceConnection({
        createHandler: createSource,
        registerHandler: registerSource,
        createMonitor: createSourceMonitor,
        createConnector: createSourceConnector
      }, this.manager, this.dndZone, type || TYPE_DYNAMIC);
      if (subscription) {
        subscription.add(conn);
      }
      return conn;
    });
  }
  /**
   * This method creates a {@link DragLayer} object
   */
  dragLayer(subscription) {
    return this.dndZone.run(() => {
      const conn = new DragLayerConnectionClass(this.manager, this.dndZone);
      if (subscription) {
        subscription.add(conn);
      }
      return conn;
    });
  }
};
_DndService.ɵfac = function DndService_Factory(t) {
  return new (t || _DndService)(ɵɵinject(DRAG_DROP_MANAGER), ɵɵinject(NgZone));
};
_DndService.ɵprov = ɵɵdefineInjectable({
  token: _DndService,
  factory: _DndService.ɵfac,
  providedIn: "root"
});
var DndService = _DndService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DndService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: void 0,
    decorators: [{
      type: Inject,
      args: [DRAG_DROP_MANAGER]
    }]
  }, {
    type: NgZone
  }], null);
})();

export {
  invariant,
  AbstractDndDirective,
  DropTargetDirective,
  DragSourceDirective,
  DragPreviewDirective,
  DRAG_DROP_BACKEND,
  DRAG_DROP_MANAGER,
  unpackBackendForEs5Users,
  managerFactory,
  getBackend,
  getGlobalContext,
  DndModule,
  provideDnd,
  DndService
};
//# sourceMappingURL=chunk-LEYU5DEE.js.map
