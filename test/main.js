var test = require('tape');
var ViewSwitcher = require('../ampersand-view-switcher');
var View = require('ampersand-view');

var makeTestView = function(options) {
    return View.extend({
        template: '<div data-hook="container"></div>',
        render: function () {
            this.renderWithTemplate();
            this.switcher = new ViewSwitcher(this.queryByHook('container'), options);
        }
    });
};

var ItemView = View.extend({
    template: '<a>hey</a>',
    autoRender: true
});

test('basics', function (t) {
    var Base = makeTestView();
    var base = new Base();
    var c1 = new ItemView();
    var c2 = new ItemView();
    base.render();
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
    base.render();
    t.equal(count, 1, 'should be called at first');
    base.switcher.set(c1);
    base.switcher.clear();
    t.equal(count, 2, 'should be called when clear is called');
    base.switcher.set(c2);
    c2.remove();
    t.equal(count, 3, 'should be called when view is removed');
    t.end();
});

test('`options.hide', function(t) {
    t.plan(4);
    var TestView = makeTestView({
        hide: function(oldView, newView) {
            t.equal(oldView, c1, 'first param should be previous view');
            t.equal(newView, c2, 'second param should be current view');
        }
    });
    var base = new TestView();
    var c1 = new ItemView();
    var c2 = new ItemView();
    base.render();
    base.switcher.set(c1);
    base.switcher.set(c2);
    t.equal(c1.el.parentNode, null, 'the previous view was removed');
    t.equal(base.el.firstChild, c2.el, 'the current view was set');
});
