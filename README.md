# ampersand-view-switcher

This module does one thing: *it helps you swap out views inside of an element*. It's compatible with ampersand-view, backbone views and any view that has an `.el`, `.render` and `.remove()`

What might you do with it?
- build a page container for your app.
- build a system for managing display of modals in your single page app.
- animate a transition between showing any two views.

What it does
- Takes an instantiated view and renders it in the container.
- Removes the existing view from the container and calls `remove` on it.
- Makes it easy to do custom stuff as views are added and removed.
- Works either synchronously or asynchronously depending on whether you want to animate transitions between the views.
- Makes no assumptions about what your views do or how they're structured except the following:
    - Views should have an `.el` property that is the root element of the view.
    - Views should have a `.remove()` method that cleans up and unbinds methods accordingly.
    - If your view has a `.render()` method it will get called before it's shown.
    - Beyond this, they could be any object.
- IT DOES VERY LITTLE ELSE (and *that* is a feature)

## Install

```
npm install ampersand-view-switcher
```

## Example

Here's an example of how you might use the view switcher to handle page views within your ampersand app.

`mainview.js`

```js
var AmpersandView = require('ampersand-view');
var ViewSwitcher = require('ampersand-view-switcher');
var templates = require('./templates');

module.exports = AmpersandView.extend({
    template: templates.body,
    render: function () {
        // render our template
        this.renderWithTemplate();

        // grab the element without our template based on its "data-hook" attribute
        this.pageContainer = this.queryByHook('page-container');

        // set up our page switcher for that element
        this.pageSwitcher = new ViewSwitcher(this.pageContainer, {
            // here we provide a few things we'd like to do each time
            // we switch pages in the app.
            show: function (newView, oldView) {
                // set our document title
                document.title = newView.pageTitle || 'my awesome app';
                // scroll to the top
                document.body.scrollTop = 0;
                // perhaps store a reference to our current page on our
                // app global for easy access from the browser console.
                app.currentPage = newView;
            }
        });
    } 
});
```

Or if you wanted to animate them you can do it asynchronously like so:

```js
// set up our page switcher for that element
this.pageSwitcher = new ViewSwitcher(this.pageContainer, {
    // whether or not to wait for remove to be done before starting show
    waitForRemove: true,
    // here we provide a few things to do before the element gets
    // removed from the DOM.
    hide: function (oldView, newView, cb) {
        // it's inserted and rendered for me so we'll add a class 
        // that has a corresponding CSS transition.
        oldView.el.classList.add('animateOut');
        // give it time to finish (yes there are other ways to do this)
        setTimeout(cb, 1000);
    },
    // here we provide a few things we'd like to do each time
    // we switch pages in the app.
    show: function (newView, oldView) {
        // it's inserted and rendered for me
        document.title = newView.pageTitle || 'app name';
        document.body.scrollTop = 0;

        // store an additional reference, just because
        app.currentPage = newView;

        newView.el.classList.add('animateIn');
        setTimeout(cb, 2000)
    }
});
```


## API Reference

### constructor `new ViewSwitcher(element, [options])`

* `element` {Element} The DOM element that should contain the views.
* `options` {Object} [optinal]
    * `show` {Function} [optional] A function that gets called when a view is being shown. It's passed the new view, the previous view (if relevant), and a callback. If you name 3 incoming arguments for example `function (newView, oldView, callback) { ... }` the view switcher will wait for you to call the callback before it's considered ready. If you only use one or two like this: `function (newView, oldView) { ... }` it won't wait for you to call a callback.
    * `hide` {Function} [optional] A function that gets called when a view is being removed. It's passed the old view, the new view (if relevant), and a callback. If you name 3 incoming arguments for example `function (oldView, newView, callback) { ... }` the view switcher will wait for you to call the callback before it's considered ready. If you only use one or two like this: `function (oldView, newView) { ... }` it won't wait for you to call a callback.
    * `waitForRemove` {Boolean} [default: `false`] Whether or not to wait until your `hide` animation callback gets called before starting your `show` animation.
    * `empty` {Function} [optional] A function that gets called any time the view switcher is empty. Including when you instantiate it without giving it a view to start with.
    * `view` {View} [optional] A view instance to start with.

```javascript
var switcher = new ViewSwitcher(document.querySelector('#pageContainer'));

var view = new MyView({ model: model });

switcher.set(view);
```

### set `switcher.set(viewInstance)`

* `viewInstance` {View} The new view to render.

The instantiated view switcher has this one main method. Simply call it with the new view you wish to show.

This is most likely going to be an instantiated [ampersand-view](https://github.com/ampersandjs/ampersand-view) or Backbone.View, but can be anything that has a `.el` property that represents that view's root element and `.remove()` method that cleans up after itself. In addition if your custom view object has a `.render()` method it will get called before the view is added to the DOM.

```javascript
var switcher = new ViewSwitcher(document.querySelector('#pageContainer'));

var view = new MyView({ model: model });

switcher.set(view);
```

### clear `switcher.clear(callback)`

* `callback` {Function} [optional] An optional callback when removed. Useful if you're doing custom animations.

Removes the current view from the view switcher. Calls `callback` when done if one was provided.`

```javascript
var switcher = new ViewSwitcher(document.querySelector('#pageContainer'));

var view = new MyView({ model: model });

switcher.set(view);

switcher.clear();
```

## Changelog

- 0.3.0 Adding empty callback, initial view option.
- 0.0.1 Initial version (prototype stage, beware)

<!-- starthide -->

## Credits

Written by [@HenrikJoreteg](http://twitter.com/henrikjoreteg) with inspiration and ideas from [@philip_roberts](http://twitter.com/philip_roberts) and [@wraithgar](http://twitter.com/wraithgar) and [other awesome Yetis](http://andyet.com/team).


## License

MIT

<!-- endhide -->
