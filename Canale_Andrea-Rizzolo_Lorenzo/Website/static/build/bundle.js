(function (l, r) {
	if (!l || l.getElementById('livereloadscript')) return;
	r = l.createElement('script');
	r.async = 1;
	r.src =
		'//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1';
	r.id = 'livereloadscript';
	l.getElementsByTagName('head')[0].appendChild(r);
})(self.document);
var app = (function () {
	'use strict';

	function noop() {}
	function assign(tar, src) {
		// @ts-ignore
		for (const k in src) tar[k] = src[k];
		return tar;
	}
	function add_location(element, file, line, column, char) {
		element.__svelte_meta = {
			loc: { file, line, column, char }
		};
	}
	function run(fn) {
		return fn();
	}
	function blank_object() {
		return Object.create(null);
	}
	function run_all(fns) {
		fns.forEach(run);
	}
	function is_function(thing) {
		return typeof thing === 'function';
	}
	function safe_not_equal(a, b) {
		return a != a ? b == b : a !== b || (a && typeof a === 'object') || typeof a === 'function';
	}
	let src_url_equal_anchor;
	function src_url_equal(element_src, url) {
		if (!src_url_equal_anchor) {
			src_url_equal_anchor = document.createElement('a');
		}
		src_url_equal_anchor.href = url;
		return element_src === src_url_equal_anchor.href;
	}
	function is_empty(obj) {
		return Object.keys(obj).length === 0;
	}
	function validate_store(store, name) {
		if (store != null && typeof store.subscribe !== 'function') {
			throw new Error(`'${name}' is not a store with a 'subscribe' method`);
		}
	}
	function subscribe(store, ...callbacks) {
		if (store == null) {
			return noop;
		}
		const unsub = store.subscribe(...callbacks);
		return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
	}
	function get_store_value(store) {
		let value;
		subscribe(store, (_) => (value = _))();
		return value;
	}
	function component_subscribe(component, store, callback) {
		component.$$.on_destroy.push(subscribe(store, callback));
	}
	function create_slot(definition, ctx, $$scope, fn) {
		if (definition) {
			const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
			return definition[0](slot_ctx);
		}
	}
	function get_slot_context(definition, ctx, $$scope, fn) {
		return definition[1] && fn ? assign($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
	}
	function get_slot_changes(definition, $$scope, dirty, fn) {
		if (definition[2] && fn) {
			const lets = definition[2](fn(dirty));
			if ($$scope.dirty === undefined) {
				return lets;
			}
			if (typeof lets === 'object') {
				const merged = [];
				const len = Math.max($$scope.dirty.length, lets.length);
				for (let i = 0; i < len; i += 1) {
					merged[i] = $$scope.dirty[i] | lets[i];
				}
				return merged;
			}
			return $$scope.dirty | lets;
		}
		return $$scope.dirty;
	}
	function update_slot_base(
		slot,
		slot_definition,
		ctx,
		$$scope,
		slot_changes,
		get_slot_context_fn
	) {
		if (slot_changes) {
			const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
			slot.p(slot_context, slot_changes);
		}
	}
	function get_all_dirty_from_scope($$scope) {
		if ($$scope.ctx.length > 32) {
			const dirty = [];
			const length = $$scope.ctx.length / 32;
			for (let i = 0; i < length; i++) {
				dirty[i] = -1;
			}
			return dirty;
		}
		return -1;
	}
	function exclude_internal_props(props) {
		const result = {};
		for (const k in props) if (k[0] !== '$') result[k] = props[k];
		return result;
	}
	function compute_rest_props(props, keys) {
		const rest = {};
		keys = new Set(keys);
		for (const k in props) if (!keys.has(k) && k[0] !== '$') rest[k] = props[k];
		return rest;
	}
	function append(target, node) {
		target.appendChild(node);
	}
	function insert(target, node, anchor) {
		target.insertBefore(node, anchor || null);
	}
	function detach(node) {
		node.parentNode.removeChild(node);
	}
	function element(name) {
		return document.createElement(name);
	}
	function text(data) {
		return document.createTextNode(data);
	}
	function space() {
		return text(' ');
	}
	function empty() {
		return text('');
	}
	function listen(node, event, handler, options) {
		node.addEventListener(event, handler, options);
		return () => node.removeEventListener(event, handler, options);
	}
	function attr(node, attribute, value) {
		if (value == null) node.removeAttribute(attribute);
		else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
	}
	function set_attributes(node, attributes) {
		// @ts-ignore
		const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
		for (const key in attributes) {
			if (attributes[key] == null) {
				node.removeAttribute(key);
			} else if (key === 'style') {
				node.style.cssText = attributes[key];
			} else if (key === '__value') {
				node.value = node[key] = attributes[key];
			} else if (descriptors[key] && descriptors[key].set) {
				node[key] = attributes[key];
			} else {
				attr(node, key, attributes[key]);
			}
		}
	}
	function children(element) {
		return Array.from(element.childNodes);
	}
	function set_input_value(input, value) {
		input.value = value == null ? '' : value;
	}
	function set_style(node, key, value, important) {
		if (value === null) {
			node.style.removeProperty(key);
		} else {
			node.style.setProperty(key, value, important ? 'important' : '');
		}
	}
	function custom_event(type, detail, bubbles = false) {
		const e = document.createEvent('CustomEvent');
		e.initCustomEvent(type, bubbles, false, detail);
		return e;
	}

	let current_component;
	function set_current_component(component) {
		current_component = component;
	}
	function get_current_component() {
		if (!current_component) throw new Error('Function called outside component initialization');
		return current_component;
	}
	function onMount(fn) {
		get_current_component().$$.on_mount.push(fn);
	}
	function onDestroy(fn) {
		get_current_component().$$.on_destroy.push(fn);
	}
	function createEventDispatcher() {
		const component = get_current_component();
		return (type, detail) => {
			const callbacks = component.$$.callbacks[type];
			if (callbacks) {
				// TODO are there situations where events could be dispatched
				// in a server (non-DOM) environment?
				const event = custom_event(type, detail);
				callbacks.slice().forEach((fn) => {
					fn.call(component, event);
				});
			}
		};
	}
	function setContext(key, context) {
		get_current_component().$$.context.set(key, context);
	}
	function getContext(key) {
		return get_current_component().$$.context.get(key);
	}

	const dirty_components = [];
	const binding_callbacks = [];
	const render_callbacks = [];
	const flush_callbacks = [];
	const resolved_promise = Promise.resolve();
	let update_scheduled = false;
	function schedule_update() {
		if (!update_scheduled) {
			update_scheduled = true;
			resolved_promise.then(flush);
		}
	}
	function tick() {
		schedule_update();
		return resolved_promise;
	}
	function add_render_callback(fn) {
		render_callbacks.push(fn);
	}
	// flush() calls callbacks in this order:
	// 1. All beforeUpdate callbacks, in order: parents before children
	// 2. All bind:this callbacks, in reverse order: children before parents.
	// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
	//    for afterUpdates called during the initial onMount, which are called in
	//    reverse order: children before parents.
	// Since callbacks might update component values, which could trigger another
	// call to flush(), the following steps guard against this:
	// 1. During beforeUpdate, any updated components will be added to the
	//    dirty_components array and will cause a reentrant call to flush(). Because
	//    the flush index is kept outside the function, the reentrant call will pick
	//    up where the earlier call left off and go through all dirty components. The
	//    current_component value is saved and restored so that the reentrant call will
	//    not interfere with the "parent" flush() call.
	// 2. bind:this callbacks cannot trigger new flush() calls.
	// 3. During afterUpdate, any updated components will NOT have their afterUpdate
	//    callback called a second time; the seen_callbacks set, outside the flush()
	//    function, guarantees this behavior.
	const seen_callbacks = new Set();
	let flushidx = 0; // Do *not* move this inside the flush() function
	function flush() {
		const saved_component = current_component;
		do {
			// first, call beforeUpdate functions
			// and update components
			while (flushidx < dirty_components.length) {
				const component = dirty_components[flushidx];
				flushidx++;
				set_current_component(component);
				update(component.$$);
			}
			set_current_component(null);
			dirty_components.length = 0;
			flushidx = 0;
			while (binding_callbacks.length) binding_callbacks.pop()();
			// then, once components are updated, call
			// afterUpdate functions. This may cause
			// subsequent updates...
			for (let i = 0; i < render_callbacks.length; i += 1) {
				const callback = render_callbacks[i];
				if (!seen_callbacks.has(callback)) {
					// ...so guard against infinite loops
					seen_callbacks.add(callback);
					callback();
				}
			}
			render_callbacks.length = 0;
		} while (dirty_components.length);
		while (flush_callbacks.length) {
			flush_callbacks.pop()();
		}
		update_scheduled = false;
		seen_callbacks.clear();
		set_current_component(saved_component);
	}
	function update($$) {
		if ($$.fragment !== null) {
			$$.update();
			run_all($$.before_update);
			const dirty = $$.dirty;
			$$.dirty = [-1];
			$$.fragment && $$.fragment.p($$.ctx, dirty);
			$$.after_update.forEach(add_render_callback);
		}
	}
	const outroing = new Set();
	let outros;
	function group_outros() {
		outros = {
			r: 0,
			c: [],
			p: outros // parent group
		};
	}
	function check_outros() {
		if (!outros.r) {
			run_all(outros.c);
		}
		outros = outros.p;
	}
	function transition_in(block, local) {
		if (block && block.i) {
			outroing.delete(block);
			block.i(local);
		}
	}
	function transition_out(block, local, detach, callback) {
		if (block && block.o) {
			if (outroing.has(block)) return;
			outroing.add(block);
			outros.c.push(() => {
				outroing.delete(block);
				if (callback) {
					if (detach) block.d(1);
					callback();
				}
			});
			block.o(local);
		}
	}

	const globals =
		typeof window !== 'undefined'
			? window
			: typeof globalThis !== 'undefined'
			? globalThis
			: global;

	function get_spread_update(levels, updates) {
		const update = {};
		const to_null_out = {};
		const accounted_for = { $$scope: 1 };
		let i = levels.length;
		while (i--) {
			const o = levels[i];
			const n = updates[i];
			if (n) {
				for (const key in o) {
					if (!(key in n)) to_null_out[key] = 1;
				}
				for (const key in n) {
					if (!accounted_for[key]) {
						update[key] = n[key];
						accounted_for[key] = 1;
					}
				}
				levels[i] = n;
			} else {
				for (const key in o) {
					accounted_for[key] = 1;
				}
			}
		}
		for (const key in to_null_out) {
			if (!(key in update)) update[key] = undefined;
		}
		return update;
	}
	function get_spread_object(spread_props) {
		return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
	}
	function create_component(block) {
		block && block.c();
	}
	function mount_component(component, target, anchor, customElement) {
		const { fragment, on_mount, on_destroy, after_update } = component.$$;
		fragment && fragment.m(target, anchor);
		if (!customElement) {
			// onMount happens before the initial afterUpdate
			add_render_callback(() => {
				const new_on_destroy = on_mount.map(run).filter(is_function);
				if (on_destroy) {
					on_destroy.push(...new_on_destroy);
				} else {
					// Edge case - component was destroyed immediately,
					// most likely as a result of a binding initialising
					run_all(new_on_destroy);
				}
				component.$$.on_mount = [];
			});
		}
		after_update.forEach(add_render_callback);
	}
	function destroy_component(component, detaching) {
		const $$ = component.$$;
		if ($$.fragment !== null) {
			run_all($$.on_destroy);
			$$.fragment && $$.fragment.d(detaching);
			// TODO null out other refs, including component.$$ (but need to
			// preserve final state?)
			$$.on_destroy = $$.fragment = null;
			$$.ctx = [];
		}
	}
	function make_dirty(component, i) {
		if (component.$$.dirty[0] === -1) {
			dirty_components.push(component);
			schedule_update();
			component.$$.dirty.fill(0);
		}
		component.$$.dirty[(i / 31) | 0] |= 1 << i % 31;
	}
	function init(
		component,
		options,
		instance,
		create_fragment,
		not_equal,
		props,
		append_styles,
		dirty = [-1]
	) {
		const parent_component = current_component;
		set_current_component(component);
		const $$ = (component.$$ = {
			fragment: null,
			ctx: null,
			// state
			props,
			update: noop,
			not_equal,
			bound: blank_object(),
			// lifecycle
			on_mount: [],
			on_destroy: [],
			on_disconnect: [],
			before_update: [],
			after_update: [],
			context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
			// everything else
			callbacks: blank_object(),
			dirty,
			skip_bound: false,
			root: options.target || parent_component.$$.root
		});
		append_styles && append_styles($$.root);
		let ready = false;
		$$.ctx = instance
			? instance(component, options.props || {}, (i, ret, ...rest) => {
					const value = rest.length ? rest[0] : ret;
					if ($$.ctx && not_equal($$.ctx[i], ($$.ctx[i] = value))) {
						if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
						if (ready) make_dirty(component, i);
					}
					return ret;
			  })
			: [];
		$$.update();
		ready = true;
		run_all($$.before_update);
		// `false` as a special case of no DOM component
		$$.fragment = create_fragment ? create_fragment($$.ctx) : false;
		if (options.target) {
			if (options.hydrate) {
				const nodes = children(options.target);
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				$$.fragment && $$.fragment.l(nodes);
				nodes.forEach(detach);
			} else {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				$$.fragment && $$.fragment.c();
			}
			if (options.intro) transition_in(component.$$.fragment);
			mount_component(component, options.target, options.anchor, options.customElement);
			flush();
		}
		set_current_component(parent_component);
	}
	/**
	 * Base class for Svelte components. Used when dev=false.
	 */
	class SvelteComponent {
		$destroy() {
			destroy_component(this, 1);
			this.$destroy = noop;
		}
		$on(type, callback) {
			const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
			callbacks.push(callback);
			return () => {
				const index = callbacks.indexOf(callback);
				if (index !== -1) callbacks.splice(index, 1);
			};
		}
		$set($$props) {
			if (this.$$set && !is_empty($$props)) {
				this.$$.skip_bound = true;
				this.$$set($$props);
				this.$$.skip_bound = false;
			}
		}
	}

	function dispatch_dev(type, detail) {
		document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
	}
	function append_dev(target, node) {
		dispatch_dev('SvelteDOMInsert', { target, node });
		append(target, node);
	}
	function insert_dev(target, node, anchor) {
		dispatch_dev('SvelteDOMInsert', { target, node, anchor });
		insert(target, node, anchor);
	}
	function detach_dev(node) {
		dispatch_dev('SvelteDOMRemove', { node });
		detach(node);
	}
	function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
		const modifiers =
			options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
		if (has_prevent_default) modifiers.push('preventDefault');
		if (has_stop_propagation) modifiers.push('stopPropagation');
		dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
		const dispose = listen(node, event, handler, options);
		return () => {
			dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
			dispose();
		};
	}
	function attr_dev(node, attribute, value) {
		attr(node, attribute, value);
		if (value == null) dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
		else dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
	}
	function prop_dev(node, property, value) {
		node[property] = value;
		dispatch_dev('SvelteDOMSetProperty', { node, property, value });
	}
	function set_data_dev(text, data) {
		data = '' + data;
		if (text.wholeText === data) return;
		dispatch_dev('SvelteDOMSetData', { node: text, data });
		text.data = data;
	}
	function validate_slots(name, slot, keys) {
		for (const slot_key of Object.keys(slot)) {
			if (!~keys.indexOf(slot_key)) {
				console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
			}
		}
	}
	/**
	 * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
	 */
	class SvelteComponentDev extends SvelteComponent {
		constructor(options) {
			if (!options || (!options.target && !options.$$inline)) {
				throw new Error("'target' is a required option");
			}
			super();
		}
		$destroy() {
			super.$destroy();
			this.$destroy = () => {
				console.warn('Component was already destroyed'); // eslint-disable-line no-console
			};
		}
		$capture_state() {}
		$inject_state() {}
	}

	/*
	 * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
	 *
	 * https://github.com/reach/router/blob/master/LICENSE
	 */

	const isUndefined = (value) => typeof value === 'undefined';

	const isFunction = (value) => typeof value === 'function';

	const isNumber = (value) => typeof value === 'number';

	/**
	 * Decides whether a given `event` should result in a navigation or not.
	 * @param {object} event
	 */
	function shouldNavigate(event) {
		return (
			!event.defaultPrevented &&
			event.button === 0 &&
			!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
		);
	}

	function createCounter() {
		let i = 0;
		/**
		 * Returns an id and increments the internal state
		 * @returns {number}
		 */
		return () => i++;
	}

	/**
	 * Create a globally unique id
	 *
	 * @returns {string} An id
	 */
	function createGlobalId() {
		return Math.random().toString(36).substring(2);
	}

	const isSSR = typeof window === 'undefined';

	function addListener(target, type, handler) {
		target.addEventListener(type, handler);
		return () => target.removeEventListener(type, handler);
	}

	const subscriber_queue = [];
	/**
	 * Creates a `Readable` store that allows reading by subscription.
	 * @param value initial value
	 * @param {StartStopNotifier}start start and stop notifications for subscriptions
	 */
	function readable(value, start) {
		return {
			subscribe: writable(value, start).subscribe
		};
	}
	/**
	 * Create a `Writable` store that allows both updating and reading by subscription.
	 * @param {*=}value initial value
	 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
	 */
	function writable(value, start = noop) {
		let stop;
		const subscribers = new Set();
		function set(new_value) {
			if (safe_not_equal(value, new_value)) {
				value = new_value;
				if (stop) {
					// store is ready
					const run_queue = !subscriber_queue.length;
					for (const subscriber of subscribers) {
						subscriber[1]();
						subscriber_queue.push(subscriber, value);
					}
					if (run_queue) {
						for (let i = 0; i < subscriber_queue.length; i += 2) {
							subscriber_queue[i][0](subscriber_queue[i + 1]);
						}
						subscriber_queue.length = 0;
					}
				}
			}
		}
		function update(fn) {
			set(fn(value));
		}
		function subscribe(run, invalidate = noop) {
			const subscriber = [run, invalidate];
			subscribers.add(subscriber);
			if (subscribers.size === 1) {
				stop = start(set) || noop;
			}
			run(value);
			return () => {
				subscribers.delete(subscriber);
				if (subscribers.size === 0) {
					stop();
					stop = null;
				}
			};
		}
		return { set, update, subscribe };
	}
	function derived(stores, fn, initial_value) {
		const single = !Array.isArray(stores);
		const stores_array = single ? [stores] : stores;
		const auto = fn.length < 2;
		return readable(initial_value, (set) => {
			let inited = false;
			const values = [];
			let pending = 0;
			let cleanup = noop;
			const sync = () => {
				if (pending) {
					return;
				}
				cleanup();
				const result = fn(single ? values[0] : values, set);
				if (auto) {
					set(result);
				} else {
					cleanup = is_function(result) ? result : noop;
				}
			};
			const unsubscribers = stores_array.map((store, i) =>
				subscribe(
					store,
					(value) => {
						values[i] = value;
						pending &= ~(1 << i);
						if (inited) {
							sync();
						}
					},
					() => {
						pending |= 1 << i;
					}
				)
			);
			inited = true;
			sync();
			return function stop() {
				run_all(unsubscribers);
				cleanup();
			};
		});
	}

	/*
	 * Adapted from https://github.com/EmilTholin/svelte-routing
	 *
	 * https://github.com/EmilTholin/svelte-routing/blob/master/LICENSE
	 */

	const createKey = (ctxName) => `@@svnav-ctx__${ctxName}`;

	// Use strings instead of objects, so different versions of
	// svelte-navigator can potentially still work together
	const LOCATION = createKey('LOCATION');
	const ROUTER = createKey('ROUTER');
	const ROUTE = createKey('ROUTE');
	const ROUTE_PARAMS = createKey('ROUTE_PARAMS');
	const FOCUS_ELEM = createKey('FOCUS_ELEM');

	const paramRegex = /^:(.+)/;

	/**
	 * Check if `string` starts with `search`
	 * @param {string} string
	 * @param {string} search
	 * @return {boolean}
	 */
	const startsWith = (string, search) => string.substr(0, search.length) === search;

	/**
	 * Check if `segment` is a root segment
	 * @param {string} segment
	 * @return {boolean}
	 */
	const isRootSegment = (segment) => segment === '';

	/**
	 * Check if `segment` is a dynamic segment
	 * @param {string} segment
	 * @return {boolean}
	 */
	const isDynamic = (segment) => paramRegex.test(segment);

	/**
	 * Check if `segment` is a splat
	 * @param {string} segment
	 * @return {boolean}
	 */
	const isSplat = (segment) => segment[0] === '*';

	/**
	 * Strip potention splat and splatname of the end of a path
	 * @param {string} str
	 * @return {string}
	 */
	const stripSplat = (str) => str.replace(/\*.*$/, '');

	/**
	 * Strip `str` of potential start and end `/`
	 * @param {string} str
	 * @return {string}
	 */
	const stripSlashes = (str) => str.replace(/(^\/+|\/+$)/g, '');

	/**
	 * Split up the URI into segments delimited by `/`
	 * @param {string} uri
	 * @return {string[]}
	 */
	function segmentize(uri, filterFalsy = false) {
		const segments = stripSlashes(uri).split('/');
		return filterFalsy ? segments.filter(Boolean) : segments;
	}

	/**
	 * Add the query to the pathname if a query is given
	 * @param {string} pathname
	 * @param {string} [query]
	 * @return {string}
	 */
	const addQuery = (pathname, query) => pathname + (query ? `?${query}` : '');

	/**
	 * Normalizes a basepath
	 *
	 * @param {string} path
	 * @returns {string}
	 *
	 * @example
	 * normalizePath("base/path/") // -> "/base/path"
	 */
	const normalizePath = (path) => `/${stripSlashes(path)}`;

	/**
	 * Joins and normalizes multiple path fragments
	 *
	 * @param {...string} pathFragments
	 * @returns {string}
	 */
	function join(...pathFragments) {
		const joinFragment = (fragment) => segmentize(fragment, true).join('/');
		const joinedSegments = pathFragments.map(joinFragment).join('/');
		return normalizePath(joinedSegments);
	}

	// We start from 1 here, so we can check if an origin id has been passed
	// by using `originId || <fallback>`
	const LINK_ID = 1;
	const ROUTE_ID = 2;
	const ROUTER_ID = 3;
	const USE_FOCUS_ID = 4;
	const USE_LOCATION_ID = 5;
	const USE_MATCH_ID = 6;
	const USE_NAVIGATE_ID = 7;
	const USE_PARAMS_ID = 8;
	const USE_RESOLVABLE_ID = 9;
	const USE_RESOLVE_ID = 10;
	const NAVIGATE_ID = 11;

	const labels = {
		[LINK_ID]: 'Link',
		[ROUTE_ID]: 'Route',
		[ROUTER_ID]: 'Router',
		[USE_FOCUS_ID]: 'useFocus',
		[USE_LOCATION_ID]: 'useLocation',
		[USE_MATCH_ID]: 'useMatch',
		[USE_NAVIGATE_ID]: 'useNavigate',
		[USE_PARAMS_ID]: 'useParams',
		[USE_RESOLVABLE_ID]: 'useResolvable',
		[USE_RESOLVE_ID]: 'useResolve',
		[NAVIGATE_ID]: 'navigate'
	};

	const createLabel = (labelId) => labels[labelId];

	function createIdentifier(labelId, props) {
		let attr;
		if (labelId === ROUTE_ID) {
			attr = props.path ? `path="${props.path}"` : 'default';
		} else if (labelId === LINK_ID) {
			attr = `to="${props.to}"`;
		} else if (labelId === ROUTER_ID) {
			attr = `basepath="${props.basepath || ''}"`;
		}
		return `<${createLabel(labelId)} ${attr || ''} />`;
	}

	function createMessage(labelId, message, props, originId) {
		const origin = props && createIdentifier(originId || labelId, props);
		const originMsg = origin ? `\n\nOccurred in: ${origin}` : '';
		const label = createLabel(labelId);
		const msg = isFunction(message) ? message(label) : message;
		return `<${label}> ${msg}${originMsg}`;
	}

	const createMessageHandler =
		(handler) =>
		(...args) =>
			handler(createMessage(...args));

	const fail = createMessageHandler((message) => {
		throw new Error(message);
	});

	// eslint-disable-next-line no-console
	const warn = createMessageHandler(console.warn);

	const SEGMENT_POINTS = 4;
	const STATIC_POINTS = 3;
	const DYNAMIC_POINTS = 2;
	const SPLAT_PENALTY = 1;
	const ROOT_POINTS = 1;

	/**
	 * Score a route depending on how its individual segments look
	 * @param {object} route
	 * @param {number} index
	 * @return {object}
	 */
	function rankRoute(route, index) {
		const score = route.default
			? 0
			: segmentize(route.fullPath).reduce((acc, segment) => {
					let nextScore = acc;
					nextScore += SEGMENT_POINTS;

					if (isRootSegment(segment)) {
						nextScore += ROOT_POINTS;
					} else if (isDynamic(segment)) {
						nextScore += DYNAMIC_POINTS;
					} else if (isSplat(segment)) {
						nextScore -= SEGMENT_POINTS + SPLAT_PENALTY;
					} else {
						nextScore += STATIC_POINTS;
					}

					return nextScore;
			  }, 0);

		return { route, score, index };
	}

	/**
	 * Give a score to all routes and sort them on that
	 * @param {object[]} routes
	 * @return {object[]}
	 */
	function rankRoutes(routes) {
		return (
			routes
				.map(rankRoute)
				// If two routes have the exact same score, we go by index instead
				.sort((a, b) => {
					if (a.score < b.score) {
						return 1;
					}
					if (a.score > b.score) {
						return -1;
					}
					return a.index - b.index;
				})
		);
	}

	/**
	 * Ranks and picks the best route to match. Each segment gets the highest
	 * amount of points, then the type of segment gets an additional amount of
	 * points where
	 *
	 *  static > dynamic > splat > root
	 *
	 * This way we don't have to worry about the order of our routes, let the
	 * computers do it.
	 *
	 * A route looks like this
	 *
	 *  { fullPath, default, value }
	 *
	 * And a returned match looks like:
	 *
	 *  { route, params, uri }
	 *
	 * @param {object[]} routes
	 * @param {string} uri
	 * @return {?object}
	 */
	function pick(routes, uri) {
		let bestMatch;
		let defaultMatch;

		const [uriPathname] = uri.split('?');
		const uriSegments = segmentize(uriPathname);
		const isRootUri = uriSegments[0] === '';
		const ranked = rankRoutes(routes);

		for (let i = 0, l = ranked.length; i < l; i++) {
			const { route } = ranked[i];
			let missed = false;
			const params = {};

			// eslint-disable-next-line no-shadow
			const createMatch = (uri) => ({ ...route, params, uri });

			if (route.default) {
				defaultMatch = createMatch(uri);
				continue;
			}

			const routeSegments = segmentize(route.fullPath);
			const max = Math.max(uriSegments.length, routeSegments.length);
			let index = 0;

			for (; index < max; index++) {
				const routeSegment = routeSegments[index];
				const uriSegment = uriSegments[index];

				if (!isUndefined(routeSegment) && isSplat(routeSegment)) {
					// Hit a splat, just grab the rest, and return a match
					// uri:   /files/documents/work
					// route: /files/* or /files/*splatname
					const splatName = routeSegment === '*' ? '*' : routeSegment.slice(1);

					params[splatName] = uriSegments.slice(index).map(decodeURIComponent).join('/');
					break;
				}

				if (isUndefined(uriSegment)) {
					// URI is shorter than the route, no match
					// uri:   /users
					// route: /users/:userId
					missed = true;
					break;
				}

				const dynamicMatch = paramRegex.exec(routeSegment);

				if (dynamicMatch && !isRootUri) {
					const value = decodeURIComponent(uriSegment);
					params[dynamicMatch[1]] = value;
				} else if (routeSegment !== uriSegment) {
					// Current segments don't match, not dynamic, not splat, so no match
					// uri:   /users/123/settings
					// route: /users/:id/profile
					missed = true;
					break;
				}
			}

			if (!missed) {
				bestMatch = createMatch(join(...uriSegments.slice(0, index)));
				break;
			}
		}

		return bestMatch || defaultMatch || null;
	}

	/**
	 * Check if the `route.fullPath` matches the `uri`.
	 * @param {Object} route
	 * @param {string} uri
	 * @return {?object}
	 */
	function match(route, uri) {
		return pick([route], uri);
	}

	/**
	 * Resolve URIs as though every path is a directory, no files. Relative URIs
	 * in the browser can feel awkward because not only can you be "in a directory",
	 * you can be "at a file", too. For example:
	 *
	 *  browserSpecResolve('foo', '/bar/') => /bar/foo
	 *  browserSpecResolve('foo', '/bar') => /foo
	 *
	 * But on the command line of a file system, it's not as complicated. You can't
	 * `cd` from a file, only directories. This way, links have to know less about
	 * their current path. To go deeper you can do this:
	 *
	 *  <Link to="deeper"/>
	 *  // instead of
	 *  <Link to=`{${props.uri}/deeper}`/>
	 *
	 * Just like `cd`, if you want to go deeper from the command line, you do this:
	 *
	 *  cd deeper
	 *  # not
	 *  cd $(pwd)/deeper
	 *
	 * By treating every path as a directory, linking to relative paths should
	 * require less contextual information and (fingers crossed) be more intuitive.
	 * @param {string} to
	 * @param {string} base
	 * @return {string}
	 */
	function resolve(to, base) {
		// /foo/bar, /baz/qux => /foo/bar
		if (startsWith(to, '/')) {
			return to;
		}

		const [toPathname, toQuery] = to.split('?');
		const [basePathname] = base.split('?');
		const toSegments = segmentize(toPathname);
		const baseSegments = segmentize(basePathname);

		// ?a=b, /users?b=c => /users?a=b
		if (toSegments[0] === '') {
			return addQuery(basePathname, toQuery);
		}

		// profile, /users/789 => /users/789/profile
		if (!startsWith(toSegments[0], '.')) {
			const pathname = baseSegments.concat(toSegments).join('/');
			return addQuery((basePathname === '/' ? '' : '/') + pathname, toQuery);
		}

		// ./       , /users/123 => /users/123
		// ../      , /users/123 => /users
		// ../..    , /users/123 => /
		// ../../one, /a/b/c/d   => /a/b/one
		// .././one , /a/b/c/d   => /a/b/c/one
		const allSegments = baseSegments.concat(toSegments);
		const segments = [];

		allSegments.forEach((segment) => {
			if (segment === '..') {
				segments.pop();
			} else if (segment !== '.') {
				segments.push(segment);
			}
		});

		return addQuery(`/${segments.join('/')}`, toQuery);
	}

	/**
	 * Normalizes a location for consumption by `Route` children and the `Router`.
	 * It removes the apps basepath from the pathname
	 * and sets default values for `search` and `hash` properties.
	 *
	 * @param {Object} location The current global location supplied by the history component
	 * @param {string} basepath The applications basepath (i.e. when serving from a subdirectory)
	 *
	 * @returns The normalized location
	 */
	function normalizeLocation(location, basepath) {
		const { pathname, hash = '', search = '', state } = location;
		const baseSegments = segmentize(basepath, true);
		const pathSegments = segmentize(pathname, true);
		while (baseSegments.length) {
			if (baseSegments[0] !== pathSegments[0]) {
				fail(
					ROUTER_ID,
					`Invalid state: All locations must begin with the basepath "${basepath}", found "${pathname}"`
				);
			}
			baseSegments.shift();
			pathSegments.shift();
		}
		return {
			pathname: join(...pathSegments),
			hash,
			search,
			state
		};
	}

	const normalizeUrlFragment = (frag) => (frag.length === 1 ? '' : frag);

	/**
	 * Creates a location object from an url.
	 * It is used to create a location from the url prop used in SSR
	 *
	 * @param {string} url The url string (e.g. "/path/to/somewhere")
	 *
	 * @returns {{ pathname: string; search: string; hash: string }} The location
	 */
	function createLocation(url) {
		const searchIndex = url.indexOf('?');
		const hashIndex = url.indexOf('#');
		const hasSearchIndex = searchIndex !== -1;
		const hasHashIndex = hashIndex !== -1;
		const hash = hasHashIndex ? normalizeUrlFragment(url.substr(hashIndex)) : '';
		const pathnameAndSearch = hasHashIndex ? url.substr(0, hashIndex) : url;
		const search = hasSearchIndex
			? normalizeUrlFragment(pathnameAndSearch.substr(searchIndex))
			: '';
		const pathname = hasSearchIndex ? pathnameAndSearch.substr(0, searchIndex) : pathnameAndSearch;
		return { pathname, search, hash };
	}

	/**
	 * Resolves a link relative to the parent Route and the Routers basepath.
	 *
	 * @param {string} path The given path, that will be resolved
	 * @param {string} routeBase The current Routes base path
	 * @param {string} appBase The basepath of the app. Used, when serving from a subdirectory
	 * @returns {string} The resolved path
	 *
	 * @example
	 * resolveLink("relative", "/routeBase", "/") // -> "/routeBase/relative"
	 * resolveLink("/absolute", "/routeBase", "/") // -> "/absolute"
	 * resolveLink("relative", "/routeBase", "/base") // -> "/base/routeBase/relative"
	 * resolveLink("/absolute", "/routeBase", "/base") // -> "/base/absolute"
	 */
	function resolveLink(path, routeBase, appBase) {
		return join(appBase, resolve(path, routeBase));
	}

	/**
	 * Get the uri for a Route, by matching it against the current location.
	 *
	 * @param {string} routePath The Routes resolved path
	 * @param {string} pathname The current locations pathname
	 */
	function extractBaseUri(routePath, pathname) {
		const fullPath = normalizePath(stripSplat(routePath));
		const baseSegments = segmentize(fullPath, true);
		const pathSegments = segmentize(pathname, true).slice(0, baseSegments.length);
		const routeMatch = match({ fullPath }, join(...pathSegments));
		return routeMatch && routeMatch.uri;
	}

	/*
	 * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
	 *
	 * https://github.com/reach/router/blob/master/LICENSE
	 */

	const POP = 'POP';
	const PUSH = 'PUSH';
	const REPLACE = 'REPLACE';

	function getLocation(source) {
		return {
			...source.location,
			pathname: encodeURI(decodeURI(source.location.pathname)),
			state: source.history.state,
			_key: (source.history.state && source.history.state._key) || 'initial'
		};
	}

	function createHistory(source) {
		let listeners = [];
		let location = getLocation(source);
		let action = POP;

		const notifyListeners = (listenerFns = listeners) =>
			listenerFns.forEach((listener) => listener({ location, action }));

		return {
			get location() {
				return location;
			},
			listen(listener) {
				listeners.push(listener);

				const popstateListener = () => {
					location = getLocation(source);
					action = POP;
					notifyListeners([listener]);
				};

				// Call listener when it is registered
				notifyListeners([listener]);

				const unlisten = addListener(source, 'popstate', popstateListener);
				return () => {
					unlisten();
					listeners = listeners.filter((fn) => fn !== listener);
				};
			},
			/**
			 * Navigate to a new absolute route.
			 *
			 * @param {string|number} to The path to navigate to.
			 *
			 * If `to` is a number we will navigate to the stack entry index + `to`
			 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
			 * @param {Object} options
			 * @param {*} [options.state] The state will be accessible through `location.state`
			 * @param {boolean} [options.replace=false] Replace the current entry in the history
			 * stack, instead of pushing on a new one
			 */
			navigate(to, options) {
				const { state = {}, replace = false } = options || {};
				action = replace ? REPLACE : PUSH;
				if (isNumber(to)) {
					if (options) {
						warn(
							NAVIGATE_ID,
							'Navigation options (state or replace) are not supported, ' +
								'when passing a number as the first argument to navigate. ' +
								'They are ignored.'
						);
					}
					action = POP;
					source.history.go(to);
				} else {
					const keyedState = { ...state, _key: createGlobalId() };
					// try...catch iOS Safari limits to 100 pushState calls
					try {
						source.history[replace ? 'replaceState' : 'pushState'](keyedState, '', to);
					} catch (e) {
						source.location[replace ? 'replace' : 'assign'](to);
					}
				}

				location = getLocation(source);
				notifyListeners();
			}
		};
	}

	function createStackFrame(state, uri) {
		return { ...createLocation(uri), state };
	}

	// Stores history entries in memory for testing or other platforms like Native
	function createMemorySource(initialPathname = '/') {
		let index = 0;
		let stack = [createStackFrame(null, initialPathname)];

		return {
			// This is just for testing...
			get entries() {
				return stack;
			},
			get location() {
				return stack[index];
			},
			addEventListener() {},
			removeEventListener() {},
			history: {
				get state() {
					return stack[index].state;
				},
				pushState(state, title, uri) {
					index++;
					// Throw away anything in the stack with an index greater than the current index.
					// This happens, when we go back using `go(-n)`. The index is now less than `stack.length`.
					// If we call `go(+n)` the stack entries with an index greater than the current index can
					// be reused.
					// However, if we navigate to a path, instead of a number, we want to create a new branch
					// of navigation.
					stack = stack.slice(0, index);
					stack.push(createStackFrame(state, uri));
				},
				replaceState(state, title, uri) {
					stack[index] = createStackFrame(state, uri);
				},
				go(to) {
					const newIndex = index + to;
					if (newIndex < 0 || newIndex > stack.length - 1) {
						return;
					}
					index = newIndex;
				}
			}
		};
	}

	// Global history uses window.history as the source if available,
	// otherwise a memory history
	const canUseDOM = !!(!isSSR && window.document && window.document.createElement);
	// Use memory history in iframes (for example in Svelte REPL)
	const isEmbeddedPage = !isSSR && window.location.origin === 'null';
	const globalHistory = createHistory(canUseDOM && !isEmbeddedPage ? window : createMemorySource());

	// We need to keep the focus candidate in a separate file, so svelte does
	// not update, when we mutate it.
	// Also, we need a single global reference, because taking focus needs to
	// work globally, even if we have multiple top level routers
	// eslint-disable-next-line import/no-mutable-exports
	let focusCandidate = null;

	// eslint-disable-next-line import/no-mutable-exports
	let initialNavigation = true;

	/**
	 * Check if RouterA is above RouterB in the document
	 * @param {number} routerIdA The first Routers id
	 * @param {number} routerIdB The second Routers id
	 */
	function isAbove(routerIdA, routerIdB) {
		const routerMarkers = document.querySelectorAll('[data-svnav-router]');
		for (let i = 0; i < routerMarkers.length; i++) {
			const node = routerMarkers[i];
			const currentId = Number(node.dataset.svnavRouter);
			if (currentId === routerIdA) return true;
			if (currentId === routerIdB) return false;
		}
		return false;
	}

	/**
     * Check if a Route candidate is the best choice to move focus to,
     * and store the best match.
     * @param {{
         level: number;
         routerId: number;
         route: {
           id: number;
           focusElement: import("svelte/store").Readable<Promise<Element>|null>;
         }
       }} item A Route candidate, that updated and is visible after a navigation
     */
	function pushFocusCandidate(item) {
		if (
			// Best candidate if it's the only candidate...
			!focusCandidate ||
			// Route is nested deeper, than previous candidate
			// -> Route change was triggered in the deepest affected
			// Route, so that's were focus should move to
			item.level > focusCandidate.level ||
			// If the level is identical, we want to focus the first Route in the document,
			// so we pick the first Router lookin from page top to page bottom.
			(item.level === focusCandidate.level && isAbove(item.routerId, focusCandidate.routerId))
		) {
			focusCandidate = item;
		}
	}

	/**
	 * Reset the focus candidate.
	 */
	function clearFocusCandidate() {
		focusCandidate = null;
	}

	function initialNavigationOccurred() {
		initialNavigation = false;
	}

	/*
	 * `focus` Adapted from https://github.com/oaf-project/oaf-side-effects/blob/master/src/index.ts
	 *
	 * https://github.com/oaf-project/oaf-side-effects/blob/master/LICENSE
	 */
	function focus(elem) {
		if (!elem) return false;
		const TABINDEX = 'tabindex';
		try {
			if (!elem.hasAttribute(TABINDEX)) {
				elem.setAttribute(TABINDEX, '-1');
				let unlisten;
				// We remove tabindex after blur to avoid weird browser behavior
				// where a mouse click can activate elements with tabindex="-1".
				const blurListener = () => {
					elem.removeAttribute(TABINDEX);
					unlisten();
				};
				unlisten = addListener(elem, 'blur', blurListener);
			}
			elem.focus();
			return document.activeElement === elem;
		} catch (e) {
			// Apparently trying to focus a disabled element in IE can throw.
			// See https://stackoverflow.com/a/1600194/2476884
			return false;
		}
	}

	function isEndMarker(elem, id) {
		return Number(elem.dataset.svnavRouteEnd) === id;
	}

	function isHeading(elem) {
		return /^H[1-6]$/i.test(elem.tagName);
	}

	function query(selector, parent = document) {
		return parent.querySelector(selector);
	}

	function queryHeading(id) {
		const marker = query(`[data-svnav-route-start="${id}"]`);
		let current = marker.nextElementSibling;
		while (!isEndMarker(current, id)) {
			if (isHeading(current)) {
				return current;
			}
			const heading = query('h1,h2,h3,h4,h5,h6', current);
			if (heading) {
				return heading;
			}
			current = current.nextElementSibling;
		}
		return null;
	}

	function handleFocus(route) {
		Promise.resolve(get_store_value(route.focusElement)).then((elem) => {
			const focusElement = elem || queryHeading(route.id);
			if (!focusElement) {
				warn(
					ROUTER_ID,
					'Could not find an element to focus. ' +
						'You should always render a header for accessibility reasons, ' +
						'or set a custom focus element via the "useFocus" hook. ' +
						"If you don't want this Route or Router to manage focus, " +
						'pass "primary={false}" to it.',
					route,
					ROUTE_ID
				);
			}
			const headingFocused = focus(focusElement);
			if (headingFocused) return;
			focus(document.documentElement);
		});
	}

	const createTriggerFocus =
		(a11yConfig, announcementText, location) => (manageFocus, announceNavigation) =>
			// Wait until the dom is updated, so we can look for headings
			tick().then(() => {
				if (!focusCandidate || initialNavigation) {
					initialNavigationOccurred();
					return;
				}
				if (manageFocus) {
					handleFocus(focusCandidate.route);
				}
				if (a11yConfig.announcements && announceNavigation) {
					const { path, fullPath, meta, params, uri } = focusCandidate.route;
					const announcementMessage = a11yConfig.createAnnouncement(
						{ path, fullPath, meta, params, uri },
						get_store_value(location)
					);
					Promise.resolve(announcementMessage).then((message) => {
						announcementText.set(message);
					});
				}
				clearFocusCandidate();
			});

	const visuallyHiddenStyle =
		'position:fixed;' +
		'top:-1px;' +
		'left:0;' +
		'width:1px;' +
		'height:1px;' +
		'padding:0;' +
		'overflow:hidden;' +
		'clip:rect(0,0,0,0);' +
		'white-space:nowrap;' +
		'border:0;';

	/* node_modules/svelte-navigator/src/Router.svelte generated by Svelte v3.46.4 */

	const file$6 = 'node_modules/svelte-navigator/src/Router.svelte';

	// (195:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}
	function create_if_block$1(ctx) {
		let div;
		let t;

		const block = {
			c: function create() {
				div = element('div');
				t = text(/*$announcementText*/ ctx[0]);
				attr_dev(div, 'role', 'status');
				attr_dev(div, 'aria-atomic', 'true');
				attr_dev(div, 'aria-live', 'polite');
				attr_dev(div, 'style', visuallyHiddenStyle);
				add_location(div, file$6, 195, 1, 5906);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
				append_dev(div, t);
			},
			p: function update(ctx, dirty) {
				if (dirty[0] & /*$announcementText*/ 1) set_data_dev(t, /*$announcementText*/ ctx[0]);
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(div);
			}
		};

		dispatch_dev('SvelteRegisterBlock', {
			block,
			id: create_if_block$1.name,
			type: 'if',
			source: '(195:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}',
			ctx
		});

		return block;
	}

	function create_fragment$6(ctx) {
		let div;
		let t0;
		let t1;
		let if_block_anchor;
		let current;
		const default_slot_template = /*#slots*/ ctx[20].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], null);
		let if_block =
			/*isTopLevelRouter*/ ctx[2] &&
			/*manageFocus*/ ctx[4] &&
			/*a11yConfig*/ ctx[1].announcements &&
			create_if_block$1(ctx);

		const block = {
			c: function create() {
				div = element('div');
				t0 = space();
				if (default_slot) default_slot.c();
				t1 = space();
				if (if_block) if_block.c();
				if_block_anchor = empty();
				set_style(div, 'display', 'none');
				attr_dev(div, 'aria-hidden', 'true');
				attr_dev(div, 'data-svnav-router', /*routerId*/ ctx[3]);
				add_location(div, file$6, 190, 0, 5750);
			},
			l: function claim(nodes) {
				throw new Error(
					'options.hydrate only works if the component was compiled with the `hydratable: true` option'
				);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
				insert_dev(target, t0, anchor);

				if (default_slot) {
					default_slot.m(target, anchor);
				}

				insert_dev(target, t1, anchor);
				if (if_block) if_block.m(target, anchor);
				insert_dev(target, if_block_anchor, anchor);
				current = true;
			},
			p: function update(ctx, dirty) {
				if (default_slot) {
					if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 524288)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[19],
							!current
								? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
								: get_slot_changes(default_slot_template, /*$$scope*/ ctx[19], dirty, null),
							null
						);
					}
				}

				if (
					/*isTopLevelRouter*/ ctx[2] &&
					/*manageFocus*/ ctx[4] &&
					/*a11yConfig*/ ctx[1].announcements
				)
					if_block.p(ctx, dirty);
			},
			i: function intro(local) {
				if (current) return;
				transition_in(default_slot, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(default_slot, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(div);
				if (detaching) detach_dev(t0);
				if (default_slot) default_slot.d(detaching);
				if (detaching) detach_dev(t1);
				if (if_block) if_block.d(detaching);
				if (detaching) detach_dev(if_block_anchor);
			}
		};

		dispatch_dev('SvelteRegisterBlock', {
			block,
			id: create_fragment$6.name,
			type: 'component',
			source: '',
			ctx
		});

		return block;
	}

	const createId$1 = createCounter();
	const defaultBasepath = '/';

	function instance$6($$self, $$props, $$invalidate) {
		let $location;
		let $activeRoute;
		let $prevLocation;
		let $routes;
		let $announcementText;
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Router', slots, ['default']);
		let { basepath = defaultBasepath } = $$props;
		let { url = null } = $$props;
		let { history = globalHistory } = $$props;
		let { primary = true } = $$props;
		let { a11y = {} } = $$props;

		const a11yConfig = {
			createAnnouncement: (route) => `Navigated to ${route.uri}`,
			announcements: true,
			...a11y
		};

		// Remember the initial `basepath`, so we can fire a warning
		// when the user changes it later
		const initialBasepath = basepath;

		const normalizedBasepath = normalizePath(basepath);
		const locationContext = getContext(LOCATION);
		const routerContext = getContext(ROUTER);
		const isTopLevelRouter = !locationContext;
		const routerId = createId$1();
		const manageFocus = primary && !(routerContext && !routerContext.manageFocus);
		const announcementText = writable('');
		validate_store(announcementText, 'announcementText');
		component_subscribe($$self, announcementText, (value) =>
			$$invalidate(0, ($announcementText = value))
		);
		const routes = writable([]);
		validate_store(routes, 'routes');
		component_subscribe($$self, routes, (value) => $$invalidate(18, ($routes = value)));
		const activeRoute = writable(null);
		validate_store(activeRoute, 'activeRoute');
		component_subscribe($$self, activeRoute, (value) => $$invalidate(16, ($activeRoute = value)));

		// Used in SSR to synchronously set that a Route is active.
		let hasActiveRoute = false;

		// Nesting level of router.
		// We will need this to identify sibling routers, when moving
		// focus on navigation, so we can focus the first possible router
		const level = isTopLevelRouter ? 0 : routerContext.level + 1;

		// If we're running an SSR we force the location to the `url` prop
		const getInitialLocation = () =>
			normalizeLocation(isSSR ? createLocation(url) : history.location, normalizedBasepath);

		const location = isTopLevelRouter ? writable(getInitialLocation()) : locationContext;

		validate_store(location, 'location');
		component_subscribe($$self, location, (value) => $$invalidate(15, ($location = value)));
		const prevLocation = writable($location);
		validate_store(prevLocation, 'prevLocation');
		component_subscribe($$self, prevLocation, (value) => $$invalidate(17, ($prevLocation = value)));
		const triggerFocus = createTriggerFocus(a11yConfig, announcementText, location);
		const createRouteFilter = (routeId) => (routeList) =>
			routeList.filter((routeItem) => routeItem.id !== routeId);

		function registerRoute(route) {
			if (isSSR) {
				// In SSR we should set the activeRoute immediately if it is a match.
				// If there are more Routes being registered after a match is found,
				// we just skip them.
				if (hasActiveRoute) {
					return;
				}

				const matchingRoute = match(route, $location.pathname);

				if (matchingRoute) {
					hasActiveRoute = true;

					// Return the match in SSR mode, so the matched Route can use it immediatly.
					// Waiting for activeRoute to update does not work, because it updates
					// after the Route is initialized
					return matchingRoute; // eslint-disable-line consistent-return
				}
			} else {
				routes.update((prevRoutes) => {
					// Remove an old version of the updated route,
					// before pushing the new version
					const nextRoutes = createRouteFilter(route.id)(prevRoutes);

					nextRoutes.push(route);
					return nextRoutes;
				});
			}
		}

		function unregisterRoute(routeId) {
			routes.update(createRouteFilter(routeId));
		}

		if (!isTopLevelRouter && basepath !== defaultBasepath) {
			warn(ROUTER_ID, 'Only top-level Routers can have a "basepath" prop. It is ignored.', {
				basepath
			});
		}

		if (isTopLevelRouter) {
			// The topmost Router in the tree is responsible for updating
			// the location store and supplying it through context.
			onMount(() => {
				const unlisten = history.listen((changedHistory) => {
					const normalizedLocation = normalizeLocation(changedHistory.location, normalizedBasepath);
					prevLocation.set($location);
					location.set(normalizedLocation);
				});

				return unlisten;
			});

			setContext(LOCATION, location);
		}

		setContext(ROUTER, {
			activeRoute,
			registerRoute,
			unregisterRoute,
			manageFocus,
			level,
			id: routerId,
			history: isTopLevelRouter ? history : routerContext.history,
			basepath: isTopLevelRouter ? normalizedBasepath : routerContext.basepath
		});

		const writable_props = ['basepath', 'url', 'history', 'primary', 'a11y'];

		Object.keys($$props).forEach((key) => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot')
				console.warn(`<Router> was created with unknown prop '${key}'`);
		});

		$$self.$$set = ($$props) => {
			if ('basepath' in $$props) $$invalidate(10, (basepath = $$props.basepath));
			if ('url' in $$props) $$invalidate(11, (url = $$props.url));
			if ('history' in $$props) $$invalidate(12, (history = $$props.history));
			if ('primary' in $$props) $$invalidate(13, (primary = $$props.primary));
			if ('a11y' in $$props) $$invalidate(14, (a11y = $$props.a11y));
			if ('$$scope' in $$props) $$invalidate(19, ($$scope = $$props.$$scope));
		};

		$$self.$capture_state = () => ({
			createCounter,
			createId: createId$1,
			getContext,
			setContext,
			onMount,
			writable,
			LOCATION,
			ROUTER,
			globalHistory,
			normalizePath,
			pick,
			match,
			normalizeLocation,
			createLocation,
			isSSR,
			warn,
			ROUTER_ID,
			pushFocusCandidate,
			visuallyHiddenStyle,
			createTriggerFocus,
			defaultBasepath,
			basepath,
			url,
			history,
			primary,
			a11y,
			a11yConfig,
			initialBasepath,
			normalizedBasepath,
			locationContext,
			routerContext,
			isTopLevelRouter,
			routerId,
			manageFocus,
			announcementText,
			routes,
			activeRoute,
			hasActiveRoute,
			level,
			getInitialLocation,
			location,
			prevLocation,
			triggerFocus,
			createRouteFilter,
			registerRoute,
			unregisterRoute,
			$location,
			$activeRoute,
			$prevLocation,
			$routes,
			$announcementText
		});

		$$self.$inject_state = ($$props) => {
			if ('basepath' in $$props) $$invalidate(10, (basepath = $$props.basepath));
			if ('url' in $$props) $$invalidate(11, (url = $$props.url));
			if ('history' in $$props) $$invalidate(12, (history = $$props.history));
			if ('primary' in $$props) $$invalidate(13, (primary = $$props.primary));
			if ('a11y' in $$props) $$invalidate(14, (a11y = $$props.a11y));
			if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute;
		};

		if ($$props && '$$inject' in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		$$self.$$.update = () => {
			if ($$self.$$.dirty[0] & /*basepath*/ 1024) {
				if (basepath !== initialBasepath) {
					warn(ROUTER_ID, 'You cannot change the "basepath" prop. It is ignored.');
				}
			}

			if ($$self.$$.dirty[0] & /*$routes, $location*/ 294912) {
				// This reactive statement will be run when the Router is created
				// when there are no Routes and then again the following tick, so it
				// will not find an active Route in SSR and in the browser it will only
				// pick an active Route after all Routes have been registered.
				{
					const bestMatch = pick($routes, $location.pathname);
					activeRoute.set(bestMatch);
				}
			}

			if ($$self.$$.dirty[0] & /*$location, $prevLocation*/ 163840) {
				// Manage focus and announce navigation to screen reader users
				{
					if (isTopLevelRouter) {
						const hasHash = !!$location.hash;

						// When a hash is present in the url, we skip focus management, because
						// focusing a different element will prevent in-page jumps (See #3)
						const shouldManageFocus = !hasHash && manageFocus;

						// We don't want to make an announcement, when the hash changes,
						// but the active route stays the same
						const announceNavigation = !hasHash || $location.pathname !== $prevLocation.pathname;

						triggerFocus(shouldManageFocus, announceNavigation);
					}
				}
			}

			if ($$self.$$.dirty[0] & /*$activeRoute*/ 65536) {
				// Queue matched Route, so top level Router can decide which Route to focus.
				// Non primary Routers should just be ignored
				if (manageFocus && $activeRoute && $activeRoute.primary) {
					pushFocusCandidate({ level, routerId, route: $activeRoute });
				}
			}
		};

		return [
			$announcementText,
			a11yConfig,
			isTopLevelRouter,
			routerId,
			manageFocus,
			announcementText,
			routes,
			activeRoute,
			location,
			prevLocation,
			basepath,
			url,
			history,
			primary,
			a11y,
			$location,
			$activeRoute,
			$prevLocation,
			$routes,
			$$scope,
			slots
		];
	}

	class Router extends SvelteComponentDev {
		constructor(options) {
			super(options);

			init(
				this,
				options,
				instance$6,
				create_fragment$6,
				safe_not_equal,
				{
					basepath: 10,
					url: 11,
					history: 12,
					primary: 13,
					a11y: 14
				},
				null,
				[-1, -1]
			);

			dispatch_dev('SvelteRegisterComponent', {
				component: this,
				tagName: 'Router',
				options,
				id: create_fragment$6.name
			});
		}

		get basepath() {
			throw new Error(
				"<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
			);
		}

		set basepath(value) {
			throw new Error(
				"<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
			);
		}

		get url() {
			throw new Error(
				"<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
			);
		}

		set url(value) {
			throw new Error(
				"<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
			);
		}

		get history() {
			throw new Error(
				"<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
			);
		}

		set history(value) {
			throw new Error(
				"<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
			);
		}

		get primary() {
			throw new Error(
				"<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
			);
		}

		set primary(value) {
			throw new Error(
				"<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
			);
		}

		get a11y() {
			throw new Error(
				"<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
			);
		}

		set a11y(value) {
			throw new Error(
				"<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
			);
		}
	}

	var Router$1 = Router;

	/**
	 * Check if a component or hook have been created outside of a
	 * context providing component
	 * @param {number} componentId
	 * @param {*} props
	 * @param {string?} ctxKey
	 * @param {number?} ctxProviderId
	 */
	function usePreflightCheck(componentId, props, ctxKey = ROUTER, ctxProviderId = ROUTER_ID) {
		const ctx = getContext(ctxKey);
		if (!ctx) {
			fail(
				componentId,
				(label) => `You cannot use ${label} outside of a ${createLabel(ctxProviderId)}.`,
				props
			);
		}
	}

	const toReadonly = (ctx) => {
		const { subscribe } = getContext(ctx);
		return { subscribe };
	};

	/**
     * Access the current location via a readable store.
     * @returns {import("svelte/store").Readable<{
        pathname: string;
        search: string;
        hash: string;
        state: {};
      }>}
     *
     * @example
      ```html
      <script>
        import { useLocation } from "svelte-navigator";

        const location = useLocation();

        $: console.log($location);
        // {
        //   pathname: "/blog",
        //   search: "?id=123",
        //   hash: "#comments",
        //   state: {}
        // }
      </script>
      ```
     */
	function useLocation() {
		usePreflightCheck(USE_LOCATION_ID);
		return toReadonly(LOCATION);
	}

	/**
     * @typedef {{
        path: string;
        fullPath: string;
        uri: string;
        params: {};
      }} RouteMatch
     */

	/**
	 * @typedef {import("svelte/store").Readable<RouteMatch|null>} RouteMatchStore
	 */

	/**
	 * Access the history of top level Router.
	 */
	function useHistory() {
		const { history } = getContext(ROUTER);
		return history;
	}

	/**
	 * Access the base of the parent Route.
	 */
	function useRouteBase() {
		const route = getContext(ROUTE);
		return route ? derived(route, (_route) => _route.base) : writable('/');
	}

	/**
     * Resolve a given link relative to the current `Route` and the `Router`s `basepath`.
     * It is used under the hood in `Link` and `useNavigate`.
     * You can use it to manually resolve links, when using the `link` or `links` actions.
     *
     * @returns {(path: string) => string}
     *
     * @example
      ```html
      <script>
        import { link, useResolve } from "svelte-navigator";

        const resolve = useResolve();
        // `resolvedLink` will be resolved relative to its parent Route
        // and the Routers `basepath`
        const resolvedLink = resolve("relativePath");
      </script>

      <a href={resolvedLink} use:link>Relative link</a>
      ```
     */
	function useResolve() {
		usePreflightCheck(USE_RESOLVE_ID);
		const routeBase = useRouteBase();
		const { basepath: appBase } = getContext(ROUTER);
		/**
		 * Resolves the path relative to the current route and basepath.
		 *
		 * @param {string} path The path to resolve
		 * @returns {string} The resolved path
		 */
		const resolve = (path) => resolveLink(path, get_store_value(routeBase), appBase);
		return resolve;
	}

	/**
     * A hook, that returns a context-aware version of `navigate`.
     * It will automatically resolve the given link relative to the current Route.
     * It will also resolve a link against the `basepath` of the Router.
     *
     * @example
      ```html
      <!-- App.svelte -->
      <script>
        import { link, Route } from "svelte-navigator";
        import RouteComponent from "./RouteComponent.svelte";
      </script>

      <Router>
        <Route path="route1">
          <RouteComponent />
        </Route>
        <!-- ... -->
      </Router>

      <!-- RouteComponent.svelte -->
      <script>
        import { useNavigate } from "svelte-navigator";

        const navigate = useNavigate();
      </script>

      <button on:click="{() => navigate('relativePath')}">
        go to /route1/relativePath
      </button>
      <button on:click="{() => navigate('/absolutePath')}">
        go to /absolutePath
      </button>
      ```
      *
      * @example
      ```html
      <!-- App.svelte -->
      <script>
        import { link, Route } from "svelte-navigator";
        import RouteComponent from "./RouteComponent.svelte";
      </script>

      <Router basepath="/base">
        <Route path="route1">
          <RouteComponent />
        </Route>
        <!-- ... -->
      </Router>

      <!-- RouteComponent.svelte -->
      <script>
        import { useNavigate } from "svelte-navigator";

        const navigate = useNavigate();
      </script>

      <button on:click="{() => navigate('relativePath')}">
        go to /base/route1/relativePath
      </button>
      <button on:click="{() => navigate('/absolutePath')}">
        go to /base/absolutePath
      </button>
      ```
     */
	function useNavigate() {
		usePreflightCheck(USE_NAVIGATE_ID);
		const resolve = useResolve();
		const { navigate } = useHistory();
		/**
		 * Navigate to a new route.
		 * Resolves the link relative to the current route and basepath.
		 *
		 * @param {string|number} to The path to navigate to.
		 *
		 * If `to` is a number we will navigate to the stack entry index + `to`
		 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
		 * @param {Object} options
		 * @param {*} [options.state]
		 * @param {boolean} [options.replace=false]
		 */
		const navigateRelative = (to, options) => {
			// If to is a number, we navigate to the target stack entry via `history.go`.
			// Otherwise resolve the link
			const target = isNumber(to) ? to : resolve(to);
			return navigate(target, options);
		};
		return navigateRelative;
	}

	/* node_modules/svelte-navigator/src/Route.svelte generated by Svelte v3.46.4 */
	const file$5 = 'node_modules/svelte-navigator/src/Route.svelte';

	const get_default_slot_changes = (dirty) => ({
		params: dirty & /*$params*/ 16,
		location: dirty & /*$location*/ 8
	});

	const get_default_slot_context = (ctx) => ({
		params: isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4],
		location: /*$location*/ ctx[3],
		navigate: /*navigate*/ ctx[10]
	});

	// (97:0) {#if isActive}
	function create_if_block(ctx) {
		let router;
		let current;

		router = new Router$1({
			props: {
				primary: /*primary*/ ctx[1],
				$$slots: { default: [create_default_slot$1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

		const block = {
			c: function create() {
				create_component(router.$$.fragment);
			},
			m: function mount(target, anchor) {
				mount_component(router, target, anchor);
				current = true;
			},
			p: function update(ctx, dirty) {
				const router_changes = {};
				if (dirty & /*primary*/ 2) router_changes.primary = /*primary*/ ctx[1];

				if (dirty & /*$$scope, component, $location, $params, $$restProps*/ 264217) {
					router_changes.$$scope = { dirty, ctx };
				}

				router.$set(router_changes);
			},
			i: function intro(local) {
				if (current) return;
				transition_in(router.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(router.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				destroy_component(router, detaching);
			}
		};

		dispatch_dev('SvelteRegisterBlock', {
			block,
			id: create_if_block.name,
			type: 'if',
			source: '(97:0) {#if isActive}',
			ctx
		});

		return block;
	}

	// (113:2) {:else}
	function create_else_block(ctx) {
		let current;
		const default_slot_template = /*#slots*/ ctx[17].default;
		const default_slot = create_slot(
			default_slot_template,
			ctx,
			/*$$scope*/ ctx[18],
			get_default_slot_context
		);

		const block = {
			c: function create() {
				if (default_slot) default_slot.c();
			},
			m: function mount(target, anchor) {
				if (default_slot) {
					default_slot.m(target, anchor);
				}

				current = true;
			},
			p: function update(ctx, dirty) {
				if (default_slot) {
					if (default_slot.p && (!current || dirty & /*$$scope, $params, $location*/ 262168)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[18],
							!current
								? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
								: get_slot_changes(
										default_slot_template,
										/*$$scope*/ ctx[18],
										dirty,
										get_default_slot_changes
								  ),
							get_default_slot_context
						);
					}
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(default_slot, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(default_slot, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (default_slot) default_slot.d(detaching);
			}
		};

		dispatch_dev('SvelteRegisterBlock', {
			block,
			id: create_else_block.name,
			type: 'else',
			source: '(113:2) {:else}',
			ctx
		});

		return block;
	}

	// (105:2) {#if component !== null}
	function create_if_block_1(ctx) {
		let switch_instance;
		let switch_instance_anchor;
		let current;

		const switch_instance_spread_levels = [
			{ location: /*$location*/ ctx[3] },
			{ navigate: /*navigate*/ ctx[10] },
			isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4],
			/*$$restProps*/ ctx[11]
		];

		var switch_value = /*component*/ ctx[0];

		function switch_props(ctx) {
			let switch_instance_props = {};

			for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
				switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
			}

			return {
				props: switch_instance_props,
				$$inline: true
			};
		}

		if (switch_value) {
			switch_instance = new switch_value(switch_props());
		}

		const block = {
			c: function create() {
				if (switch_instance) create_component(switch_instance.$$.fragment);
				switch_instance_anchor = empty();
			},
			m: function mount(target, anchor) {
				if (switch_instance) {
					mount_component(switch_instance, target, anchor);
				}

				insert_dev(target, switch_instance_anchor, anchor);
				current = true;
			},
			p: function update(ctx, dirty) {
				const switch_instance_changes =
					dirty & /*$location, navigate, isSSR, get, params, $params, $$restProps*/ 3608
						? get_spread_update(switch_instance_spread_levels, [
								dirty & /*$location*/ 8 && { location: /*$location*/ ctx[3] },
								dirty & /*navigate*/ 1024 && { navigate: /*navigate*/ ctx[10] },
								dirty & /*isSSR, get, params, $params*/ 528 &&
									get_spread_object(
										isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4]
									),
								dirty & /*$$restProps*/ 2048 && get_spread_object(/*$$restProps*/ ctx[11])
						  ])
						: {};

				if (switch_value !== (switch_value = /*component*/ ctx[0])) {
					if (switch_instance) {
						group_outros();
						const old_component = switch_instance;

						transition_out(old_component.$$.fragment, 1, 0, () => {
							destroy_component(old_component, 1);
						});

						check_outros();
					}

					if (switch_value) {
						switch_instance = new switch_value(switch_props());
						create_component(switch_instance.$$.fragment);
						transition_in(switch_instance.$$.fragment, 1);
						mount_component(
							switch_instance,
							switch_instance_anchor.parentNode,
							switch_instance_anchor
						);
					} else {
						switch_instance = null;
					}
				} else if (switch_value) {
					switch_instance.$set(switch_instance_changes);
				}
			},
			i: function intro(local) {
				if (current) return;
				if (switch_instance) transition_in(switch_instance.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				if (switch_instance) transition_out(switch_instance.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(switch_instance_anchor);
				if (switch_instance) destroy_component(switch_instance, detaching);
			}
		};

		dispatch_dev('SvelteRegisterBlock', {
			block,
			id: create_if_block_1.name,
			type: 'if',
			source: '(105:2) {#if component !== null}',
			ctx
		});

		return block;
	}

	// (98:1) <Router {primary}>
	function create_default_slot$1(ctx) {
		let current_block_type_index;
		let if_block;
		let if_block_anchor;
		let current;
		const if_block_creators = [create_if_block_1, create_else_block];
		const if_blocks = [];

		function select_block_type(ctx, dirty) {
			if (/*component*/ ctx[0] !== null) return 0;
			return 1;
		}

		current_block_type_index = select_block_type(ctx);
		if_block = if_blocks[current_block_type_index] =
			if_block_creators[current_block_type_index](ctx);

		const block = {
			c: function create() {
				if_block.c();
				if_block_anchor = empty();
			},
			m: function mount(target, anchor) {
				if_blocks[current_block_type_index].m(target, anchor);
				insert_dev(target, if_block_anchor, anchor);
				current = true;
			},
			p: function update(ctx, dirty) {
				let previous_block_index = current_block_type_index;
				current_block_type_index = select_block_type(ctx);

				if (current_block_type_index === previous_block_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				} else {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
					if_block = if_blocks[current_block_type_index];

					if (!if_block) {
						if_block = if_blocks[current_block_type_index] =
							if_block_creators[current_block_type_index](ctx);
						if_block.c();
					} else {
						if_block.p(ctx, dirty);
					}

					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(if_block);
				current = true;
			},
			o: function outro(local) {
				transition_out(if_block);
				current = false;
			},
			d: function destroy(detaching) {
				if_blocks[current_block_type_index].d(detaching);
				if (detaching) detach_dev(if_block_anchor);
			}
		};

		dispatch_dev('SvelteRegisterBlock', {
			block,
			id: create_default_slot$1.name,
			type: 'slot',
			source: '(98:1) <Router {primary}>',
			ctx
		});

		return block;
	}

	function create_fragment$5(ctx) {
		let div0;
		let t0;
		let t1;
		let div1;
		let current;
		let if_block = /*isActive*/ ctx[2] && create_if_block(ctx);

		const block = {
			c: function create() {
				div0 = element('div');
				t0 = space();
				if (if_block) if_block.c();
				t1 = space();
				div1 = element('div');
				set_style(div0, 'display', 'none');
				attr_dev(div0, 'aria-hidden', 'true');
				attr_dev(div0, 'data-svnav-route-start', /*id*/ ctx[5]);
				add_location(div0, file$5, 95, 0, 2622);
				set_style(div1, 'display', 'none');
				attr_dev(div1, 'aria-hidden', 'true');
				attr_dev(div1, 'data-svnav-route-end', /*id*/ ctx[5]);
				add_location(div1, file$5, 121, 0, 3295);
			},
			l: function claim(nodes) {
				throw new Error(
					'options.hydrate only works if the component was compiled with the `hydratable: true` option'
				);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div0, anchor);
				insert_dev(target, t0, anchor);
				if (if_block) if_block.m(target, anchor);
				insert_dev(target, t1, anchor);
				insert_dev(target, div1, anchor);
				current = true;
			},
			p: function update(ctx, [dirty]) {
				if (/*isActive*/ ctx[2]) {
					if (if_block) {
						if_block.p(ctx, dirty);

						if (dirty & /*isActive*/ 4) {
							transition_in(if_block, 1);
						}
					} else {
						if_block = create_if_block(ctx);
						if_block.c();
						transition_in(if_block, 1);
						if_block.m(t1.parentNode, t1);
					}
				} else if (if_block) {
					group_outros();

					transition_out(if_block, 1, 1, () => {
						if_block = null;
					});

					check_outros();
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(if_block);
				current = true;
			},
			o: function outro(local) {
				transition_out(if_block);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(div0);
				if (detaching) detach_dev(t0);
				if (if_block) if_block.d(detaching);
				if (detaching) detach_dev(t1);
				if (detaching) detach_dev(div1);
			}
		};

		dispatch_dev('SvelteRegisterBlock', {
			block,
			id: create_fragment$5.name,
			type: 'component',
			source: '',
			ctx
		});

		return block;
	}

	const createId = createCounter();

	function instance$5($$self, $$props, $$invalidate) {
		let isActive;
		const omit_props_names = ['path', 'component', 'meta', 'primary'];
		let $$restProps = compute_rest_props($$props, omit_props_names);
		let $activeRoute;
		let $location;
		let $parentBase;
		let $params;
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Route', slots, ['default']);
		let { path = '' } = $$props;
		let { component = null } = $$props;
		let { meta = {} } = $$props;
		let { primary = true } = $$props;
		usePreflightCheck(ROUTE_ID, $$props);
		const id = createId();
		const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
		validate_store(activeRoute, 'activeRoute');
		component_subscribe($$self, activeRoute, (value) => $$invalidate(15, ($activeRoute = value)));
		const parentBase = useRouteBase();
		validate_store(parentBase, 'parentBase');
		component_subscribe($$self, parentBase, (value) => $$invalidate(16, ($parentBase = value)));
		const location = useLocation();
		validate_store(location, 'location');
		component_subscribe($$self, location, (value) => $$invalidate(3, ($location = value)));
		const focusElement = writable(null);

		// In SSR we cannot wait for $activeRoute to update,
		// so we use the match returned from `registerRoute` instead
		let ssrMatch;

		const route = writable();
		const params = writable({});
		validate_store(params, 'params');
		component_subscribe($$self, params, (value) => $$invalidate(4, ($params = value)));
		setContext(ROUTE, route);
		setContext(ROUTE_PARAMS, params);
		setContext(FOCUS_ELEM, focusElement);

		// We need to call useNavigate after the route is set,
		// so we can use the routes path for link resolution
		const navigate = useNavigate();

		// There is no need to unregister Routes in SSR since it will all be
		// thrown away anyway
		if (!isSSR) {
			onDestroy(() => unregisterRoute(id));
		}

		$$self.$$set = ($$new_props) => {
			$$invalidate(
				23,
				($$props = assign(assign({}, $$props), exclude_internal_props($$new_props)))
			);
			$$invalidate(11, ($$restProps = compute_rest_props($$props, omit_props_names)));
			if ('path' in $$new_props) $$invalidate(12, (path = $$new_props.path));
			if ('component' in $$new_props) $$invalidate(0, (component = $$new_props.component));
			if ('meta' in $$new_props) $$invalidate(13, (meta = $$new_props.meta));
			if ('primary' in $$new_props) $$invalidate(1, (primary = $$new_props.primary));
			if ('$$scope' in $$new_props) $$invalidate(18, ($$scope = $$new_props.$$scope));
		};

		$$self.$capture_state = () => ({
			createCounter,
			createId,
			getContext,
			onDestroy,
			setContext,
			writable,
			get: get_store_value,
			Router: Router$1,
			ROUTER,
			ROUTE,
			ROUTE_PARAMS,
			FOCUS_ELEM,
			useLocation,
			useNavigate,
			useRouteBase,
			usePreflightCheck,
			isSSR,
			extractBaseUri,
			join,
			ROUTE_ID,
			path,
			component,
			meta,
			primary,
			id,
			registerRoute,
			unregisterRoute,
			activeRoute,
			parentBase,
			location,
			focusElement,
			ssrMatch,
			route,
			params,
			navigate,
			isActive,
			$activeRoute,
			$location,
			$parentBase,
			$params
		});

		$$self.$inject_state = ($$new_props) => {
			$$invalidate(23, ($$props = assign(assign({}, $$props), $$new_props)));
			if ('path' in $$props) $$invalidate(12, (path = $$new_props.path));
			if ('component' in $$props) $$invalidate(0, (component = $$new_props.component));
			if ('meta' in $$props) $$invalidate(13, (meta = $$new_props.meta));
			if ('primary' in $$props) $$invalidate(1, (primary = $$new_props.primary));
			if ('ssrMatch' in $$props) $$invalidate(14, (ssrMatch = $$new_props.ssrMatch));
			if ('isActive' in $$props) $$invalidate(2, (isActive = $$new_props.isActive));
		};

		if ($$props && '$$inject' in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		$$self.$$.update = () => {
			if ($$self.$$.dirty & /*path, $parentBase, meta, $location, primary*/ 77834) {
				{
					// The route store will be re-computed whenever props, location or parentBase change
					const isDefault = path === '';

					const rawBase = join($parentBase, path);

					const updatedRoute = {
						id,
						path,
						meta,
						// If no path prop is given, this Route will act as the default Route
						// that is rendered if no other Route in the Router is a match
						default: isDefault,
						fullPath: isDefault ? '' : rawBase,
						base: isDefault ? $parentBase : extractBaseUri(rawBase, $location.pathname),
						primary,
						focusElement
					};

					route.set(updatedRoute);

					// If we're in SSR mode and the Route matches,
					// `registerRoute` will return the match
					$$invalidate(14, (ssrMatch = registerRoute(updatedRoute)));
				}
			}

			if ($$self.$$.dirty & /*ssrMatch, $activeRoute*/ 49152) {
				$$invalidate(2, (isActive = !!(ssrMatch || ($activeRoute && $activeRoute.id === id))));
			}

			if ($$self.$$.dirty & /*isActive, ssrMatch, $activeRoute*/ 49156) {
				if (isActive) {
					const { params: activeParams } = ssrMatch || $activeRoute;
					params.set(activeParams);
				}
			}
		};

		$$props = exclude_internal_props($$props);

		return [
			component,
			primary,
			isActive,
			$location,
			$params,
			id,
			activeRoute,
			parentBase,
			location,
			params,
			navigate,
			$$restProps,
			path,
			meta,
			ssrMatch,
			$activeRoute,
			$parentBase,
			slots,
			$$scope
		];
	}

	class Route extends SvelteComponentDev {
		constructor(options) {
			super(options);

			init(this, options, instance$5, create_fragment$5, safe_not_equal, {
				path: 12,
				component: 0,
				meta: 13,
				primary: 1
			});

			dispatch_dev('SvelteRegisterComponent', {
				component: this,
				tagName: 'Route',
				options,
				id: create_fragment$5.name
			});
		}

		get path() {
			throw new Error(
				"<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
			);
		}

		set path(value) {
			throw new Error(
				"<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
			);
		}

		get component() {
			throw new Error(
				"<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
			);
		}

		set component(value) {
			throw new Error(
				"<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
			);
		}

		get meta() {
			throw new Error(
				"<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
			);
		}

		set meta(value) {
			throw new Error(
				"<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
			);
		}

		get primary() {
			throw new Error(
				"<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
			);
		}

		set primary(value) {
			throw new Error(
				"<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
			);
		}
	}

	var Route$1 = Route;

	/* node_modules/svelte-navigator/src/Link.svelte generated by Svelte v3.46.4 */
	const file$4 = 'node_modules/svelte-navigator/src/Link.svelte';

	function create_fragment$4(ctx) {
		let a;
		let current;
		let mounted;
		let dispose;
		const default_slot_template = /*#slots*/ ctx[13].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);
		let a_levels = [{ href: /*href*/ ctx[0] }, /*ariaCurrent*/ ctx[2], /*props*/ ctx[1]];
		let a_data = {};

		for (let i = 0; i < a_levels.length; i += 1) {
			a_data = assign(a_data, a_levels[i]);
		}

		const block = {
			c: function create() {
				a = element('a');
				if (default_slot) default_slot.c();
				set_attributes(a, a_data);
				add_location(a, file$4, 63, 0, 1735);
			},
			l: function claim(nodes) {
				throw new Error(
					'options.hydrate only works if the component was compiled with the `hydratable: true` option'
				);
			},
			m: function mount(target, anchor) {
				insert_dev(target, a, anchor);

				if (default_slot) {
					default_slot.m(a, null);
				}

				current = true;

				if (!mounted) {
					dispose = listen_dev(a, 'click', /*onClick*/ ctx[4], false, false, false);
					mounted = true;
				}
			},
			p: function update(ctx, [dirty]) {
				if (default_slot) {
					if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[12],
							!current
								? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
								: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
							null
						);
					}
				}

				set_attributes(
					a,
					(a_data = get_spread_update(a_levels, [
						(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
						dirty & /*ariaCurrent*/ 4 && /*ariaCurrent*/ ctx[2],
						dirty & /*props*/ 2 && /*props*/ ctx[1]
					]))
				);
			},
			i: function intro(local) {
				if (current) return;
				transition_in(default_slot, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(default_slot, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(a);
				if (default_slot) default_slot.d(detaching);
				mounted = false;
				dispose();
			}
		};

		dispatch_dev('SvelteRegisterBlock', {
			block,
			id: create_fragment$4.name,
			type: 'component',
			source: '',
			ctx
		});

		return block;
	}

	function instance$4($$self, $$props, $$invalidate) {
		let href;
		let isPartiallyCurrent;
		let isCurrent;
		let ariaCurrent;
		let props;
		const omit_props_names = ['to', 'replace', 'state', 'getProps'];
		let $$restProps = compute_rest_props($$props, omit_props_names);
		let $location;
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Link', slots, ['default']);
		let { to } = $$props;
		let { replace = false } = $$props;
		let { state = {} } = $$props;
		let { getProps = null } = $$props;
		usePreflightCheck(LINK_ID, $$props);
		const location = useLocation();
		validate_store(location, 'location');
		component_subscribe($$self, location, (value) => $$invalidate(11, ($location = value)));
		const dispatch = createEventDispatcher();
		const resolve = useResolve();
		const { navigate } = useHistory();

		function onClick(event) {
			dispatch('click', event);

			if (shouldNavigate(event)) {
				event.preventDefault();

				// Don't push another entry to the history stack when the user
				// clicks on a Link to the page they are currently on.
				const shouldReplace = isCurrent || replace;

				navigate(href, { state, replace: shouldReplace });
			}
		}

		$$self.$$set = ($$new_props) => {
			$$invalidate(
				18,
				($$props = assign(assign({}, $$props), exclude_internal_props($$new_props)))
			);
			$$invalidate(17, ($$restProps = compute_rest_props($$props, omit_props_names)));
			if ('to' in $$new_props) $$invalidate(5, (to = $$new_props.to));
			if ('replace' in $$new_props) $$invalidate(6, (replace = $$new_props.replace));
			if ('state' in $$new_props) $$invalidate(7, (state = $$new_props.state));
			if ('getProps' in $$new_props) $$invalidate(8, (getProps = $$new_props.getProps));
			if ('$$scope' in $$new_props) $$invalidate(12, ($$scope = $$new_props.$$scope));
		};

		$$self.$capture_state = () => ({
			createEventDispatcher,
			useLocation,
			useResolve,
			useHistory,
			usePreflightCheck,
			shouldNavigate,
			isFunction,
			startsWith,
			LINK_ID,
			to,
			replace,
			state,
			getProps,
			location,
			dispatch,
			resolve,
			navigate,
			onClick,
			href,
			isCurrent,
			isPartiallyCurrent,
			props,
			ariaCurrent,
			$location
		});

		$$self.$inject_state = ($$new_props) => {
			$$invalidate(18, ($$props = assign(assign({}, $$props), $$new_props)));
			if ('to' in $$props) $$invalidate(5, (to = $$new_props.to));
			if ('replace' in $$props) $$invalidate(6, (replace = $$new_props.replace));
			if ('state' in $$props) $$invalidate(7, (state = $$new_props.state));
			if ('getProps' in $$props) $$invalidate(8, (getProps = $$new_props.getProps));
			if ('href' in $$props) $$invalidate(0, (href = $$new_props.href));
			if ('isCurrent' in $$props) $$invalidate(9, (isCurrent = $$new_props.isCurrent));
			if ('isPartiallyCurrent' in $$props)
				$$invalidate(10, (isPartiallyCurrent = $$new_props.isPartiallyCurrent));
			if ('props' in $$props) $$invalidate(1, (props = $$new_props.props));
			if ('ariaCurrent' in $$props) $$invalidate(2, (ariaCurrent = $$new_props.ariaCurrent));
		};

		if ($$props && '$$inject' in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		$$self.$$.update = () => {
			if ($$self.$$.dirty & /*to, $location*/ 2080) {
				// We need to pass location here to force re-resolution of the link,
				// when the pathname changes. Otherwise we could end up with stale path params,
				// when for example an :id changes in the parent Routes path
				$$invalidate(0, (href = resolve(to, $location)));
			}

			if ($$self.$$.dirty & /*$location, href*/ 2049) {
				$$invalidate(10, (isPartiallyCurrent = startsWith($location.pathname, href)));
			}

			if ($$self.$$.dirty & /*href, $location*/ 2049) {
				$$invalidate(9, (isCurrent = href === $location.pathname));
			}

			if ($$self.$$.dirty & /*isCurrent*/ 512) {
				$$invalidate(2, (ariaCurrent = isCurrent ? { 'aria-current': 'page' } : {}));
			}

			$$invalidate(
				1,
				(props = (() => {
					if (isFunction(getProps)) {
						const dynamicProps = getProps({
							location: $location,
							href,
							isPartiallyCurrent,
							isCurrent
						});

						return { ...$$restProps, ...dynamicProps };
					}

					return $$restProps;
				})())
			);
		};

		$$props = exclude_internal_props($$props);

		return [
			href,
			props,
			ariaCurrent,
			location,
			onClick,
			to,
			replace,
			state,
			getProps,
			isCurrent,
			isPartiallyCurrent,
			$location,
			$$scope,
			slots
		];
	}

	class Link extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$4, create_fragment$4, safe_not_equal, {
				to: 5,
				replace: 6,
				state: 7,
				getProps: 8
			});

			dispatch_dev('SvelteRegisterComponent', {
				component: this,
				tagName: 'Link',
				options,
				id: create_fragment$4.name
			});

			const { ctx } = this.$$;
			const props = options.props || {};

			if (/*to*/ ctx[5] === undefined && !('to' in props)) {
				console.warn("<Link> was created without expected prop 'to'");
			}
		}

		get to() {
			throw new Error(
				"<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
			);
		}

		set to(value) {
			throw new Error(
				"<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
			);
		}

		get replace() {
			throw new Error(
				"<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
			);
		}

		set replace(value) {
			throw new Error(
				"<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
			);
		}

		get state() {
			throw new Error(
				"<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
			);
		}

		set state(value) {
			throw new Error(
				"<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
			);
		}

		get getProps() {
			throw new Error(
				"<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
			);
		}

		set getProps(value) {
			throw new Error(
				"<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'"
			);
		}
	}

	var Link$1 = Link;

	/* src/login.svelte generated by Svelte v3.46.4 */

	const { console: console_1$1 } = globals;
	const file$3 = 'src/login.svelte';

	function create_fragment$3(ctx) {
		let link;
		let t0;
		let div1;
		let h1;
		let t2;
		let div0;
		let input0;
		let t3;
		let input1;
		let t4;
		let input2;
		let t5;
		let br;
		let t6;
		let button0;
		let t7;
		let t8;
		let button1;
		let mounted;
		let dispose;

		const block = {
			c: function create() {
				link = element('link');
				t0 = space();
				div1 = element('div');
				h1 = element('h1');
				h1.textContent = 'PAGINA DI LOGIN';
				t2 = space();
				div0 = element('div');
				input0 = element('input');
				t3 = space();
				input1 = element('input');
				t4 = space();
				input2 = element('input');
				t5 = space();
				br = element('br');
				t6 = space();
				button0 = element('button');
				t7 = text(/*logtext*/ ctx[4]);
				t8 = space();
				button1 = element('button');
				button1.textContent = 'Registrati';
				attr_dev(link, 'rel', 'stylesheet');
				attr_dev(link, 'type', 'text/css');
				attr_dev(link, 'href', 'login.css');
				add_location(link, file$3, 0, 0, 0);
				add_location(h1, file$3, 2, 2, 90);
				attr_dev(input0, 'placeholder', 'Inserisci la tua email');
				add_location(input0, file$3, 4, 6, 147);
				attr_dev(input1, 'type', 'password');
				attr_dev(input1, 'placeholder', 'Inserisci la tua password');
				add_location(input1, file$3, 5, 6, 218);
				attr_dev(input2, 'type', 'password');
				attr_dev(input2, 'class', 'accesso2');
				input2.hidden = /*nascosto*/ ctx[3];
				attr_dev(input2, 'placeholder', 'Conferma la tua password');
				add_location(input2, file$3, 6, 6, 307);
				add_location(br, file$3, 7, 6, 434);
				attr_dev(div0, 'class', 'accesso');
				add_location(div0, file$3, 3, 4, 119);
				attr_dev(button0, 'type', 'button');
				attr_dev(button0, 'class', 'acce');
				add_location(button0, file$3, 9, 4, 454);
				attr_dev(button1, 'type', 'button');
				attr_dev(button1, 'id', 'reg');
				attr_dev(button1, 'class', 'regi');
				add_location(button1, file$3, 12, 4, 547);
				attr_dev(div1, 'class', 'Blog');
				attr_dev(div1, 'id', 'login');
				add_location(div1, file$3, 1, 0, 57);
			},
			l: function claim(nodes) {
				throw new Error(
					'options.hydrate only works if the component was compiled with the `hydratable: true` option'
				);
			},
			m: function mount(target, anchor) {
				insert_dev(target, link, anchor);
				insert_dev(target, t0, anchor);
				insert_dev(target, div1, anchor);
				append_dev(div1, h1);
				append_dev(div1, t2);
				append_dev(div1, div0);
				append_dev(div0, input0);
				set_input_value(input0, /*user*/ ctx[0]);
				append_dev(div0, t3);
				append_dev(div0, input1);
				set_input_value(input1, /*pass*/ ctx[1]);
				append_dev(div0, t4);
				append_dev(div0, input2);
				set_input_value(input2, /*pass2*/ ctx[2]);
				append_dev(div0, t5);
				append_dev(div0, br);
				append_dev(div1, t6);
				append_dev(div1, button0);
				append_dev(button0, t7);
				append_dev(div1, t8);
				append_dev(div1, button1);

				if (!mounted) {
					dispose = [
						listen_dev(input0, 'input', /*input0_input_handler*/ ctx[6]),
						listen_dev(input1, 'input', /*input1_input_handler*/ ctx[7]),
						listen_dev(input2, 'input', /*input2_input_handler*/ ctx[8]),
						listen_dev(
							button0,
							'click',
							function () {
								if (is_function(/*funzione*/ ctx[5])) /*funzione*/ ctx[5].apply(this, arguments);
							},
							false,
							false,
							false
						),
						listen_dev(button1, 'click', reg$1, false, false, false)
					];

					mounted = true;
				}
			},
			p: function update(new_ctx, [dirty]) {
				ctx = new_ctx;

				if (dirty & /*user*/ 1 && input0.value !== /*user*/ ctx[0]) {
					set_input_value(input0, /*user*/ ctx[0]);
				}

				if (dirty & /*pass*/ 2 && input1.value !== /*pass*/ ctx[1]) {
					set_input_value(input1, /*pass*/ ctx[1]);
				}

				if (dirty & /*nascosto*/ 8) {
					prop_dev(input2, 'hidden', /*nascosto*/ ctx[3]);
				}

				if (dirty & /*pass2*/ 4 && input2.value !== /*pass2*/ ctx[2]) {
					set_input_value(input2, /*pass2*/ ctx[2]);
				}

				if (dirty & /*logtext*/ 16) set_data_dev(t7, /*logtext*/ ctx[4]);
			},
			i: noop,
			o: noop,
			d: function destroy(detaching) {
				if (detaching) detach_dev(link);
				if (detaching) detach_dev(t0);
				if (detaching) detach_dev(div1);
				mounted = false;
				run_all(dispose);
			}
		};

		dispatch_dev('SvelteRegisterBlock', {
			block,
			id: create_fragment$3.name,
			type: 'component',
			source: '',
			ctx
		});

		return block;
	}

	function reg$1() {
		window.location.href = '/registrati';
	}

	function instance$3($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Login', slots, []);
		let user = '';
		let pass = '';
		let pass2 = '';
		let result = null;
		let registra = '';
		let nascosto = 'hidden';
		let logtext = 'Login';
		let regnas = '';
		let pianosel = [];
		let pag = '';
		let funzione = doPost;

		function registrapage() {
			$$invalidate(3, (nascosto = ''));
			$$invalidate(4, (logtext = 'Registrati'));
			$$invalidate(5, (funzione = regpost));
			regnas = 'hidden';
		}

		async function doPost() {
			var host = location.protocol + '//' + location.hostname;

			fetch(host + ':3000/login', {
				method: 'post', // Default is 'get'
				body: JSON.stringify({ username: user, password: pass }),
				mode: 'cors',
				headers: new Headers({ 'Content-Type': 'application/json' })
			})
				.then((response) => response.json())
				.then((json) => console.log('Response', json));
		}

		async function regpost() {
			var host = location.protocol + '//' + location.hostname;

			if (document.getElementById('100').checked == true) {
				pianosel.push('100GB');
			} else if (document.getElementById('500').checked == true) {
				pianosel.push('500GB');
			} else if (document.getElementById('1000').checked == true) {
				pianosel.push('1000GB');
			} else if (document.getElementById('2000').checked == true) {
				pianosel.push('2000GB');
			}

			if (document.getElementById('anno').checked == true) {
				pianosel.push('anno');
			} else if (document.getElementById('mese').checked == true) {
				pianosel.push('mese');
			}

			if (document.getElementById('cc').checked == true) {
				pianosel.push('CC');
			} else if (document.getElementById('paypal').checked == true) {
				pianosel.push('paypal');
			} else if (document.getElementById('crypto').checked == true) {
				pianosel.push('crypto');
			} else if (document.getElementById('bonifico').checked == true) {
				pianosel.push('bonifico');
			}

			if (pass == pass2) {
				fetch(host + ':3000/register', {
					method: 'post', // Default is 'get'
					body: JSON.stringify({
						username: user,
						password: pass,
						piano: pianosel[0],
						pag: pianosel[1],
						met: pianosel[2]
					}),
					mode: 'cors',
					headers: new Headers({ 'Content-Type': 'application/json' })
				})
					.then((response) => response.json())
					.then((json) => console.log('Response', json));
			} else {
				alert('Le password non corrispondono');
			}
		}

		const writable_props = [];

		Object.keys($$props).forEach((key) => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot')
				console_1$1.warn(`<Login> was created with unknown prop '${key}'`);
		});

		function input0_input_handler() {
			user = this.value;
			$$invalidate(0, user);
		}

		function input1_input_handler() {
			pass = this.value;
			$$invalidate(1, pass);
		}

		function input2_input_handler() {
			pass2 = this.value;
			$$invalidate(2, pass2);
		}

		$$self.$capture_state = () => ({
			reg: reg$1,
			user,
			pass,
			pass2,
			result,
			registra,
			nascosto,
			logtext,
			regnas,
			pianosel,
			pag,
			funzione,
			registrapage,
			doPost,
			regpost
		});

		$$self.$inject_state = ($$props) => {
			if ('user' in $$props) $$invalidate(0, (user = $$props.user));
			if ('pass' in $$props) $$invalidate(1, (pass = $$props.pass));
			if ('pass2' in $$props) $$invalidate(2, (pass2 = $$props.pass2));
			if ('result' in $$props) result = $$props.result;
			if ('registra' in $$props) registra = $$props.registra;
			if ('nascosto' in $$props) $$invalidate(3, (nascosto = $$props.nascosto));
			if ('logtext' in $$props) $$invalidate(4, (logtext = $$props.logtext));
			if ('regnas' in $$props) regnas = $$props.regnas;
			if ('pianosel' in $$props) pianosel = $$props.pianosel;
			if ('pag' in $$props) pag = $$props.pag;
			if ('funzione' in $$props) $$invalidate(5, (funzione = $$props.funzione));
		};

		if ($$props && '$$inject' in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [
			user,
			pass,
			pass2,
			nascosto,
			logtext,
			funzione,
			input0_input_handler,
			input1_input_handler,
			input2_input_handler
		];
	}

	class Login extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

			dispatch_dev('SvelteRegisterComponent', {
				component: this,
				tagName: 'Login',
				options,
				id: create_fragment$3.name
			});
		}
	}

	/* src/index.svelte generated by Svelte v3.46.4 */
	const file$2 = 'src/index.svelte';

	function create_fragment$2(ctx) {
		let link0;
		let link1;
		let script0;
		let script0_src_value;
		let script1;
		let script1_src_value;
		let t0;
		let header;
		let nav;
		let ul;
		let li0;
		let t1;
		let div1;
		let div0;
		let t2;
		let br0;
		let t3;
		let br1;
		let t4;
		let t5;
		let li1;
		let t6;
		let div3;
		let div2;
		let t8;
		let li2;
		let t9;
		let div5;
		let div4;
		let t11;
		let h1;
		let t13;
		let div8;
		let table;
		let thead;
		let th0;
		let t14;
		let span0;
		let a0;
		let t16;
		let div6;
		let t17;
		let br2;
		let t18;
		let br3;
		let t19;
		let th1;
		let t20;
		let th2;
		let t21;
		let span1;
		let a1;
		let t23;
		let div7;
		let t24;
		let br4;
		let t25;
		let br5;
		let t26;
		let br6;
		let t27;
		let t28;
		let tbody;
		let tr0;
		let td0;
		let span4;
		let t29;
		let span2;
		let t31;
		let span3;
		let td1;
		let t33;
		let td2;
		let span7;
		let t34;
		let span5;
		let t36;
		let span6;
		let t38;
		let tr1;
		let td3;
		let span10;
		let t39;
		let span8;
		let t41;
		let span9;
		let t43;
		let td4;
		let t44;
		let td5;
		let span13;
		let t45;
		let span11;
		let t47;
		let span12;
		let t49;
		let tr2;
		let td6;
		let span16;
		let t50;
		let span14;
		let t52;
		let span15;
		let t54;
		let td7;
		let t55;
		let td8;
		let span19;
		let t56;
		let span17;
		let t58;
		let span18;
		let t60;
		let tr3;
		let td9;
		let span22;
		let t61;
		let span20;
		let t63;
		let span21;
		let t65;
		let td10;
		let t66;
		let td11;
		let span25;
		let t67;
		let span23;
		let t69;
		let span24;
		let t71;
		let div10;
		let div9;
		let p0;
		let strong;
		let t73;
		let br7;
		let t74;
		let t75;
		let div11;
		let t76;
		let p1;
		let img;
		let img_src_value;
		let t77;
		let p2;
		let t79;
		let div12;
		let video;
		let source;
		let source_src_value;

		const block = {
			c: function create() {
				link0 = element('link');
				link1 = element('link');
				script0 = element('script');
				script1 = element('script');
				t0 = space();
				header = element('header');
				nav = element('nav');
				ul = element('ul');
				li0 = element('li');
				t1 = text('Servizi\n              ');
				div1 = element('div');
				div0 = element('div');
				t2 = text(
					'THECLOUD ti permette di creare delle cartelle e di aprirle ovunque, basta creare una stanza. è gestibile '
				);
				br0 = element('br');
				t3 = text(
					'\n                          a proprio piacimento, in oltre è protetta dal nome della stanza e da una password. '
				);
				br1 = element('br');
				t4 = text(
					'\n                          Dentro si possono aggiungere o trasferire cartelle e file.'
				);
				t5 = space();
				li1 = element('li');
				t6 = text('Assistenza\n          ');
				div3 = element('div');
				div2 = element('div');
				div2.textContent =
					'Il nostro servizio di assistenza per qualsiasi problema è aperto h24 tutta la settimana.';
				t8 = space();
				li2 = element('li');
				t9 = text('contatti\n          ');
				div5 = element('div');
				div4 = element('div');
				div4.textContent = 'Tel: \n                             \n                  mail:';
				t11 = space();
				h1 = element('h1');
				h1.textContent = 'PIANI DI ABBONAMENTO';
				t13 = space();
				div8 = element('div');
				table = element('table');
				thead = element('thead');
				th0 = element('th');
				t14 = text('PIANO UTENTI ');
				span0 = element('span');
				a0 = element('a');
				a0.textContent = 'INFO';
				t16 = space();
				div6 = element('div');
				t17 = text("Nell'area per Utenti puoi salvare i tuoi");
				br2 = element('br');
				t18 = text('\n                        file in tutta comodità, condividerli e');
				br3 = element('br');
				t19 = text('\n                        modificarli a tuo piacimento.');
				th1 = element('th');
				t20 = space();
				th2 = element('th');
				t21 = text('PIANO BUSINESS ');
				span1 = element('span');
				a1 = element('a');
				a1.textContent = 'INFO';
				t23 = space();
				div7 = element('div');
				t24 = text("Nell'area Business puoi mettere date di");
				br4 = element('br');
				t25 = text('\n                        scadenza ai Files,in caso di certificati');
				br5 = element('br');
				t26 = text('\n                        e allo scadere ci saranno dei messaggi ');
				br6 = element('br');
				t27 = text("\n                        di avviso dall'app.");
				t28 = space();
				tbody = element('tbody');
				tr0 = element('tr');
				td0 = element('td');
				span4 = element('span');
				t29 = text('100 GB | 0,99€');
				span2 = element('span');
				span2.textContent = '/mese';
				t31 = text(' | 9,99€');
				span3 = element('span');
				span3.textContent = '/anno';
				td1 = element('td');
				t33 = space();
				td2 = element('td');
				span7 = element('span');
				t34 = text('1 TB | 5,99€');
				span5 = element('span');
				span5.textContent = '/mese';
				t36 = text(' | 49,99€');
				span6 = element('span');
				span6.textContent = '/anno';
				t38 = space();
				tr1 = element('tr');
				td3 = element('td');
				span10 = element('span');
				t39 = text('500 GB | 4,99€');
				span8 = element('span');
				span8.textContent = '/mese';
				t41 = text(' | 44,99€');
				span9 = element('span');
				span9.textContent = '/anno';
				t43 = space();
				td4 = element('td');
				t44 = space();
				td5 = element('td');
				span13 = element('span');
				t45 = text('5 TB | 19,99€ ');
				span11 = element('span');
				span11.textContent = '/mese';
				t47 = text(' | 179,99€');
				span12 = element('span');
				span12.textContent = '/anno';
				t49 = space();
				tr2 = element('tr');
				td6 = element('td');
				span16 = element('span');
				t50 = text('1 TB | 6,99€');
				span14 = element('span');
				span14.textContent = '/mese';
				t52 = text(' | 79,99€');
				span15 = element('span');
				span15.textContent = '/anno';
				t54 = space();
				td7 = element('td');
				t55 = space();
				td8 = element('td');
				span19 = element('span');
				t56 = text('10 TB | 39,99€ ');
				span17 = element('span');
				span17.textContent = '/mese';
				t58 = text(' | 439,99€');
				span18 = element('span');
				span18.textContent = '/anno';
				t60 = space();
				tr3 = element('tr');
				td9 = element('td');
				span22 = element('span');
				t61 = text('2 TB | 8,99€');
				span20 = element('span');
				span20.textContent = '/mese';
				t63 = text(' | 94,99€');
				span21 = element('span');
				span21.textContent = '/anno';
				t65 = space();
				td10 = element('td');
				t66 = space();
				td11 = element('td');
				span25 = element('span');
				t67 = text('100 TB | 399,99€ ');
				span23 = element('span');
				span23.textContent = '/mese';
				t69 = text(' | 4799,99€');
				span24 = element('span');
				span24.textContent = '/anno';
				t71 = space();
				div10 = element('div');
				div9 = element('div');
				p0 = element('p');
				strong = element('strong');
				strong.textContent = 'THECLOUD';
				t73 = text(
					' si occupa di creare cartelle virtuali, nelle quali ogni utente può salvare file o qualsiasi '
				);
				br7 = element('br');
				t74 = text(
					' altro contenuto.\n              Crea le tue cartelle accessibili ovunque, in totale sicurezza.'
				);
				t75 = space();
				div11 = element('div');
				t76 = space();
				p1 = element('p');
				img = element('img');
				t77 = space();
				p2 = element('p');
				p2.textContent = 'Video tutorial sul funzionamento del sito';
				t79 = space();
				div12 = element('div');
				video = element('video');
				source = element('source');
				document.title = 'THECLOUD.com';
				attr_dev(link0, 'rel', 'preconnect');
				attr_dev(link0, 'href', 'https://fonts.googleapis.com');
				add_location(link0, file$2, 2, 2, 46);
				attr_dev(link1, 'rel', 'preconnect');
				attr_dev(link1, 'href', 'https://fonts.googleapis.com');
				add_location(link1, file$2, 3, 2, 108);
				if (!src_url_equal(script0.src, (script0_src_value = './particles.js')))
					attr_dev(script0, 'src', script0_src_value);
				add_location(script0, file$2, 4, 2, 170);
				if (!src_url_equal(script1.src, (script1_src_value = './app.js')))
					attr_dev(script1, 'src', script1_src_value);
				add_location(script1, file$2, 5, 2, 211);
				add_location(br0, file$2, 18, 137, 641);
				add_location(br1, file$2, 19, 115, 761);
				attr_dev(div0, 'class', 'cardstyle');
				add_location(div0, file$2, 17, 18, 480);
				attr_dev(div1, 'class', 'card1');
				add_location(div1, file$2, 16, 14, 441);
				add_location(li0, file$2, 15, 6, 415);
				attr_dev(div2, 'class', 'cardstyle');
				add_location(div2, file$2, 26, 14, 975);
				attr_dev(div3, 'class', 'card2');
				add_location(div3, file$2, 25, 10, 941);
				add_location(li1, file$2, 24, 6, 916);
				attr_dev(div4, 'class', 'cardstyle');
				add_location(div4, file$2, 34, 14, 1236);
				attr_dev(div5, 'class', 'card3');
				add_location(div5, file$2, 33, 10, 1202);
				add_location(li2, file$2, 32, 6, 1179);
				add_location(ul, file$2, 14, 2, 404);
				add_location(nav, file$2, 13, 1, 396);
				add_location(header, file$2, 12, 0, 386);
				attr_dev(h1, 'class', 'piani-title');
				add_location(h1, file$2, 45, 6, 1479);
				attr_dev(a0, 'href', '#');
				add_location(a0, file$2, 49, 64, 1672);
				add_location(br2, file$2, 51, 64, 1799);
				add_location(br3, file$2, 52, 62, 1866);
				attr_dev(div6, 'class', 'infouno');
				add_location(div6, file$2, 50, 20, 1713);
				attr_dev(span0, 'class', 'info');
				add_location(span0, file$2, 49, 45, 1653);
				add_location(th0, file$2, 49, 18, 1626);
				attr_dev(th1, 'class', 'centro');
				add_location(th1, file$2, 53, 71, 1942);
				attr_dev(a1, 'href', '#');
				add_location(a1, file$2, 54, 67, 2034);
				add_location(br4, file$2, 56, 63, 2160);
				add_location(br5, file$2, 57, 64, 2229);
				add_location(br6, file$2, 58, 63, 2297);
				attr_dev(div7, 'class', 'infouno');
				add_location(div7, file$2, 55, 20, 2075);
				attr_dev(span1, 'class', 'info');
				add_location(span1, file$2, 54, 47, 2014);
				add_location(th2, file$2, 54, 18, 1985);
				add_location(thead, file$2, 48, 14, 1600);
				attr_dev(span2, 'class', 'mese');
				add_location(span2, file$2, 64, 86, 2539);
				attr_dev(span3, 'class', 'mese');
				add_location(span3, file$2, 64, 140, 2593);
				attr_dev(span4, 'class', 'title-span');
				add_location(span4, file$2, 64, 41, 2494);
				attr_dev(td0, 'class', 'utenti');
				add_location(td0, file$2, 64, 22, 2475);
				attr_dev(td1, 'class', 'centro');
				add_location(td1, file$2, 64, 183, 2636);
				attr_dev(span5, 'class', 'mese');
				add_location(span5, file$2, 65, 81, 2742);
				attr_dev(span6, 'class', 'mese');
				add_location(span6, file$2, 65, 136, 2797);
				attr_dev(span7, 'class', 'title-span');
				add_location(span7, file$2, 65, 38, 2699);
				attr_dev(td2, 'class', 'bus');
				add_location(td2, file$2, 65, 22, 2683);
				add_location(tr0, file$2, 63, 18, 2448);
				attr_dev(span8, 'class', 'mese');
				add_location(span8, file$2, 68, 86, 2974);
				attr_dev(span9, 'class', 'mese');
				add_location(span9, file$2, 68, 141, 3029);
				attr_dev(span10, 'class', 'title-span');
				add_location(span10, file$2, 68, 41, 2929);
				attr_dev(td3, 'class', 'utenti');
				add_location(td3, file$2, 68, 22, 2910);
				attr_dev(td4, 'class', 'centro');
				add_location(td4, file$2, 68, 185, 3073);
				attr_dev(span11, 'class', 'mese');
				add_location(span11, file$2, 69, 83, 3181);
				attr_dev(span12, 'class', 'mese');
				add_location(span12, file$2, 69, 139, 3237);
				attr_dev(span13, 'class', 'title-span');
				add_location(span13, file$2, 69, 38, 3136);
				attr_dev(td5, 'class', 'bus');
				add_location(td5, file$2, 69, 22, 3120);
				add_location(tr1, file$2, 67, 18, 2883);
				attr_dev(span14, 'class', 'mese');
				add_location(span14, file$2, 72, 84, 3413);
				attr_dev(span15, 'class', 'mese');
				add_location(span15, file$2, 72, 139, 3468);
				attr_dev(span16, 'class', 'title-span');
				add_location(span16, file$2, 72, 41, 3370);
				attr_dev(td6, 'class', 'utenti');
				add_location(td6, file$2, 72, 22, 3351);
				attr_dev(td7, 'class', 'centro');
				add_location(td7, file$2, 72, 183, 3512);
				attr_dev(span17, 'class', 'mese');
				add_location(span17, file$2, 73, 84, 3621);
				attr_dev(span18, 'class', 'mese');
				add_location(span18, file$2, 73, 140, 3677);
				attr_dev(span19, 'class', 'title-span');
				add_location(span19, file$2, 73, 38, 3575);
				attr_dev(td8, 'class', 'bus');
				add_location(td8, file$2, 73, 22, 3559);
				add_location(tr2, file$2, 71, 18, 3324);
				attr_dev(span20, 'class', 'mese');
				add_location(span20, file$2, 76, 84, 3853);
				attr_dev(span21, 'class', 'mese');
				add_location(span21, file$2, 76, 139, 3908);
				attr_dev(span22, 'class', 'title-span');
				add_location(span22, file$2, 76, 41, 3810);
				attr_dev(td9, 'class', 'utenti');
				add_location(td9, file$2, 76, 22, 3791);
				attr_dev(td10, 'class', 'centro');
				add_location(td10, file$2, 76, 183, 3952);
				attr_dev(span23, 'class', 'mese');
				add_location(span23, file$2, 77, 86, 4063);
				attr_dev(span24, 'class', 'mese');
				add_location(span24, file$2, 77, 143, 4120);
				attr_dev(span25, 'class', 'title-span');
				add_location(span25, file$2, 77, 38, 4015);
				attr_dev(td11, 'class', 'bus');
				add_location(td11, file$2, 77, 22, 3999);
				add_location(tr3, file$2, 75, 18, 3764);
				add_location(tbody, file$2, 62, 14, 2422);
				add_location(table, file$2, 47, 10, 1578);
				attr_dev(div8, 'align', 'center');
				attr_dev(div8, 'class', 'tab');
				add_location(div8, file$2, 46, 6, 1535);
				add_location(strong, file$2, 86, 29, 4347);
				add_location(br7, file$2, 86, 154, 4472);
				attr_dev(p0, 'class', 'det');
				add_location(p0, file$2, 86, 14, 4332);
				attr_dev(div9, 'class', 'testo');
				add_location(div9, file$2, 85, 10, 4298);
				attr_dev(div10, 'align', 'center');
				add_location(div10, file$2, 84, 6, 4267);
				attr_dev(div11, 'class', 'infodue');
				add_location(div11, file$2, 92, 6, 4625);
				if (!src_url_equal(img.src, (img_src_value = 'img/fine.png')))
					attr_dev(img, 'src', img_src_value);
				attr_dev(img, 'width', '800');
				attr_dev(img, 'height', '350');
				add_location(img, file$2, 96, 28, 4690);
				attr_dev(p1, 'align', 'center');
				add_location(p1, file$2, 96, 10, 4672);
				attr_dev(p2, 'align', 'center');
				attr_dev(p2, 'class', 'tutorial');
				add_location(p2, file$2, 98, 10, 4766);
				if (!src_url_equal(source.src, (source_src_value = 'video.mp4')))
					attr_dev(source, 'src', source_src_value);
				attr_dev(source, 'type', 'video/mp4');
				add_location(source, file$2, 102, 18, 4955);
				attr_dev(video, 'width', '800');
				attr_dev(video, 'height', '400');
				video.controls = true;
				add_location(video, file$2, 101, 14, 4895);
				attr_dev(div12, 'align', 'center');
				add_location(div12, file$2, 100, 10, 4860);
			},
			l: function claim(nodes) {
				throw new Error(
					'options.hydrate only works if the component was compiled with the `hydratable: true` option'
				);
			},
			m: function mount(target, anchor) {
				append_dev(document.head, link0);
				append_dev(document.head, link1);
				append_dev(document.head, script0);
				append_dev(document.head, script1);
				insert_dev(target, t0, anchor);
				insert_dev(target, header, anchor);
				append_dev(header, nav);
				append_dev(nav, ul);
				append_dev(ul, li0);
				append_dev(li0, t1);
				append_dev(li0, div1);
				append_dev(div1, div0);
				append_dev(div0, t2);
				append_dev(div0, br0);
				append_dev(div0, t3);
				append_dev(div0, br1);
				append_dev(div0, t4);
				append_dev(ul, t5);
				append_dev(ul, li1);
				append_dev(li1, t6);
				append_dev(li1, div3);
				append_dev(div3, div2);
				append_dev(ul, t8);
				append_dev(ul, li2);
				append_dev(li2, t9);
				append_dev(li2, div5);
				append_dev(div5, div4);
				insert_dev(target, t11, anchor);
				insert_dev(target, h1, anchor);
				insert_dev(target, t13, anchor);
				insert_dev(target, div8, anchor);
				append_dev(div8, table);
				append_dev(table, thead);
				append_dev(thead, th0);
				append_dev(th0, t14);
				append_dev(th0, span0);
				append_dev(span0, a0);
				append_dev(span0, t16);
				append_dev(span0, div6);
				append_dev(div6, t17);
				append_dev(div6, br2);
				append_dev(div6, t18);
				append_dev(div6, br3);
				append_dev(div6, t19);
				append_dev(thead, th1);
				append_dev(thead, t20);
				append_dev(thead, th2);
				append_dev(th2, t21);
				append_dev(th2, span1);
				append_dev(span1, a1);
				append_dev(span1, t23);
				append_dev(span1, div7);
				append_dev(div7, t24);
				append_dev(div7, br4);
				append_dev(div7, t25);
				append_dev(div7, br5);
				append_dev(div7, t26);
				append_dev(div7, br6);
				append_dev(div7, t27);
				append_dev(table, t28);
				append_dev(table, tbody);
				append_dev(tbody, tr0);
				append_dev(tr0, td0);
				append_dev(td0, span4);
				append_dev(span4, t29);
				append_dev(span4, span2);
				append_dev(span4, t31);
				append_dev(span4, span3);
				append_dev(tr0, td1);
				append_dev(tr0, t33);
				append_dev(tr0, td2);
				append_dev(td2, span7);
				append_dev(span7, t34);
				append_dev(span7, span5);
				append_dev(span7, t36);
				append_dev(span7, span6);
				append_dev(tbody, t38);
				append_dev(tbody, tr1);
				append_dev(tr1, td3);
				append_dev(td3, span10);
				append_dev(span10, t39);
				append_dev(span10, span8);
				append_dev(span10, t41);
				append_dev(span10, span9);
				append_dev(span10, t43);
				append_dev(tr1, td4);
				append_dev(tr1, t44);
				append_dev(tr1, td5);
				append_dev(td5, span13);
				append_dev(span13, t45);
				append_dev(span13, span11);
				append_dev(span13, t47);
				append_dev(span13, span12);
				append_dev(tbody, t49);
				append_dev(tbody, tr2);
				append_dev(tr2, td6);
				append_dev(td6, span16);
				append_dev(span16, t50);
				append_dev(span16, span14);
				append_dev(span16, t52);
				append_dev(span16, span15);
				append_dev(span16, t54);
				append_dev(tr2, td7);
				append_dev(tr2, t55);
				append_dev(tr2, td8);
				append_dev(td8, span19);
				append_dev(span19, t56);
				append_dev(span19, span17);
				append_dev(span19, t58);
				append_dev(span19, span18);
				append_dev(tbody, t60);
				append_dev(tbody, tr3);
				append_dev(tr3, td9);
				append_dev(td9, span22);
				append_dev(span22, t61);
				append_dev(span22, span20);
				append_dev(span22, t63);
				append_dev(span22, span21);
				append_dev(span22, t65);
				append_dev(tr3, td10);
				append_dev(tr3, t66);
				append_dev(tr3, td11);
				append_dev(td11, span25);
				append_dev(span25, t67);
				append_dev(span25, span23);
				append_dev(span25, t69);
				append_dev(span25, span24);
				insert_dev(target, t71, anchor);
				insert_dev(target, div10, anchor);
				append_dev(div10, div9);
				append_dev(div9, p0);
				append_dev(p0, strong);
				append_dev(p0, t73);
				append_dev(p0, br7);
				append_dev(p0, t74);
				insert_dev(target, t75, anchor);
				insert_dev(target, div11, anchor);
				insert_dev(target, t76, anchor);
				insert_dev(target, p1, anchor);
				append_dev(p1, img);
				insert_dev(target, t77, anchor);
				insert_dev(target, p2, anchor);
				insert_dev(target, t79, anchor);
				insert_dev(target, div12, anchor);
				append_dev(div12, video);
				append_dev(video, source);
			},
			p: noop,
			i: noop,
			o: noop,
			d: function destroy(detaching) {
				detach_dev(link0);
				detach_dev(link1);
				detach_dev(script0);
				detach_dev(script1);
				if (detaching) detach_dev(t0);
				if (detaching) detach_dev(header);
				if (detaching) detach_dev(t11);
				if (detaching) detach_dev(h1);
				if (detaching) detach_dev(t13);
				if (detaching) detach_dev(div8);
				if (detaching) detach_dev(t71);
				if (detaching) detach_dev(div10);
				if (detaching) detach_dev(t75);
				if (detaching) detach_dev(div11);
				if (detaching) detach_dev(t76);
				if (detaching) detach_dev(p1);
				if (detaching) detach_dev(t77);
				if (detaching) detach_dev(p2);
				if (detaching) detach_dev(t79);
				if (detaching) detach_dev(div12);
			}
		};

		dispatch_dev('SvelteRegisterBlock', {
			block,
			id: create_fragment$2.name,
			type: 'component',
			source: '',
			ctx
		});

		return block;
	}

	function instance$2($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Src', slots, []);
		const writable_props = [];

		Object.keys($$props).forEach((key) => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot')
				console.warn(`<Src> was created with unknown prop '${key}'`);
		});

		$$self.$capture_state = () => ({ Router: Router$1, Route: Route$1, Link: Link$1, Login });
		return [];
	}

	class Src extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

			dispatch_dev('SvelteRegisterComponent', {
				component: this,
				tagName: 'Src',
				options,
				id: create_fragment$2.name
			});
		}
	}

	/* src/registrati.svelte generated by Svelte v3.46.4 */

	const { console: console_1 } = globals;
	const file$1 = 'src/registrati.svelte';

	function create_fragment$1(ctx) {
		let link;
		let t0;
		let div16;
		let div0;
		let input0;
		let t1;
		let input1;
		let t2;
		let input2;
		let t3;
		let br;
		let t4;
		let form0;
		let p0;
		let t6;
		let div1;
		let input3;
		let t7;
		let span2;
		let t8;
		let span0;
		let t10;
		let span1;
		let t12;
		let div2;
		let input4;
		let t13;
		let span5;
		let t14;
		let span3;
		let t16;
		let span4;
		let t18;
		let div3;
		let input5;
		let t19;
		let span8;
		let t20;
		let span6;
		let t22;
		let span7;
		let t24;
		let div4;
		let input6;
		let t25;
		let span11;
		let t26;
		let span9;
		let t28;
		let span10;
		let t30;
		let p1;
		let t32;
		let div5;
		let input7;
		let t33;
		let span14;
		let t34;
		let span12;
		let t36;
		let span13;
		let t38;
		let div6;
		let input8;
		let t39;
		let span17;
		let t40;
		let span15;
		let t42;
		let span16;
		let t44;
		let div7;
		let input9;
		let t45;
		let span20;
		let t46;
		let span18;
		let t48;
		let span19;
		let t50;
		let div8;
		let input10;
		let t51;
		let span23;
		let t52;
		let span21;
		let t54;
		let span22;
		let t56;
		let form1;
		let p2;
		let t58;
		let div9;
		let input11;
		let t59;
		let span24;
		let t61;
		let div10;
		let input12;
		let t62;
		let span25;
		let t64;
		let form2;
		let p3;
		let t66;
		let div11;
		let input13;
		let t67;
		let span26;
		let t69;
		let div12;
		let input14;
		let t70;
		let span27;
		let t72;
		let div13;
		let input15;
		let t73;
		let span28;
		let t75;
		let div14;
		let input16;
		let t76;
		let span29;
		let t78;
		let div15;
		let button;
		let mounted;
		let dispose;

		const block = {
			c: function create() {
				link = element('link');
				t0 = space();
				div16 = element('div');
				div0 = element('div');
				input0 = element('input');
				t1 = space();
				input1 = element('input');
				t2 = space();
				input2 = element('input');
				t3 = space();
				br = element('br');
				t4 = space();
				form0 = element('form');
				p0 = element('p');
				p0.textContent = 'Seleziona un piano per utenti';
				t6 = space();
				div1 = element('div');
				input3 = element('input');
				t7 = space();
				span2 = element('span');
				t8 = text('100 GB | 0,99€');
				span0 = element('span');
				span0.textContent = '/mese';
				t10 = text(' |  9,99€');
				span1 = element('span');
				span1.textContent = '/anno';
				t12 = space();
				div2 = element('div');
				input4 = element('input');
				t13 = space();
				span5 = element('span');
				t14 = text('500 GB | 4,99€');
				span3 = element('span');
				span3.textContent = '/mese';
				t16 = text(' | 51.99€');
				span4 = element('span');
				span4.textContent = '/anno';
				t18 = space();
				div3 = element('div');
				input5 = element('input');
				t19 = space();
				span8 = element('span');
				t20 = text('1 TB | 6,99€');
				span6 = element('span');
				span6.textContent = '/mese';
				t22 = text(' | 79,99€');
				span7 = element('span');
				span7.textContent = '/anno';
				t24 = space();
				div4 = element('div');
				input6 = element('input');
				t25 = space();
				span11 = element('span');
				t26 = text('2 TB | 8,99€');
				span9 = element('span');
				span9.textContent = '/mese';
				t28 = text(' | 92,99€');
				span10 = element('span');
				span10.textContent = '/anno';
				t30 = space();
				p1 = element('p');
				p1.textContent = 'Seleziona un piano Business';
				t32 = space();
				div5 = element('div');
				input7 = element('input');
				t33 = space();
				span14 = element('span');
				t34 = text('1 TB | 6,99€');
				span12 = element('span');
				span12.textContent = '/mese';
				t36 = text(' |  49,99€');
				span13 = element('span');
				span13.textContent = '/anno';
				t38 = space();
				div6 = element('div');
				input8 = element('input');
				t39 = space();
				span17 = element('span');
				t40 = text('5 TB | 19,99€');
				span15 = element('span');
				span15.textContent = '/mese';
				t42 = text(' | 179.99€');
				span16 = element('span');
				span16.textContent = '/anno';
				t44 = space();
				div7 = element('div');
				input9 = element('input');
				t45 = space();
				span20 = element('span');
				t46 = text('10 TB | 39,99€');
				span18 = element('span');
				span18.textContent = '/mese';
				t48 = text(' | 439,99€');
				span19 = element('span');
				span19.textContent = '/anno';
				t50 = space();
				div8 = element('div');
				input10 = element('input');
				t51 = space();
				span23 = element('span');
				t52 = text('100 TB | 399,99€');
				span21 = element('span');
				span21.textContent = '/mese';
				t54 = text(' | 4799,99€');
				span22 = element('span');
				span22.textContent = '/anno';
				t56 = space();
				form1 = element('form');
				p2 = element('p');
				p2.textContent = 'Seleziona il tipo di pagamento';
				t58 = space();
				div9 = element('div');
				input11 = element('input');
				t59 = space();
				span24 = element('span');
				span24.textContent = 'Pagamento annuale';
				t61 = space();
				div10 = element('div');
				input12 = element('input');
				t62 = space();
				span25 = element('span');
				span25.textContent = 'Pagamento mensile';
				t64 = space();
				form2 = element('form');
				p3 = element('p');
				p3.textContent = 'Seleziona il metodo di pagamento';
				t66 = space();
				div11 = element('div');
				input13 = element('input');
				t67 = space();
				span26 = element('span');
				span26.textContent = 'Carta di credito';
				t69 = space();
				div12 = element('div');
				input14 = element('input');
				t70 = space();
				span27 = element('span');
				span27.textContent = 'PayPal';
				t72 = space();
				div13 = element('div');
				input15 = element('input');
				t73 = space();
				span28 = element('span');
				span28.textContent = 'Crypto';
				t75 = space();
				div14 = element('div');
				input16 = element('input');
				t76 = space();
				span29 = element('span');
				span29.textContent = 'Bonifico bancario';
				t78 = space();
				div15 = element('div');
				button = element('button');
				button.textContent = 'Conferma la registrazione';
				attr_dev(link, 'rel', 'stylesheet');
				attr_dev(link, 'type', 'text/css');
				attr_dev(link, 'href', 'login.css');
				add_location(link, file$1, 0, 0, 0);
				attr_dev(input0, 'placeholder', 'Inserisci la tua email');
				add_location(input0, file$1, 5, 10, 136);
				attr_dev(input1, 'type', 'password');
				attr_dev(input1, 'placeholder', 'Inserisci la tua password');
				add_location(input1, file$1, 6, 10, 211);
				attr_dev(input2, 'type', 'password');
				attr_dev(input2, 'class', 'accesso2');
				attr_dev(input2, 'placeholder', 'Conferma la tua password');
				add_location(input2, file$1, 7, 10, 304);
				add_location(br, file$1, 8, 10, 415);
				attr_dev(div0, 'class', 'accesso');
				attr_dev(div0, 'align', 'center');
				add_location(div0, file$1, 4, 8, 89);
				add_location(p0, file$1, 12, 6, 468);
				attr_dev(input3, 'type', 'radio');
				attr_dev(input3, 'id', '100');
				attr_dev(input3, 'name', 'size');
				input3.value = 'size';
				add_location(input3, file$1, 14, 10, 542);
				attr_dev(span0, 'class', 'mese');
				add_location(span0, file$1, 15, 34, 632);
				attr_dev(span1, 'class', 'mese');
				add_location(span1, file$1, 15, 78, 676);
				add_location(span2, file$1, 15, 10, 608);
				attr_dev(div1, 'class', 'spazio');
				add_location(div1, file$1, 13, 6, 511);
				attr_dev(input4, 'type', 'radio');
				attr_dev(input4, 'id', '500');
				attr_dev(input4, 'name', 'size');
				input4.value = 'size';
				add_location(input4, file$1, 18, 10, 765);
				attr_dev(span3, 'class', 'mese');
				add_location(span3, file$1, 19, 34, 855);
				attr_dev(span4, 'class', 'mese');
				add_location(span4, file$1, 19, 78, 899);
				add_location(span5, file$1, 19, 10, 831);
				attr_dev(div2, 'class', 'spazio');
				add_location(div2, file$1, 17, 6, 734);
				attr_dev(input5, 'type', 'radio');
				attr_dev(input5, 'id', '1000');
				attr_dev(input5, 'name', 'size');
				input5.value = 'size';
				add_location(input5, file$1, 22, 10, 988);
				attr_dev(span6, 'class', 'mese');
				add_location(span6, file$1, 23, 32, 1077);
				attr_dev(span7, 'class', 'mese');
				add_location(span7, file$1, 23, 76, 1121);
				add_location(span8, file$1, 23, 10, 1055);
				attr_dev(div3, 'class', 'spazio');
				add_location(div3, file$1, 21, 6, 957);
				attr_dev(input6, 'type', 'radio');
				attr_dev(input6, 'id', '2000');
				attr_dev(input6, 'name', 'size');
				input6.value = 'size';
				add_location(input6, file$1, 26, 10, 1211);
				attr_dev(span9, 'class', 'mese');
				add_location(span9, file$1, 27, 32, 1300);
				attr_dev(span10, 'class', 'mese');
				add_location(span10, file$1, 27, 76, 1344);
				add_location(span11, file$1, 27, 10, 1278);
				attr_dev(div4, 'class', 'spazio');
				add_location(div4, file$1, 25, 6, 1180);
				add_location(p1, file$1, 29, 6, 1402);
				attr_dev(input7, 'type', 'radio');
				attr_dev(input7, 'id', '100');
				attr_dev(input7, 'name', 'size');
				input7.value = 'size';
				add_location(input7, file$1, 31, 10, 1474);
				attr_dev(span12, 'class', 'mese');
				add_location(span12, file$1, 32, 32, 1562);
				attr_dev(span13, 'class', 'mese');
				add_location(span13, file$1, 32, 77, 1607);
				add_location(span14, file$1, 32, 10, 1540);
				attr_dev(div5, 'class', 'spazio');
				add_location(div5, file$1, 30, 6, 1443);
				attr_dev(input8, 'type', 'radio');
				attr_dev(input8, 'id', '500');
				attr_dev(input8, 'name', 'size');
				input8.value = 'size';
				add_location(input8, file$1, 35, 10, 1696);
				attr_dev(span15, 'class', 'mese');
				add_location(span15, file$1, 36, 33, 1785);
				attr_dev(span16, 'class', 'mese');
				add_location(span16, file$1, 36, 78, 1830);
				add_location(span17, file$1, 36, 10, 1762);
				attr_dev(div6, 'class', 'spazio');
				add_location(div6, file$1, 34, 6, 1665);
				attr_dev(input9, 'type', 'radio');
				attr_dev(input9, 'id', '1000');
				attr_dev(input9, 'name', 'size');
				input9.value = 'size';
				add_location(input9, file$1, 39, 10, 1919);
				attr_dev(span18, 'class', 'mese');
				add_location(span18, file$1, 40, 34, 2010);
				attr_dev(span19, 'class', 'mese');
				add_location(span19, file$1, 40, 79, 2055);
				add_location(span20, file$1, 40, 10, 1986);
				attr_dev(div7, 'class', 'spazio');
				add_location(div7, file$1, 38, 6, 1888);
				attr_dev(input10, 'type', 'radio');
				attr_dev(input10, 'id', '2000');
				attr_dev(input10, 'name', 'size');
				input10.value = 'size';
				add_location(input10, file$1, 43, 10, 2145);
				attr_dev(span21, 'class', 'mese');
				add_location(span21, file$1, 44, 36, 2238);
				attr_dev(span22, 'class', 'mese');
				add_location(span22, file$1, 44, 82, 2284);
				add_location(span23, file$1, 44, 10, 2212);
				attr_dev(div8, 'class', 'spazio');
				add_location(div8, file$1, 42, 6, 2114);
				attr_dev(form0, 'action', '');
				add_location(form0, file$1, 11, 4, 445);
				add_location(p2, file$1, 49, 6, 2374);
				attr_dev(input11, 'type', 'radio');
				attr_dev(input11, 'id', 'anno');
				attr_dev(input11, 'name', 'pag');
				input11.value = 'pag';
				add_location(input11, file$1, 51, 10, 2449);
				add_location(span24, file$1, 52, 10, 2514);
				attr_dev(div9, 'class', 'spazio');
				add_location(div9, file$1, 50, 6, 2418);
				attr_dev(input12, 'type', 'radio');
				attr_dev(input12, 'id', 'mese');
				attr_dev(input12, 'name', 'pag');
				input12.value = 'pag';
				add_location(input12, file$1, 55, 10, 2595);
				add_location(span25, file$1, 56, 6, 2656);
				attr_dev(div10, 'class', 'spazio');
				add_location(div10, file$1, 54, 6, 2564);
				attr_dev(form1, 'action', '');
				add_location(form1, file$1, 48, 4, 2351);
				add_location(p3, file$1, 60, 6, 2737);
				attr_dev(input13, 'type', 'radio');
				attr_dev(input13, 'id', 'cc');
				attr_dev(input13, 'name', 'met');
				input13.value = 'met';
				add_location(input13, file$1, 62, 10, 2814);
				add_location(span26, file$1, 63, 6, 2873);
				attr_dev(div11, 'class', 'spazio');
				add_location(div11, file$1, 61, 6, 2783);
				attr_dev(input14, 'type', 'radio');
				attr_dev(input14, 'id', 'paypal');
				attr_dev(input14, 'name', 'met');
				input14.value = 'met';
				add_location(input14, file$1, 66, 10, 2953);
				add_location(span27, file$1, 67, 6, 3016);
				attr_dev(div12, 'class', 'spazio');
				add_location(div12, file$1, 65, 6, 2922);
				attr_dev(input15, 'type', 'radio');
				attr_dev(input15, 'id', 'crypto');
				attr_dev(input15, 'name', 'met');
				input15.value = 'met';
				add_location(input15, file$1, 70, 10, 3086);
				add_location(span28, file$1, 71, 6, 3149);
				attr_dev(div13, 'class', 'spazio');
				add_location(div13, file$1, 69, 6, 3055);
				attr_dev(input16, 'type', 'radio');
				attr_dev(input16, 'id', 'bonifico');
				attr_dev(input16, 'name', 'met');
				input16.value = 'met';
				add_location(input16, file$1, 74, 10, 3219);
				add_location(span29, file$1, 75, 6, 3284);
				attr_dev(div14, 'class', 'spazio');
				add_location(div14, file$1, 73, 6, 3188);
				attr_dev(form2, 'action', '');
				add_location(form2, file$1, 59, 4, 2714);
				attr_dev(button, 'type', 'button');
				attr_dev(button, 'id', 'reg');
				attr_dev(button, 'class', 'regi');
				add_location(button, file$1, 79, 6, 3371);
				attr_dev(div15, 'align', 'center');
				add_location(div15, file$1, 78, 4, 3344);
				attr_dev(div16, 'id', 'piani');
				add_location(div16, file$1, 2, 0, 58);
			},
			l: function claim(nodes) {
				throw new Error(
					'options.hydrate only works if the component was compiled with the `hydratable: true` option'
				);
			},
			m: function mount(target, anchor) {
				insert_dev(target, link, anchor);
				insert_dev(target, t0, anchor);
				insert_dev(target, div16, anchor);
				append_dev(div16, div0);
				append_dev(div0, input0);
				set_input_value(input0, /*user*/ ctx[0]);
				append_dev(div0, t1);
				append_dev(div0, input1);
				set_input_value(input1, /*pass*/ ctx[1]);
				append_dev(div0, t2);
				append_dev(div0, input2);
				set_input_value(input2, /*pass2*/ ctx[2]);
				append_dev(div0, t3);
				append_dev(div0, br);
				append_dev(div16, t4);
				append_dev(div16, form0);
				append_dev(form0, p0);
				append_dev(form0, t6);
				append_dev(form0, div1);
				append_dev(div1, input3);
				append_dev(div1, t7);
				append_dev(div1, span2);
				append_dev(span2, t8);
				append_dev(span2, span0);
				append_dev(span2, t10);
				append_dev(span2, span1);
				append_dev(form0, t12);
				append_dev(form0, div2);
				append_dev(div2, input4);
				append_dev(div2, t13);
				append_dev(div2, span5);
				append_dev(span5, t14);
				append_dev(span5, span3);
				append_dev(span5, t16);
				append_dev(span5, span4);
				append_dev(form0, t18);
				append_dev(form0, div3);
				append_dev(div3, input5);
				append_dev(div3, t19);
				append_dev(div3, span8);
				append_dev(span8, t20);
				append_dev(span8, span6);
				append_dev(span8, t22);
				append_dev(span8, span7);
				append_dev(form0, t24);
				append_dev(form0, div4);
				append_dev(div4, input6);
				append_dev(div4, t25);
				append_dev(div4, span11);
				append_dev(span11, t26);
				append_dev(span11, span9);
				append_dev(span11, t28);
				append_dev(span11, span10);
				append_dev(form0, t30);
				append_dev(form0, p1);
				append_dev(form0, t32);
				append_dev(form0, div5);
				append_dev(div5, input7);
				append_dev(div5, t33);
				append_dev(div5, span14);
				append_dev(span14, t34);
				append_dev(span14, span12);
				append_dev(span14, t36);
				append_dev(span14, span13);
				append_dev(form0, t38);
				append_dev(form0, div6);
				append_dev(div6, input8);
				append_dev(div6, t39);
				append_dev(div6, span17);
				append_dev(span17, t40);
				append_dev(span17, span15);
				append_dev(span17, t42);
				append_dev(span17, span16);
				append_dev(form0, t44);
				append_dev(form0, div7);
				append_dev(div7, input9);
				append_dev(div7, t45);
				append_dev(div7, span20);
				append_dev(span20, t46);
				append_dev(span20, span18);
				append_dev(span20, t48);
				append_dev(span20, span19);
				append_dev(form0, t50);
				append_dev(form0, div8);
				append_dev(div8, input10);
				append_dev(div8, t51);
				append_dev(div8, span23);
				append_dev(span23, t52);
				append_dev(span23, span21);
				append_dev(span23, t54);
				append_dev(span23, span22);
				append_dev(div16, t56);
				append_dev(div16, form1);
				append_dev(form1, p2);
				append_dev(form1, t58);
				append_dev(form1, div9);
				append_dev(div9, input11);
				append_dev(div9, t59);
				append_dev(div9, span24);
				append_dev(form1, t61);
				append_dev(form1, div10);
				append_dev(div10, input12);
				append_dev(div10, t62);
				append_dev(div10, span25);
				append_dev(div16, t64);
				append_dev(div16, form2);
				append_dev(form2, p3);
				append_dev(form2, t66);
				append_dev(form2, div11);
				append_dev(div11, input13);
				append_dev(div11, t67);
				append_dev(div11, span26);
				append_dev(form2, t69);
				append_dev(form2, div12);
				append_dev(div12, input14);
				append_dev(div12, t70);
				append_dev(div12, span27);
				append_dev(form2, t72);
				append_dev(form2, div13);
				append_dev(div13, input15);
				append_dev(div13, t73);
				append_dev(div13, span28);
				append_dev(form2, t75);
				append_dev(form2, div14);
				append_dev(div14, input16);
				append_dev(div14, t76);
				append_dev(div14, span29);
				append_dev(div16, t78);
				append_dev(div16, div15);
				append_dev(div15, button);

				if (!mounted) {
					dispose = [
						listen_dev(input0, 'input', /*input0_input_handler*/ ctx[3]),
						listen_dev(input1, 'input', /*input1_input_handler*/ ctx[4]),
						listen_dev(input2, 'input', /*input2_input_handler*/ ctx[5])
					];

					mounted = true;
				}
			},
			p: function update(ctx, [dirty]) {
				if (dirty & /*user*/ 1 && input0.value !== /*user*/ ctx[0]) {
					set_input_value(input0, /*user*/ ctx[0]);
				}

				if (dirty & /*pass*/ 2 && input1.value !== /*pass*/ ctx[1]) {
					set_input_value(input1, /*pass*/ ctx[1]);
				}

				if (dirty & /*pass2*/ 4 && input2.value !== /*pass2*/ ctx[2]) {
					set_input_value(input2, /*pass2*/ ctx[2]);
				}
			},
			i: noop,
			o: noop,
			d: function destroy(detaching) {
				if (detaching) detach_dev(link);
				if (detaching) detach_dev(t0);
				if (detaching) detach_dev(div16);
				mounted = false;
				run_all(dispose);
			}
		};

		dispatch_dev('SvelteRegisterBlock', {
			block,
			id: create_fragment$1.name,
			type: 'component',
			source: '',
			ctx
		});

		return block;
	}

	function reg() {
		window.location.href = '/registrati';
	}

	function instance$1($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Registrati', slots, []);
		let user = '';
		let pass = '';
		let pass2 = '';
		let result = null;
		let registra = '';
		let nascosto = 'hidden';
		let logtext = 'Login';
		let regnas = '';
		let pianosel = [];
		let pag = '';
		let funzione = doPost;

		function registrapage() {
			nascosto = '';
			logtext = 'Registrati';
			funzione = regpost;
			regnas = 'hidden';
		}

		async function doPost() {
			var host = location.protocol + '//' + location.hostname;

			fetch(host + ':3000/login', {
				method: 'post', // Default is 'get'
				body: JSON.stringify({ username: user, password: pass }),
				mode: 'cors',
				headers: new Headers({ 'Content-Type': 'application/json' })
			})
				.then((response) => response.json())
				.then((json) => console.log('Response', json));
		}

		async function regpost() {
			var host = location.protocol + '//' + location.hostname;

			if (document.getElementById('100').checked == true) {
				pianosel.push('100GB');
			} else if (document.getElementById('500').checked == true) {
				pianosel.push('500GB');
			} else if (document.getElementById('1000').checked == true) {
				pianosel.push('1000GB');
			} else if (document.getElementById('2000').checked == true) {
				pianosel.push('2000GB');
			}

			if (document.getElementById('anno').checked == true) {
				pianosel.push('anno');
			} else if (document.getElementById('mese').checked == true) {
				pianosel.push('mese');
			}

			if (document.getElementById('cc').checked == true) {
				pianosel.push('CC');
			} else if (document.getElementById('paypal').checked == true) {
				pianosel.push('paypal');
			} else if (document.getElementById('crypto').checked == true) {
				pianosel.push('crypto');
			} else if (document.getElementById('bonifico').checked == true) {
				pianosel.push('bonifico');
			}

			if (pass == pass2) {
				fetch(host + ':3000/register', {
					method: 'post', // Default is 'get'
					body: JSON.stringify({
						username: user,
						password: pass,
						piano: pianosel[0],
						pag: pianosel[1],
						met: pianosel[2]
					}),
					mode: 'cors',
					headers: new Headers({ 'Content-Type': 'application/json' })
				})
					.then((response) => response.json())
					.then((json) => console.log('Response', json));
			} else {
				alert('Le password non corrispondono');
			}
		}

		const writable_props = [];

		Object.keys($$props).forEach((key) => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot')
				console_1.warn(`<Registrati> was created with unknown prop '${key}'`);
		});

		function input0_input_handler() {
			user = this.value;
			$$invalidate(0, user);
		}

		function input1_input_handler() {
			pass = this.value;
			$$invalidate(1, pass);
		}

		function input2_input_handler() {
			pass2 = this.value;
			$$invalidate(2, pass2);
		}

		$$self.$capture_state = () => ({
			reg,
			user,
			pass,
			pass2,
			result,
			registra,
			nascosto,
			logtext,
			regnas,
			pianosel,
			pag,
			funzione,
			registrapage,
			doPost,
			regpost
		});

		$$self.$inject_state = ($$props) => {
			if ('user' in $$props) $$invalidate(0, (user = $$props.user));
			if ('pass' in $$props) $$invalidate(1, (pass = $$props.pass));
			if ('pass2' in $$props) $$invalidate(2, (pass2 = $$props.pass2));
			if ('result' in $$props) result = $$props.result;
			if ('registra' in $$props) registra = $$props.registra;
			if ('nascosto' in $$props) nascosto = $$props.nascosto;
			if ('logtext' in $$props) logtext = $$props.logtext;
			if ('regnas' in $$props) regnas = $$props.regnas;
			if ('pianosel' in $$props) pianosel = $$props.pianosel;
			if ('pag' in $$props) pag = $$props.pag;
			if ('funzione' in $$props) funzione = $$props.funzione;
		};

		if ($$props && '$$inject' in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [user, pass, pass2, input0_input_handler, input1_input_handler, input2_input_handler];
	}

	class Registrati extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

			dispatch_dev('SvelteRegisterComponent', {
				component: this,
				tagName: 'Registrati',
				options,
				id: create_fragment$1.name
			});
		}
	}

	/* src/App.svelte generated by Svelte v3.46.4 */
	const file = 'src/App.svelte';

	// (12:12) <Link to="home">
	function create_default_slot_6(ctx) {
		let button;

		const block = {
			c: function create() {
				button = element('button');
				button.textContent = 'Home';
				attr_dev(button, 'type', 'button');
				attr_dev(button, 'class', 'accedi');
				add_location(button, file, 11, 28, 392);
			},
			m: function mount(target, anchor) {
				insert_dev(target, button, anchor);
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(button);
			}
		};

		dispatch_dev('SvelteRegisterBlock', {
			block,
			id: create_default_slot_6.name,
			type: 'slot',
			source: '(12:12) <Link to=\\"home\\">',
			ctx
		});

		return block;
	}

	// (16:12) <Link to="login">
	function create_default_slot_5(ctx) {
		let button;

		const block = {
			c: function create() {
				button = element('button');
				button.textContent = 'Accedi';
				attr_dev(button, 'type', 'button');
				attr_dev(button, 'class', 'accedi');
				add_location(button, file, 15, 29, 539);
			},
			m: function mount(target, anchor) {
				insert_dev(target, button, anchor);
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(button);
			}
		};

		dispatch_dev('SvelteRegisterBlock', {
			block,
			id: create_default_slot_5.name,
			type: 'slot',
			source: '(16:12) <Link to=\\"login\\">',
			ctx
		});

		return block;
	}

	// (19:14) <Link to="registrati">
	function create_default_slot_4(ctx) {
		let button;

		const block = {
			c: function create() {
				button = element('button');
				button.textContent = 'Registrati';
				attr_dev(button, 'type', 'button');
				attr_dev(button, 'class', 'accedi');
				add_location(button, file, 18, 36, 684);
			},
			m: function mount(target, anchor) {
				insert_dev(target, button, anchor);
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(button);
			}
		};

		dispatch_dev('SvelteRegisterBlock', {
			block,
			id: create_default_slot_4.name,
			type: 'slot',
			source: '(19:14) <Link to=\\"registrati\\">',
			ctx
		});

		return block;
	}

	// (23:8) <Route path="home">
	function create_default_slot_3(ctx) {
		let home;
		let current;
		home = new Src({ $$inline: true });

		const block = {
			c: function create() {
				create_component(home.$$.fragment);
			},
			m: function mount(target, anchor) {
				mount_component(home, target, anchor);
				current = true;
			},
			i: function intro(local) {
				if (current) return;
				transition_in(home.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(home.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				destroy_component(home, detaching);
			}
		};

		dispatch_dev('SvelteRegisterBlock', {
			block,
			id: create_default_slot_3.name,
			type: 'slot',
			source: '(23:8) <Route path=\\"home\\">',
			ctx
		});

		return block;
	}

	// (26:6) <Route path="login">
	function create_default_slot_2(ctx) {
		let login;
		let current;
		login = new Login({ $$inline: true });

		const block = {
			c: function create() {
				create_component(login.$$.fragment);
			},
			m: function mount(target, anchor) {
				mount_component(login, target, anchor);
				current = true;
			},
			i: function intro(local) {
				if (current) return;
				transition_in(login.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(login.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				destroy_component(login, detaching);
			}
		};

		dispatch_dev('SvelteRegisterBlock', {
			block,
			id: create_default_slot_2.name,
			type: 'slot',
			source: '(26:6) <Route path=\\"login\\">',
			ctx
		});

		return block;
	}

	// (29:6) <Route path="registrati">
	function create_default_slot_1(ctx) {
		let registrati;
		let current;
		registrati = new Registrati({ $$inline: true });

		const block = {
			c: function create() {
				create_component(registrati.$$.fragment);
			},
			m: function mount(target, anchor) {
				mount_component(registrati, target, anchor);
				current = true;
			},
			i: function intro(local) {
				if (current) return;
				transition_in(registrati.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(registrati.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				destroy_component(registrati, detaching);
			}
		};

		dispatch_dev('SvelteRegisterBlock', {
			block,
			id: create_default_slot_1.name,
			type: 'slot',
			source: '(29:6) <Route path=\\"registrati\\">',
			ctx
		});

		return block;
	}

	// (8:2) <Router>
	function create_default_slot(ctx) {
		let header;
		let span;
		let div0;
		let t2;
		let div1;
		let link0;
		let t3;
		let div2;
		let link1;
		let t4;
		let div3;
		let link2;
		let t5;
		let main;
		let route0;
		let t6;
		let route1;
		let t7;
		let route2;
		let current;

		link0 = new Link$1({
			props: {
				to: 'home',
				$$slots: { default: [create_default_slot_6] },
				$$scope: { ctx }
			},
			$$inline: true
		});

		link1 = new Link$1({
			props: {
				to: 'login',
				$$slots: { default: [create_default_slot_5] },
				$$scope: { ctx }
			},
			$$inline: true
		});

		link2 = new Link$1({
			props: {
				to: 'registrati',
				$$slots: { default: [create_default_slot_4] },
				$$scope: { ctx }
			},
			$$inline: true
		});

		route0 = new Route$1({
			props: {
				path: 'home',
				$$slots: { default: [create_default_slot_3] },
				$$scope: { ctx }
			},
			$$inline: true
		});

		route1 = new Route$1({
			props: {
				path: 'login',
				$$slots: { default: [create_default_slot_2] },
				$$scope: { ctx }
			},
			$$inline: true
		});

		route2 = new Route$1({
			props: {
				path: 'registrati',
				$$slots: { default: [create_default_slot_1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

		const block = {
			c: function create() {
				header = element('header');
				span = element('span');
				span.textContent = 'THECLOUD';
				div0 = element('div');
				div0.textContent = '.com';
				t2 = space();
				div1 = element('div');
				create_component(link0.$$.fragment);
				t3 = space();
				div2 = element('div');
				create_component(link1.$$.fragment);
				t4 = space();
				div3 = element('div');
				create_component(link2.$$.fragment);
				t5 = space();
				main = element('main');
				create_component(route0.$$.fragment);
				t6 = space();
				create_component(route1.$$.fragment);
				t7 = space();
				create_component(route2.$$.fragment);
				add_location(span, file, 9, 8, 287);
				attr_dev(div0, 'class', 'due');
				add_location(div0, file, 9, 29, 308);
				attr_dev(div1, 'class', 'pul');
				add_location(div1, file, 10, 8, 344);
				attr_dev(div2, 'class', 'pul');
				add_location(div2, file, 14, 10, 490);
				attr_dev(div3, 'class', 'pul');
				add_location(div3, file, 17, 12, 628);
				add_location(header, file, 8, 4, 270);
				add_location(main, file, 21, 4, 790);
			},
			m: function mount(target, anchor) {
				insert_dev(target, header, anchor);
				append_dev(header, span);
				append_dev(header, div0);
				append_dev(header, t2);
				append_dev(header, div1);
				mount_component(link0, div1, null);
				append_dev(header, t3);
				append_dev(header, div2);
				mount_component(link1, div2, null);
				append_dev(header, t4);
				append_dev(header, div3);
				mount_component(link2, div3, null);
				insert_dev(target, t5, anchor);
				insert_dev(target, main, anchor);
				mount_component(route0, main, null);
				append_dev(main, t6);
				mount_component(route1, main, null);
				append_dev(main, t7);
				mount_component(route2, main, null);
				current = true;
			},
			p: function update(ctx, dirty) {
				const link0_changes = {};

				if (dirty & /*$$scope*/ 1) {
					link0_changes.$$scope = { dirty, ctx };
				}

				link0.$set(link0_changes);
				const link1_changes = {};

				if (dirty & /*$$scope*/ 1) {
					link1_changes.$$scope = { dirty, ctx };
				}

				link1.$set(link1_changes);
				const link2_changes = {};

				if (dirty & /*$$scope*/ 1) {
					link2_changes.$$scope = { dirty, ctx };
				}

				link2.$set(link2_changes);
				const route0_changes = {};

				if (dirty & /*$$scope*/ 1) {
					route0_changes.$$scope = { dirty, ctx };
				}

				route0.$set(route0_changes);
				const route1_changes = {};

				if (dirty & /*$$scope*/ 1) {
					route1_changes.$$scope = { dirty, ctx };
				}

				route1.$set(route1_changes);
				const route2_changes = {};

				if (dirty & /*$$scope*/ 1) {
					route2_changes.$$scope = { dirty, ctx };
				}

				route2.$set(route2_changes);
			},
			i: function intro(local) {
				if (current) return;
				transition_in(link0.$$.fragment, local);
				transition_in(link1.$$.fragment, local);
				transition_in(link2.$$.fragment, local);
				transition_in(route0.$$.fragment, local);
				transition_in(route1.$$.fragment, local);
				transition_in(route2.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(link0.$$.fragment, local);
				transition_out(link1.$$.fragment, local);
				transition_out(link2.$$.fragment, local);
				transition_out(route0.$$.fragment, local);
				transition_out(route1.$$.fragment, local);
				transition_out(route2.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(header);
				destroy_component(link0);
				destroy_component(link1);
				destroy_component(link2);
				if (detaching) detach_dev(t5);
				if (detaching) detach_dev(main);
				destroy_component(route0);
				destroy_component(route1);
				destroy_component(route2);
			}
		};

		dispatch_dev('SvelteRegisterBlock', {
			block,
			id: create_default_slot.name,
			type: 'slot',
			source: '(8:2) <Router>',
			ctx
		});

		return block;
	}

	function create_fragment(ctx) {
		let link;
		let t;
		let router;
		let current;

		router = new Router$1({
			props: {
				$$slots: { default: [create_default_slot] },
				$$scope: { ctx }
			},
			$$inline: true
		});

		const block = {
			c: function create() {
				link = element('link');
				t = space();
				create_component(router.$$.fragment);
				attr_dev(link, 'rel', 'stylesheet');
				attr_dev(link, 'type', 'text/css');
				attr_dev(link, 'href', 'start.css');
				add_location(link, file, 6, 0, 198);
			},
			l: function claim(nodes) {
				throw new Error(
					'options.hydrate only works if the component was compiled with the `hydratable: true` option'
				);
			},
			m: function mount(target, anchor) {
				insert_dev(target, link, anchor);
				insert_dev(target, t, anchor);
				mount_component(router, target, anchor);
				current = true;
			},
			p: function update(ctx, [dirty]) {
				const router_changes = {};

				if (dirty & /*$$scope*/ 1) {
					router_changes.$$scope = { dirty, ctx };
				}

				router.$set(router_changes);
			},
			i: function intro(local) {
				if (current) return;
				transition_in(router.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(router.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) detach_dev(link);
				if (detaching) detach_dev(t);
				destroy_component(router, detaching);
			}
		};

		dispatch_dev('SvelteRegisterBlock', {
			block,
			id: create_fragment.name,
			type: 'component',
			source: '',
			ctx
		});

		return block;
	}

	function instance($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('App', slots, []);
		const writable_props = [];

		Object.keys($$props).forEach((key) => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot')
				console.warn(`<App> was created with unknown prop '${key}'`);
		});

		$$self.$capture_state = () => ({
			Router: Router$1,
			Route: Route$1,
			Link: Link$1,
			Home: Src,
			Login,
			Registrati
		});

		return [];
	}

	class App extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance, create_fragment, safe_not_equal, {});

			dispatch_dev('SvelteRegisterComponent', {
				component: this,
				tagName: 'App',
				options,
				id: create_fragment.name
			});
		}
	}

	var app = new App({
		target: document.body
	});

	return app;
})();
//# sourceMappingURL=bundle.js.map
