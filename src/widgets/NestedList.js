/**
 * @class Ext.NestedList
 * @extends Ext.Panel
 *
 * NestedList provides a miller column interface to navigate between nested sets
 * and provide a clean interface with limited screen real-estate.
 *
 * <pre><code>
var nestedList = Ext.NestedList({
    items: [{
        text: 'Option A',
        items: [{
            text: 'Option A.1'
        },{
            text: 'Option A.2'
        }]
    },{
        text: 'Option B',
        items: [{
            text: 'Option B.1'
        },{
            text: 'Option B.2'
        }]
    },{
        text: 'Option C',
        items: [{
            text: 'Option C.1'
        },{
            text: 'Option C.2'
        }]
    }]
});</code></pre>
 *
 * @xtype nestedlist
 */
Ext.NestedList = Ext.extend(Ext.Panel, {
    cmpCls: 'x-nested-list',
    /**
     * @cfg {String} layout
     * @hide
     */
    layout: 'card',

    /**
     * @cfg {String} animation
     * Animation to be used during transitions of cards.
     * Any valid value from Ext.anims can be used ('fade', 'slide', 'flip', 'cube', 'pop', 'wipe').
     * Defaults to 'slide'.
     */
    animation: 'slide',

    /**
     * @type Ext.Button
     */
    backButton: null,

    /**
     * @cfg {Object} toolbar
     * Configuration for the Ext.Toolbar that is created within the Ext.NestedList.
     */

    initComponent : function() {
        // Add the back button
        this.backButton = new Ext.Button({
            text: 'Back',
            ui: 'back',
            handler: this.onBackTap,
            scope: this,
            hidden: true // First stack doesn't show back
        });

        if (!this.toolbar || !this.toolbar.isComponent) {
            this.toolbar = Ext.apply({}, this.toolbar || {}, {
                dock: 'top',
                xtype: 'toolbar',
                ui: 'light',
                items: []
            });
            this.toolbar.items.unshift(this.backButton);
            this.toolbar = new Ext.Toolbar(this.toolbar);

            this.dockedItems = this.dockedItems || [];
            this.dockedItems.push(this.toolbar);
        }
        else {
            this.toolbar.insert(0, this.backButton);
        }

        var list = this.items;
        this.items = null;

        Ext.NestedList.superclass.initComponent.call(this);

        this.addEvents(
            /**
             * @event listchange
             * @param {Ext.NestedList} this
             * @param {Object} listitem
             */
            'listchange'
        );

        this.listIndex = 0;
        this.setList(list, true);

        this.on({
            beforeactivate: this.onBeforeActivate,
            beforedeactivate: this.onBeforeDeactivate,
            scope: this
        });
    },

    setList : function(list, init) {
        var items = init ? list : list.items;
        if (!list.isList) {
            list = new Ext.Container({
                isList: true,
                baseCls: 'x-list',
                cls: 'x-list-flat',
                defaults: {
                    xtype: 'button',
                    baseCls: 'x-list-item',
                    pressedCls: 'x-item-pressed',
                    ui: null,
                    pressedDelay: true
                },
                listeners: {
                    afterrender: function() {
                        this.getContentTarget().addClass('x-list-parent');
                    }
                },
                scroll: 'vertical',
                items: items,
                text: list.text
            });
        }

        this.lists = this.lists || [];
        if (!this.lists.contains(list)) {
            this.lists.push(this.add(list));
        }

        var isBack = (this.lists.indexOf(list) < this.lists.indexOf(this.activeItem));
        if (this.rendered) {
            this.setCard(list, init ? false : {
                type: this.animation,
                reverse: isBack
            });
        }
        this.activeItem = list;
    },

    afterRender : function() {
        Ext.NestedList.superclass.afterRender.call(this);

        this.mon(this.body, {
            tap: this.onTap,
            scope: this
        });
    },

    onTap : function(e, t) {
        t = e.getTarget('.x-list-item');
        if (t) {
            this.onItemTap(Ext.getCmp(t.id));
        }
    },

    onItemTap : function(item) {
        item.el.radioClass('x-item-selected');
        if (item.items) {
            this.backButton.show();
            this.setList(item);
            this.listIndex++;
        }
        this.fireEvent('listchange', this, item);
    },

    onBackTap : function() {
        this.listIndex--;

        var list = this.lists[this.listIndex];

        if (this.listIndex === 0) {
            this.backButton.hide();
        }

        this.activeItem.on('deactivate', function(item) {
            this.lists.remove(item);
            item.destroy();
        }, this, {single: true});

        this.setList(list);
        
        var me = this;
        setTimeout(function() {
            list.el.select('.x-item-selected').removeClass('x-item-selected');
        }, 500);
        
        this.fireEvent('listchange', this, list);
    },

    onBeforeDeactivate : function() {
        this.backButton.hide();
        this.toolbar.doLayout();
        this.initialActivate = true;
    },

    onBeforeActivate : function() {
        if (this.initialActivate && this.listIndex !== 0) {
            this.backButton.show();
            this.toolbar.doLayout();
        }
        var me = this;
        setTimeout(function() {
            me.activeItem.el.select('.x-item-selected').removeClass('x-item-selected');
        }, 500);
    }
});
Ext.reg('nestedlist', Ext.NestedList);