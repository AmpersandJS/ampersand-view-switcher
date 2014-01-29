function ViewSwitcher(el, options) {
    options || (options = {});
    this.el = el;
    this.config = {
        hide: null,
        show: null,
        waitForRemove: false
    };
    for (var item in options) {
        this.config[item] = options[item];
    }
    this.current = null;
}

ViewSwitcher.prototype.set = function (view) {
    var self = this;
    var prev = this.previous = this.current;
    var current = this.current = view;
    if (this.config.waitForRemove) {
        this._hide(prev, function () {
            // make sure we're still dealing with the same one
            // that way if we're navigating quickly we don't start
            // to show one that's already old.
            if (prev === self.previous && current === self.current) {
                self._show(current);
            }
        });
    } else {
        this._hide(prev);
        this._show(current);
    }
};

ViewSwitcher.prototype._show = function (view, cb) {
    var customShow = this.config.show;
    if (customShow) {
        // async
        if (customShow.length === 3) {
            this._render(view);
            customShow(view, cb);
        } else {
            this._render(view);
            customShow(view);
            if (cb) cb();
        }
    } else {
        this._render(view);
        if (cb) cb();
    }
};

ViewSwitcher.prototype._render = function (view) {
    view.render({containerEl: this.el});
    this.el.appendChild(view.el);
};

ViewSwitcher.prototype._hide = function (view, cb) {
    var customHide = this.config.hide;
    if (!view) return cb && cb();
    if (customHide) {
        // async
        if (customHide.length === 3) {
            customHide(view, this.current, function () {
                view.remove();
            });
        } else {
            customHide(view, this.current);
            view.remove();
            if (cb) cb();
        }
    } else {
        view.remove();
        if (cb) cb();
    }
};


module.exports = ViewSwitcher;
