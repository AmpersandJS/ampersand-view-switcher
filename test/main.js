var test = require('tape');
var viewCompliance = require('ampersand-view-conventions');
var ViewSwitcher = require('../ampersand-view-switcher');
var View = require('ampersand-view');

var makeTestView = function(options) {
    options = options || {};
    return View.extend({
        template: '<div data-hook="container"></div>',
        autoRender: true,
        render: function () {
            this.renderWithTemplate();
            if (!options.el) options.el = this.queryByHook('container');
            this.switcher = new ViewSwitcher(options);
        }
    });
};

var ItemView = View.extend({
    template: '<a>hey</a>',
    autoRender: true
});

var SelfInsertingView = View.extend({
    insertSelf: true,
    render: function () {}
});

viewCompliance.view(test, ViewSwitcher, { el: document.createElement("div") });

test('basics', function (t) {
    var Base = makeTestView();
    var base = new Base();
    var c1 = new ItemView();
    var c2 = new ItemView();
    t.ok(base.el);
    base.switcher.set(c1);
    t.equal(base.el.firstChild, c1.el);
    base.switcher.set(c2);
    t.equal(base.el.firstChild, c2.el);
    t.end();
});

test('calls `empty` when appropriate', function (t) {
    var count = 0;
    var NewView = makeTestView({
        empty: function () { count++; }
    });
    var c1 = new ItemView();
    var c2 = new ItemView();
    var base = new NewView();
    t.equal(count, 1, 'should be called at first');
    base.switcher.set(c1);
    base.switcher.clear();
    t.equal(count, 2, 'should be called when clear is called');
    base.switcher.set(c2);
    c2.remove();
    t.equal(count, 3, 'should be called when view is removed');
    t.end();
});

test('self inserting views can be set without throwing exceptions', function (t) {
    var Base = makeTestView();
    var base = new Base();
    var v1 = new SelfInsertingView();
    base.render();
    t.doesNotThrow(function() {
        base.switcher.set(v1);
    });
    t.end();
});

test('`options.show`', function (t) {
    var TestView = makeTestView({
        show: function (newView) {
            t.equal(newView, c1, 'first param should be new view');
        }
    });
    var base = new TestView();
    var c1 = new ItemView();
    base.switcher.set(c1);
    t.equal(base.el.firstChild, c1.el, 'the current view was set');
    t.end();
});

test('`options.prepend`', function (t) {
    var TestView = makeTestView({
        prepend: true
    });
    var base = new TestView();
    var c1 = new ItemView();
    base.el.appendChild(document.createElement('div'));
    base.switcher.set(c1);
    t.equal(c1.el.parentNode.firstChild, c1.el, 'view was prepended to container');
    t.end();
});

test('`options.hide`', function (t) {
    var TestView = makeTestView({
        hide: function (oldView) {
            t.equal(oldView, c1, 'first param should be previous view');
        }
    });
    var base = new TestView();
    var c1 = new ItemView();
    var c2 = new ItemView();
    base.switcher.set(c1);
    base.switcher.set(c2);
    t.equal(c1.el.parentNode, null, 'the previous view was removed');
    t.equal(base.el.firstChild, c2.el, 'the current view was set');
    t.end();
});

test('`option.hide` with `waitForRemove`', function (t) {
    var TestView = makeTestView({
        waitForRemove: true,
        hide: function (oldView, cb) {
            t.equal(oldView, c1, 'first param should be previous view');
            t.ok(typeof cb === 'function', 'second param is callback');
            cb();
        }
    });
    var base = new TestView();
    var c1 = new ItemView();
    var c2 = new ItemView();
    base.switcher.set(c1);
    base.switcher.set(c2);
    t.equal(c1.el.parentNode, null, 'the previous view was removed');
    t.equal(base.el.firstChild, c2.el, 'the current view was set');
    t.end();
});

test('`option.show` and `option.hide` used together', function (t) {
    var showCount = 0;
    var hideCount = 0;
    var TestView = makeTestView({
        show: function () {
            showCount++;
        },
        hide: function () {
            hideCount++;
        }
    });
    var base = new TestView();
    var c1 = new ItemView();
    var c2 = new ItemView();
    base.switcher.set(c1);
    t.equal(base.el.firstChild, c1.el, 'first view was set');
    base.switcher.set(c2);
    t.equal(c1.el.parentNode, null, 'first view was removed');
    t.equal(base.el.firstChild, c2.el, 'second view was set');
    t.equal(showCount, 2, 'show should be called for every view we set');
    t.equal(hideCount, 1, 'hide should be called only once, after first view has been set');
    t.end();
});

test('`option.autoRender` false`', function (t) {
    var c1 = new ItemView();
    var TestView = makeTestView({
        autoRender: false,
        view: c1
    });
    var base = new TestView();
    t.equal(base.switcher.config.autoRender, false, 'autoRender set to false');
    t.equal(c1.el.parentNode, null, 'option view was not rendered');
    base.switcher.render();
    t.equal(base.el.firstChild, c1.el, 'option view was rendered');
    t.end();
});

test('`option.autoRender` true', function (t) {
    var c1 = new ItemView();
    var TestView = makeTestView({
        autoRender: true,
        view: c1
    });
    var base = new TestView();
    t.equal(base.switcher.config.autoRender, true, 'autoRender set to true');
    t.equal(base.switcher.el.firstChild, c1.el, 'option view was rendered');
    t.end();
});
