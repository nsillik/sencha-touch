/**
 * @class Ext.form.Field
 * @extends Ext.Container
 * @xtype field
 * Base class for form fields that provides default event handling, sizing, value handling and other functionality. Ext.form.Field
 * is not used directly in applications, instead the subclasses such as {@link Ext.form.TextField} should be used.
 * @constructor
 * Creates a new Field
 * @param {Object} config Configuration options
 */
Ext.form.Field = Ext.extend(Ext.Component,  {
    ui: 'text',

    /**
     * Set to true on all Ext.form.Field subclasses. This is used by {@link Ext.form.FormPanel#getValues} to determine which
     * components inside a form are fields.
     * @property isField
     * @type Boolean
     */
    isField: true,

    /**
     * <p>The label Element associated with this Field. <b>Only available after this Field has been rendered by a
     * {@link form Ext.layout.FormLayout} layout manager.</b></p>
     * @type Ext.Element
     * @property label
     */

    /**
     * @cfg {Number} tabIndex The tabIndex for this field. Note this only applies to fields that are rendered,
     * not those which are built via applyTo (defaults to undefined).
     */
    /**
     * @cfg {Mixed} value A value to initialize this field with (defaults to undefined).
     */
    /**
     * @cfg {String} name The field's HTML name attribute (defaults to '').
     * <b>Note</b>: this property must be set if this field is to be automatically included with
     * {@link Ext.form.BasicForm#submit form submit()}.
     */
    /**
     * @cfg {String} cls A custom CSS class to apply to the field's underlying element (defaults to '').
     */

    /**
     * @cfg {String} fieldClass The default CSS class for the field (defaults to 'x-form-field')
     */
    baseCls : 'x-field',

    /**
     * @cfg {String} inputCls Optional CSS class that will be added to the actual <input> element (or whichever different element is
     * defined by {@link inputAutoEl}). Defaults to undefined.
     */
    inputCls: undefined,

    /**
     * @cfg {String} focusClass The CSS class to use when the field receives focus (defaults to 'x-form-focus')
     */
    focusClass : 'x-field-focus',

    renderTpl: new Ext.XTemplate(
        '<div <tpl if="id">id="{id}" </tpl>class="{baseCls}<tpl if="required"> {required}</tpl><tpl if="cls"> {cls}</tpl><tpl if="cmpCls"> {cmpCls}</tpl><tpl if="ui"> {uiBase}-{ui}</tpl> <tpl if="label">{labelAlign}</tpl>" <tpl if="style"> style="{style}"</tpl>>',
            '<tpl if="label"><label <tpl if="fieldEl">for="{inputId}"</tpl>><span>{label}</span></label></tpl>',
            '<tpl if="fieldEl"><input id="{inputId}" type="{type}" name="{name}" class="{fieldCls}"',
                '<tpl if="tabIndex">tabIndex="{tabIndex}" </tpl>',
                '<tpl if="placeholder">placeholder="{placeholder}" </tpl>',
                '<tpl if="style">style="{style}" </tpl>',
                '<tpl if="autocomplete">autocomplete="{autocomplete}" </tpl>',
            '/></tpl>',
            '<tpl if="maskField"><div class="x-field-mask"></div></tpl>',
        '</div>',
        { compiled: true }
    ),

    /**
     * @cfg {Boolean} disabled True to disable the field (defaults to false).
     * <p>Be aware that conformant with the <a href="http://www.w3.org/TR/html401/interact/forms.html#h-17.12.1">HTML specification</a>,
     * disabled Fields will not be {@link Ext.form.BasicForm#submit submitted}.</p>
     */
    disabled : false,

    // @private
    isFormField : true,

    // @private
    hasFocus : false,

    /**
     * @cfg {Boolean} autoCreateField True to automatically create the field input element on render. This is true by default, but should
     * be set to false for any Ext.Field subclasses that don't need an HTML input (e.g. Ext.Slider and similar)
     */
    autoCreateField: true,

    /**
     * @cfg {String} inputType The type attribute for input fields -- e.g. radio, text, password, file (defaults
     * to 'text'). The types 'file' and 'password' must be used to render those field types currently -- there are
     * no separate Ext components for those. Note that if you use <tt>type:'file'</tt>, {@link #emptyText}
     * is not supported and should be avoided.
     */
    inputType: 'text',
    label: null,
    labelWidth: 100, // Currently unsupported

    /**
     * @cfg {String} labelAlign The location to render the label of the field. Acceptable values are 'top' and 'left', defaults to 'left'
     */
    labelAlign: 'left',

    /**
     * @cfg {Boolean} required True to make this field required. Note: this only causes a visual indication. Doesn't prevent user from submitting the form.
     */
    required: false,

    maskField: false,

    // @private
    initComponent : function() {
        //backwards compatibility - deprecate in next major release
        this.label = this.label || this.fieldLabel;

        Ext.form.Field.superclass.initComponent.call(this);
        this.addEvents(
            /**
             * @event focus
             * Fires when this field receives input focus.
             * @param {Ext.form.Field} this
             */
            'focus',
            /**
             * @event blur
             * Fires when this field loses input focus.
             * @param {Ext.form.Field} this
             */
            'blur',
            /**
             * @event change
             * Fires just before the field blurs if the field value has changed.
             * @param {Ext.form.Field} this
             * @param {Mixed} newValue The new value
             * @param {Mixed} oldValue The original value
             */
            'change'
        );
    },

    /**
     * Returns the {@link Ext.form.Field#name name} or {@link Ext.form.ComboBox#hiddenName hiddenName}
     * attribute of the field if available.
     * @return {String} name The field {@link Ext.form.Field#name name} or {@link Ext.form.ComboBox#hiddenName hiddenName}
     */
    getName : function() {
        return this.name || this.id || '';
    },

    // @private
    onRender : function(ct, position) {
        Ext.applyIf(this.renderData, {
            disabled: this.disabled,
            fieldCls: this.inputCls || 'x-input-' + this.inputType,
            fieldEl: !this.fieldEl && this.autoCreateField,
            inputId: Ext.id(),
            label: this.label,
            labelAlign: 'x-label-align-' + this.labelAlign,
            name: this.name || this.id,
            placeholder: this.placeholder,
            required: this.required ? 'x-field-required' : undefined,
            style: this.style,
            tabIndex: this.tabIndex,
            type: this.inputType,
            maskField: this.maskField
        });

        Ext.applyIf(this.renderSelectors, {
            labelEl: 'label',
            fieldEl: '.' + this.renderData.fieldCls,
            mask: '.x-field-mask'
        });

        Ext.form.Field.superclass.onRender.call(this, ct, position);

        if (this.fieldEl) {
            this.mon(this.fieldEl, {
                focus: this.onFocus,
                blur: this.onBlur,
                change: this.onChange,
                keyup: this.onKeyUp,
                scope: this
            });
            if (this.maskField) {
                this.mon(this.mask, {
                    tap: this.onMaskTap,
                    scope: this
                });
            }
        }
    },

    // @private
    onEnable : function() {
        this.getActionEl().removeClass(this.disabledClass);
        this.el.dom.disabled = false;
        this.fieldEl.dom.disabled = false;
    },

    // @private
    onDisable : function() {
        this.getActionEl().addClass(this.disabledClass);
        this.el.dom.disabled = true;
        this.fieldEl.dom.disabled = true;
    },

    // @private
    initValue : function(){
        if (this.value !== undefined) {
            this.setValue(this.value);
        }

        /**
         * The original value of the field as configured in the {@link #value} configuration, or
         * as loaded by the last form load operation if the form's {@link Ext.form.BasicForm#trackResetOnLoad trackResetOnLoad}
         * setting is <code>true</code>.
         * @type mixed
         * @property originalValue
         */
        this.originalValue = this.getValue();
    },

    /**
     * <p>Returns true if the value of this Field has been changed from its original value.
     * Will return false if the field is disabled or has not been rendered yet.</p>
     * <p>Note that if the owning {@link Ext.form.BasicForm form} was configured with
     * {@link Ext.form.BasicForm}.{@link Ext.form.BasicForm#trackResetOnLoad trackResetOnLoad}
     * then the <i>original value</i> is updated when the values are loaded by
     * {@link Ext.form.BasicForm}.{@link Ext.form.BasicForm#setValues setValues}.</p>
     * @return {Boolean} True if this field has been changed from its original value (and
     * is not disabled), false otherwise.
     */
    isDirty : function() {
        if (this.disabled || !this.rendered) {
            return false;
        }
        return String(this.getValue()) !== String(this.originalValue);
    },

    // @private
    afterRender : function(){
        Ext.form.Field.superclass.afterRender.call(this);
        this.initValue();
    },

    onKeyUp : function(e) {
        this.fireEvent('keyup', this, this.getValue());
    },

    onMaskTap : function(e) {
        this.mask.hide();
    },

    onChange : function(e) {
        this.fireEvent('change', this, this.getValue());
    },

    /**
     * Resets the current field value to the originally loaded value and clears any validation messages.
     * See {@link Ext.form.BasicForm}.{@link Ext.form.BasicForm#trackResetOnLoad trackResetOnLoad}
     */
    reset : function() {
        this.setValue(this.originalValue);
    },

    // @private
    beforeFocus: Ext.emptyFn,

    undoNativeScroll : function() {
        var parent = this.el.parent();
        while (parent) {
            if (parent.getStyle('overflow') == 'hidden') {
                parent.dom.scrollTop = 0;
            }
            parent = parent.parent();
        }
    },

    // @private
    onFocus : function() {
        var me = this;
        setTimeout(function() {
            me.undoNativeScroll();
        }, 0);

        this.beforeFocus();
        if (this.focusClass) {
            this.el.addClass(this.focusClass);
        }

        if (!this.hasFocus) {
            this.hasFocus = true;
            /**
             * <p>The value that the Field had at the time it was last focused. This is the value that is passed
             * to the {@link #change} event which is fired if the value has been changed when the Field is blurred.</p>
             * <p><b>This will be undefined until the Field has been visited.</b> Compare {@link #originalValue}.</p>
             * @type mixed
             * @property startValue
             */
            this.startValue = this.getValue();
            this.fireEvent('focus', this);
        }
    },

    // @private
    beforeBlur : Ext.emptyFn,

    // @private
    onBlur : function() {
        this.beforeBlur();
        if (this.focusClass) {
            this.el.removeClass(this.focusClass);
        }
        this.hasFocus = false;
        var v = this.getValue();
        if (String(v) !== String(this.startValue)){
            this.fireEvent('change', this, v, this.startValue);
        }
        this.fireEvent('blur', this);
        if (this.maskField) {
            this.mask.show();
        }
        this.postBlur();
    },

    // @private
    postBlur : Ext.emptyFn,

    /**
     * Returns the normalized data value (undefined or emptyText will be returned as '').  To return the raw value see {@link #getRawValue}.
     * @return {Mixed} value The field value
     */
    getValue : function(){
        if (!this.rendered || !this.fieldEl) {
            return this.value;
        }

        return this.fieldEl.getValue() || '';
    },

    /**
     * Sets a data value into the field and validates it.  To set the value directly without validation see {@link #setRawValue}.
     * @param {Mixed} value The value to set
     * @return {Ext.form.Field} this
     */
    setValue : function(v){
        this.value = v;
        if (this.rendered && this.fieldEl) {
            this.fieldEl.dom.value = (Ext.isEmpty(v) ? '' : v);
        }
        return this;
    }
});

Ext.reg('field', Ext.form.Field);
