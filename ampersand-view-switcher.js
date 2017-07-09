/*$AMPERSAND_VERSION*/
function ViewSwitcher(options) {
    options || (options = {});
    this.el = options.el;
    this.config = {
        hide: null,
        show: null,
        empty: null,
        prepend: false,
        waitForRemove: false,
        autoRender: true
    };
    for (var item in options) {
        if (this.config.hasOwnProperty(item)) {
            this.config[item] = options[item];
        }
    }
    
    this._setCurrent(options.view);
    if (this.config.autoRender) this.render();
}

ViewSwitcher.prototype.set = function (view) {
    var self = this;
    var prev = this.previous = this.current;

    if (prev === view) {
        return;
    }

    if (this.config.waitForRemove) {
        this.next = view;
        this._hide(prev, function () {
            if (self.next === view) {
                delete self.next;
                self._show(view);
            }
        });
    } else {
        this._hide(prev);
        this._show(view);
    }
    return this;
};

ViewSwitcher.prototype._setCurrent = function (view) {
    this.current = view;
    if (view) this._registerRemoveListener(view);
    var emptyCb = this.config.empty;
    if (emptyCb && !this.current) {
        emptyCb();
    }
    return view;
};

ViewSwitcher.prototype.clear = function (cb) {
    this._hide(this.current, cb);
    return this;
};

// If the view switcher itself is removed, remove its child to avoid memory leaks
ViewSwitcher.prototype.remove = function () {
    if (this.current) this.current.remove();
    if (this.previous) this.previous.remove();
    if (this.el && this.el.parentNode) this.el.parentNode.removeChild(this.el);
    return this;
};

ViewSwitcher.prototype._show = function (view) {
    var customShow = this.config.show;
    this._setCurrent(view);
    this._render(view);
    if (customShow) customShow(view);
};

ViewSwitcher.prototype._registerRemoveListener = function (view) {
    if (view && view.once) view.once('remove', this._onViewRemove, this);
};

ViewSwitcher.prototype._onViewRemove = function (view) {
    var emptyCb = this.config.empty;
    if (this.current === view) {
        this.current = null;
    }
    if (emptyCb && !this.current) {
        emptyCb();
    }
};

ViewSwitcher.prototype._render = function (view) {
    if(this.el) {
        if (!view.rendered) view.render({containerEl: this.el});
        if (!view.insertSelf) {
            if (this.config.prepend) {
                this.el.insertBefore(view.el, this.el.firstChild);
            } else {
                this.el.appendChild(view.el);
            }
        }
    }
};

ViewSwitcher.prototype.render = function () {
    if (this.current && !this._rendered) {
        this._render(this.current);
    }
    //set rendered, el exists even if a current view was not inserted/appended
    this._rendered = true;
    return this;
};

ViewSwitcher.prototype._hide = function (view, cb) {
    var customHide = this.config.hide;
    if (!view) return cb && cb();
    if (customHide) {
        if (customHide.length === 2) {
            customHide(view, function () {
                view.remove();
                if (cb) cb();
            });
        } else {
            customHide(view);
            view.remove();
            if (cb) cb();
        }
    } else {
        view.remove();
        if (cb) cb();
    }
};


module.exports = ViewSwitcher;
