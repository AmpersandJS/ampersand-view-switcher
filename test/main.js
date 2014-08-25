var test = require('tape');
var ViewSwitcher = require('../ampersand-view-switcher');
var View = require('ampersand-view');


var TestView = View.extend({
    template: '<div data-hook="container"></div>',
    render: function () {
        this.renderWithTemplate();
        this.switcher = new ViewSwitcher(this.queryByHook('container'));
    }
});

var ItemView = View.extend({
    template: '<a>hey</a>',
    autoRender: true
});

test('basics', function (t) {
    var base = new TestView();
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
    var NewView = TestView.extend({
        render: function () {
            this.renderWithTemplate();
            this.switcher = new ViewSwitcher(this.queryByHook('container'), {
                empty: function () {
                    count++;
                }
            });
        }
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
