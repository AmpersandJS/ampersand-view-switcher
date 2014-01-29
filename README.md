# human-view-switcher

This module does one thing: *it helps you swap out views inside of an element*. It's compatible with human-view, backbone views and any view that has an `.el`, `.render` and `.remove()`

What might you do with it?
- build a page container for your app.
- build a system for managing display of modals in your single page app.
- When you want to animate a transition between showing any two views.

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

## installing

```
npm install human-view-switcher
```

## example usage

Here's an example of how you might use the view switcher to handle page views within your humanjs app.

`mainview.js`

```js
var HumanView = require('human-view');
var templates = require('./templates');

module.exports = HumanView.extend({
    template: templates.body,
    render: function () {
        // render our template
        this.renderAndBind();

        // grab the element without our template based on its "role" attribute
        this.pageContainer = this.getByRole('page-container');

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
                app.currentPage = view;
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
        view.el.classList.add('animateOut');
        // give it time to finish (yes there are other ways to do this)
        setTimeout(cb, 1000);
    },
    // here we provide a few things we'd like to do each time
    // we switch pages in the app.
    show: function (view, oldView) {
        // it's inserted and rendered for me
        document.title = newView.pageTitle || 'app name';
        document.body.scrollTop = 0;

        // store an additional reference, just because
        app.currentPage = newView;

        view.el.classList.add('animateIn');
        setTimeout(cb, 2000)
    }
});
```


## Changelog

- 0.0.1 Initial version (prototype stage, beware)

## Credits

Written by [@HenrikJoreteg](http://twitter.com/henrikjoreteg) with inspiration and ideas from [@philip_roberts](http://twitter.com/philip_roberts) and [@wraithgar](http://twitter.com/wraithgar) and [other awesome Yetis](http://andyet.com/team).


## License

MIT
