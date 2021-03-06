/**
 * @class Ext.data.XmlReader
 * @extends Ext.data.Reader
 * Xml Reader
 */
Ext.data.XmlReader = Ext.extend(Ext.data.Reader, {
    /**
     * @private
     * Creates a function to return some particular key of data from a response. The totalProperty and
     * successProperty are treated as special cases for type casting, everything else is just a simple selector.
     * @param {String} key
     * @return {Function}
     */
    createAccessor: function() {
        var q = Ext.DomQuery;

        return function(key) {
            var meta = this.meta,
                fn;

            if (key == meta.totalProperty) {
                fn = function(root, def) {
                    return q.selectNumber(key, root, def);
                };
            }

            else if (key == meta.successProperty) {
                fn = function(root, def) {
                    var value = q.selectValue(key, root, true);

                    return (value !== false && value !== 'false');
                };
            }

            else {
                fn = function(root, def) {
                    return q.selectValue(key, root, def);
                };
            }

            return fn;
        };
    }(),

    /**
     * Normalizes the data object
     * @param {Object} data The raw data object
     * @return {Object} Returns the documentElement property of the data object if present, or the same object if not
     */
    getData: function(data) {
        return data.documentElement || data;
    },

    /**
     * @private
     * Given an XML object, returns the Element that represents the root as configured by the Reader's meta data
     * @param {Object} data The XML data object
     * @return {Element} The root node element
     */
    getRoot: function(data) {
        var meta = this.meta,
            el   = Ext.isEmpty(meta.record) ? meta.root : meta.record;

        return Ext.DomQuery.select(el, data);
    },


    //EVERYTHING BELOW THIS LINE WILL BE DEPRECATED IN EXT JS 5.0


    /**
     * @cfg {String} idPath DEPRECATED - this will be removed in Ext JS 5.0. Please use idProperty instead
     */

    /**
     * @cfg {String} id DEPRECATED - this will be removed in Ext JS 5.0. Please use idProperty instead
     */

    /**
     * @cfg {String} success DEPRECATED - this will be removed in Ext JS 5.0. Please use successProperty instead
     */

    /**
     * @constructor
     * @ignore
     * TODO: This can be removed in 5.0 as all it does is support some deprecated config
     */
    constructor: function(config) {
        config = config || {};

        // backwards compat, convert idPath or id / success
        // DEPRECATED - remove this in 5.0
        Ext.applyIf(config, {
            idProperty     : config.idPath || config.id,
            successProperty: config.success
        });

        Ext.data.XmlReader.superclass.constructor.call(this, config);
    },

    /**
     * Parses an XML document and returns a ResultSet containing the model instances
     * @param {Object} doc Parsed XML document
     * @return {Ext.data.ResultSet} The parsed result set
     */
    //inherit docs
    readRecords: function(doc) {
        /**
         * DEPRECATED - will be removed in Ext JS 5.0. This is just a copy of this.rawData - use that instead
         * @property xmlData
         * @type Object
         */
        this.xmlData = doc;

        return Ext.data.XmlReader.superclass.readRecords.call(this, doc);
    }
});

Ext.data.ReaderMgr.registerType('xml', Ext.data.XmlReader);