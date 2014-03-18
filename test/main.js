var test = require('tape');
var ViewSwitcher = require('../ampersand-view-switcher');
var View = require('ampersand-view');


var TestView = View.extend({
    template: '<div role="container"></div>',
    render: function () {
        this.renderAndBind();
        this.switcher = new ViewSwitcher(this.getByRole('container'));
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


