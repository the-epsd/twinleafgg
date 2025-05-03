import {
  NG_PIPE_DEF,
  _global,
  getLContext
} from "./chunk-JWP5VVKN.js";
import "./chunk-4LDUOPTP.js";
import "./chunk-L6WT4WHF.js";
import {
  EMPTY,
  Subject,
  Subscription,
  from,
  mergeMap,
  takeUntil
} from "./chunk-Q3Q6CVA2.js";
import "./chunk-24ZYNOED.js";
import "./chunk-BT6DLQRC.js";

// node_modules/@ngneat/until-destroy/fesm2020/ngneat-until-destroy.mjs
var NG_PIPE_DEF2 = NG_PIPE_DEF;
function isPipe(target) {
  return !!target[NG_PIPE_DEF2];
}
var DESTROY = Symbol("__destroy");
var DECORATOR_APPLIED = Symbol("__decoratorApplied");
function getSymbol(destroyMethodName) {
  if (typeof destroyMethodName === "string") {
    return Symbol(`__destroy__${destroyMethodName}`);
  } else {
    return DESTROY;
  }
}
function markAsDecorated(type) {
  type.prototype[DECORATOR_APPLIED] = true;
}
function createSubjectOnTheInstance(instance, symbol) {
  if (!instance[symbol]) {
    instance[symbol] = new Subject();
  }
}
function completeSubjectOnTheInstance(instance, symbol) {
  if (instance[symbol]) {
    instance[symbol].next();
    instance[symbol].complete();
    instance[symbol] = null;
  }
}
function unsubscribe(property) {
  if (property instanceof Subscription) {
    property.unsubscribe();
  }
}
function unsubscribeIfPropertyIsArrayLike(property) {
  Array.isArray(property) && property.forEach(unsubscribe);
}
function decorateNgOnDestroy(ngOnDestroy, options) {
  return function() {
    ngOnDestroy && ngOnDestroy.call(this);
    completeSubjectOnTheInstance(this, getSymbol());
    if (options.arrayName) {
      unsubscribeIfPropertyIsArrayLike(this[options.arrayName]);
    }
    if (options.checkProperties) {
      for (const property in this) {
        if (options.blackList?.includes(property)) {
          continue;
        }
        unsubscribe(this[property]);
      }
    }
  };
}
function decorateProviderDirectiveOrComponent(type, options) {
  type.prototype.ngOnDestroy = decorateNgOnDestroy(type.prototype.ngOnDestroy, options);
}
function decoratePipe(type, options) {
  const def = type.ɵpipe;
  def.onDestroy = decorateNgOnDestroy(def.onDestroy, options);
}
function UntilDestroy(options = {}) {
  return (type) => {
    if (isPipe(type)) {
      decoratePipe(type, options);
    } else {
      decorateProviderDirectiveOrComponent(type, options);
    }
    markAsDecorated(type);
  };
}
var CLEANUP = 7;
var CheckerHasBeenSet = Symbol("CheckerHasBeenSet");
function setupSubjectUnsubscribedChecker(instance, destroy$) {
  if (instance[CheckerHasBeenSet] || isAngularInTestMode()) {
    return;
  }
  runOutsideAngular(() => from(Promise.resolve()).pipe(
    mergeMap(() => {
      let lContext;
      try {
        lContext = getLContext(instance);
      } catch {
        lContext = null;
      }
      const lView = lContext?.lView;
      if (lView == null) {
        return EMPTY;
      }
      const lCleanup = lView[CLEANUP] || (lView[CLEANUP] = []);
      const cleanupHasBeenExecuted$ = new Subject();
      lCleanup.push(function untilDestroyedLCleanup() {
        runOutsideAngular(() => {
          cleanupHasBeenExecuted$.next();
          cleanupHasBeenExecuted$.complete();
        });
      });
      return cleanupHasBeenExecuted$;
    }),
    // We can't use `observeOn(asapScheduler)` because this might break the app's change detection.
    // RxJS schedulers coalesce tasks and then flush the queue, which means our task might be scheduled
    // within the root zone, and then all of the tasks (that were set up by developers in the Angular zone)
    // will also be flushed in the root zone.
    mergeMap(() => Promise.resolve())
  ).subscribe(() => {
    const observed = destroy$["observed"] ?? destroy$["observers"].length > 0;
    if (observed) {
      console.warn(createMessage(instance));
    }
  }));
  instance[CheckerHasBeenSet] = true;
}
function isAngularInTestMode() {
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    typeof __karma__ !== "undefined" && !!__karma__ || // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    typeof jasmine !== "undefined" && !!jasmine || // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    typeof jest !== "undefined" && !!jest || // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    typeof Mocha !== "undefined" && !!Mocha || // Jest is not defined in ESM mode since it must be access only by importing from `@jest/globals`.
    // There's no way to check if we're in Jest ESM mode or not, but we can check if the `process` is defined.
    // Note: it's required to check for `[object process]` because someone might be running unit tests with
    // Webpack and shimming `process`.
    typeof process !== "undefined" && Object.prototype.toString.call(process) === "[object process]"
  );
}
function runOutsideAngular(fn) {
  const Zone = _global.Zone;
  const isNgZoneEnabled = !!Zone && typeof Zone.root?.run === "function";
  return isNgZoneEnabled ? Zone.root.run(fn) : fn();
}
function createMessage(instance) {
  return `
  The ${instance.constructor.name} still has subscriptions that haven't been unsubscribed.
  This may happen if the class extends another class decorated with @UntilDestroy().
  The child class implements its own ngOnDestroy() method but doesn't call super.ngOnDestroy().
  Let's look at the following example:
  @UntilDestroy()
  @Directive()
  export abstract class BaseDirective {}
  @Component({ template: '' })
  export class ConcreteComponent extends BaseDirective implements OnDestroy {
    constructor() {
      super();
      someObservable$.pipe(untilDestroyed(this)).subscribe();
    }
    ngOnDestroy(): void {
      // Some logic here...
    }
  }
  The BaseDirective.ngOnDestroy() will not be called since Angular will call ngOnDestroy()
  on the ConcreteComponent, but not on the BaseDirective.
  One of the solutions is to declare an empty ngOnDestroy method on the BaseDirective:
  @UntilDestroy()
  @Directive()
  export abstract class BaseDirective {
    ngOnDestroy(): void {}
  }
  @Component({ template: '' })
  export class ConcreteComponent extends BaseDirective implements OnDestroy {
    constructor() {
      super();
      someObservable$.pipe(untilDestroyed(this)).subscribe();
    }
    ngOnDestroy(): void {
      // Some logic here...
      super.ngOnDestroy();
    }
  }
  `;
}
var NG_DEV_MODE = typeof ngDevMode === "undefined" || ngDevMode;
function overrideNonDirectiveInstanceMethod(instance, destroyMethodName, symbol) {
  const originalDestroy = instance[destroyMethodName];
  if (NG_DEV_MODE && typeof originalDestroy !== "function") {
    throw new Error(`${instance.constructor.name} is using untilDestroyed but doesn't implement ${destroyMethodName}`);
  }
  createSubjectOnTheInstance(instance, symbol);
  instance[destroyMethodName] = function() {
    originalDestroy.apply(this, arguments);
    completeSubjectOnTheInstance(this, symbol);
    instance[destroyMethodName] = originalDestroy;
  };
}
function untilDestroyed(instance, destroyMethodName) {
  return (source) => {
    const symbol = getSymbol(destroyMethodName);
    if (typeof destroyMethodName === "string") {
      overrideNonDirectiveInstanceMethod(instance, destroyMethodName, symbol);
    } else {
      NG_DEV_MODE && ensureClassIsDecorated(instance);
      createSubjectOnTheInstance(instance, symbol);
    }
    const destroy$ = instance[symbol];
    NG_DEV_MODE && setupSubjectUnsubscribedChecker(instance, destroy$);
    return source.pipe(takeUntil(destroy$));
  };
}
function ensureClassIsDecorated(instance) {
  const prototype = Object.getPrototypeOf(instance);
  const missingDecorator = !(DECORATOR_APPLIED in prototype);
  if (missingDecorator) {
    throw new Error("untilDestroyed operator cannot be used inside directives or components or providers that are not decorated with UntilDestroy decorator");
  }
}
export {
  UntilDestroy,
  untilDestroyed
};
//# sourceMappingURL=@ngneat_until-destroy.js.map
