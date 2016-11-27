function setOrientation(domItem, orientation) {
    if (orientation === 'row') {
        domItem.style.display = 'inline-block';
    } else if (orientation === 'column') {
        domItem.style.display = 'block';
    } else {
        console.warn(`you need specify display for item element toolbar`);
    }
}

function createToolbarItem(baseOptions, itemOptions, container) {
    const classes = `${baseOptions.template.classes} ${itemOptions.classes}`;
    const item = L.DomUtil.create(baseOptions.template.tag, classes, container);
    item.title = itemOptions.title;
    item.style.margin = '0 auto';

    setOrientation(item, baseOptions.orientation);

    return item;
}


L.FunctionButtons = L.Control.extend({
    includes: L.Mixin.Events,

    initialize: function (buttons, options) {
        if (!('push' in buttons && 'splice' in buttons))
            buttons = [buttons];
        this._buttons = buttons;
        if (!options && buttons.length > 0 && 'position' in buttons[0])
            options = { position: buttons[0].position };

        this._options = options;
        L.Control.prototype.initialize.call(this, options);
    },

    onAdd: function (map) {
        this._map = map;

        var container = L.DomUtil.create('div', this._options.toolbarTemplate.classes);
        for (var i = 0; i < this._buttons.length; i++) {
            var button = this._buttons[i],
                domItem = createToolbarItem(this._options, button, container);

            domItem._buttonIndex = i; // todo: remove?

            if (button.title) {
                domItem.title = button.title;
            }

            button.domItem = domItem;

            var stop = L.DomEvent.stopPropagation;
            L.DomEvent
                .on(domItem, 'click', stop)
                .on(domItem, 'mousedown', stop)
                .on(domItem, 'dblclick', stop);

            if (!button.href) {
                L.DomEvent
                    .on(domItem, 'click', L.DomEvent.preventDefault)
                    .on(domItem, 'click', this.clicked, this);
            }
        }

        return container;
    },

    clicked: function (e) {
        var domItem = (window.event && window.event.srcElement) || e.target || e.srcElement;
        while (domItem && 'tagName' in domItem && domItem.tagName !== 'A' && !('_buttonIndex' in domItem))
            domItem = domItem.parentNode;
        if ('_buttonIndex' in domItem) {
            var button = this._buttons[domItem._buttonIndex];
            if (button) {
                if ('callback' in button)
                    button.callback.call(button.context);
                this.fire('clicked', { idx: domItem._buttonIndex });
            }
        }
    }
});

L.Toolbar = function (buttons, options) {
    return new L.FunctionButtons(buttons, options);
};