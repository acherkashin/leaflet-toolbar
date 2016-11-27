function setOrientation(domItem, orientation) {
    if (orientation === 'row') {
        domItem.style.display = 'inline-block';
    } else if (orientation === 'column') {
        domItem.style.display = 'block';
    } else {
        console.warn(`you need specify display for item element toolbar`);
    }
}

L.toolbar = L.Control.extend({
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
                this._createToolbarItem(this._options, button, groupContainer, i, j);
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
    },

    /**
     * @param  {} baseOptions - common options for all toolbar
     * @param  {} itemOptions - options for item button
     * @param  {} container - container, where will be placed toolbar item
     * @param  {Number} groupIndex - index of group 
     * @param  {Number} buttonIndex - index of index
     */
    _createToolbarItem: function (baseOptions, itemOptions, container, groupIndex, buttonIndex) {
        let domItem = this._createToolbarDOMItem(baseOptions, itemOptions, container);

        domItem._groupsButtonIndex = groupIndex;
        domItem._buttonIndex = buttonIndex;

        if (itemOptions.title) {
            domItem.title = itemOptions.title;
        }

        itemOptions.domItem = domItem;

        //Prevents the event from bubbling up the DOM tree, preventing any parent handlers from being notified of the even
        var stop = L.DomEvent.stopPropagation;
        L.DomEvent
            .on(domItem, 'mousedown', stop)
            .on(domItem, 'dblclick', stop)
            .on(domItem, 'click', stop)
            .on(domItem, 'click', L.DomEvent.preventDefault) //If this method is called, the default action of the event will not be triggered
            .on(domItem, 'click', this.clicked, this);
    },

    /**
     * @param  {} baseOptions - common options for all toolbar
     * @param  {} itemOptions - options for item button
     * @param  {} container - container, where will be placed toolbar item
     */
    _createToolbarDOMItem: function (baseOptions, itemOptions, container) {
        const classes = `${baseOptions.template.classes} ${itemOptions.classes}`;
        const item = L.DomUtil.create(baseOptions.template.tag, classes, container);
        item.title = itemOptions.title;
        item.style.margin = '0 auto';

        setOrientation(item, baseOptions.orientation);

        return item;
    }
});

L.Toolbar = function (buttons, options) {
    return new L.toolbar(buttons, options);
};