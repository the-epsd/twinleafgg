import {
  DndService
} from "./chunk-LEYU5DEE.js";
import {
  NgTemplateOutlet
} from "./chunk-UOVHJDKO.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  Input,
  InputFlags,
  NgModule,
  TemplateRef,
  setClassMetadata,
  ɵɵInheritDefinitionFeature,
  ɵɵNgOnChangesFeature,
  ɵɵProvidersFeature,
  ɵɵStandaloneFeature,
  ɵɵcontentQuery,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelementContainer,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵqueryRefresh,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵtemplate
} from "./chunk-JWP5VVKN.js";
import "./chunk-4LDUOPTP.js";
import "./chunk-L6WT4WHF.js";
import {
  BehaviorSubject,
  Subject,
  Subscription,
  distinctUntilChanged,
  filter
} from "./chunk-Q3Q6CVA2.js";
import "./chunk-24ZYNOED.js";
import {
  __spreadValues
} from "./chunk-BT6DLQRC.js";

// node_modules/@ng-dnd/sortable/fesm2022/ng-dnd-sortable.mjs
var _c0 = (a0) => ({
  $implicit: a0
});
function DndSortableList_For_1_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function DndSortableList_For_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, DndSortableList_For_1_ng_container_0_Template, 1, 0, "ng-container", 0);
  }
  if (rf & 2) {
    const card_r1 = ctx.$implicit;
    const i_r2 = ctx.$index;
    const ctx_r2 = ɵɵnextContext();
    ɵɵproperty("ngTemplateOutlet", ctx_r2.template)("ngTemplateOutletContext", ɵɵpureFunction1(2, _c0, ctx_r2.contextFor(card_r1, i_r2)));
  }
}
function isEmpty(list) {
  for (const _ of list) {
    return false;
  }
  return true;
}
var Size = class {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
  style() {
    return {
      width: this.width + "px",
      height: this.height + "px"
    };
  }
};
var HoverTrigger;
(function(HoverTrigger2) {
  HoverTrigger2["halfway"] = "halfway";
  HoverTrigger2["fixed"] = "fixed";
})(HoverTrigger || (HoverTrigger = {}));
var _DndSortable = class _DndSortable {
  /** @ignore */
  constructor(dnd, el, cdr) {
    this.dnd = dnd;
    this.el = el;
    this.cdr = cdr;
    this.listId = Math.random().toString();
    this.horizontal = false;
    this.hoverTrigger = HoverTrigger.halfway;
    this.childrenSubject$ = new BehaviorSubject([]);
    this.children$ = this.childrenSubject$;
    this.subs = new Subscription();
    this.listSubs = new Subscription();
    this.target = this.dnd.dropTarget(null, {
      canDrop: (monitor) => {
        if (!this.acceptsType(monitor.getItemType())) {
          return false;
        }
        const item = monitor.getItem();
        if (!item) {
          return false;
        }
        return this.getCanDrop(item, monitor);
      },
      drop: (monitor) => {
        const item = monitor.getItem();
        if (item && this.getCanDrop(item, monitor)) {
          this.spec.drop?.(item, monitor);
        }
        return {};
      },
      hover: (monitor) => {
        const item = monitor.getItem();
        if (this.children && isEmpty(this.children) && item) {
          const canDrop = this.getCanDrop(item, monitor);
          if (canDrop && monitor.isOver({
            shallow: true
          })) {
            this.callHover(item, monitor, {
              listId: this.listId,
              index: 0
            });
          }
        }
      }
    }, this.subs);
  }
  contextFor(data, index) {
    return {
      data,
      index,
      listId: this.listId,
      spec: this.spec,
      horizontal: this.horizontal,
      hoverTrigger: this.hoverTrigger
    };
  }
  /** @ignore */
  updateSubscription() {
    if (this.listId != null && this.spec) {
      if (this.listSubs) {
        this.subs.remove(this.listSubs);
        this.listSubs.unsubscribe();
      }
      if (this.spec.getList) {
        const cs$ = this.spec.getList(this.listId);
        this.listSubs = cs$?.subscribe((l) => {
          if (l) {
            this.childrenSubject$.next(l);
            this.children = l;
            this.cdr.markForCheck();
          }
        });
        this.subs.add(this.listSubs);
      }
    }
  }
  /** @ignore */
  getCanDrop(item, monitor, _default = true) {
    if (this.spec.canDrop) {
      return this.spec.canDrop(item, monitor);
    }
    return _default;
  }
  /** @ignore */
  callHover(item, monitor, newHover) {
    if (newHover) {
      item.hover = newHover;
      item = __spreadValues({}, item);
    }
    this.spec.hover?.(item, monitor);
  }
  /** @ignore */
  ngOnInit() {
    this.updateSubscription();
    this.target.setTypes(this.getTargetType());
  }
  getTargetType() {
    if (Array.isArray(this.spec.accepts)) {
      return this.spec.accepts;
    } else {
      return this.spec.accepts || this.spec.type;
    }
  }
  acceptsType(ty) {
    if (ty == null) return false;
    if (Array.isArray(this.spec.accepts)) {
      const arr = this.spec.accepts;
      return arr.indexOf(ty) !== -1;
    } else {
      const acc = this.getTargetType();
      return ty == acc;
    }
  }
  /** @ignore */
  ngOnChanges({
    spec,
    listId
  }) {
    if (listId) {
      this.updateSubscription();
    }
    if (spec) {
      this.updateSubscription();
    }
    this.target.setTypes(this.getTargetType());
  }
  /** @ignore */
  ngAfterViewInit() {
    if (this.el) {
      this.target.connectDropTarget(this.el.nativeElement);
    } else {
      throw new Error("dndSortable directive must have ElementRef");
    }
  }
  /** @ignore */
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
};
_DndSortable.ɵfac = function DndSortable_Factory(t) {
  return new (t || _DndSortable)(ɵɵdirectiveInject(DndService), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(ChangeDetectorRef));
};
_DndSortable.ɵdir = ɵɵdefineDirective({
  type: _DndSortable,
  selectors: [["", "dndSortable", ""]],
  inputs: {
    listId: "listId",
    horizontal: "horizontal",
    spec: "spec",
    children: "children",
    hoverTrigger: "hoverTrigger"
  },
  exportAs: ["dndSortable"],
  standalone: true,
  features: [ɵɵNgOnChangesFeature]
});
var DndSortable = _DndSortable;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DndSortable, [{
    type: Directive,
    args: [{
      selector: "[dndSortable]",
      exportAs: "dndSortable",
      standalone: true
    }]
  }], () => [{
    type: DndService
  }, {
    type: ElementRef
  }, {
    type: ChangeDetectorRef
  }], {
    listId: [{
      type: Input
    }],
    horizontal: [{
      type: Input
    }],
    spec: [{
      type: Input
    }],
    children: [{
      type: Input
    }],
    hoverTrigger: [{
      type: Input
    }]
  });
})();
var EXTERNAL_LIST_ID = Symbol("EXTERNAL_LIST_ID");
var _DndSortableExternal = class _DndSortableExternal {
  /** @ignore */
  constructor(dnd, el) {
    this.dnd = dnd;
    this.el = el;
    this.source = this.dnd.dragSource(null, {
      canDrag: (monitor) => {
        if (this.spec.canDrag) {
          return this.spec.canDrag(void 0, void 0, monitor);
        }
        return true;
      },
      beginDrag: () => {
        if (typeof this.spec.createData !== "function") {
          throw new Error("spec.createData must be a function");
        }
        return {
          type: this.spec.type,
          data: this.spec.createData(),
          hover: {
            index: -1,
            listId: EXTERNAL_LIST_ID
          },
          isInternal: false,
          index: -1,
          listId: EXTERNAL_LIST_ID,
          size: this.size()
        };
      },
      endDrag: (monitor) => {
        const item = monitor.getItem();
        if (item) {
          this.spec.endDrag?.(item, monitor);
        }
      }
    });
  }
  /** @ignore */
  size() {
    const rect = this.el.nativeElement.getBoundingClientRect();
    return new Size(rect.width || rect.right - rect.left, rect.height || rect.bottom - rect.top);
  }
  /** @ignore */
  ngOnChanges() {
    this.source.setType(this.spec.type);
  }
  /** @ignore */
  ngOnDestroy() {
    this.source.unsubscribe();
  }
};
_DndSortableExternal.ɵfac = function DndSortableExternal_Factory(t) {
  return new (t || _DndSortableExternal)(ɵɵdirectiveInject(DndService), ɵɵdirectiveInject(ElementRef));
};
_DndSortableExternal.ɵdir = ɵɵdefineDirective({
  type: _DndSortableExternal,
  selectors: [["", "dndSortableExternal", ""]],
  inputs: {
    spec: [InputFlags.None, "dndSortableExternal", "spec"]
  },
  exportAs: ["dndSortableExternal"],
  standalone: true,
  features: [ɵɵNgOnChangesFeature]
});
var DndSortableExternal = _DndSortableExternal;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DndSortableExternal, [{
    type: Directive,
    args: [{
      selector: "[dndSortableExternal]",
      exportAs: "dndSortableExternal",
      standalone: true
    }]
  }], () => [{
    type: DndService
  }, {
    type: ElementRef
  }], {
    spec: [{
      type: Input,
      args: ["dndSortableExternal"]
    }]
  });
})();
var _DndSortableTemplate = class _DndSortableTemplate {
};
_DndSortableTemplate.ɵfac = function DndSortableTemplate_Factory(t) {
  return new (t || _DndSortableTemplate)();
};
_DndSortableTemplate.ɵdir = ɵɵdefineDirective({
  type: _DndSortableTemplate,
  selectors: [["", "dndSortableTemplate", ""]],
  standalone: true
});
var DndSortableTemplate = _DndSortableTemplate;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DndSortableTemplate, [{
    type: Directive,
    args: [{
      selector: "[dndSortableTemplate]",
      standalone: true
    }]
  }], null, null);
})();
var _DndSortableList = class _DndSortableList extends DndSortable {
  /** @ignore */
  set renderTemplates(ql) {
    if (ql.length > 0) {
      this.template = ql.first;
    }
  }
  /** @ignore */
  constructor(dnd, el, cdr) {
    super(dnd, el, cdr);
    this.template = null;
    this.trackById = (_index, data) => {
      return this.spec.trackBy(data);
    };
  }
  /** @ignore */
  ngAfterContentInit() {
    if (!this.template) {
      throw new Error('You must provide a <ng-template cardTemplate> as a content child, or with [template]="myTemplateRef"');
    }
  }
  // forwarding lifecycle events is required until Ivy renderer
  /** @ignore */
  ngOnChanges(changes) {
    super.ngOnChanges(changes);
  }
  /** @ignore */
  ngOnInit() {
    super.ngOnInit();
  }
  /** @ignore */
  ngAfterViewInit() {
    super.ngAfterViewInit();
  }
  /** @ignore */
  ngOnDestroy() {
    super.ngOnDestroy();
  }
};
_DndSortableList.ɵfac = function DndSortableList_Factory(t) {
  return new (t || _DndSortableList)(ɵɵdirectiveInject(DndService), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(ChangeDetectorRef));
};
_DndSortableList.ɵcmp = ɵɵdefineComponent({
  type: _DndSortableList,
  selectors: [["dnd-sortable-list"]],
  contentQueries: function DndSortableList_ContentQueries(rf, ctx, dirIndex) {
    if (rf & 1) {
      ɵɵcontentQuery(dirIndex, DndSortableTemplate, 4, TemplateRef);
    }
    if (rf & 2) {
      let _t;
      ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.renderTemplates = _t);
    }
  },
  inputs: {
    template: "template"
  },
  standalone: true,
  features: [ɵɵProvidersFeature([{
    provide: DndSortable,
    useExisting: _DndSortableList
  }]), ɵɵInheritDefinitionFeature, ɵɵNgOnChangesFeature, ɵɵStandaloneFeature],
  decls: 2,
  vars: 0,
  consts: [[4, "ngTemplateOutlet", "ngTemplateOutletContext"]],
  template: function DndSortableList_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵrepeaterCreate(0, DndSortableList_For_1_Template, 1, 4, "ng-container", null, ctx.trackById, true);
    }
    if (rf & 2) {
      ɵɵrepeater(ctx.children);
    }
  },
  dependencies: [NgTemplateOutlet],
  styles: ["[_nghost-%COMP%]{display:block}"],
  changeDetection: 0
});
var DndSortableList = _DndSortableList;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DndSortableList, [{
    type: Component,
    args: [{
      selector: "dnd-sortable-list",
      template: `
    @for (card of children; let i = $index; track trackById(i, card)) {
      <ng-container *ngTemplateOutlet="template; context: { $implicit: contextFor(card, i) }" />
    }
  `,
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [{
        provide: DndSortable,
        useExisting: DndSortableList
      }],
      standalone: true,
      imports: [NgTemplateOutlet],
      styles: [":host{display:block}\n"]
    }]
  }], () => [{
    type: DndService
  }, {
    type: ElementRef
  }, {
    type: ChangeDetectorRef
  }], {
    template: [{
      type: Input
    }],
    renderTemplates: [{
      type: ContentChildren,
      args: [DndSortableTemplate, {
        read: TemplateRef
      }]
    }]
  });
})();
function suggestHalfway(ctx, item, rect, clientOffset) {
  const {
    hover
  } = item;
  const dim = ctx.horizontal ? rect.width || rect.right - rect.left : rect.height || rect.bottom - rect.top;
  const start = ctx.horizontal ? rect.left : rect.top;
  const targetCentre = start + dim / 2;
  const mouse = ctx.horizontal ? clientOffset.x : clientOffset.y;
  const topHalf = mouse < targetCentre;
  let suggestedIndex;
  if (ctx.listId === hover.listId) {
    if (ctx.index < hover.index) {
      suggestedIndex = topHalf ? ctx.index : ctx.index + 1;
    } else {
      suggestedIndex = topHalf ? ctx.index - 1 : ctx.index;
      if (suggestedIndex < 0) {
        suggestedIndex = 0;
      }
    }
  } else {
    suggestedIndex = topHalf ? ctx.index : ctx.index + 1;
  }
  return suggestedIndex;
}
function suggestFixed(ctx) {
  return ctx.index;
}
function getSuggester(trigger) {
  switch (trigger) {
    case HoverTrigger.fixed:
      return suggestFixed;
    default:
      return suggestHalfway;
  }
}
var _scheduleMicroTaskPolyfill = requestAnimationFrame || ((f) => setTimeout(f, 0));
var _DndSortableRenderer = class _DndSortableRenderer {
  get data() {
    return this.context.data;
  }
  get index() {
    return this.context.index;
  }
  get type() {
    return this.context.spec.type;
  }
  get listId() {
    return this.context.listId;
  }
  /** @ignore */
  get accepts() {
    const spec = this.context.spec;
    if (!spec) return [];
    if (Array.isArray(spec.accepts)) {
      return spec.accepts;
    } else {
      return spec.accepts || spec.type;
    }
  }
  /** @ignore */
  get spec() {
    return this.context.spec;
  }
  /** @ignore */
  constructor(dnd, el) {
    this.dnd = dnd;
    this.el = el;
    this.subs = new Subscription();
    this.sameIds = (data, other) => {
      return data && other.data && this.spec.trackBy(data) === this.spec.trackBy(other.data);
    };
    this.target = this.dnd.dropTarget(null, {
      // this is a hover-only situation
      canDrop: () => false,
      hover: (monitor) => {
        this.hover(monitor);
      }
    }, this.subs);
    this.source = this.dnd.dragSource(null, {
      canDrag: (monitor) => {
        return this.getCanDrag(monitor);
      },
      isDragging: (monitor) => {
        return this.isDragging(monitor.getItem());
      },
      beginDrag: (monitor) => {
        const item = this.createItem();
        this.spec.beginDrag && _scheduleMicroTaskPolyfill(() => {
          this.spec.beginDrag?.(item, monitor);
        });
        return item;
      },
      endDrag: (monitor) => {
        const item = monitor.getItem();
        if (item) {
          this.spec.endDrag?.(item, monitor);
        }
      }
    }, this.subs);
    this.isDragging$ = this.source.listen((m) => m.isDragging());
  }
  /** @ignore */
  createItem() {
    return {
      data: this.data,
      index: this.index,
      size: this.size(),
      type: this.type,
      isInternal: true,
      listId: this.listId,
      hover: {
        index: this.index,
        listId: this.listId
      }
    };
  }
  /** @ignore */
  getCanDrag(monitor) {
    if (this.spec.canDrag) {
      return this.spec.canDrag(this.data, this.listId, monitor);
    }
    return true;
  }
  /** @ignore */
  isDragging(item) {
    if (this.spec.isDragging) {
      return item && this.spec.isDragging(this.data, item) || false;
    } else {
      return item && this.sameIds(this.data, item) || false;
    }
  }
  /** @ignore */
  hover(monitor) {
    const item = monitor.getItem();
    const clientOffset = monitor.getClientOffset();
    if (item == null || clientOffset == null) {
      return;
    }
    if (this.isDragging(item) && this.index === item.hover.index && this.listId === item.hover.listId) {
      return;
    }
    const {
      hover
    } = item;
    const suggester = getSuggester(this.context.hoverTrigger);
    const suggestedIndex = suggester(this.context, item, this.rect(), clientOffset);
    if (suggestedIndex < 0) {
      throw new Error("@ng-dnd/sortable: Cannot move a card to an index < 0.");
    }
    if (suggestedIndex !== hover.index || this.listId !== hover.listId) {
      item.hover = {
        index: suggestedIndex,
        listId: this.listId
      };
      if (this.spec.canDrop && !this.spec.canDrop(item, monitor)) {
        return;
      }
      this.spec.hover?.(__spreadValues({}, item), monitor);
    }
  }
  /** @ignore */
  rect() {
    if (!this.el) {
      throw new Error("@ng-dnd/sortable: [dndSortableRender] expected to be attached to a real DOM element");
    }
    const rect = this.el.nativeElement.getBoundingClientRect();
    return rect;
  }
  /** @ignore */
  size() {
    const rect = this.rect();
    const width = rect.width || rect.right - rect.left;
    const height = rect.height || rect.bottom - rect.top;
    return new Size(width, height);
  }
  /** @ignore */
  ngOnChanges() {
    this.target.setTypes(this.accepts);
    this.source.setType(this.type);
  }
  /** @ignore */
  ngOnInit() {
    this.target.setTypes(this.accepts);
    this.source.setType(this.type);
  }
  /** @ignore */
  ngAfterViewInit() {
    if (this.el) {
      this.target.connectDropTarget(this.el.nativeElement);
    }
  }
  /** @ignore */
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
};
_DndSortableRenderer.ɵfac = function DndSortableRenderer_Factory(t) {
  return new (t || _DndSortableRenderer)(ɵɵdirectiveInject(DndService), ɵɵdirectiveInject(ElementRef));
};
_DndSortableRenderer.ɵdir = ɵɵdefineDirective({
  type: _DndSortableRenderer,
  selectors: [["", "dndSortableRender", ""]],
  inputs: {
    context: [InputFlags.None, "dndSortableRender", "context"]
  },
  exportAs: ["dndSortableRender"],
  standalone: true,
  features: [ɵɵNgOnChangesFeature]
});
var DndSortableRenderer = _DndSortableRenderer;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DndSortableRenderer, [{
    type: Directive,
    args: [{
      selector: "[dndSortableRender]",
      exportAs: "dndSortableRender",
      standalone: true
    }]
  }], () => [{
    type: DndService
  }, {
    type: ElementRef
  }], {
    context: [{
      type: Input,
      args: ["dndSortableRender"]
    }]
  });
})();
var SortableEvents;
(function(SortableEvents2) {
  SortableEvents2["BeginDrag"] = "BeginDrag";
  SortableEvents2["Hover"] = "Hover";
  SortableEvents2["Drop"] = "Drop";
  SortableEvents2["EndDrag"] = "EndDrag";
})(SortableEvents || (SortableEvents = {}));
var BeginDragAction = class {
  constructor(type, item) {
    this.type = type;
    this.item = item;
    this.event = SortableEvents.BeginDrag;
  }
};
var HoverAction = class {
  constructor(type, item) {
    this.type = type;
    this.item = item;
    this.event = SortableEvents.Hover;
  }
};
var DropAction = class {
  constructor(type, item) {
    this.type = type;
    this.item = item;
    this.event = SortableEvents.Drop;
  }
};
var EndDragAction = class {
  constructor(type, item) {
    this.type = type;
    this.item = item;
    this.event = SortableEvents.EndDrag;
  }
};
var NgRxSortable = class {
  /**
   * @param store      An @ngrx store instance.
   * @param actionType The type in your own @ngrx/store `ActionTypes` enum you want the sortable actions to use.
   * @param configure  You must provide `trackBy` and `getList` functions here. Hopefully your `getList` will select from the store you passed!
   */
  constructor(store, actionType, configure) {
    this.store = store;
    this.actionType = actionType;
    this.beginDrag = (item, _monitor) => {
      this.store.dispatch(new BeginDragAction(this.actionType, item));
    };
    this.hover = (item, _monitor) => {
      this.store.dispatch(new HoverAction(this.actionType, item));
    };
    this.drop = (item, _monitor) => {
      this.store.dispatch(new DropAction(this.actionType, item));
    };
    this.endDrag = (item, _monitor) => {
      this.store.dispatch(new EndDragAction(this.actionType, item));
    };
    if (configure.type !== void 0) this.type = configure.type;
    if (configure.accepts !== void 0) this.accepts = configure.accepts;
    if (configure.trackBy !== void 0) this.trackBy = configure.trackBy;
    if (configure.getList !== void 0) this.getList = configure.getList;
    if (configure.canDrag !== void 0) this.canDrag = configure.canDrag;
    if (configure.canDrop !== void 0) this.canDrop = configure.canDrop;
    if (configure.isDragging !== void 0) this.isDragging = configure.isDragging;
    if (configure.createData !== void 0) this.createData = configure.createData;
  }
};
var SPILLED_LIST_ID = Symbol("SPILLED_LIST_ID");
function spillTarget(dnd, types, config) {
  const mutate = (item) => {
    if (!item) return null;
    item.hover = {
      listId: SPILLED_LIST_ID,
      index: -1
    };
    return __spreadValues({}, item);
  };
  const hover$ = new Subject();
  const target = dnd.dropTarget(types, {
    hover: (monitor) => {
      if (monitor.canDrop() && monitor.isOver({
        shallow: true
      })) {
        const item = mutate(monitor.getItem());
        hover$.next(item);
      } else {
        hover$.next(null);
      }
    },
    drop: config.drop && ((monitor) => {
      const item = mutate(monitor.getItem());
      if (!monitor.didDrop()) {
        item && config.drop?.(item);
      }
    }) || void 0
  });
  const spilled$ = hover$.pipe(distinctUntilChanged(), filter((a) => !!a));
  const subs = spilled$.subscribe((item) => {
    item && config.hover?.(item);
  });
  target.add(subs);
  return target;
}
var EXPORTS = [DndSortable, DndSortableList, DndSortableTemplate, DndSortableRenderer, DndSortableExternal];
var _DndSortableModule = class _DndSortableModule {
};
_DndSortableModule.ɵfac = function DndSortableModule_Factory(t) {
  return new (t || _DndSortableModule)();
};
_DndSortableModule.ɵmod = ɵɵdefineNgModule({
  type: _DndSortableModule,
  imports: [DndSortable, DndSortableList, DndSortableTemplate, DndSortableRenderer, DndSortableExternal],
  exports: [DndSortable, DndSortableList, DndSortableTemplate, DndSortableRenderer, DndSortableExternal]
});
_DndSortableModule.ɵinj = ɵɵdefineInjector({});
var DndSortableModule = _DndSortableModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DndSortableModule, [{
    type: NgModule,
    args: [{
      imports: EXPORTS,
      exports: EXPORTS
    }]
  }], null, null);
})();
export {
  BeginDragAction,
  DndSortable,
  DndSortableExternal,
  DndSortableList,
  DndSortableModule,
  DndSortableRenderer,
  DndSortableTemplate,
  DropAction,
  EXTERNAL_LIST_ID,
  EndDragAction,
  HoverAction,
  HoverTrigger,
  NgRxSortable,
  SPILLED_LIST_ID,
  Size,
  SortableEvents,
  spillTarget
};
//# sourceMappingURL=@ng-dnd_sortable.js.map
