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
        if (!(buttons.push && buttons.splice)) {
            buttons = [buttons];
        }

        if (!options.position) {
            options.position = 'topleft';
        }

        this._groupsButton = buttons;
        this._options = options;

        L.Control.prototype.initialize.call(this, options);
    },

    onAdd: function (map) {
        this._map = map;

        const container = L.DomUtil.create('div', this._options.toolbarTemplate.classes);

        for (let i = 0; i < this._groupsButton.length; i++) {
            const buttons = this._groupsButton[i];
            const groupContainer = L.DomUtil.create('div', this._options.groupTemplate.classes, container);
            for (let j = 0; j < buttons.length; j++) {
                let button = buttons[j];
                let domItem = createToolbarItem(this._options, button, groupContainer);

                domItem._groupsButtonIndex = i;
                domItem._buttonIndex = j; // todo: remove?

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
        }

        return container;
    },

    clicked: function (e) {
        var domItem = (window.event && window.event.srcElement) || e.target || e.srcElement;

        while (!('_buttonIndex' in domItem && '_groupsButtonIndex' in domItem)) {
            domItem = domItem.parentNode;
        }

        if ('_buttonIndex' in domItem) {
            var button = this._groupsButton[domItem._groupsButtonIndex][domItem._buttonIndex];
            if (button) {
                if (button.callback) {
                    button.callback.call(button.context);
                }

                this.fire('clicked', { idx: domItem._buttonIndex });
            }
        }
    }
});

L.Toolbar = function (buttons, options) {
    return new L.FunctionButtons(buttons, options);
};