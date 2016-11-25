/*
 * A leaflet button with icon or text and click listener.
 * http://mapbbcode.org/leaflet.html
 */
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

        var container = L.DomUtil.create('div', 'controls-panel-wrap');
        for (var i = 0; i < this._buttons.length; i++) {
            var button = this._buttons[i],
                domItem = createToolbarItem(this._options, button, container);

            domItem._buttonIndex = i; // todo: remove?
            domItem.href = button.href || '#';
            if (button.href) {
                domItem.target = 'funcbtn';
            }

            domItem.style.padding = '0 4px';
            domItem.style.width = 'auto';
            domItem.style.minWidth = '20px';
            if (button.bgColor) {
                domItem.style.backgroundColor = button.bgColor;
            }

            if (button.title) {
                domItem.title = button.title;
            }

            button.domItem = domItem;
            // this._updateContent(i);

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

    _updateContent: function (n) {
        if (n >= this._buttons.length)
            return;
        var button = this._buttons[n],
            domItem = button.domItem,
            content = button.content;
        if (!domItem)
            return;
        if (content === undefined || content === false || content === null || content === '')
            domItem.innerHTML = button.alt || '&nbsp;';
        else if (typeof content === 'string') {
            var ext = content.length < 4 ? '' : content.substring(content.length - 4),
                isData = content.substring(0, 11) === 'data:image/';
            if (ext === '.png' || ext === '.gif' || ext === '.jpg' || isData) {
                domItem.style.width = '' + (button.imageSize || 26) + 'px';
                domItem.style.height = '' + (button.imageSize || 26) + 'px';
                domItem.style.padding = '0';
                domItem.style.backgroundImage = 'url(' + content + ')';
                domItem.style.backgroundRepeat = 'no-repeat';
                domItem.style.backgroundPosition = button.bgPos ? (-button.bgPos[0]) + 'px ' + (-button.bgPos[1]) + 'px' : '0px 0px';
            } else
                domItem.innerHTML = content;
        } else {
            while (domItem.firstChild)
                domItem.removeChild(domItem.firstChild);
            domItem.appendChild(content);
        }
    },

    setContent: function (n, content) {
        if (content === undefined) {
            content = n;
            n = 0;
        }
        if (n < this._buttons.length) {
            this._buttons[n].content = content;
            this._updateContent(n);
        }
    },

    setTitle: function (n, title) {
        if (title === undefined) {
            title = n;
            n = 0;
        }
        if (n < this._buttons.length) {
            var button = this._buttons[n];
            button.title = title;
            if (button.domItem)
                button.domItem.title = title;
        }
    },

    setBgPos: function (n, bgPos) {
        if (bgPos === undefined) {
            bgPos = n;
            n = 0;
        }
        if (n < this._buttons.length) {
            var button = this._buttons[n];
            button.bgPos = bgPos;
            if (button.domItem)
                button.domItem.style.backgroundPosition = bgPos ? (-bgPos[0]) + 'px ' + (-bgPos[1]) + 'px' : '0px 0px';
        }
    },

    setHref: function (n, href) {
        if (href === undefined) {
            href = n;
            n = 0;
        }
        if (n < this._buttons.length) {
            var button = this._buttons[n];
            button.href = href;
            if (button.domItem)
                button.domItem.href = href;
        }
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

L.functionButtons = function (buttons, options) {
    return new L.FunctionButtons(buttons, options);
};

/*
 * Helper method from the old class. It is not recommended to use it, please use L.functionButtons().
 */
L.functionButton = function (content, button, options) {
    if (button)
        button.content = content;
    else
        button = { content: content };
    return L.functionButtons([button], options);
};