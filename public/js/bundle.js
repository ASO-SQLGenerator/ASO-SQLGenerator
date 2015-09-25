(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
Copyright (c) 2014 Ramesh Nair (hiddentao.com)

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/


(function() {
  var getValueHandler, registerValueHandler, squel, _buildSquel, _extend, _without,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _extend = function() {
    var dst, k, sources, src, v, _i, _len;
    dst = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (sources) {
      for (_i = 0, _len = sources.length; _i < _len; _i++) {
        src = sources[_i];
        if (src) {
          for (k in src) {
            if (!__hasProp.call(src, k)) continue;
            v = src[k];
            dst[k] = v;
          }
        }
      }
    }
    return dst;
  };

  _without = function() {
    var dst, obj, p, properties, _i, _len;
    obj = arguments[0], properties = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    dst = _extend({}, obj);
    for (_i = 0, _len = properties.length; _i < _len; _i++) {
      p = properties[_i];
      delete dst[p];
    }
    return dst;
  };

  registerValueHandler = function(handlers, type, handler) {
    var typeHandler, _i, _len;
    if ('function' !== typeof type && 'string' !== typeof type) {
      throw new Error("type must be a class constructor or string denoting 'typeof' result");
    }
    if ('function' !== typeof handler) {
      throw new Error("handler must be a function");
    }
    for (_i = 0, _len = handlers.length; _i < _len; _i++) {
      typeHandler = handlers[_i];
      if (typeHandler.type === type) {
        typeHandler.handler = handler;
        return;
      }
    }
    return handlers.push({
      type: type,
      handler: handler
    });
  };

  getValueHandler = function() {
    var handlerLists, handlers, typeHandler, value, _i, _j, _len, _len1;
    value = arguments[0], handlerLists = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    for (_i = 0, _len = handlerLists.length; _i < _len; _i++) {
      handlers = handlerLists[_i];
      for (_j = 0, _len1 = handlers.length; _j < _len1; _j++) {
        typeHandler = handlers[_j];
        if (typeHandler.type === typeof value || (typeof typeHandler.type !== 'string' && value instanceof typeHandler.type)) {
          return typeHandler.handler;
        }
      }
    }
    return void 0;
  };

  _buildSquel = function() {
    var cls, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _squel;
    cls = {};
    cls.DefaultQueryBuilderOptions = {
      autoQuoteTableNames: false,
      autoQuoteFieldNames: false,
      autoQuoteAliasNames: true,
      nameQuoteCharacter: '`',
      tableAliasQuoteCharacter: '`',
      fieldAliasQuoteCharacter: '"',
      valueHandlers: [],
      numberedParameters: false,
      numberedParametersStartAt: 1,
      replaceSingleQuotes: false,
      singleQuoteReplacement: '\'\'',
      separator: ' '
    };
    cls.globalValueHandlers = [];
    cls.registerValueHandler = function(type, handler) {
      return registerValueHandler(cls.globalValueHandlers, type, handler);
    };
    cls.Cloneable = (function() {
      function Cloneable() {}

      Cloneable.prototype.clone = function() {
        var newInstance;
        newInstance = new this.constructor;
        return _extend(newInstance, JSON.parse(JSON.stringify(this)));
      };

      return Cloneable;

    })();
    cls.BaseBuilder = (function(_super) {
      __extends(BaseBuilder, _super);

      function BaseBuilder(options) {
        this._sanitizeNestableQuery = __bind(this._sanitizeNestableQuery, this);
        var defaults;
        defaults = JSON.parse(JSON.stringify(cls.DefaultQueryBuilderOptions));
        this.options = _extend({}, defaults, options);
      }

      BaseBuilder.prototype.registerValueHandler = function(type, handler) {
        registerValueHandler(this.options.valueHandlers, type, handler);
        return this;
      };

      BaseBuilder.prototype._getObjectClassName = function(obj) {
        var arr;
        if (obj && obj.constructor && obj.constructor.toString) {
          arr = obj.constructor.toString().match(/function\s*(\w+)/);
          if (arr && arr.length === 2) {
            return arr[1];
          }
        }
        return void 0;
      };

      BaseBuilder.prototype._sanitizeCondition = function(condition) {
        if (!(condition instanceof cls.Expression)) {
          if ("string" !== typeof condition) {
            throw new Error("condition must be a string or Expression instance");
          }
        }
        return condition;
      };

      BaseBuilder.prototype._sanitizeName = function(value, type) {
        if ("string" !== typeof value) {
          throw new Error("" + type + " must be a string");
        }
        return value;
      };

      BaseBuilder.prototype._sanitizeField = function(item, formattingOptions) {
        var quoteChar;
        if (formattingOptions == null) {
          formattingOptions = {};
        }
        if (item instanceof cls.QueryBuilder) {
          item = "(" + item + ")";
        } else {
          item = this._sanitizeName(item, "field name");
          if (this.options.autoQuoteFieldNames) {
            quoteChar = this.options.nameQuoteCharacter;
            if (formattingOptions.ignorePeriodsForFieldNameQuotes) {
              item = "" + quoteChar + item + quoteChar;
            } else {
              item = item.split('.').map(function(v) {
                if ('*' === v) {
                  return v;
                } else {
                  return "" + quoteChar + v + quoteChar;
                }
              }).join('.');
            }
          }
        }
        return item;
      };

      BaseBuilder.prototype._sanitizeNestableQuery = function(item) {
        if (item instanceof cls.QueryBuilder && item.isNestable()) {
          return item;
        }
        throw new Error("must be a nestable query, e.g. SELECT");
      };

      BaseBuilder.prototype._sanitizeTable = function(item, allowNested) {
        var e, sanitized;
        if (allowNested == null) {
          allowNested = false;
        }
        if (allowNested) {
          if ("string" === typeof item) {
            sanitized = item;
          } else {
            try {
              sanitized = this._sanitizeNestableQuery(item);
            } catch (_error) {
              e = _error;
              throw new Error("table name must be a string or a nestable query instance");
            }
          }
        } else {
          sanitized = this._sanitizeName(item, 'table name');
        }
        if (this.options.autoQuoteTableNames) {
          return "" + this.options.nameQuoteCharacter + sanitized + this.options.nameQuoteCharacter;
        } else {
          return sanitized;
        }
      };

      BaseBuilder.prototype._sanitizeTableAlias = function(item) {
        var sanitized;
        sanitized = this._sanitizeName(item, "table alias");
        if (this.options.autoQuoteAliasNames) {
          return "" + this.options.tableAliasQuoteCharacter + sanitized + this.options.tableAliasQuoteCharacter;
        } else {
          return sanitized;
        }
      };

      BaseBuilder.prototype._sanitizeFieldAlias = function(item) {
        var sanitized;
        sanitized = this._sanitizeName(item, "field alias");
        if (this.options.autoQuoteAliasNames) {
          return "" + this.options.fieldAliasQuoteCharacter + sanitized + this.options.fieldAliasQuoteCharacter;
        } else {
          return sanitized;
        }
      };

      BaseBuilder.prototype._sanitizeLimitOffset = function(value) {
        value = parseInt(value);
        if (0 > value || isNaN(value)) {
          throw new Error("limit/offset must be >= 0");
        }
        return value;
      };

      BaseBuilder.prototype._sanitizeValue = function(item) {
        var itemType, typeIsValid;
        itemType = typeof item;
        if (null === item) {

        } else if ("string" === itemType || "number" === itemType || "boolean" === itemType) {

        } else if (item instanceof cls.QueryBuilder && item.isNestable()) {

        } else if (item instanceof cls.FunctionBlock) {

        } else {
          typeIsValid = void 0 !== getValueHandler(item, this.options.valueHandlers, cls.globalValueHandlers);
          if (!typeIsValid) {
            throw new Error("field value must be a string, number, boolean, null or one of the registered custom value types");
          }
        }
        return item;
      };

      BaseBuilder.prototype._escapeValue = function(value) {
        if (true !== this.options.replaceSingleQuotes) {
          return value;
        }
        return value.replace(/\'/g, this.options.singleQuoteReplacement);
      };

      BaseBuilder.prototype._formatCustomValue = function(value, asParam) {
        var customHandler;
        if (asParam == null) {
          asParam = false;
        }
        customHandler = getValueHandler(value, this.options.valueHandlers, cls.globalValueHandlers);
        if (customHandler) {
          value = customHandler(value, asParam);
        }
        return value;
      };

      BaseBuilder.prototype._formatValueAsParam = function(value) {
        var p,
          _this = this;
        if (Array.isArray(value)) {
          return value.map(function(v) {
            return _this._formatValueAsParam(v);
          });
        } else {
          if (value instanceof cls.QueryBuilder && value.isNestable()) {
            value.updateOptions({
              "nestedBuilder": true
            });
            return p = value.toParam();
          } else if (value instanceof cls.Expression) {
            return p = value.toParam();
          } else {
            return this._formatCustomValue(value, true);
          }
        }
      };

      BaseBuilder.prototype._formatValue = function(value, formattingOptions) {
        var customFormattedValue, escapedValue,
          _this = this;
        if (formattingOptions == null) {
          formattingOptions = {};
        }
        customFormattedValue = this._formatCustomValue(value);
        if (customFormattedValue !== value) {
          return "(" + customFormattedValue + ")";
        }
        if (Array.isArray(value)) {
          value = value.map(function(v) {
            return _this._formatValue(v);
          });
          value = "(" + (value.join(', ')) + ")";
        } else {
          if (null === value) {
            value = "NULL";
          } else if ("boolean" === typeof value) {
            value = value ? "TRUE" : "FALSE";
          } else if (value instanceof cls.QueryBuilder) {
            value = "(" + value + ")";
          } else if (value instanceof cls.Expression) {
            value = "(" + value + ")";
          } else if ("number" !== typeof value) {
            if (formattingOptions.dontQuote) {
              value = "" + value;
            } else {
              escapedValue = this._escapeValue(value);
              value = "'" + escapedValue + "'";
            }
          }
        }
        return value;
      };

      return BaseBuilder;

    })(cls.Cloneable);
    cls.Expression = (function(_super) {
      __extends(Expression, _super);

      Expression.prototype.tree = null;

      Expression.prototype.current = null;

      function Expression() {
        var _this = this;
        Expression.__super__.constructor.call(this);
        this.tree = {
          parent: null,
          nodes: []
        };
        this.current = this.tree;
        this._begin = function(op) {
          var new_tree;
          new_tree = {
            type: op,
            parent: _this.current,
            nodes: []
          };
          _this.current.nodes.push(new_tree);
          _this.current = _this.current.nodes[_this.current.nodes.length - 1];
          return _this;
        };
      }

      Expression.prototype.and_begin = function() {
        return this._begin('AND');
      };

      Expression.prototype.or_begin = function() {
        return this._begin('OR');
      };

      Expression.prototype.end = function() {
        if (!this.current.parent) {
          throw new Error("begin() needs to be called");
        }
        this.current = this.current.parent;
        return this;
      };

      Expression.prototype.and = function(expr, param) {
        if (!expr || "string" !== typeof expr) {
          throw new Error("expr must be a string");
        }
        this.current.nodes.push({
          type: 'AND',
          expr: expr,
          para: param
        });
        return this;
      };

      Expression.prototype.or = function(expr, param) {
        if (!expr || "string" !== typeof expr) {
          throw new Error("expr must be a string");
        }
        this.current.nodes.push({
          type: 'OR',
          expr: expr,
          para: param
        });
        return this;
      };

      Expression.prototype.toString = function() {
        if (null !== this.current.parent) {
          throw new Error("end() needs to be called");
        }
        return this._toString(this.tree);
      };

      Expression.prototype.toParam = function() {
        if (null !== this.current.parent) {
          throw new Error("end() needs to be called");
        }
        return this._toString(this.tree, true);
      };

      Expression.prototype._toString = function(node, paramMode) {
        var child, cv, inStr, nodeStr, params, str, _i, _len, _ref;
        if (paramMode == null) {
          paramMode = false;
        }
        str = "";
        params = [];
        _ref = node.nodes;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          if (child.expr != null) {
            nodeStr = child.expr;
            if (void 0 !== child.para) {
              if (!paramMode) {
                nodeStr = nodeStr.replace('?', this._formatValue(child.para));
              } else {
                cv = this._formatValueAsParam(child.para);
                if (((cv != null ? cv.text : void 0) != null)) {
                  params = params.concat(cv.values);
                  nodeStr = nodeStr.replace('?', "(" + cv.text + ")");
                } else {
                  params = params.concat(cv);
                }
                if (Array.isArray(child.para)) {
                  inStr = Array.apply(null, new Array(child.para.length)).map(function() {
                    return '?';
                  });
                  nodeStr = nodeStr.replace('?', "(" + (inStr.join(', ')) + ")");
                }
              }
            }
          } else {
            nodeStr = this._toString(child, paramMode);
            if (paramMode) {
              params = params.concat(nodeStr.values);
              nodeStr = nodeStr.text;
            }
            if ("" !== nodeStr) {
              nodeStr = "(" + nodeStr + ")";
            }
          }
          if ("" !== nodeStr) {
            if ("" !== str) {
              str += " " + child.type + " ";
            }
            str += nodeStr;
          }
        }
        if (paramMode) {
          return {
            text: str,
            values: params
          };
        } else {
          return str;
        }
      };

      /*
      Clone this expression.
      
      Note that the algorithm contained within this method is probably non-optimal, so please avoid cloning large
      expression trees.
      */


      Expression.prototype.clone = function() {
        var newInstance, _cloneTree;
        newInstance = new this.constructor;
        (_cloneTree = function(node) {
          var child, _i, _len, _ref, _results;
          _ref = node.nodes;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            child = _ref[_i];
            if (child.expr != null) {
              _results.push(newInstance.current.nodes.push(JSON.parse(JSON.stringify(child))));
            } else {
              newInstance._begin(child.type);
              _cloneTree(child);
              if (!this.current === child) {
                _results.push(newInstance.end());
              } else {
                _results.push(void 0);
              }
            }
          }
          return _results;
        })(this.tree);
        return newInstance;
      };

      return Expression;

    })(cls.BaseBuilder);
    cls.Block = (function(_super) {
      __extends(Block, _super);

      function Block() {
        _ref = Block.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      Block.prototype.exposedMethods = function() {
        var attr, ret, value;
        ret = {};
        for (attr in this) {
          value = this[attr];
          if (typeof value === "function" && attr.charAt(0) !== '_' && !cls.Block.prototype[attr]) {
            ret[attr] = value;
          }
        }
        return ret;
      };

      Block.prototype.buildStr = function(queryBuilder) {
        return '';
      };

      Block.prototype.buildParam = function(queryBuilder) {
        return {
          text: this.buildStr(queryBuilder),
          values: []
        };
      };

      return Block;

    })(cls.BaseBuilder);
    cls.StringBlock = (function(_super) {
      __extends(StringBlock, _super);

      function StringBlock(options, str) {
        StringBlock.__super__.constructor.call(this, options);
        this.str = str;
      }

      StringBlock.prototype.buildStr = function(queryBuilder) {
        return this.str;
      };

      return StringBlock;

    })(cls.Block);
    cls.AbstractValueBlock = (function(_super) {
      __extends(AbstractValueBlock, _super);

      function AbstractValueBlock(options) {
        AbstractValueBlock.__super__.constructor.call(this, options);
        this._str = '';
        this._values = [];
      }

      AbstractValueBlock.prototype._setValue = function() {
        var str, values;
        str = arguments[0], values = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        this._str = str;
        this._values = values;
        return this;
      };

      AbstractValueBlock.prototype.buildStr = function(queryBuilder) {
        var c, finalStr, idx, str, values, _i, _ref1;
        str = this._str;
        finalStr = '';
        values = [].concat(this._values);
        for (idx = _i = 0, _ref1 = str.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; idx = 0 <= _ref1 ? ++_i : --_i) {
          c = str.charAt(idx);
          if ('?' === c && 0 < values.length) {
            c = values.shift();
          }
          finalStr += c;
        }
        return finalStr;
      };

      AbstractValueBlock.prototype.buildParam = function(queryBuilder) {
        return {
          text: this._str,
          values: this._values
        };
      };

      return AbstractValueBlock;

    })(cls.Block);
    cls.FunctionBlock = (function(_super) {
      __extends(FunctionBlock, _super);

      function FunctionBlock() {
        _ref1 = FunctionBlock.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      FunctionBlock.prototype["function"] = function() {
        var str, values;
        str = arguments[0], values = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        return this._setValue.apply(this, [str].concat(values));
      };

      return FunctionBlock;

    })(cls.AbstractValueBlock);
    cls.fval = function() {
      var inst, str, values;
      str = arguments[0], values = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      inst = new cls.FunctionBlock();
      return inst["function"].apply(inst, [str].concat(values));
    };
    cls.registerValueHandler(cls.FunctionBlock, function(value, asParam) {
      if (asParam == null) {
        asParam = false;
      }
      if (asParam) {
        return value.buildParam();
      } else {
        return value.buildStr();
      }
    });
    cls.AbstractTableBlock = (function(_super) {
      __extends(AbstractTableBlock, _super);

      function AbstractTableBlock(options) {
        AbstractTableBlock.__super__.constructor.call(this, options);
        this.tables = [];
      }

      AbstractTableBlock.prototype._table = function(table, alias) {
        if (alias == null) {
          alias = null;
        }
        if (alias) {
          alias = this._sanitizeTableAlias(alias);
        }
        table = this._sanitizeTable(table, this.options.allowNested || false);
        if (this.options.singleTable) {
          this.tables = [];
        }
        return this.tables.push({
          table: table,
          alias: alias
        });
      };

      AbstractTableBlock.prototype._hasTable = function() {
        return 0 < this.tables.length;
      };

      AbstractTableBlock.prototype.buildStr = function(queryBuilder) {
        var table, tables, _i, _len, _ref2;
        if (!this._hasTable()) {
          return "";
        }
        tables = "";
        _ref2 = this.tables;
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          table = _ref2[_i];
          if ("" !== tables) {
            tables += ", ";
          }
          if ("string" === typeof table.table) {
            tables += table.table;
          } else {
            tables += "(" + table.table + ")";
          }
          if (table.alias) {
            tables += " " + table.alias;
          }
        }
        return tables;
      };

      AbstractTableBlock.prototype._buildParam = function(queryBuilder, prefix) {
        var blk, p, paramStr, params, ret, v, _i, _j, _k, _len, _len1, _len2, _ref2, _ref3;
        if (prefix == null) {
          prefix = null;
        }
        ret = {
          text: "",
          values: []
        };
        params = [];
        paramStr = "";
        if (!this._hasTable()) {
          return ret;
        }
        _ref2 = this.tables;
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          blk = _ref2[_i];
          if ("string" === typeof blk.table) {
            p = {
              "text": "" + blk.table,
              "values": []
            };
          } else if (blk.table instanceof cls.QueryBuilder) {
            blk.table.updateOptions({
              "nestedBuilder": true
            });
            p = blk.table.toParam();
          } else {
            blk.updateOptions({
              "nestedBuilder": true
            });
            p = blk.buildParam(queryBuilder);
          }
          p.table = blk;
          params.push(p);
        }
        for (_j = 0, _len1 = params.length; _j < _len1; _j++) {
          p = params[_j];
          if (paramStr !== "") {
            paramStr += ", ";
          } else {
            if ((prefix != null) && prefix !== "") {
              paramStr += "" + prefix + " " + paramStr;
            }
            paramStr;
          }
          if ("string" === typeof p.table.table) {
            paramStr += "" + p.text;
          } else {
            paramStr += "(" + p.text + ")";
          }
          if (p.table.alias != null) {
            paramStr += " " + p.table.alias;
          }
          _ref3 = p.values;
          for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
            v = _ref3[_k];
            ret.values.push(this._formatCustomValue(v));
          }
        }
        ret.text += paramStr;
        return ret;
      };

      AbstractTableBlock.prototype.buildParam = function(queryBuilder) {
        return this._buildParam(queryBuilder);
      };

      return AbstractTableBlock;

    })(cls.Block);
    cls.UpdateTableBlock = (function(_super) {
      __extends(UpdateTableBlock, _super);

      function UpdateTableBlock() {
        _ref2 = UpdateTableBlock.__super__.constructor.apply(this, arguments);
        return _ref2;
      }

      UpdateTableBlock.prototype.table = function(table, alias) {
        if (alias == null) {
          alias = null;
        }
        return this._table(table, alias);
      };

      return UpdateTableBlock;

    })(cls.AbstractTableBlock);
    cls.FromTableBlock = (function(_super) {
      __extends(FromTableBlock, _super);

      function FromTableBlock() {
        _ref3 = FromTableBlock.__super__.constructor.apply(this, arguments);
        return _ref3;
      }

      FromTableBlock.prototype.from = function(table, alias) {
        if (alias == null) {
          alias = null;
        }
        return this._table(table, alias);
      };

      FromTableBlock.prototype.buildStr = function(queryBuilder) {
        var tables;
        tables = FromTableBlock.__super__.buildStr.call(this, queryBuilder);
        if (tables.length) {
          return "FROM " + tables;
        } else {
          return "";
        }
      };

      FromTableBlock.prototype.buildParam = function(queryBuilder) {
        return this._buildParam(queryBuilder, "FROM");
      };

      return FromTableBlock;

    })(cls.AbstractTableBlock);
    cls.IntoTableBlock = (function(_super) {
      __extends(IntoTableBlock, _super);

      function IntoTableBlock(options) {
        IntoTableBlock.__super__.constructor.call(this, options);
        this.table = null;
      }

      IntoTableBlock.prototype.into = function(table) {
        return this.table = this._sanitizeTable(table, false);
      };

      IntoTableBlock.prototype.buildStr = function(queryBuilder) {
        if (!this.table) {
          throw new Error("into() needs to be called");
        }
        return "INTO " + this.table;
      };

      return IntoTableBlock;

    })(cls.Block);
    cls.GetFieldBlock = (function(_super) {
      __extends(GetFieldBlock, _super);

      function GetFieldBlock(options) {
        GetFieldBlock.__super__.constructor.call(this, options);
        this._fieldAliases = {};
        this._fields = [];
      }

      GetFieldBlock.prototype.fields = function(_fields, options) {
        var alias, field, _i, _len, _results, _results1;
        if (options == null) {
          options = {};
        }
        if (Array.isArray(_fields)) {
          _results = [];
          for (_i = 0, _len = _fields.length; _i < _len; _i++) {
            field = _fields[_i];
            _results.push(this.field(field, null, options));
          }
          return _results;
        } else {
          _results1 = [];
          for (field in _fields) {
            alias = _fields[field];
            _results1.push(this.field(field, alias, options));
          }
          return _results1;
        }
      };

      GetFieldBlock.prototype.field = function(field, alias, options) {
        if (alias == null) {
          alias = null;
        }
        if (options == null) {
          options = {};
        }
        field = this._sanitizeField(field, options);
        if (alias) {
          alias = this._sanitizeFieldAlias(alias);
        }
        if (this._fieldAliases[field] === alias) {
          return;
        }
        this._fieldAliases[field] = alias;
        return this._fields.push({
          name: field,
          alias: alias
        });
      };

      GetFieldBlock.prototype.buildStr = function(queryBuilder) {
        var field, fields, _i, _len, _ref4;
        if (!queryBuilder.getBlock(cls.FromTableBlock)._hasTable()) {
          return "";
        }
        fields = "";
        _ref4 = this._fields;
        for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
          field = _ref4[_i];
          if ("" !== fields) {
            fields += ", ";
          }
          fields += field.name;
          if (field.alias) {
            fields += " AS " + field.alias;
          }
        }
        if ("" === fields) {
          return "*";
        } else {
          return fields;
        }
      };

      return GetFieldBlock;

    })(cls.Block);
    cls.AbstractSetFieldBlock = (function(_super) {
      __extends(AbstractSetFieldBlock, _super);

      function AbstractSetFieldBlock(options) {
        AbstractSetFieldBlock.__super__.constructor.call(this, options);
        this.fieldOptions = [];
        this.fields = [];
        this.values = [];
      }

      AbstractSetFieldBlock.prototype._set = function(field, value, options) {
        var index;
        if (options == null) {
          options = {};
        }
        if (this.values.length > 1) {
          throw new Error("Cannot call set or setFields on multiple rows of fields.");
        }
        if (void 0 !== value) {
          value = this._sanitizeValue(value);
        }
        index = this.fields.indexOf(this._sanitizeField(field, options));
        if (index !== -1) {
          this.values[0][index] = value;
          this.fieldOptions[0][index] = options;
        } else {
          this.fields.push(this._sanitizeField(field, options));
          index = this.fields.length - 1;
          if (Array.isArray(this.values[0])) {
            this.values[0][index] = value;
            this.fieldOptions[0][index] = options;
          } else {
            this.values.push([value]);
            this.fieldOptions.push([options]);
          }
        }
        return this;
      };

      AbstractSetFieldBlock.prototype._setFields = function(fields, options) {
        var field;
        if (options == null) {
          options = {};
        }
        if (typeof fields !== 'object') {
          throw new Error("Expected an object but got " + typeof fields);
        }
        for (field in fields) {
          if (!__hasProp.call(fields, field)) continue;
          this._set(field, fields[field], options);
        }
        return this;
      };

      AbstractSetFieldBlock.prototype._setFieldsRows = function(fieldsRows, options) {
        var field, i, index, value, _i, _ref4, _ref5;
        if (options == null) {
          options = {};
        }
        if (!Array.isArray(fieldsRows)) {
          throw new Error("Expected an array of objects but got " + typeof fieldsRows);
        }
        this.fields = [];
        this.values = [];
        for (i = _i = 0, _ref4 = fieldsRows.length; 0 <= _ref4 ? _i < _ref4 : _i > _ref4; i = 0 <= _ref4 ? ++_i : --_i) {
          _ref5 = fieldsRows[i];
          for (field in _ref5) {
            if (!__hasProp.call(_ref5, field)) continue;
            index = this.fields.indexOf(this._sanitizeField(field, options));
            if (0 < i && -1 === index) {
              throw new Error('All fields in subsequent rows must match the fields in the first row');
            }
            if (-1 === index) {
              this.fields.push(this._sanitizeField(field, options));
              index = this.fields.length - 1;
            }
            value = this._sanitizeValue(fieldsRows[i][field]);
            if (Array.isArray(this.values[i])) {
              this.values[i][index] = value;
              this.fieldOptions[i][index] = options;
            } else {
              this.values[i] = [value];
              this.fieldOptions[i] = [options];
            }
          }
        }
        return this;
      };

      AbstractSetFieldBlock.prototype.buildStr = function() {
        throw new Error('Not yet implemented');
      };

      AbstractSetFieldBlock.prototype.buildParam = function() {
        throw new Error('Not yet implemented');
      };

      return AbstractSetFieldBlock;

    })(cls.Block);
    cls.SetFieldBlock = (function(_super) {
      __extends(SetFieldBlock, _super);

      function SetFieldBlock() {
        _ref4 = SetFieldBlock.__super__.constructor.apply(this, arguments);
        return _ref4;
      }

      SetFieldBlock.prototype.set = function(field, value, options) {
        return this._set(field, value, options);
      };

      SetFieldBlock.prototype.setFields = function(fields, options) {
        return this._setFields(fields, options);
      };

      SetFieldBlock.prototype.buildStr = function(queryBuilder) {
        var field, fieldOptions, i, str, value, _i, _ref5;
        if (0 >= this.fields.length) {
          throw new Error("set() needs to be called");
        }
        str = "";
        for (i = _i = 0, _ref5 = this.fields.length; 0 <= _ref5 ? _i < _ref5 : _i > _ref5; i = 0 <= _ref5 ? ++_i : --_i) {
          field = this.fields[i];
          if ("" !== str) {
            str += ", ";
          }
          value = this.values[0][i];
          fieldOptions = this.fieldOptions[0][i];
          if (typeof value === 'undefined') {
            str += field;
          } else {
            str += "" + field + " = " + (this._formatValue(value, fieldOptions));
          }
        }
        return "SET " + str;
      };

      SetFieldBlock.prototype.buildParam = function(queryBuilder) {
        var field, i, p, str, v, vals, value, _i, _j, _len, _ref5, _ref6;
        if (0 >= this.fields.length) {
          throw new Error("set() needs to be called");
        }
        str = "";
        vals = [];
        for (i = _i = 0, _ref5 = this.fields.length; 0 <= _ref5 ? _i < _ref5 : _i > _ref5; i = 0 <= _ref5 ? ++_i : --_i) {
          field = this.fields[i];
          if ("" !== str) {
            str += ", ";
          }
          value = this.values[0][i];
          if (typeof value === 'undefined') {
            str += field;
          } else {
            p = this._formatValueAsParam(value);
            if ((p != null ? p.text : void 0) != null) {
              str += "" + field + " = (" + p.text + ")";
              _ref6 = p.values;
              for (_j = 0, _len = _ref6.length; _j < _len; _j++) {
                v = _ref6[_j];
                vals.push(v);
              }
            } else {
              str += "" + field + " = ?";
              vals.push(p);
            }
          }
        }
        return {
          text: "SET " + str,
          values: vals
        };
      };

      return SetFieldBlock;

    })(cls.AbstractSetFieldBlock);
    cls.InsertFieldValueBlock = (function(_super) {
      __extends(InsertFieldValueBlock, _super);

      function InsertFieldValueBlock() {
        _ref5 = InsertFieldValueBlock.__super__.constructor.apply(this, arguments);
        return _ref5;
      }

      InsertFieldValueBlock.prototype.set = function(field, value, options) {
        if (options == null) {
          options = {};
        }
        return this._set(field, value, options);
      };

      InsertFieldValueBlock.prototype.setFields = function(fields, options) {
        return this._setFields(fields, options);
      };

      InsertFieldValueBlock.prototype.setFieldsRows = function(fieldsRows, options) {
        return this._setFieldsRows(fieldsRows, options);
      };

      InsertFieldValueBlock.prototype._buildVals = function() {
        var formattedValue, i, j, vals, _i, _j, _ref6, _ref7;
        vals = [];
        for (i = _i = 0, _ref6 = this.values.length; 0 <= _ref6 ? _i < _ref6 : _i > _ref6; i = 0 <= _ref6 ? ++_i : --_i) {
          for (j = _j = 0, _ref7 = this.values[i].length; 0 <= _ref7 ? _j < _ref7 : _j > _ref7; j = 0 <= _ref7 ? ++_j : --_j) {
            formattedValue = this._formatValue(this.values[i][j], this.fieldOptions[i][j]);
            if ('string' === typeof vals[i]) {
              vals[i] += ', ' + formattedValue;
            } else {
              vals[i] = '' + formattedValue;
            }
          }
        }
        return vals;
      };

      InsertFieldValueBlock.prototype._buildValParams = function() {
        var i, j, p, params, str, v, vals, _i, _j, _k, _len, _ref6, _ref7, _ref8;
        vals = [];
        params = [];
        for (i = _i = 0, _ref6 = this.values.length; 0 <= _ref6 ? _i < _ref6 : _i > _ref6; i = 0 <= _ref6 ? ++_i : --_i) {
          for (j = _j = 0, _ref7 = this.values[i].length; 0 <= _ref7 ? _j < _ref7 : _j > _ref7; j = 0 <= _ref7 ? ++_j : --_j) {
            p = this._formatValueAsParam(this.values[i][j]);
            if ((p != null ? p.text : void 0) != null) {
              str = p.text;
              _ref8 = p.values;
              for (_k = 0, _len = _ref8.length; _k < _len; _k++) {
                v = _ref8[_k];
                params.push(v);
              }
            } else {
              str = '?';
              params.push(p);
            }
            if ('string' === typeof vals[i]) {
              vals[i] += ", " + str;
            } else {
              vals[i] = "" + str;
            }
          }
        }
        return {
          vals: vals,
          params: params
        };
      };

      InsertFieldValueBlock.prototype.buildStr = function(queryBuilder) {
        if (0 >= this.fields.length) {
          return '';
        }
        return "(" + (this.fields.join(', ')) + ") VALUES (" + (this._buildVals().join('), (')) + ")";
      };

      InsertFieldValueBlock.prototype.buildParam = function(queryBuilder) {
        var i, params, str, vals, _i, _ref6, _ref7;
        if (0 >= this.fields.length) {
          return {
            text: '',
            values: []
          };
        }
        str = "";
        _ref6 = this._buildValParams(), vals = _ref6.vals, params = _ref6.params;
        for (i = _i = 0, _ref7 = this.fields.length; 0 <= _ref7 ? _i < _ref7 : _i > _ref7; i = 0 <= _ref7 ? ++_i : --_i) {
          if ("" !== str) {
            str += ", ";
          }
          str += this.fields[i];
        }
        return {
          text: "(" + str + ") VALUES (" + (vals.join('), (')) + ")",
          values: params
        };
      };

      return InsertFieldValueBlock;

    })(cls.AbstractSetFieldBlock);
    cls.InsertFieldsFromQueryBlock = (function(_super) {
      __extends(InsertFieldsFromQueryBlock, _super);

      function InsertFieldsFromQueryBlock(options) {
        InsertFieldsFromQueryBlock.__super__.constructor.call(this, options);
        this._fields = [];
        this._query = null;
      }

      InsertFieldsFromQueryBlock.prototype.fromQuery = function(fields, selectQuery) {
        var _this = this;
        this._fields = fields.map((function(v) {
          return _this._sanitizeField(v);
        }));
        return this._query = this._sanitizeNestableQuery(selectQuery);
      };

      InsertFieldsFromQueryBlock.prototype.buildStr = function(queryBuilder) {
        if (0 >= this._fields.length) {
          return '';
        }
        return "(" + (this._fields.join(', ')) + ") (" + (this._query.toString()) + ")";
      };

      InsertFieldsFromQueryBlock.prototype.buildParam = function(queryBuilder) {
        var qryParam;
        if (0 >= this._fields.length) {
          return {
            text: '',
            values: []
          };
        }
        qryParam = this._query.toParam();
        return {
          text: "(" + (this._fields.join(', ')) + ") (" + qryParam.text + ")",
          values: qryParam.values
        };
      };

      return InsertFieldsFromQueryBlock;

    })(cls.Block);
    cls.DistinctBlock = (function(_super) {
      __extends(DistinctBlock, _super);

      function DistinctBlock(options) {
        DistinctBlock.__super__.constructor.call(this, options);
        this.useDistinct = false;
      }

      DistinctBlock.prototype.distinct = function() {
        return this.useDistinct = true;
      };

      DistinctBlock.prototype.buildStr = function(queryBuilder) {
        if (this.useDistinct) {
          return "DISTINCT";
        } else {
          return "";
        }
      };

      return DistinctBlock;

    })(cls.Block);
    cls.GroupByBlock = (function(_super) {
      __extends(GroupByBlock, _super);

      function GroupByBlock(options) {
        GroupByBlock.__super__.constructor.call(this, options);
        this.groups = [];
      }

      GroupByBlock.prototype.group = function(field) {
        field = this._sanitizeField(field);
        return this.groups.push(field);
      };

      GroupByBlock.prototype.buildStr = function(queryBuilder) {
        var f, groups, _i, _len, _ref6;
        groups = "";
        if (0 < this.groups.length) {
          _ref6 = this.groups;
          for (_i = 0, _len = _ref6.length; _i < _len; _i++) {
            f = _ref6[_i];
            if ("" !== groups) {
              groups += ", ";
            }
            groups += f;
          }
          groups = "GROUP BY " + groups;
        }
        return groups;
      };

      return GroupByBlock;

    })(cls.Block);
    cls.OffsetBlock = (function(_super) {
      __extends(OffsetBlock, _super);

      function OffsetBlock(options) {
        OffsetBlock.__super__.constructor.call(this, options);
        this.offsets = null;
      }

      OffsetBlock.prototype.offset = function(start) {
        start = this._sanitizeLimitOffset(start);
        return this.offsets = start;
      };

      OffsetBlock.prototype.buildStr = function(queryBuilder) {
        if (this.offsets) {
          return "OFFSET " + this.offsets;
        } else {
          return "";
        }
      };

      return OffsetBlock;

    })(cls.Block);
    cls.AbstractConditionBlock = (function(_super) {
      __extends(AbstractConditionBlock, _super);

      function AbstractConditionBlock(conditionVerb, options) {
        this.conditionVerb = conditionVerb;
        AbstractConditionBlock.__super__.constructor.call(this, options);
        this.conditions = [];
      }

      AbstractConditionBlock.prototype._condition = function() {
        var c, condition, finalCondition, finalValues, idx, inValues, item, nextValue, t, values, _i, _j, _len, _ref6;
        condition = arguments[0], values = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        condition = this._sanitizeCondition(condition);
        finalCondition = "";
        finalValues = [];
        if (condition instanceof cls.Expression) {
          t = condition.toParam();
          finalCondition = t.text;
          finalValues = t.values;
        } else {
          for (idx = _i = 0, _ref6 = condition.length; 0 <= _ref6 ? _i < _ref6 : _i > _ref6; idx = 0 <= _ref6 ? ++_i : --_i) {
            c = condition.charAt(idx);
            if ('?' === c && 0 < values.length) {
              nextValue = values.shift();
              if (Array.isArray(nextValue)) {
                inValues = [];
                for (_j = 0, _len = nextValue.length; _j < _len; _j++) {
                  item = nextValue[_j];
                  inValues.push(this._sanitizeValue(item));
                }
                finalValues = finalValues.concat(inValues);
                finalCondition += "(" + (((function() {
                  var _k, _len1, _results;
                  _results = [];
                  for (_k = 0, _len1 = inValues.length; _k < _len1; _k++) {
                    item = inValues[_k];
                    _results.push('?');
                  }
                  return _results;
                })()).join(', ')) + ")";
              } else {
                finalCondition += '?';
                finalValues.push(this._sanitizeValue(nextValue));
              }
            } else {
              finalCondition += c;
            }
          }
        }
        if ("" !== finalCondition) {
          return this.conditions.push({
            text: finalCondition,
            values: finalValues
          });
        }
      };

      AbstractConditionBlock.prototype.buildStr = function(queryBuilder) {
        var c, cond, condStr, idx, pIndex, _i, _j, _len, _ref6, _ref7;
        if (0 >= this.conditions.length) {
          return "";
        }
        condStr = "";
        _ref6 = this.conditions;
        for (_i = 0, _len = _ref6.length; _i < _len; _i++) {
          cond = _ref6[_i];
          if ("" !== condStr) {
            condStr += ") AND (";
          }
          if (0 < cond.values.length) {
            pIndex = 0;
            for (idx = _j = 0, _ref7 = cond.text.length; 0 <= _ref7 ? _j < _ref7 : _j > _ref7; idx = 0 <= _ref7 ? ++_j : --_j) {
              c = cond.text.charAt(idx);
              if ('?' === c) {
                condStr += this._formatValue(cond.values[pIndex++]);
              } else {
                condStr += c;
              }
            }
          } else {
            condStr += cond.text;
          }
        }
        return "" + this.conditionVerb + " (" + condStr + ")";
      };

      AbstractConditionBlock.prototype.buildParam = function(queryBuilder) {
        var cond, condStr, i, p, qv, ret, str, v, _i, _j, _k, _len, _len1, _len2, _ref6, _ref7, _ref8;
        ret = {
          text: "",
          values: []
        };
        if (0 >= this.conditions.length) {
          return ret;
        }
        condStr = "";
        _ref6 = this.conditions;
        for (_i = 0, _len = _ref6.length; _i < _len; _i++) {
          cond = _ref6[_i];
          if ("" !== condStr) {
            condStr += ") AND (";
          }
          str = cond.text.split('?');
          i = 0;
          _ref7 = cond.values;
          for (_j = 0, _len1 = _ref7.length; _j < _len1; _j++) {
            v = _ref7[_j];
            if (str[i] != null) {
              condStr += "" + str[i];
            }
            p = this._formatValueAsParam(v);
            if (((p != null ? p.text : void 0) != null)) {
              condStr += "(" + p.text + ")";
              _ref8 = p.values;
              for (_k = 0, _len2 = _ref8.length; _k < _len2; _k++) {
                qv = _ref8[_k];
                ret.values.push(qv);
              }
            } else {
              condStr += "?";
              ret.values.push(p);
            }
            i = i + 1;
          }
          if (str[i] != null) {
            condStr += "" + str[i];
          }
        }
        ret.text = "" + this.conditionVerb + " (" + condStr + ")";
        return ret;
      };

      return AbstractConditionBlock;

    })(cls.Block);
    cls.WhereBlock = (function(_super) {
      __extends(WhereBlock, _super);

      function WhereBlock(options) {
        WhereBlock.__super__.constructor.call(this, 'WHERE', options);
      }

      WhereBlock.prototype.where = function() {
        var condition, values;
        condition = arguments[0], values = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        return this._condition.apply(this, [condition].concat(__slice.call(values)));
      };

      return WhereBlock;

    })(cls.AbstractConditionBlock);
    cls.HavingBlock = (function(_super) {
      __extends(HavingBlock, _super);

      function HavingBlock(options) {
        HavingBlock.__super__.constructor.call(this, 'HAVING', options);
      }

      HavingBlock.prototype.having = function() {
        var condition, values;
        condition = arguments[0], values = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        return this._condition.apply(this, [condition].concat(__slice.call(values)));
      };

      return HavingBlock;

    })(cls.AbstractConditionBlock);
    cls.OrderByBlock = (function(_super) {
      __extends(OrderByBlock, _super);

      function OrderByBlock(options) {
        OrderByBlock.__super__.constructor.call(this, options);
        this.orders = [];
        this._values = [];
      }

      OrderByBlock.prototype.order = function() {
        var asc, field, values;
        field = arguments[0], asc = arguments[1], values = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
        field = this._sanitizeField(field);
        if (asc === void 0) {
          asc = true;
        }
        if (asc !== null) {
          asc = !!asc;
        }
        this._values = values;
        return this.orders.push({
          field: field,
          dir: asc
        });
      };

      OrderByBlock.prototype._buildStr = function(toParam) {
        var c, fstr, idx, o, orders, pIndex, _i, _j, _len, _ref6, _ref7;
        if (toParam == null) {
          toParam = false;
        }
        if (0 < this.orders.length) {
          pIndex = 0;
          orders = "";
          _ref6 = this.orders;
          for (_i = 0, _len = _ref6.length; _i < _len; _i++) {
            o = _ref6[_i];
            if ("" !== orders) {
              orders += ", ";
            }
            fstr = "";
            if (!toParam) {
              for (idx = _j = 0, _ref7 = o.field.length; 0 <= _ref7 ? _j < _ref7 : _j > _ref7; idx = 0 <= _ref7 ? ++_j : --_j) {
                c = o.field.charAt(idx);
                if ('?' === c) {
                  fstr += this._formatValue(this._values[pIndex++]);
                } else {
                  fstr += c;
                }
              }
            } else {
              fstr = o.field;
            }
            orders += "" + fstr;
            if (o.dir !== null) {
              orders += " " + (o.dir ? 'ASC' : 'DESC');
            }
          }
          return "ORDER BY " + orders;
        } else {
          return "";
        }
      };

      OrderByBlock.prototype.buildStr = function(queryBuilder) {
        return this._buildStr();
      };

      OrderByBlock.prototype.buildParam = function(queryBuilder) {
        var _this = this;
        return {
          text: this._buildStr(true),
          values: this._values.map(function(v) {
            return _this._formatValueAsParam(v);
          })
        };
      };

      return OrderByBlock;

    })(cls.Block);
    cls.LimitBlock = (function(_super) {
      __extends(LimitBlock, _super);

      function LimitBlock(options) {
        LimitBlock.__super__.constructor.call(this, options);
        this.limits = null;
      }

      LimitBlock.prototype.limit = function(max) {
        max = this._sanitizeLimitOffset(max);
        return this.limits = max;
      };

      LimitBlock.prototype.buildStr = function(queryBuilder) {
        if (this.limits) {
          return "LIMIT " + this.limits;
        } else {
          return "";
        }
      };

      return LimitBlock;

    })(cls.Block);
    cls.JoinBlock = (function(_super) {
      __extends(JoinBlock, _super);

      function JoinBlock(options) {
        JoinBlock.__super__.constructor.call(this, options);
        this.joins = [];
      }

      JoinBlock.prototype.join = function(table, alias, condition, type) {
        if (alias == null) {
          alias = null;
        }
        if (condition == null) {
          condition = null;
        }
        if (type == null) {
          type = 'INNER';
        }
        table = this._sanitizeTable(table, true);
        if (alias) {
          alias = this._sanitizeTableAlias(alias);
        }
        if (condition) {
          condition = this._sanitizeCondition(condition);
        }
        this.joins.push({
          type: type,
          table: table,
          alias: alias,
          condition: condition
        });
        return this;
      };

      JoinBlock.prototype.left_join = function(table, alias, condition) {
        if (alias == null) {
          alias = null;
        }
        if (condition == null) {
          condition = null;
        }
        return this.join(table, alias, condition, 'LEFT');
      };

      JoinBlock.prototype.right_join = function(table, alias, condition) {
        if (alias == null) {
          alias = null;
        }
        if (condition == null) {
          condition = null;
        }
        return this.join(table, alias, condition, 'RIGHT');
      };

      JoinBlock.prototype.outer_join = function(table, alias, condition) {
        if (alias == null) {
          alias = null;
        }
        if (condition == null) {
          condition = null;
        }
        return this.join(table, alias, condition, 'OUTER');
      };

      JoinBlock.prototype.left_outer_join = function(table, alias, condition) {
        if (alias == null) {
          alias = null;
        }
        if (condition == null) {
          condition = null;
        }
        return this.join(table, alias, condition, 'LEFT OUTER');
      };

      JoinBlock.prototype.full_join = function(table, alias, condition) {
        if (alias == null) {
          alias = null;
        }
        if (condition == null) {
          condition = null;
        }
        return this.join(table, alias, condition, 'FULL');
      };

      JoinBlock.prototype.cross_join = function(table, alias, condition) {
        if (alias == null) {
          alias = null;
        }
        if (condition == null) {
          condition = null;
        }
        return this.join(table, alias, condition, 'CROSS');
      };

      JoinBlock.prototype.buildStr = function(queryBuilder) {
        var j, joins, _i, _len, _ref6;
        joins = "";
        _ref6 = this.joins || [];
        for (_i = 0, _len = _ref6.length; _i < _len; _i++) {
          j = _ref6[_i];
          if (joins !== "") {
            joins += " ";
          }
          joins += "" + j.type + " JOIN ";
          if ("string" === typeof j.table) {
            joins += j.table;
          } else {
            joins += "(" + j.table + ")";
          }
          if (j.alias) {
            joins += " " + j.alias;
          }
          if (j.condition) {
            joins += " ON (" + j.condition + ")";
          }
        }
        return joins;
      };

      JoinBlock.prototype.buildParam = function(queryBuilder) {
        var blk, cp, joinStr, p, params, ret, v, _i, _j, _k, _len, _len1, _len2, _ref6, _ref7;
        ret = {
          text: "",
          values: []
        };
        params = [];
        joinStr = "";
        if (0 >= this.joins.length) {
          return ret;
        }
        _ref6 = this.joins;
        for (_i = 0, _len = _ref6.length; _i < _len; _i++) {
          blk = _ref6[_i];
          if ("string" === typeof blk.table) {
            p = {
              "text": "" + blk.table,
              "values": []
            };
          } else if (blk.table instanceof cls.QueryBuilder) {
            blk.table.updateOptions({
              "nestedBuilder": true
            });
            p = blk.table.toParam();
          } else {
            blk.updateOptions({
              "nestedBuilder": true
            });
            p = blk.buildParam(queryBuilder);
          }
          if (blk.condition instanceof cls.Expression) {
            cp = blk.condition.toParam();
            p.condition = cp.text;
            p.values = p.values.concat(cp.values);
          } else {
            p.condition = blk.condition;
          }
          p.join = blk;
          params.push(p);
        }
        for (_j = 0, _len1 = params.length; _j < _len1; _j++) {
          p = params[_j];
          if (joinStr !== "") {
            joinStr += " ";
          }
          joinStr += "" + p.join.type + " JOIN ";
          if ("string" === typeof p.join.table) {
            joinStr += p.text;
          } else {
            joinStr += "(" + p.text + ")";
          }
          if (p.join.alias) {
            joinStr += " " + p.join.alias;
          }
          if (p.condition) {
            joinStr += " ON (" + p.condition + ")";
          }
          _ref7 = p.values;
          for (_k = 0, _len2 = _ref7.length; _k < _len2; _k++) {
            v = _ref7[_k];
            ret.values.push(this._formatCustomValue(v));
          }
        }
        ret.text += joinStr;
        return ret;
      };

      return JoinBlock;

    })(cls.Block);
    cls.UnionBlock = (function(_super) {
      __extends(UnionBlock, _super);

      function UnionBlock(options) {
        UnionBlock.__super__.constructor.call(this, options);
        this.unions = [];
      }

      UnionBlock.prototype.union = function(table, type) {
        if (type == null) {
          type = 'UNION';
        }
        table = this._sanitizeTable(table, true);
        this.unions.push({
          type: type,
          table: table
        });
        return this;
      };

      UnionBlock.prototype.union_all = function(table) {
        return this.union(table, 'UNION ALL');
      };

      UnionBlock.prototype.buildStr = function(queryBuilder) {
        var j, unionStr, _i, _len, _ref6;
        unionStr = "";
        _ref6 = this.unions || [];
        for (_i = 0, _len = _ref6.length; _i < _len; _i++) {
          j = _ref6[_i];
          if (unionStr !== "") {
            unionStr += " ";
          }
          unionStr += "" + j.type + " ";
          if ("string" === typeof j.table) {
            unionStr += j.table;
          } else {
            unionStr += "(" + j.table + ")";
          }
        }
        return unionStr;
      };

      UnionBlock.prototype.buildParam = function(queryBuilder) {
        var blk, p, params, ret, unionStr, v, _i, _j, _k, _len, _len1, _len2, _ref6, _ref7;
        ret = {
          text: "",
          values: []
        };
        params = [];
        unionStr = "";
        if (0 >= this.unions.length) {
          return ret;
        }
        _ref6 = this.unions || [];
        for (_i = 0, _len = _ref6.length; _i < _len; _i++) {
          blk = _ref6[_i];
          if ("string" === typeof blk.table) {
            p = {
              "text": "" + blk.table,
              "values": []
            };
          } else if (blk.table instanceof cls.QueryBuilder) {
            blk.table.updateOptions({
              "nestedBuilder": true
            });
            p = blk.table.toParam();
          } else {
            blk.updateOptions({
              "nestedBuilder": true
            });
            p = blk.buildParam(queryBuilder);
          }
          p.type = blk.type;
          params.push(p);
        }
        for (_j = 0, _len1 = params.length; _j < _len1; _j++) {
          p = params[_j];
          if (unionStr !== "") {
            unionStr += " ";
          }
          unionStr += "" + p.type + " (" + p.text + ")";
          _ref7 = p.values;
          for (_k = 0, _len2 = _ref7.length; _k < _len2; _k++) {
            v = _ref7[_k];
            ret.values.push(this._formatCustomValue(v));
          }
        }
        ret.text += unionStr;
        return ret;
      };

      return UnionBlock;

    })(cls.Block);
    cls.QueryBuilder = (function(_super) {
      __extends(QueryBuilder, _super);

      function QueryBuilder(options, blocks) {
        var block, methodBody, methodName, _fn, _i, _len, _ref6, _ref7,
          _this = this;
        QueryBuilder.__super__.constructor.call(this, options);
        this.blocks = blocks || [];
        _ref6 = this.blocks;
        for (_i = 0, _len = _ref6.length; _i < _len; _i++) {
          block = _ref6[_i];
          _ref7 = block.exposedMethods();
          _fn = function(block, name, body) {
            return _this[name] = function() {
              body.apply(block, arguments);
              return _this;
            };
          };
          for (methodName in _ref7) {
            methodBody = _ref7[methodName];
            if (this[methodName] != null) {
              throw new Error("" + (this._getObjectClassName(this)) + " already has a builder method called: " + methodName);
            }
            _fn(block, methodName, methodBody);
          }
        }
      }

      QueryBuilder.prototype.registerValueHandler = function(type, handler) {
        var block, _i, _len, _ref6;
        _ref6 = this.blocks;
        for (_i = 0, _len = _ref6.length; _i < _len; _i++) {
          block = _ref6[_i];
          block.registerValueHandler(type, handler);
        }
        QueryBuilder.__super__.registerValueHandler.call(this, type, handler);
        return this;
      };

      QueryBuilder.prototype.updateOptions = function(options) {
        var block, _i, _len, _ref6, _results;
        this.options = _extend({}, this.options, options);
        _ref6 = this.blocks;
        _results = [];
        for (_i = 0, _len = _ref6.length; _i < _len; _i++) {
          block = _ref6[_i];
          _results.push(block.options = _extend({}, block.options, options));
        }
        return _results;
      };

      QueryBuilder.prototype.toString = function() {
        var block;
        return ((function() {
          var _i, _len, _ref6, _results;
          _ref6 = this.blocks;
          _results = [];
          for (_i = 0, _len = _ref6.length; _i < _len; _i++) {
            block = _ref6[_i];
            _results.push(block.buildStr(this));
          }
          return _results;
        }).call(this)).filter(function(v) {
          return 0 < v.length;
        }).join(this.options.separator);
      };

      QueryBuilder.prototype.toParam = function(options) {
        var block, blocks, i, old, result, _ref6;
        if (options == null) {
          options = void 0;
        }
        old = this.options;
        if (options != null) {
          this.options = _extend({}, this.options, options);
        }
        result = {
          text: '',
          values: []
        };
        blocks = (function() {
          var _i, _len, _ref6, _results;
          _ref6 = this.blocks;
          _results = [];
          for (_i = 0, _len = _ref6.length; _i < _len; _i++) {
            block = _ref6[_i];
            _results.push(block.buildParam(this));
          }
          return _results;
        }).call(this);
        result.text = ((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = blocks.length; _i < _len; _i++) {
            block = blocks[_i];
            _results.push(block.text);
          }
          return _results;
        })()).filter(function(v) {
          return 0 < v.length;
        }).join(this.options.separator);
        result.values = (_ref6 = []).concat.apply(_ref6, (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = blocks.length; _i < _len; _i++) {
            block = blocks[_i];
            _results.push(block.values);
          }
          return _results;
        })());
        if (this.options.nestedBuilder == null) {
          if (this.options.numberedParameters || ((options != null ? options.numberedParametersStartAt : void 0) != null)) {
            i = 1;
            if (this.options.numberedParametersStartAt != null) {
              i = this.options.numberedParametersStartAt;
            }
            result.text = result.text.replace(/\?/g, function() {
              return "$" + (i++);
            });
          }
        }
        this.options = old;
        return result;
      };

      QueryBuilder.prototype.clone = function() {
        var block;
        return new this.constructor(this.options, (function() {
          var _i, _len, _ref6, _results;
          _ref6 = this.blocks;
          _results = [];
          for (_i = 0, _len = _ref6.length; _i < _len; _i++) {
            block = _ref6[_i];
            _results.push(block.clone());
          }
          return _results;
        }).call(this));
      };

      QueryBuilder.prototype.isNestable = function() {
        return false;
      };

      QueryBuilder.prototype.getBlock = function(blockType) {
        return this.blocks.filter(function(b) {
          return b instanceof blockType;
        })[0];
      };

      return QueryBuilder;

    })(cls.BaseBuilder);
    cls.Select = (function(_super) {
      __extends(Select, _super);

      function Select(options, blocks) {
        if (blocks == null) {
          blocks = null;
        }
        blocks || (blocks = [
          new cls.StringBlock(options, 'SELECT'), new cls.FunctionBlock(options), new cls.DistinctBlock(options), new cls.GetFieldBlock(options), new cls.FromTableBlock(_extend({}, options, {
            allowNested: true
          })), new cls.JoinBlock(_extend({}, options, {
            allowNested: true
          })), new cls.WhereBlock(options), new cls.GroupByBlock(options), new cls.HavingBlock(options), new cls.OrderByBlock(options), new cls.LimitBlock(options), new cls.OffsetBlock(options), new cls.UnionBlock(_extend({}, options, {
            allowNested: true
          }))
        ]);
        Select.__super__.constructor.call(this, options, blocks);
      }

      Select.prototype.isNestable = function() {
        return true;
      };

      return Select;

    })(cls.QueryBuilder);
    cls.Update = (function(_super) {
      __extends(Update, _super);

      function Update(options, blocks) {
        if (blocks == null) {
          blocks = null;
        }
        blocks || (blocks = [new cls.StringBlock(options, 'UPDATE'), new cls.UpdateTableBlock(options), new cls.SetFieldBlock(options), new cls.WhereBlock(options), new cls.OrderByBlock(options), new cls.LimitBlock(options)]);
        Update.__super__.constructor.call(this, options, blocks);
      }

      return Update;

    })(cls.QueryBuilder);
    cls.Delete = (function(_super) {
      __extends(Delete, _super);

      function Delete(options, blocks) {
        if (blocks == null) {
          blocks = null;
        }
        blocks || (blocks = [
          new cls.StringBlock(options, 'DELETE'), new cls.FromTableBlock(_extend({}, options, {
            singleTable: true
          })), new cls.JoinBlock(options), new cls.WhereBlock(options), new cls.OrderByBlock(options), new cls.LimitBlock(options)
        ]);
        Delete.__super__.constructor.call(this, options, blocks);
      }

      return Delete;

    })(cls.QueryBuilder);
    cls.Insert = (function(_super) {
      __extends(Insert, _super);

      function Insert(options, blocks) {
        if (blocks == null) {
          blocks = null;
        }
        blocks || (blocks = [new cls.StringBlock(options, 'INSERT'), new cls.IntoTableBlock(options), new cls.InsertFieldValueBlock(options), new cls.InsertFieldsFromQueryBlock(options)]);
        Insert.__super__.constructor.call(this, options, blocks);
      }

      return Insert;

    })(cls.QueryBuilder);
    _squel = {
      VERSION: '4.2.0',
      expr: function() {
        return new cls.Expression;
      },
      select: function(options, blocks) {
        return new cls.Select(options, blocks);
      },
      update: function(options, blocks) {
        return new cls.Update(options, blocks);
      },
      insert: function(options, blocks) {
        return new cls.Insert(options, blocks);
      },
      "delete": function(options, blocks) {
        return new cls.Delete(options, blocks);
      },
      registerValueHandler: cls.registerValueHandler,
      fval: cls.fval
    };
    _squel.remove = _squel["delete"];
    _squel.cls = cls;
    return _squel;
  };

  squel = _buildSquel();

  if (typeof define !== "undefined" && define !== null ? define.amd : void 0) {
    define(function() {
      return squel;
    });
  } else if (typeof module !== "undefined" && module !== null ? module.exports : void 0) {
    module.exports = squel;
  } else {
    if (typeof window !== "undefined" && window !== null) {
      window.squel = squel;
    }
  }

  squel.flavours = {};

  squel.useFlavour = function(flavour) {
    var s;
    if (flavour == null) {
      flavour = null;
    }
    if (!flavour) {
      return squel;
    }
    if (squel.flavours[flavour] instanceof Function) {
      s = _buildSquel();
      squel.flavours[flavour].call(null, s);
      return s;
    } else {
      throw new Error("Flavour not available: " + flavour);
    }
  };

  /*
  Copyright (c) Ramesh Nair (hiddentao.com)
  
  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation
  files (the "Software"), to deal in the Software without
  restriction, including without limitation the rights to use,
  copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the
  Software is furnished to do so, subject to the following
  conditions:
  
  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
  HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
  WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
  OTHER DEALINGS IN THE SOFTWARE.
  */


  squel.flavours['postgres'] = function(_squel) {
    var cls;
    cls = _squel.cls;
    cls.DefaultQueryBuilderOptions.numberedParameters = true;
    cls.DefaultQueryBuilderOptions.numberedParametersStartAt = 1;
    cls.DefaultQueryBuilderOptions.autoQuoteAliasNames = false;
    cls.ReturningBlock = (function(_super) {
      __extends(ReturningBlock, _super);

      function ReturningBlock(options) {
        ReturningBlock.__super__.constructor.call(this, options);
        this._str = null;
      }

      ReturningBlock.prototype.returning = function(ret) {
        return this._str = this._sanitizeField(ret);
      };

      ReturningBlock.prototype.buildStr = function() {
        if (this._str) {
          return "RETURNING " + this._str;
        } else {
          return "";
        }
      };

      return ReturningBlock;

    })(cls.Block);
    cls.Insert = (function(_super) {
      __extends(Insert, _super);

      function Insert(options, blocks) {
        if (blocks == null) {
          blocks = null;
        }
        blocks || (blocks = [new cls.StringBlock(options, 'INSERT'), new cls.IntoTableBlock(options), new cls.InsertFieldValueBlock(options), new cls.InsertFieldsFromQueryBlock(options), new cls.ReturningBlock(options)]);
        Insert.__super__.constructor.call(this, options, blocks);
      }

      return Insert;

    })(cls.QueryBuilder);
    cls.Update = (function(_super) {
      __extends(Update, _super);

      function Update(options, blocks) {
        if (blocks == null) {
          blocks = null;
        }
        blocks || (blocks = [new cls.StringBlock(options, 'UPDATE'), new cls.UpdateTableBlock(options), new cls.SetFieldBlock(options), new cls.WhereBlock(options), new cls.OrderByBlock(options), new cls.LimitBlock(options), new cls.ReturningBlock(options)]);
        Update.__super__.constructor.call(this, options, blocks);
      }

      return Update;

    })(cls.QueryBuilder);
    return cls.Delete = (function(_super) {
      __extends(Delete, _super);

      function Delete(options, blocks) {
        if (blocks == null) {
          blocks = null;
        }
        blocks || (blocks = [
          new cls.StringBlock(options, 'DELETE'), new cls.FromTableBlock(_extend({}, options, {
            singleTable: true
          })), new cls.JoinBlock(options), new cls.WhereBlock(options), new cls.OrderByBlock(options), new cls.LimitBlock(options), new cls.ReturningBlock(options)
        ]);
        Delete.__super__.constructor.call(this, options, blocks);
      }

      return Delete;

    })(cls.QueryBuilder);
  };

  /*
  Copyright (c) Ramesh Nair (hiddentao.com)
  
  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation
  files (the "Software"), to deal in the Software without
  restriction, including without limitation the rights to use,
  copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the
  Software is furnished to do so, subject to the following
  conditions:
  
  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
  HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
  WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
  OTHER DEALINGS IN THE SOFTWARE.
  */


  squel.flavours['mysql'] = function(_squel) {
    var cls, _ref, _ref1;
    cls = _squel.cls;
    cls.TargetTableBlock = (function(_super) {
      __extends(TargetTableBlock, _super);

      function TargetTableBlock() {
        _ref = TargetTableBlock.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      TargetTableBlock.prototype.target = function(table) {
        return this._setValue(this._sanitizeTable(table));
      };

      return TargetTableBlock;

    })(cls.AbstractValueBlock);
    cls.MysqlOnDuplicateKeyUpdateBlock = (function(_super) {
      __extends(MysqlOnDuplicateKeyUpdateBlock, _super);

      function MysqlOnDuplicateKeyUpdateBlock() {
        _ref1 = MysqlOnDuplicateKeyUpdateBlock.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      MysqlOnDuplicateKeyUpdateBlock.prototype.onDupUpdate = function(field, value, options) {
        return this._set(field, value, options);
      };

      MysqlOnDuplicateKeyUpdateBlock.prototype.buildStr = function() {
        var field, fieldOptions, i, str, value, _i, _ref2;
        str = "";
        for (i = _i = 0, _ref2 = this.fields.length; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; i = 0 <= _ref2 ? ++_i : --_i) {
          field = this.fields[i];
          if ("" !== str) {
            str += ", ";
          }
          value = this.values[0][i];
          fieldOptions = this.fieldOptions[0][i];
          if (typeof value === 'undefined') {
            str += field;
          } else {
            str += "" + field + " = " + (this._formatValue(value, fieldOptions));
          }
        }
        if (str === "") {
          return "";
        } else {
          return "ON DUPLICATE KEY UPDATE " + str;
        }
      };

      MysqlOnDuplicateKeyUpdateBlock.prototype.buildParam = function(queryBuilder) {
        var field, i, str, vals, value, _i, _ref2;
        str = "";
        vals = [];
        for (i = _i = 0, _ref2 = this.fields.length; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; i = 0 <= _ref2 ? ++_i : --_i) {
          field = this.fields[i];
          if ("" !== str) {
            str += ", ";
          }
          value = this.values[0][i];
          if (typeof value === 'undefined') {
            str += field;
          } else {
            str += "" + field + " = ?";
            vals.push(this._formatValueAsParam(value));
          }
        }
        return {
          text: str === "" ? "" : "ON DUPLICATE KEY UPDATE " + str,
          values: vals
        };
      };

      return MysqlOnDuplicateKeyUpdateBlock;

    })(cls.AbstractSetFieldBlock);
    cls.Insert = (function(_super) {
      __extends(Insert, _super);

      function Insert(options, blocks) {
        if (blocks == null) {
          blocks = null;
        }
        blocks || (blocks = [new cls.StringBlock(options, 'INSERT'), new cls.IntoTableBlock(options), new cls.InsertFieldValueBlock(options), new cls.InsertFieldsFromQueryBlock(options), new cls.MysqlOnDuplicateKeyUpdateBlock(options)]);
        Insert.__super__.constructor.call(this, options, blocks);
      }

      return Insert;

    })(cls.QueryBuilder);
    return cls.Delete = (function(_super) {
      __extends(Delete, _super);

      function Delete(options, blocks) {
        if (blocks == null) {
          blocks = null;
        }
        blocks || (blocks = [
          new cls.StringBlock(options, 'DELETE'), new cls.TargetTableBlock(options), new cls.FromTableBlock(_extend({}, options, {
            singleTable: true
          })), new cls.JoinBlock(options), new cls.WhereBlock(options), new cls.OrderByBlock(options), new cls.LimitBlock(options)
        ]);
        Delete.__super__.constructor.call(this, options, blocks);
      }

      return Delete;

    })(cls.QueryBuilder);
  };

  /*
  Copyright (c) Ramesh Nair (hiddentao.com)
  
  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation
  files (the "Software"), to deal in the Software without
  restriction, including without limitation the rights to use,
  copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the
  Software is furnished to do so, subject to the following
  conditions:
  
  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
  HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
  WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
  OTHER DEALINGS IN THE SOFTWARE.
  */


  _extend = function() {
    var dst, k, sources, src, v, _i, _len;
    dst = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (sources) {
      for (_i = 0, _len = sources.length; _i < _len; _i++) {
        src = sources[_i];
        if (src) {
          for (k in src) {
            if (!__hasProp.call(src, k)) continue;
            v = src[k];
            dst[k] = v;
          }
        }
      }
    }
    return dst;
  };

  squel.flavours['mssql'] = function(_squel) {
    var cls;
    cls = _squel.cls;
    cls.DefaultQueryBuilderOptions.replaceSingleQuotes = true;
    cls.DefaultQueryBuilderOptions.autoQuoteAliasNames = false;
    _squel.registerValueHandler(Date, function(date) {
      return "'" + (date.getUTCFullYear()) + "-" + (date.getUTCMonth() + 1) + "-" + (date.getUTCDate()) + " " + (date.getUTCHours()) + ":" + (date.getUTCMinutes()) + ":" + (date.getUTCSeconds()) + "'";
    });
    cls.MssqlLimitOffsetTopBlock = (function(_super) {
      var LimitBlock, OffsetBlock, ParentBlock, TopBlock, _limit, _ref, _ref1, _ref2;

      __extends(MssqlLimitOffsetTopBlock, _super);

      function MssqlLimitOffsetTopBlock(options) {
        MssqlLimitOffsetTopBlock.__super__.constructor.call(this, options);
        this.limits = null;
        this.offsets = null;
      }

      _limit = function(max) {
        max = this._sanitizeLimitOffset(max);
        return this._parent.limits = max;
      };

      ParentBlock = (function(_super1) {
        __extends(ParentBlock, _super1);

        function ParentBlock(parent) {
          ParentBlock.__super__.constructor.call(this, parent.options);
          this._parent = parent;
        }

        return ParentBlock;

      })(cls.Block);

      LimitBlock = (function(_super1) {
        __extends(LimitBlock, _super1);

        function LimitBlock() {
          _ref = LimitBlock.__super__.constructor.apply(this, arguments);
          return _ref;
        }

        LimitBlock.prototype.limit = _limit;

        LimitBlock.prototype.buildStr = function(queryBuilder) {
          if (this._parent.limits && this._parent.offsets) {
            return "FETCH NEXT " + this._parent.limits + " ROWS ONLY";
          } else {
            return "";
          }
        };

        return LimitBlock;

      })(ParentBlock);

      TopBlock = (function(_super1) {
        __extends(TopBlock, _super1);

        function TopBlock() {
          _ref1 = TopBlock.__super__.constructor.apply(this, arguments);
          return _ref1;
        }

        TopBlock.prototype.top = _limit;

        TopBlock.prototype.buildStr = function(queryBuilder) {
          if (this._parent.limits && !this._parent.offsets) {
            return "TOP (" + this._parent.limits + ")";
          } else {
            return "";
          }
        };

        return TopBlock;

      })(ParentBlock);

      OffsetBlock = (function(_super1) {
        __extends(OffsetBlock, _super1);

        function OffsetBlock() {
          this.offset = __bind(this.offset, this);
          _ref2 = OffsetBlock.__super__.constructor.apply(this, arguments);
          return _ref2;
        }

        OffsetBlock.prototype.offset = function(start) {
          start = this._sanitizeLimitOffset(start);
          return this._parent.offsets = start;
        };

        OffsetBlock.prototype.buildStr = function(queryBuilder) {
          if (this._parent.offsets) {
            return "OFFSET " + this._parent.offsets + " ROWS";
          } else {
            return "";
          }
        };

        return OffsetBlock;

      })(ParentBlock);

      MssqlLimitOffsetTopBlock.prototype.LIMIT = function(options) {
        this.constructor(options);
        return new LimitBlock(this);
      };

      MssqlLimitOffsetTopBlock.prototype.TOP = function(options) {
        this.constructor(options);
        return new TopBlock(this);
      };

      MssqlLimitOffsetTopBlock.prototype.OFFSET = function(options) {
        this.constructor(options);
        return new OffsetBlock(this);
      };

      return MssqlLimitOffsetTopBlock;

    }).call(this, cls.Block);
    cls.MssqlUpdateTopBlock = (function(_super) {
      var _limit;

      __extends(MssqlUpdateTopBlock, _super);

      function MssqlUpdateTopBlock(options) {
        MssqlUpdateTopBlock.__super__.constructor.call(this, options);
        this.limits = null;
      }

      _limit = function(max) {
        max = this._sanitizeLimitOffset(max);
        return this.limits = max;
      };

      MssqlUpdateTopBlock.prototype.limit = _limit;

      MssqlUpdateTopBlock.prototype.top = _limit;

      MssqlUpdateTopBlock.prototype.buildStr = function(queryBuilder) {
        if (this.limits) {
          return "TOP (" + this.limits + ")";
        } else {
          return "";
        }
      };

      return MssqlUpdateTopBlock;

    })(cls.Block);
    cls.MssqlInsertFieldValueBlock = (function(_super) {
      __extends(MssqlInsertFieldValueBlock, _super);

      function MssqlInsertFieldValueBlock(options) {
        MssqlInsertFieldValueBlock.__super__.constructor.call(this, options);
        this.outputs = [];
      }

      MssqlInsertFieldValueBlock.prototype.output = function(fields) {
        var f, _i, _len, _results;
        if ('string' === typeof fields) {
          return this.outputs.push("INSERTED." + (this._sanitizeField(fields)));
        } else {
          _results = [];
          for (_i = 0, _len = fields.length; _i < _len; _i++) {
            f = fields[_i];
            _results.push(this.outputs.push("INSERTED." + (this._sanitizeField(f))));
          }
          return _results;
        }
      };

      MssqlInsertFieldValueBlock.prototype.buildStr = function(queryBuilder) {
        if (0 >= this.fields.length) {
          throw new Error("set() needs to be called");
        }
        return "(" + (this.fields.join(', ')) + ") " + (this.outputs.length !== 0 ? "OUTPUT " + (this.outputs.join(', ')) + " " : '') + "VALUES (" + (this._buildVals().join('), (')) + ")";
      };

      MssqlInsertFieldValueBlock.prototype.buildParam = function(queryBuilder) {
        var i, params, str, vals, _i, _ref, _ref1;
        if (0 >= this.fields.length) {
          throw new Error("set() needs to be called");
        }
        str = "";
        _ref = this._buildValParams(), vals = _ref.vals, params = _ref.params;
        for (i = _i = 0, _ref1 = this.fields.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
          if ("" !== str) {
            str += ", ";
          }
          str += this.fields[i];
        }
        return {
          text: "(" + str + ") " + (this.outputs.length !== 0 ? "OUTPUT " + (this.outputs.join(', ')) + " " : '') + "VALUES (" + (vals.join('), (')) + ")",
          values: params
        };
      };

      return MssqlInsertFieldValueBlock;

    })(cls.InsertFieldValueBlock);
    cls.MssqlUpdateDeleteOutputBlock = (function(_super) {
      __extends(MssqlUpdateDeleteOutputBlock, _super);

      function MssqlUpdateDeleteOutputBlock(options) {
        MssqlUpdateDeleteOutputBlock.__super__.constructor.call(this, options);
        this._outputs = [];
      }

      MssqlUpdateDeleteOutputBlock.prototype.outputs = function(_outputs) {
        var alias, output, _results;
        _results = [];
        for (output in _outputs) {
          alias = _outputs[output];
          _results.push(this.output(output, alias));
        }
        return _results;
      };

      MssqlUpdateDeleteOutputBlock.prototype.output = function(output, alias) {
        if (alias == null) {
          alias = null;
        }
        output = this._sanitizeField(output);
        if (alias) {
          alias = this._sanitizeFieldAlias(alias);
        }
        return this._outputs.push({
          name: this.options.forDelete ? "DELETED." + output : "INSERTED." + output,
          alias: alias
        });
      };

      MssqlUpdateDeleteOutputBlock.prototype.buildStr = function(queryBuilder) {
        var output, outputs, _i, _len, _ref;
        outputs = "";
        if (this._outputs.length > 0) {
          _ref = this._outputs;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            output = _ref[_i];
            if ("" !== outputs) {
              outputs += ", ";
            }
            outputs += output.name;
            if (output.alias) {
              outputs += " AS " + output.alias;
            }
          }
          outputs = "OUTPUT " + outputs;
        }
        return outputs;
      };

      return MssqlUpdateDeleteOutputBlock;

    })(cls.Block);
    cls.Select = (function(_super) {
      __extends(Select, _super);

      function Select(options, blocks) {
        var limitOffsetTopBlock;
        if (blocks == null) {
          blocks = null;
        }
        limitOffsetTopBlock = new cls.MssqlLimitOffsetTopBlock(options);
        blocks || (blocks = [
          new cls.StringBlock(options, 'SELECT'), new cls.DistinctBlock(options), limitOffsetTopBlock.TOP(options), new cls.GetFieldBlock(options), new cls.FromTableBlock(_extend({}, options, {
            allowNested: true
          })), new cls.JoinBlock(_extend({}, options, {
            allowNested: true
          })), new cls.WhereBlock(options), new cls.GroupByBlock(options), new cls.OrderByBlock(options), limitOffsetTopBlock.OFFSET(options), limitOffsetTopBlock.LIMIT(options), new cls.UnionBlock(_extend({}, options, {
            allowNested: true
          }))
        ]);
        Select.__super__.constructor.call(this, options, blocks);
      }

      Select.prototype.isNestable = function() {
        return true;
      };

      return Select;

    })(cls.QueryBuilder);
    cls.Update = (function(_super) {
      __extends(Update, _super);

      function Update(options, blocks) {
        if (blocks == null) {
          blocks = null;
        }
        blocks || (blocks = [new cls.StringBlock(options, 'UPDATE'), new cls.MssqlUpdateTopBlock(options), new cls.UpdateTableBlock(options), new cls.SetFieldBlock(options), new cls.MssqlUpdateDeleteOutputBlock(options), new cls.WhereBlock(options)]);
        Update.__super__.constructor.call(this, options, blocks);
      }

      return Update;

    })(cls.QueryBuilder);
    cls.Delete = (function(_super) {
      __extends(Delete, _super);

      function Delete(options, blocks) {
        if (blocks == null) {
          blocks = null;
        }
        blocks || (blocks = [
          new cls.StringBlock(options, 'DELETE'), new cls.FromTableBlock(_extend({}, options, {
            singleTable: true
          })), new cls.JoinBlock(options), new cls.MssqlUpdateDeleteOutputBlock(_extend({}, options, {
            forDelete: true
          })), new cls.WhereBlock(options), new cls.OrderByBlock(options), new cls.LimitBlock(options)
        ]);
        Delete.__super__.constructor.call(this, options, blocks);
      }

      return Delete;

    })(cls.QueryBuilder);
    return cls.Insert = (function(_super) {
      __extends(Insert, _super);

      function Insert(options, blocks) {
        if (blocks == null) {
          blocks = null;
        }
        blocks || (blocks = [new cls.StringBlock(options, 'INSERT'), new cls.IntoTableBlock(options), new cls.MssqlInsertFieldValueBlock(options), new cls.InsertFieldsFromQueryBlock(options)]);
        Insert.__super__.constructor.call(this, options, blocks);
      }

      return Insert;

    })(cls.QueryBuilder);
  };

}).call(this);

},{}],2:[function(require,module,exports){
var testJQuery = require('./testJquery.js');
var create = require('./createStatementGenerate.js');

create();
testJQuery();

},{"./createStatementGenerate.js":3,"./testJquery.js":4}],3:[function(require,module,exports){
/**
 * Created by ryu on 15/09/18.
 */
var squel = require('squel');

module.exports = function(){
  /* OOP Inheritance mechanism (substitute your own favourite library for this!) */
  Function.prototype.inheritsFrom = function( parentClassOrObject ) {
    this.prototype = new parentClassOrObject;
    this.prototype.constructor = this;
    this.prototype.parent = parentClassOrObject.prototype;
    this.prototype.parent.constructor = parentClassOrObject;
  };

  var CreateTableBlock = function(options){
    this.parent.constructor.apply(this,options);
  };

  CreateTableBlock.inheritsFrom(squel.cls.AbstractTableBlock);


  CreateTableBlock.prototype.table = function(table,alias){
    if (alias == null) {
      alias = null;
    }
      return this._table(table,alias);
  };


  var ColumnBlock = function() {
    var _columns = [];

    ColumnBlock.prototype.columns = function(colunms){
      if (Array.isArray(colunms)){
        _columns.push(colunms.join(", "));
      }
      else{
        throw new TypeError(colunms + "is not Array")
      }

    }
    ColumnBlock.prototype.column = function(column) {
      column = this._sanitizeName(column,"column property")
      _columns.push(column);
    }

    ColumnBlock.prototype.buildStr = function() {
      return "(" + _columns.join(", ") + ")";
    }
  };

  ColumnBlock.inheritsFrom(squel.cls.Block);

  /* Create the 'Create' query builder */

  var CreateQuery = function(options) {
    this.parent.constructor.call(this, options, [
      new squel.cls.StringBlock(options, 'CREATE TABLE'),
      new CreateTableBlock({singleTable: true}),
      new ColumnBlock()
    ]);
  };
  CreateQuery.inheritsFrom(squel.cls.QueryBuilder);


  /* Create squel.create() convenience method */

  squel.create = function(options) {
    return new CreateQuery(options)
  };


  /* Try it out! */
  var col = ["cc","dd"]

  console.log(
    squel.create()
      .table('test')
      .column("a b")
      .columns(col)
      .column("c d")
      .toString()
  );
}
},{"squel":1}],4:[function(require,module,exports){
(function (global){
/**
 * Created by ryu on 15/09/18.
 */
var $ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);
var squel = require('squel');

module.exports = function()
{
  $(document).ready(function(){
    var query = squel.select().from("students").toString();
    $('.inner').append("Hello");
    $('.query').append(query);
  });
};
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"squel":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvc3F1ZWwvc3F1ZWwuanMiLCJzcmMvanMvYXBwLmpzIiwic3JjL2pzL2NyZWF0ZVN0YXRlbWVudEdlbmVyYXRlLmpzIiwic3JjL2pzL3Rlc3RKcXVlcnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2h2RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypcbkNvcHlyaWdodCAoYykgMjAxNCBSYW1lc2ggTmFpciAoaGlkZGVudGFvLmNvbSlcblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbm9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uXG5maWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXRcbnJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLFxuY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZVxuU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmdcbmNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlXG5pbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbkVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFU1xuT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkRcbk5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUXG5IT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSxcbldIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lOR1xuRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUlxuT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuKi9cblxuXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBnZXRWYWx1ZUhhbmRsZXIsIHJlZ2lzdGVyVmFsdWVIYW5kbGVyLCBzcXVlbCwgX2J1aWxkU3F1ZWwsIF9leHRlbmQsIF93aXRob3V0LFxuICAgIF9fc2xpY2UgPSBbXS5zbGljZSxcbiAgICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgICBfX2JpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9LFxuICAgIF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9O1xuXG4gIF9leHRlbmQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZHN0LCBrLCBzb3VyY2VzLCBzcmMsIHYsIF9pLCBfbGVuO1xuICAgIGRzdCA9IGFyZ3VtZW50c1swXSwgc291cmNlcyA9IDIgPD0gYXJndW1lbnRzLmxlbmd0aCA/IF9fc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpIDogW107XG4gICAgaWYgKHNvdXJjZXMpIHtcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gc291cmNlcy5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBzcmMgPSBzb3VyY2VzW19pXTtcbiAgICAgICAgaWYgKHNyYykge1xuICAgICAgICAgIGZvciAoayBpbiBzcmMpIHtcbiAgICAgICAgICAgIGlmICghX19oYXNQcm9wLmNhbGwoc3JjLCBrKSkgY29udGludWU7XG4gICAgICAgICAgICB2ID0gc3JjW2tdO1xuICAgICAgICAgICAgZHN0W2tdID0gdjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRzdDtcbiAgfTtcblxuICBfd2l0aG91dCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkc3QsIG9iaiwgcCwgcHJvcGVydGllcywgX2ksIF9sZW47XG4gICAgb2JqID0gYXJndW1lbnRzWzBdLCBwcm9wZXJ0aWVzID0gMiA8PSBhcmd1bWVudHMubGVuZ3RoID8gX19zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkgOiBbXTtcbiAgICBkc3QgPSBfZXh0ZW5kKHt9LCBvYmopO1xuICAgIGZvciAoX2kgPSAwLCBfbGVuID0gcHJvcGVydGllcy5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgcCA9IHByb3BlcnRpZXNbX2ldO1xuICAgICAgZGVsZXRlIGRzdFtwXTtcbiAgICB9XG4gICAgcmV0dXJuIGRzdDtcbiAgfTtcblxuICByZWdpc3RlclZhbHVlSGFuZGxlciA9IGZ1bmN0aW9uKGhhbmRsZXJzLCB0eXBlLCBoYW5kbGVyKSB7XG4gICAgdmFyIHR5cGVIYW5kbGVyLCBfaSwgX2xlbjtcbiAgICBpZiAoJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIHR5cGUgJiYgJ3N0cmluZycgIT09IHR5cGVvZiB0eXBlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0eXBlIG11c3QgYmUgYSBjbGFzcyBjb25zdHJ1Y3RvciBvciBzdHJpbmcgZGVub3RpbmcgJ3R5cGVvZicgcmVzdWx0XCIpO1xuICAgIH1cbiAgICBpZiAoJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIGhhbmRsZXIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcImhhbmRsZXIgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpO1xuICAgIH1cbiAgICBmb3IgKF9pID0gMCwgX2xlbiA9IGhhbmRsZXJzLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICB0eXBlSGFuZGxlciA9IGhhbmRsZXJzW19pXTtcbiAgICAgIGlmICh0eXBlSGFuZGxlci50eXBlID09PSB0eXBlKSB7XG4gICAgICAgIHR5cGVIYW5kbGVyLmhhbmRsZXIgPSBoYW5kbGVyO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBoYW5kbGVycy5wdXNoKHtcbiAgICAgIHR5cGU6IHR5cGUsXG4gICAgICBoYW5kbGVyOiBoYW5kbGVyXG4gICAgfSk7XG4gIH07XG5cbiAgZ2V0VmFsdWVIYW5kbGVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGhhbmRsZXJMaXN0cywgaGFuZGxlcnMsIHR5cGVIYW5kbGVyLCB2YWx1ZSwgX2ksIF9qLCBfbGVuLCBfbGVuMTtcbiAgICB2YWx1ZSA9IGFyZ3VtZW50c1swXSwgaGFuZGxlckxpc3RzID0gMiA8PSBhcmd1bWVudHMubGVuZ3RoID8gX19zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkgOiBbXTtcbiAgICBmb3IgKF9pID0gMCwgX2xlbiA9IGhhbmRsZXJMaXN0cy5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgaGFuZGxlcnMgPSBoYW5kbGVyTGlzdHNbX2ldO1xuICAgICAgZm9yIChfaiA9IDAsIF9sZW4xID0gaGFuZGxlcnMubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICAgIHR5cGVIYW5kbGVyID0gaGFuZGxlcnNbX2pdO1xuICAgICAgICBpZiAodHlwZUhhbmRsZXIudHlwZSA9PT0gdHlwZW9mIHZhbHVlIHx8ICh0eXBlb2YgdHlwZUhhbmRsZXIudHlwZSAhPT0gJ3N0cmluZycgJiYgdmFsdWUgaW5zdGFuY2VvZiB0eXBlSGFuZGxlci50eXBlKSkge1xuICAgICAgICAgIHJldHVybiB0eXBlSGFuZGxlci5oYW5kbGVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2b2lkIDA7XG4gIH07XG5cbiAgX2J1aWxkU3F1ZWwgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgY2xzLCBfcmVmLCBfcmVmMSwgX3JlZjIsIF9yZWYzLCBfcmVmNCwgX3JlZjUsIF9zcXVlbDtcbiAgICBjbHMgPSB7fTtcbiAgICBjbHMuRGVmYXVsdFF1ZXJ5QnVpbGRlck9wdGlvbnMgPSB7XG4gICAgICBhdXRvUXVvdGVUYWJsZU5hbWVzOiBmYWxzZSxcbiAgICAgIGF1dG9RdW90ZUZpZWxkTmFtZXM6IGZhbHNlLFxuICAgICAgYXV0b1F1b3RlQWxpYXNOYW1lczogdHJ1ZSxcbiAgICAgIG5hbWVRdW90ZUNoYXJhY3RlcjogJ2AnLFxuICAgICAgdGFibGVBbGlhc1F1b3RlQ2hhcmFjdGVyOiAnYCcsXG4gICAgICBmaWVsZEFsaWFzUXVvdGVDaGFyYWN0ZXI6ICdcIicsXG4gICAgICB2YWx1ZUhhbmRsZXJzOiBbXSxcbiAgICAgIG51bWJlcmVkUGFyYW1ldGVyczogZmFsc2UsXG4gICAgICBudW1iZXJlZFBhcmFtZXRlcnNTdGFydEF0OiAxLFxuICAgICAgcmVwbGFjZVNpbmdsZVF1b3RlczogZmFsc2UsXG4gICAgICBzaW5nbGVRdW90ZVJlcGxhY2VtZW50OiAnXFwnXFwnJyxcbiAgICAgIHNlcGFyYXRvcjogJyAnXG4gICAgfTtcbiAgICBjbHMuZ2xvYmFsVmFsdWVIYW5kbGVycyA9IFtdO1xuICAgIGNscy5yZWdpc3RlclZhbHVlSGFuZGxlciA9IGZ1bmN0aW9uKHR5cGUsIGhhbmRsZXIpIHtcbiAgICAgIHJldHVybiByZWdpc3RlclZhbHVlSGFuZGxlcihjbHMuZ2xvYmFsVmFsdWVIYW5kbGVycywgdHlwZSwgaGFuZGxlcik7XG4gICAgfTtcbiAgICBjbHMuQ2xvbmVhYmxlID0gKGZ1bmN0aW9uKCkge1xuICAgICAgZnVuY3Rpb24gQ2xvbmVhYmxlKCkge31cblxuICAgICAgQ2xvbmVhYmxlLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbmV3SW5zdGFuY2U7XG4gICAgICAgIG5ld0luc3RhbmNlID0gbmV3IHRoaXMuY29uc3RydWN0b3I7XG4gICAgICAgIHJldHVybiBfZXh0ZW5kKG5ld0luc3RhbmNlLCBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRoaXMpKSk7XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gQ2xvbmVhYmxlO1xuXG4gICAgfSkoKTtcbiAgICBjbHMuQmFzZUJ1aWxkZXIgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gICAgICBfX2V4dGVuZHMoQmFzZUJ1aWxkZXIsIF9zdXBlcik7XG5cbiAgICAgIGZ1bmN0aW9uIEJhc2VCdWlsZGVyKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5fc2FuaXRpemVOZXN0YWJsZVF1ZXJ5ID0gX19iaW5kKHRoaXMuX3Nhbml0aXplTmVzdGFibGVRdWVyeSwgdGhpcyk7XG4gICAgICAgIHZhciBkZWZhdWx0cztcbiAgICAgICAgZGVmYXVsdHMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGNscy5EZWZhdWx0UXVlcnlCdWlsZGVyT3B0aW9ucykpO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBfZXh0ZW5kKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG4gICAgICB9XG5cbiAgICAgIEJhc2VCdWlsZGVyLnByb3RvdHlwZS5yZWdpc3RlclZhbHVlSGFuZGxlciA9IGZ1bmN0aW9uKHR5cGUsIGhhbmRsZXIpIHtcbiAgICAgICAgcmVnaXN0ZXJWYWx1ZUhhbmRsZXIodGhpcy5vcHRpb25zLnZhbHVlSGFuZGxlcnMsIHR5cGUsIGhhbmRsZXIpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH07XG5cbiAgICAgIEJhc2VCdWlsZGVyLnByb3RvdHlwZS5fZ2V0T2JqZWN0Q2xhc3NOYW1lID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgIHZhciBhcnI7XG4gICAgICAgIGlmIChvYmogJiYgb2JqLmNvbnN0cnVjdG9yICYmIG9iai5jb25zdHJ1Y3Rvci50b1N0cmluZykge1xuICAgICAgICAgIGFyciA9IG9iai5jb25zdHJ1Y3Rvci50b1N0cmluZygpLm1hdGNoKC9mdW5jdGlvblxccyooXFx3KykvKTtcbiAgICAgICAgICBpZiAoYXJyICYmIGFyci5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgIHJldHVybiBhcnJbMV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgICB9O1xuXG4gICAgICBCYXNlQnVpbGRlci5wcm90b3R5cGUuX3Nhbml0aXplQ29uZGl0aW9uID0gZnVuY3Rpb24oY29uZGl0aW9uKSB7XG4gICAgICAgIGlmICghKGNvbmRpdGlvbiBpbnN0YW5jZW9mIGNscy5FeHByZXNzaW9uKSkge1xuICAgICAgICAgIGlmIChcInN0cmluZ1wiICE9PSB0eXBlb2YgY29uZGl0aW9uKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJjb25kaXRpb24gbXVzdCBiZSBhIHN0cmluZyBvciBFeHByZXNzaW9uIGluc3RhbmNlXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29uZGl0aW9uO1xuICAgICAgfTtcblxuICAgICAgQmFzZUJ1aWxkZXIucHJvdG90eXBlLl9zYW5pdGl6ZU5hbWUgPSBmdW5jdGlvbih2YWx1ZSwgdHlwZSkge1xuICAgICAgICBpZiAoXCJzdHJpbmdcIiAhPT0gdHlwZW9mIHZhbHVlKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiXCIgKyB0eXBlICsgXCIgbXVzdCBiZSBhIHN0cmluZ1wiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9O1xuXG4gICAgICBCYXNlQnVpbGRlci5wcm90b3R5cGUuX3Nhbml0aXplRmllbGQgPSBmdW5jdGlvbihpdGVtLCBmb3JtYXR0aW5nT3B0aW9ucykge1xuICAgICAgICB2YXIgcXVvdGVDaGFyO1xuICAgICAgICBpZiAoZm9ybWF0dGluZ09wdGlvbnMgPT0gbnVsbCkge1xuICAgICAgICAgIGZvcm1hdHRpbmdPcHRpb25zID0ge307XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBjbHMuUXVlcnlCdWlsZGVyKSB7XG4gICAgICAgICAgaXRlbSA9IFwiKFwiICsgaXRlbSArIFwiKVwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW0gPSB0aGlzLl9zYW5pdGl6ZU5hbWUoaXRlbSwgXCJmaWVsZCBuYW1lXCIpO1xuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYXV0b1F1b3RlRmllbGROYW1lcykge1xuICAgICAgICAgICAgcXVvdGVDaGFyID0gdGhpcy5vcHRpb25zLm5hbWVRdW90ZUNoYXJhY3RlcjtcbiAgICAgICAgICAgIGlmIChmb3JtYXR0aW5nT3B0aW9ucy5pZ25vcmVQZXJpb2RzRm9yRmllbGROYW1lUXVvdGVzKSB7XG4gICAgICAgICAgICAgIGl0ZW0gPSBcIlwiICsgcXVvdGVDaGFyICsgaXRlbSArIHF1b3RlQ2hhcjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGl0ZW0gPSBpdGVtLnNwbGl0KCcuJykubWFwKGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICAgICAgICBpZiAoJyonID09PSB2KSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiXCIgKyBxdW90ZUNoYXIgKyB2ICsgcXVvdGVDaGFyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSkuam9pbignLicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgIH07XG5cbiAgICAgIEJhc2VCdWlsZGVyLnByb3RvdHlwZS5fc2FuaXRpemVOZXN0YWJsZVF1ZXJ5ID0gZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIGNscy5RdWVyeUJ1aWxkZXIgJiYgaXRlbS5pc05lc3RhYmxlKCkpIHtcbiAgICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJtdXN0IGJlIGEgbmVzdGFibGUgcXVlcnksIGUuZy4gU0VMRUNUXCIpO1xuICAgICAgfTtcblxuICAgICAgQmFzZUJ1aWxkZXIucHJvdG90eXBlLl9zYW5pdGl6ZVRhYmxlID0gZnVuY3Rpb24oaXRlbSwgYWxsb3dOZXN0ZWQpIHtcbiAgICAgICAgdmFyIGUsIHNhbml0aXplZDtcbiAgICAgICAgaWYgKGFsbG93TmVzdGVkID09IG51bGwpIHtcbiAgICAgICAgICBhbGxvd05lc3RlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhbGxvd05lc3RlZCkge1xuICAgICAgICAgIGlmIChcInN0cmluZ1wiID09PSB0eXBlb2YgaXRlbSkge1xuICAgICAgICAgICAgc2FuaXRpemVkID0gaXRlbTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgc2FuaXRpemVkID0gdGhpcy5fc2FuaXRpemVOZXN0YWJsZVF1ZXJ5KGl0ZW0pO1xuICAgICAgICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7XG4gICAgICAgICAgICAgIGUgPSBfZXJyb3I7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRhYmxlIG5hbWUgbXVzdCBiZSBhIHN0cmluZyBvciBhIG5lc3RhYmxlIHF1ZXJ5IGluc3RhbmNlXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzYW5pdGl6ZWQgPSB0aGlzLl9zYW5pdGl6ZU5hbWUoaXRlbSwgJ3RhYmxlIG5hbWUnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmF1dG9RdW90ZVRhYmxlTmFtZXMpIHtcbiAgICAgICAgICByZXR1cm4gXCJcIiArIHRoaXMub3B0aW9ucy5uYW1lUXVvdGVDaGFyYWN0ZXIgKyBzYW5pdGl6ZWQgKyB0aGlzLm9wdGlvbnMubmFtZVF1b3RlQ2hhcmFjdGVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBzYW5pdGl6ZWQ7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIEJhc2VCdWlsZGVyLnByb3RvdHlwZS5fc2FuaXRpemVUYWJsZUFsaWFzID0gZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICB2YXIgc2FuaXRpemVkO1xuICAgICAgICBzYW5pdGl6ZWQgPSB0aGlzLl9zYW5pdGl6ZU5hbWUoaXRlbSwgXCJ0YWJsZSBhbGlhc1wiKTtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hdXRvUXVvdGVBbGlhc05hbWVzKSB7XG4gICAgICAgICAgcmV0dXJuIFwiXCIgKyB0aGlzLm9wdGlvbnMudGFibGVBbGlhc1F1b3RlQ2hhcmFjdGVyICsgc2FuaXRpemVkICsgdGhpcy5vcHRpb25zLnRhYmxlQWxpYXNRdW90ZUNoYXJhY3RlcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gc2FuaXRpemVkO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBCYXNlQnVpbGRlci5wcm90b3R5cGUuX3Nhbml0aXplRmllbGRBbGlhcyA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgdmFyIHNhbml0aXplZDtcbiAgICAgICAgc2FuaXRpemVkID0gdGhpcy5fc2FuaXRpemVOYW1lKGl0ZW0sIFwiZmllbGQgYWxpYXNcIik7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYXV0b1F1b3RlQWxpYXNOYW1lcykge1xuICAgICAgICAgIHJldHVybiBcIlwiICsgdGhpcy5vcHRpb25zLmZpZWxkQWxpYXNRdW90ZUNoYXJhY3RlciArIHNhbml0aXplZCArIHRoaXMub3B0aW9ucy5maWVsZEFsaWFzUXVvdGVDaGFyYWN0ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHNhbml0aXplZDtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgQmFzZUJ1aWxkZXIucHJvdG90eXBlLl9zYW5pdGl6ZUxpbWl0T2Zmc2V0ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgdmFsdWUgPSBwYXJzZUludCh2YWx1ZSk7XG4gICAgICAgIGlmICgwID4gdmFsdWUgfHwgaXNOYU4odmFsdWUpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibGltaXQvb2Zmc2V0IG11c3QgYmUgPj0gMFwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9O1xuXG4gICAgICBCYXNlQnVpbGRlci5wcm90b3R5cGUuX3Nhbml0aXplVmFsdWUgPSBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIHZhciBpdGVtVHlwZSwgdHlwZUlzVmFsaWQ7XG4gICAgICAgIGl0ZW1UeXBlID0gdHlwZW9mIGl0ZW07XG4gICAgICAgIGlmIChudWxsID09PSBpdGVtKSB7XG5cbiAgICAgICAgfSBlbHNlIGlmIChcInN0cmluZ1wiID09PSBpdGVtVHlwZSB8fCBcIm51bWJlclwiID09PSBpdGVtVHlwZSB8fCBcImJvb2xlYW5cIiA9PT0gaXRlbVR5cGUpIHtcblxuICAgICAgICB9IGVsc2UgaWYgKGl0ZW0gaW5zdGFuY2VvZiBjbHMuUXVlcnlCdWlsZGVyICYmIGl0ZW0uaXNOZXN0YWJsZSgpKSB7XG5cbiAgICAgICAgfSBlbHNlIGlmIChpdGVtIGluc3RhbmNlb2YgY2xzLkZ1bmN0aW9uQmxvY2spIHtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHR5cGVJc1ZhbGlkID0gdm9pZCAwICE9PSBnZXRWYWx1ZUhhbmRsZXIoaXRlbSwgdGhpcy5vcHRpb25zLnZhbHVlSGFuZGxlcnMsIGNscy5nbG9iYWxWYWx1ZUhhbmRsZXJzKTtcbiAgICAgICAgICBpZiAoIXR5cGVJc1ZhbGlkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJmaWVsZCB2YWx1ZSBtdXN0IGJlIGEgc3RyaW5nLCBudW1iZXIsIGJvb2xlYW4sIG51bGwgb3Igb25lIG9mIHRoZSByZWdpc3RlcmVkIGN1c3RvbSB2YWx1ZSB0eXBlc1wiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICB9O1xuXG4gICAgICBCYXNlQnVpbGRlci5wcm90b3R5cGUuX2VzY2FwZVZhbHVlID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgaWYgKHRydWUgIT09IHRoaXMub3B0aW9ucy5yZXBsYWNlU2luZ2xlUXVvdGVzKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZS5yZXBsYWNlKC9cXCcvZywgdGhpcy5vcHRpb25zLnNpbmdsZVF1b3RlUmVwbGFjZW1lbnQpO1xuICAgICAgfTtcblxuICAgICAgQmFzZUJ1aWxkZXIucHJvdG90eXBlLl9mb3JtYXRDdXN0b21WYWx1ZSA9IGZ1bmN0aW9uKHZhbHVlLCBhc1BhcmFtKSB7XG4gICAgICAgIHZhciBjdXN0b21IYW5kbGVyO1xuICAgICAgICBpZiAoYXNQYXJhbSA9PSBudWxsKSB7XG4gICAgICAgICAgYXNQYXJhbSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGN1c3RvbUhhbmRsZXIgPSBnZXRWYWx1ZUhhbmRsZXIodmFsdWUsIHRoaXMub3B0aW9ucy52YWx1ZUhhbmRsZXJzLCBjbHMuZ2xvYmFsVmFsdWVIYW5kbGVycyk7XG4gICAgICAgIGlmIChjdXN0b21IYW5kbGVyKSB7XG4gICAgICAgICAgdmFsdWUgPSBjdXN0b21IYW5kbGVyKHZhbHVlLCBhc1BhcmFtKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9O1xuXG4gICAgICBCYXNlQnVpbGRlci5wcm90b3R5cGUuX2Zvcm1hdFZhbHVlQXNQYXJhbSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHZhciBwLFxuICAgICAgICAgIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlLm1hcChmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMuX2Zvcm1hdFZhbHVlQXNQYXJhbSh2KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBjbHMuUXVlcnlCdWlsZGVyICYmIHZhbHVlLmlzTmVzdGFibGUoKSkge1xuICAgICAgICAgICAgdmFsdWUudXBkYXRlT3B0aW9ucyh7XG4gICAgICAgICAgICAgIFwibmVzdGVkQnVpbGRlclwiOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwID0gdmFsdWUudG9QYXJhbSgpO1xuICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWUgaW5zdGFuY2VvZiBjbHMuRXhwcmVzc2lvbikge1xuICAgICAgICAgICAgcmV0dXJuIHAgPSB2YWx1ZS50b1BhcmFtKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mb3JtYXRDdXN0b21WYWx1ZSh2YWx1ZSwgdHJ1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBCYXNlQnVpbGRlci5wcm90b3R5cGUuX2Zvcm1hdFZhbHVlID0gZnVuY3Rpb24odmFsdWUsIGZvcm1hdHRpbmdPcHRpb25zKSB7XG4gICAgICAgIHZhciBjdXN0b21Gb3JtYXR0ZWRWYWx1ZSwgZXNjYXBlZFZhbHVlLFxuICAgICAgICAgIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKGZvcm1hdHRpbmdPcHRpb25zID09IG51bGwpIHtcbiAgICAgICAgICBmb3JtYXR0aW5nT3B0aW9ucyA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGN1c3RvbUZvcm1hdHRlZFZhbHVlID0gdGhpcy5fZm9ybWF0Q3VzdG9tVmFsdWUodmFsdWUpO1xuICAgICAgICBpZiAoY3VzdG9tRm9ybWF0dGVkVmFsdWUgIT09IHZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuIFwiKFwiICsgY3VzdG9tRm9ybWF0dGVkVmFsdWUgKyBcIilcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICB2YWx1ZSA9IHZhbHVlLm1hcChmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMuX2Zvcm1hdFZhbHVlKHYpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHZhbHVlID0gXCIoXCIgKyAodmFsdWUuam9pbignLCAnKSkgKyBcIilcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAobnVsbCA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgIHZhbHVlID0gXCJOVUxMXCI7XG4gICAgICAgICAgfSBlbHNlIGlmIChcImJvb2xlYW5cIiA9PT0gdHlwZW9mIHZhbHVlKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlID8gXCJUUlVFXCIgOiBcIkZBTFNFXCI7XG4gICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSBpbnN0YW5jZW9mIGNscy5RdWVyeUJ1aWxkZXIpIHtcbiAgICAgICAgICAgIHZhbHVlID0gXCIoXCIgKyB2YWx1ZSArIFwiKVwiO1xuICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWUgaW5zdGFuY2VvZiBjbHMuRXhwcmVzc2lvbikge1xuICAgICAgICAgICAgdmFsdWUgPSBcIihcIiArIHZhbHVlICsgXCIpXCI7XG4gICAgICAgICAgfSBlbHNlIGlmIChcIm51bWJlclwiICE9PSB0eXBlb2YgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmIChmb3JtYXR0aW5nT3B0aW9ucy5kb250UXVvdGUpIHtcbiAgICAgICAgICAgICAgdmFsdWUgPSBcIlwiICsgdmFsdWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBlc2NhcGVkVmFsdWUgPSB0aGlzLl9lc2NhcGVWYWx1ZSh2YWx1ZSk7XG4gICAgICAgICAgICAgIHZhbHVlID0gXCInXCIgKyBlc2NhcGVkVmFsdWUgKyBcIidcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIEJhc2VCdWlsZGVyO1xuXG4gICAgfSkoY2xzLkNsb25lYWJsZSk7XG4gICAgY2xzLkV4cHJlc3Npb24gPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gICAgICBfX2V4dGVuZHMoRXhwcmVzc2lvbiwgX3N1cGVyKTtcblxuICAgICAgRXhwcmVzc2lvbi5wcm90b3R5cGUudHJlZSA9IG51bGw7XG5cbiAgICAgIEV4cHJlc3Npb24ucHJvdG90eXBlLmN1cnJlbnQgPSBudWxsO1xuXG4gICAgICBmdW5jdGlvbiBFeHByZXNzaW9uKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBFeHByZXNzaW9uLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMpO1xuICAgICAgICB0aGlzLnRyZWUgPSB7XG4gICAgICAgICAgcGFyZW50OiBudWxsLFxuICAgICAgICAgIG5vZGVzOiBbXVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSB0aGlzLnRyZWU7XG4gICAgICAgIHRoaXMuX2JlZ2luID0gZnVuY3Rpb24ob3ApIHtcbiAgICAgICAgICB2YXIgbmV3X3RyZWU7XG4gICAgICAgICAgbmV3X3RyZWUgPSB7XG4gICAgICAgICAgICB0eXBlOiBvcCxcbiAgICAgICAgICAgIHBhcmVudDogX3RoaXMuY3VycmVudCxcbiAgICAgICAgICAgIG5vZGVzOiBbXVxuICAgICAgICAgIH07XG4gICAgICAgICAgX3RoaXMuY3VycmVudC5ub2Rlcy5wdXNoKG5ld190cmVlKTtcbiAgICAgICAgICBfdGhpcy5jdXJyZW50ID0gX3RoaXMuY3VycmVudC5ub2Rlc1tfdGhpcy5jdXJyZW50Lm5vZGVzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgIHJldHVybiBfdGhpcztcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgRXhwcmVzc2lvbi5wcm90b3R5cGUuYW5kX2JlZ2luID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9iZWdpbignQU5EJyk7XG4gICAgICB9O1xuXG4gICAgICBFeHByZXNzaW9uLnByb3RvdHlwZS5vcl9iZWdpbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYmVnaW4oJ09SJyk7XG4gICAgICB9O1xuXG4gICAgICBFeHByZXNzaW9uLnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCF0aGlzLmN1cnJlbnQucGFyZW50KSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiYmVnaW4oKSBuZWVkcyB0byBiZSBjYWxsZWRcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdXJyZW50ID0gdGhpcy5jdXJyZW50LnBhcmVudDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9O1xuXG4gICAgICBFeHByZXNzaW9uLnByb3RvdHlwZS5hbmQgPSBmdW5jdGlvbihleHByLCBwYXJhbSkge1xuICAgICAgICBpZiAoIWV4cHIgfHwgXCJzdHJpbmdcIiAhPT0gdHlwZW9mIGV4cHIpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJleHByIG11c3QgYmUgYSBzdHJpbmdcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdXJyZW50Lm5vZGVzLnB1c2goe1xuICAgICAgICAgIHR5cGU6ICdBTkQnLFxuICAgICAgICAgIGV4cHI6IGV4cHIsXG4gICAgICAgICAgcGFyYTogcGFyYW1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfTtcblxuICAgICAgRXhwcmVzc2lvbi5wcm90b3R5cGUub3IgPSBmdW5jdGlvbihleHByLCBwYXJhbSkge1xuICAgICAgICBpZiAoIWV4cHIgfHwgXCJzdHJpbmdcIiAhPT0gdHlwZW9mIGV4cHIpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJleHByIG11c3QgYmUgYSBzdHJpbmdcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdXJyZW50Lm5vZGVzLnB1c2goe1xuICAgICAgICAgIHR5cGU6ICdPUicsXG4gICAgICAgICAgZXhwcjogZXhwcixcbiAgICAgICAgICBwYXJhOiBwYXJhbVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9O1xuXG4gICAgICBFeHByZXNzaW9uLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAobnVsbCAhPT0gdGhpcy5jdXJyZW50LnBhcmVudCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImVuZCgpIG5lZWRzIHRvIGJlIGNhbGxlZFwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fdG9TdHJpbmcodGhpcy50cmVlKTtcbiAgICAgIH07XG5cbiAgICAgIEV4cHJlc3Npb24ucHJvdG90eXBlLnRvUGFyYW0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKG51bGwgIT09IHRoaXMuY3VycmVudC5wYXJlbnQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJlbmQoKSBuZWVkcyB0byBiZSBjYWxsZWRcIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX3RvU3RyaW5nKHRoaXMudHJlZSwgdHJ1ZSk7XG4gICAgICB9O1xuXG4gICAgICBFeHByZXNzaW9uLnByb3RvdHlwZS5fdG9TdHJpbmcgPSBmdW5jdGlvbihub2RlLCBwYXJhbU1vZGUpIHtcbiAgICAgICAgdmFyIGNoaWxkLCBjdiwgaW5TdHIsIG5vZGVTdHIsIHBhcmFtcywgc3RyLCBfaSwgX2xlbiwgX3JlZjtcbiAgICAgICAgaWYgKHBhcmFtTW9kZSA9PSBudWxsKSB7XG4gICAgICAgICAgcGFyYW1Nb2RlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgc3RyID0gXCJcIjtcbiAgICAgICAgcGFyYW1zID0gW107XG4gICAgICAgIF9yZWYgPSBub2RlLm5vZGVzO1xuICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICBjaGlsZCA9IF9yZWZbX2ldO1xuICAgICAgICAgIGlmIChjaGlsZC5leHByICE9IG51bGwpIHtcbiAgICAgICAgICAgIG5vZGVTdHIgPSBjaGlsZC5leHByO1xuICAgICAgICAgICAgaWYgKHZvaWQgMCAhPT0gY2hpbGQucGFyYSkge1xuICAgICAgICAgICAgICBpZiAoIXBhcmFtTW9kZSkge1xuICAgICAgICAgICAgICAgIG5vZGVTdHIgPSBub2RlU3RyLnJlcGxhY2UoJz8nLCB0aGlzLl9mb3JtYXRWYWx1ZShjaGlsZC5wYXJhKSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY3YgPSB0aGlzLl9mb3JtYXRWYWx1ZUFzUGFyYW0oY2hpbGQucGFyYSk7XG4gICAgICAgICAgICAgICAgaWYgKCgoY3YgIT0gbnVsbCA/IGN2LnRleHQgOiB2b2lkIDApICE9IG51bGwpKSB7XG4gICAgICAgICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMuY29uY2F0KGN2LnZhbHVlcyk7XG4gICAgICAgICAgICAgICAgICBub2RlU3RyID0gbm9kZVN0ci5yZXBsYWNlKCc/JywgXCIoXCIgKyBjdi50ZXh0ICsgXCIpXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMuY29uY2F0KGN2KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY2hpbGQucGFyYSkpIHtcbiAgICAgICAgICAgICAgICAgIGluU3RyID0gQXJyYXkuYXBwbHkobnVsbCwgbmV3IEFycmF5KGNoaWxkLnBhcmEubGVuZ3RoKSkubWFwKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJz8nO1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICBub2RlU3RyID0gbm9kZVN0ci5yZXBsYWNlKCc/JywgXCIoXCIgKyAoaW5TdHIuam9pbignLCAnKSkgKyBcIilcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vZGVTdHIgPSB0aGlzLl90b1N0cmluZyhjaGlsZCwgcGFyYW1Nb2RlKTtcbiAgICAgICAgICAgIGlmIChwYXJhbU1vZGUpIHtcbiAgICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zLmNvbmNhdChub2RlU3RyLnZhbHVlcyk7XG4gICAgICAgICAgICAgIG5vZGVTdHIgPSBub2RlU3RyLnRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoXCJcIiAhPT0gbm9kZVN0cikge1xuICAgICAgICAgICAgICBub2RlU3RyID0gXCIoXCIgKyBub2RlU3RyICsgXCIpXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChcIlwiICE9PSBub2RlU3RyKSB7XG4gICAgICAgICAgICBpZiAoXCJcIiAhPT0gc3RyKSB7XG4gICAgICAgICAgICAgIHN0ciArPSBcIiBcIiArIGNoaWxkLnR5cGUgKyBcIiBcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0ciArPSBub2RlU3RyO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocGFyYW1Nb2RlKSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRleHQ6IHN0cixcbiAgICAgICAgICAgIHZhbHVlczogcGFyYW1zXG4gICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICAvKlxuICAgICAgQ2xvbmUgdGhpcyBleHByZXNzaW9uLlxuICAgICAgXG4gICAgICBOb3RlIHRoYXQgdGhlIGFsZ29yaXRobSBjb250YWluZWQgd2l0aGluIHRoaXMgbWV0aG9kIGlzIHByb2JhYmx5IG5vbi1vcHRpbWFsLCBzbyBwbGVhc2UgYXZvaWQgY2xvbmluZyBsYXJnZVxuICAgICAgZXhwcmVzc2lvbiB0cmVlcy5cbiAgICAgICovXG5cblxuICAgICAgRXhwcmVzc2lvbi5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG5ld0luc3RhbmNlLCBfY2xvbmVUcmVlO1xuICAgICAgICBuZXdJbnN0YW5jZSA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yO1xuICAgICAgICAoX2Nsb25lVHJlZSA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICB2YXIgY2hpbGQsIF9pLCBfbGVuLCBfcmVmLCBfcmVzdWx0cztcbiAgICAgICAgICBfcmVmID0gbm9kZS5ub2RlcztcbiAgICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgICAgY2hpbGQgPSBfcmVmW19pXTtcbiAgICAgICAgICAgIGlmIChjaGlsZC5leHByICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgX3Jlc3VsdHMucHVzaChuZXdJbnN0YW5jZS5jdXJyZW50Lm5vZGVzLnB1c2goSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShjaGlsZCkpKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBuZXdJbnN0YW5jZS5fYmVnaW4oY2hpbGQudHlwZSk7XG4gICAgICAgICAgICAgIF9jbG9uZVRyZWUoY2hpbGQpO1xuICAgICAgICAgICAgICBpZiAoIXRoaXMuY3VycmVudCA9PT0gY2hpbGQpIHtcbiAgICAgICAgICAgICAgICBfcmVzdWx0cy5wdXNoKG5ld0luc3RhbmNlLmVuZCgpKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfcmVzdWx0cy5wdXNoKHZvaWQgMCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgICB9KSh0aGlzLnRyZWUpO1xuICAgICAgICByZXR1cm4gbmV3SW5zdGFuY2U7XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gRXhwcmVzc2lvbjtcblxuICAgIH0pKGNscy5CYXNlQnVpbGRlcik7XG4gICAgY2xzLkJsb2NrID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICAgICAgX19leHRlbmRzKEJsb2NrLCBfc3VwZXIpO1xuXG4gICAgICBmdW5jdGlvbiBCbG9jaygpIHtcbiAgICAgICAgX3JlZiA9IEJsb2NrLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gX3JlZjtcbiAgICAgIH1cblxuICAgICAgQmxvY2sucHJvdG90eXBlLmV4cG9zZWRNZXRob2RzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhdHRyLCByZXQsIHZhbHVlO1xuICAgICAgICByZXQgPSB7fTtcbiAgICAgICAgZm9yIChhdHRyIGluIHRoaXMpIHtcbiAgICAgICAgICB2YWx1ZSA9IHRoaXNbYXR0cl07XG4gICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiICYmIGF0dHIuY2hhckF0KDApICE9PSAnXycgJiYgIWNscy5CbG9jay5wcm90b3R5cGVbYXR0cl0pIHtcbiAgICAgICAgICAgIHJldFthdHRyXSA9IHZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgfTtcblxuICAgICAgQmxvY2sucHJvdG90eXBlLmJ1aWxkU3RyID0gZnVuY3Rpb24ocXVlcnlCdWlsZGVyKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIH07XG5cbiAgICAgIEJsb2NrLnByb3RvdHlwZS5idWlsZFBhcmFtID0gZnVuY3Rpb24ocXVlcnlCdWlsZGVyKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdGV4dDogdGhpcy5idWlsZFN0cihxdWVyeUJ1aWxkZXIpLFxuICAgICAgICAgIHZhbHVlczogW11cbiAgICAgICAgfTtcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBCbG9jaztcblxuICAgIH0pKGNscy5CYXNlQnVpbGRlcik7XG4gICAgY2xzLlN0cmluZ0Jsb2NrID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICAgICAgX19leHRlbmRzKFN0cmluZ0Jsb2NrLCBfc3VwZXIpO1xuXG4gICAgICBmdW5jdGlvbiBTdHJpbmdCbG9jayhvcHRpb25zLCBzdHIpIHtcbiAgICAgICAgU3RyaW5nQmxvY2suX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgb3B0aW9ucyk7XG4gICAgICAgIHRoaXMuc3RyID0gc3RyO1xuICAgICAgfVxuXG4gICAgICBTdHJpbmdCbG9jay5wcm90b3R5cGUuYnVpbGRTdHIgPSBmdW5jdGlvbihxdWVyeUJ1aWxkZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RyO1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIFN0cmluZ0Jsb2NrO1xuXG4gICAgfSkoY2xzLkJsb2NrKTtcbiAgICBjbHMuQWJzdHJhY3RWYWx1ZUJsb2NrID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICAgICAgX19leHRlbmRzKEFic3RyYWN0VmFsdWVCbG9jaywgX3N1cGVyKTtcblxuICAgICAgZnVuY3Rpb24gQWJzdHJhY3RWYWx1ZUJsb2NrKG9wdGlvbnMpIHtcbiAgICAgICAgQWJzdHJhY3RWYWx1ZUJsb2NrLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLl9zdHIgPSAnJztcbiAgICAgICAgdGhpcy5fdmFsdWVzID0gW107XG4gICAgICB9XG5cbiAgICAgIEFic3RyYWN0VmFsdWVCbG9jay5wcm90b3R5cGUuX3NldFZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzdHIsIHZhbHVlcztcbiAgICAgICAgc3RyID0gYXJndW1lbnRzWzBdLCB2YWx1ZXMgPSAyIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBfX3NsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSA6IFtdO1xuICAgICAgICB0aGlzLl9zdHIgPSBzdHI7XG4gICAgICAgIHRoaXMuX3ZhbHVlcyA9IHZhbHVlcztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9O1xuXG4gICAgICBBYnN0cmFjdFZhbHVlQmxvY2sucHJvdG90eXBlLmJ1aWxkU3RyID0gZnVuY3Rpb24ocXVlcnlCdWlsZGVyKSB7XG4gICAgICAgIHZhciBjLCBmaW5hbFN0ciwgaWR4LCBzdHIsIHZhbHVlcywgX2ksIF9yZWYxO1xuICAgICAgICBzdHIgPSB0aGlzLl9zdHI7XG4gICAgICAgIGZpbmFsU3RyID0gJyc7XG4gICAgICAgIHZhbHVlcyA9IFtdLmNvbmNhdCh0aGlzLl92YWx1ZXMpO1xuICAgICAgICBmb3IgKGlkeCA9IF9pID0gMCwgX3JlZjEgPSBzdHIubGVuZ3RoOyAwIDw9IF9yZWYxID8gX2kgPCBfcmVmMSA6IF9pID4gX3JlZjE7IGlkeCA9IDAgPD0gX3JlZjEgPyArK19pIDogLS1faSkge1xuICAgICAgICAgIGMgPSBzdHIuY2hhckF0KGlkeCk7XG4gICAgICAgICAgaWYgKCc/JyA9PT0gYyAmJiAwIDwgdmFsdWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgYyA9IHZhbHVlcy5zaGlmdCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBmaW5hbFN0ciArPSBjO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmaW5hbFN0cjtcbiAgICAgIH07XG5cbiAgICAgIEFic3RyYWN0VmFsdWVCbG9jay5wcm90b3R5cGUuYnVpbGRQYXJhbSA9IGZ1bmN0aW9uKHF1ZXJ5QnVpbGRlcikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHRleHQ6IHRoaXMuX3N0cixcbiAgICAgICAgICB2YWx1ZXM6IHRoaXMuX3ZhbHVlc1xuICAgICAgICB9O1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIEFic3RyYWN0VmFsdWVCbG9jaztcblxuICAgIH0pKGNscy5CbG9jayk7XG4gICAgY2xzLkZ1bmN0aW9uQmxvY2sgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gICAgICBfX2V4dGVuZHMoRnVuY3Rpb25CbG9jaywgX3N1cGVyKTtcblxuICAgICAgZnVuY3Rpb24gRnVuY3Rpb25CbG9jaygpIHtcbiAgICAgICAgX3JlZjEgPSBGdW5jdGlvbkJsb2NrLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gX3JlZjE7XG4gICAgICB9XG5cbiAgICAgIEZ1bmN0aW9uQmxvY2sucHJvdG90eXBlW1wiZnVuY3Rpb25cIl0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHN0ciwgdmFsdWVzO1xuICAgICAgICBzdHIgPSBhcmd1bWVudHNbMF0sIHZhbHVlcyA9IDIgPD0gYXJndW1lbnRzLmxlbmd0aCA/IF9fc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpIDogW107XG4gICAgICAgIHJldHVybiB0aGlzLl9zZXRWYWx1ZS5hcHBseSh0aGlzLCBbc3RyXS5jb25jYXQodmFsdWVzKSk7XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gRnVuY3Rpb25CbG9jaztcblxuICAgIH0pKGNscy5BYnN0cmFjdFZhbHVlQmxvY2spO1xuICAgIGNscy5mdmFsID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaW5zdCwgc3RyLCB2YWx1ZXM7XG4gICAgICBzdHIgPSBhcmd1bWVudHNbMF0sIHZhbHVlcyA9IDIgPD0gYXJndW1lbnRzLmxlbmd0aCA/IF9fc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpIDogW107XG4gICAgICBpbnN0ID0gbmV3IGNscy5GdW5jdGlvbkJsb2NrKCk7XG4gICAgICByZXR1cm4gaW5zdFtcImZ1bmN0aW9uXCJdLmFwcGx5KGluc3QsIFtzdHJdLmNvbmNhdCh2YWx1ZXMpKTtcbiAgICB9O1xuICAgIGNscy5yZWdpc3RlclZhbHVlSGFuZGxlcihjbHMuRnVuY3Rpb25CbG9jaywgZnVuY3Rpb24odmFsdWUsIGFzUGFyYW0pIHtcbiAgICAgIGlmIChhc1BhcmFtID09IG51bGwpIHtcbiAgICAgICAgYXNQYXJhbSA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKGFzUGFyYW0pIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlLmJ1aWxkUGFyYW0oKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB2YWx1ZS5idWlsZFN0cigpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGNscy5BYnN0cmFjdFRhYmxlQmxvY2sgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gICAgICBfX2V4dGVuZHMoQWJzdHJhY3RUYWJsZUJsb2NrLCBfc3VwZXIpO1xuXG4gICAgICBmdW5jdGlvbiBBYnN0cmFjdFRhYmxlQmxvY2sob3B0aW9ucykge1xuICAgICAgICBBYnN0cmFjdFRhYmxlQmxvY2suX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgb3B0aW9ucyk7XG4gICAgICAgIHRoaXMudGFibGVzID0gW107XG4gICAgICB9XG5cbiAgICAgIEFic3RyYWN0VGFibGVCbG9jay5wcm90b3R5cGUuX3RhYmxlID0gZnVuY3Rpb24odGFibGUsIGFsaWFzKSB7XG4gICAgICAgIGlmIChhbGlhcyA9PSBudWxsKSB7XG4gICAgICAgICAgYWxpYXMgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhbGlhcykge1xuICAgICAgICAgIGFsaWFzID0gdGhpcy5fc2FuaXRpemVUYWJsZUFsaWFzKGFsaWFzKTtcbiAgICAgICAgfVxuICAgICAgICB0YWJsZSA9IHRoaXMuX3Nhbml0aXplVGFibGUodGFibGUsIHRoaXMub3B0aW9ucy5hbGxvd05lc3RlZCB8fCBmYWxzZSk7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2luZ2xlVGFibGUpIHtcbiAgICAgICAgICB0aGlzLnRhYmxlcyA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnRhYmxlcy5wdXNoKHtcbiAgICAgICAgICB0YWJsZTogdGFibGUsXG4gICAgICAgICAgYWxpYXM6IGFsaWFzXG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgQWJzdHJhY3RUYWJsZUJsb2NrLnByb3RvdHlwZS5faGFzVGFibGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIDAgPCB0aGlzLnRhYmxlcy5sZW5ndGg7XG4gICAgICB9O1xuXG4gICAgICBBYnN0cmFjdFRhYmxlQmxvY2sucHJvdG90eXBlLmJ1aWxkU3RyID0gZnVuY3Rpb24ocXVlcnlCdWlsZGVyKSB7XG4gICAgICAgIHZhciB0YWJsZSwgdGFibGVzLCBfaSwgX2xlbiwgX3JlZjI7XG4gICAgICAgIGlmICghdGhpcy5faGFzVGFibGUoKSkge1xuICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIHRhYmxlcyA9IFwiXCI7XG4gICAgICAgIF9yZWYyID0gdGhpcy50YWJsZXM7XG4gICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjIubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICB0YWJsZSA9IF9yZWYyW19pXTtcbiAgICAgICAgICBpZiAoXCJcIiAhPT0gdGFibGVzKSB7XG4gICAgICAgICAgICB0YWJsZXMgKz0gXCIsIFwiO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoXCJzdHJpbmdcIiA9PT0gdHlwZW9mIHRhYmxlLnRhYmxlKSB7XG4gICAgICAgICAgICB0YWJsZXMgKz0gdGFibGUudGFibGU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRhYmxlcyArPSBcIihcIiArIHRhYmxlLnRhYmxlICsgXCIpXCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0YWJsZS5hbGlhcykge1xuICAgICAgICAgICAgdGFibGVzICs9IFwiIFwiICsgdGFibGUuYWxpYXM7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0YWJsZXM7XG4gICAgICB9O1xuXG4gICAgICBBYnN0cmFjdFRhYmxlQmxvY2sucHJvdG90eXBlLl9idWlsZFBhcmFtID0gZnVuY3Rpb24ocXVlcnlCdWlsZGVyLCBwcmVmaXgpIHtcbiAgICAgICAgdmFyIGJsaywgcCwgcGFyYW1TdHIsIHBhcmFtcywgcmV0LCB2LCBfaSwgX2osIF9rLCBfbGVuLCBfbGVuMSwgX2xlbjIsIF9yZWYyLCBfcmVmMztcbiAgICAgICAgaWYgKHByZWZpeCA9PSBudWxsKSB7XG4gICAgICAgICAgcHJlZml4ID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXQgPSB7XG4gICAgICAgICAgdGV4dDogXCJcIixcbiAgICAgICAgICB2YWx1ZXM6IFtdXG4gICAgICAgIH07XG4gICAgICAgIHBhcmFtcyA9IFtdO1xuICAgICAgICBwYXJhbVN0ciA9IFwiXCI7XG4gICAgICAgIGlmICghdGhpcy5faGFzVGFibGUoKSkge1xuICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH1cbiAgICAgICAgX3JlZjIgPSB0aGlzLnRhYmxlcztcbiAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmMi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgIGJsayA9IF9yZWYyW19pXTtcbiAgICAgICAgICBpZiAoXCJzdHJpbmdcIiA9PT0gdHlwZW9mIGJsay50YWJsZSkge1xuICAgICAgICAgICAgcCA9IHtcbiAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiXCIgKyBibGsudGFibGUsXG4gICAgICAgICAgICAgIFwidmFsdWVzXCI6IFtdXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0gZWxzZSBpZiAoYmxrLnRhYmxlIGluc3RhbmNlb2YgY2xzLlF1ZXJ5QnVpbGRlcikge1xuICAgICAgICAgICAgYmxrLnRhYmxlLnVwZGF0ZU9wdGlvbnMoe1xuICAgICAgICAgICAgICBcIm5lc3RlZEJ1aWxkZXJcIjogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBwID0gYmxrLnRhYmxlLnRvUGFyYW0oKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYmxrLnVwZGF0ZU9wdGlvbnMoe1xuICAgICAgICAgICAgICBcIm5lc3RlZEJ1aWxkZXJcIjogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBwID0gYmxrLmJ1aWxkUGFyYW0ocXVlcnlCdWlsZGVyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcC50YWJsZSA9IGJsaztcbiAgICAgICAgICBwYXJhbXMucHVzaChwKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKF9qID0gMCwgX2xlbjEgPSBwYXJhbXMubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICAgICAgcCA9IHBhcmFtc1tfal07XG4gICAgICAgICAgaWYgKHBhcmFtU3RyICE9PSBcIlwiKSB7XG4gICAgICAgICAgICBwYXJhbVN0ciArPSBcIiwgXCI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICgocHJlZml4ICE9IG51bGwpICYmIHByZWZpeCAhPT0gXCJcIikge1xuICAgICAgICAgICAgICBwYXJhbVN0ciArPSBcIlwiICsgcHJlZml4ICsgXCIgXCIgKyBwYXJhbVN0cjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhcmFtU3RyO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoXCJzdHJpbmdcIiA9PT0gdHlwZW9mIHAudGFibGUudGFibGUpIHtcbiAgICAgICAgICAgIHBhcmFtU3RyICs9IFwiXCIgKyBwLnRleHQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhcmFtU3RyICs9IFwiKFwiICsgcC50ZXh0ICsgXCIpXCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChwLnRhYmxlLmFsaWFzICE9IG51bGwpIHtcbiAgICAgICAgICAgIHBhcmFtU3RyICs9IFwiIFwiICsgcC50YWJsZS5hbGlhcztcbiAgICAgICAgICB9XG4gICAgICAgICAgX3JlZjMgPSBwLnZhbHVlcztcbiAgICAgICAgICBmb3IgKF9rID0gMCwgX2xlbjIgPSBfcmVmMy5sZW5ndGg7IF9rIDwgX2xlbjI7IF9rKyspIHtcbiAgICAgICAgICAgIHYgPSBfcmVmM1tfa107XG4gICAgICAgICAgICByZXQudmFsdWVzLnB1c2godGhpcy5fZm9ybWF0Q3VzdG9tVmFsdWUodikpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXQudGV4dCArPSBwYXJhbVN0cjtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgIH07XG5cbiAgICAgIEFic3RyYWN0VGFibGVCbG9jay5wcm90b3R5cGUuYnVpbGRQYXJhbSA9IGZ1bmN0aW9uKHF1ZXJ5QnVpbGRlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5fYnVpbGRQYXJhbShxdWVyeUJ1aWxkZXIpO1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIEFic3RyYWN0VGFibGVCbG9jaztcblxuICAgIH0pKGNscy5CbG9jayk7XG4gICAgY2xzLlVwZGF0ZVRhYmxlQmxvY2sgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gICAgICBfX2V4dGVuZHMoVXBkYXRlVGFibGVCbG9jaywgX3N1cGVyKTtcblxuICAgICAgZnVuY3Rpb24gVXBkYXRlVGFibGVCbG9jaygpIHtcbiAgICAgICAgX3JlZjIgPSBVcGRhdGVUYWJsZUJsb2NrLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gX3JlZjI7XG4gICAgICB9XG5cbiAgICAgIFVwZGF0ZVRhYmxlQmxvY2sucHJvdG90eXBlLnRhYmxlID0gZnVuY3Rpb24odGFibGUsIGFsaWFzKSB7XG4gICAgICAgIGlmIChhbGlhcyA9PSBudWxsKSB7XG4gICAgICAgICAgYWxpYXMgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl90YWJsZSh0YWJsZSwgYWxpYXMpO1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIFVwZGF0ZVRhYmxlQmxvY2s7XG5cbiAgICB9KShjbHMuQWJzdHJhY3RUYWJsZUJsb2NrKTtcbiAgICBjbHMuRnJvbVRhYmxlQmxvY2sgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gICAgICBfX2V4dGVuZHMoRnJvbVRhYmxlQmxvY2ssIF9zdXBlcik7XG5cbiAgICAgIGZ1bmN0aW9uIEZyb21UYWJsZUJsb2NrKCkge1xuICAgICAgICBfcmVmMyA9IEZyb21UYWJsZUJsb2NrLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gX3JlZjM7XG4gICAgICB9XG5cbiAgICAgIEZyb21UYWJsZUJsb2NrLnByb3RvdHlwZS5mcm9tID0gZnVuY3Rpb24odGFibGUsIGFsaWFzKSB7XG4gICAgICAgIGlmIChhbGlhcyA9PSBudWxsKSB7XG4gICAgICAgICAgYWxpYXMgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl90YWJsZSh0YWJsZSwgYWxpYXMpO1xuICAgICAgfTtcblxuICAgICAgRnJvbVRhYmxlQmxvY2sucHJvdG90eXBlLmJ1aWxkU3RyID0gZnVuY3Rpb24ocXVlcnlCdWlsZGVyKSB7XG4gICAgICAgIHZhciB0YWJsZXM7XG4gICAgICAgIHRhYmxlcyA9IEZyb21UYWJsZUJsb2NrLl9fc3VwZXJfXy5idWlsZFN0ci5jYWxsKHRoaXMsIHF1ZXJ5QnVpbGRlcik7XG4gICAgICAgIGlmICh0YWJsZXMubGVuZ3RoKSB7XG4gICAgICAgICAgcmV0dXJuIFwiRlJPTSBcIiArIHRhYmxlcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgRnJvbVRhYmxlQmxvY2sucHJvdG90eXBlLmJ1aWxkUGFyYW0gPSBmdW5jdGlvbihxdWVyeUJ1aWxkZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2J1aWxkUGFyYW0ocXVlcnlCdWlsZGVyLCBcIkZST01cIik7XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gRnJvbVRhYmxlQmxvY2s7XG5cbiAgICB9KShjbHMuQWJzdHJhY3RUYWJsZUJsb2NrKTtcbiAgICBjbHMuSW50b1RhYmxlQmxvY2sgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gICAgICBfX2V4dGVuZHMoSW50b1RhYmxlQmxvY2ssIF9zdXBlcik7XG5cbiAgICAgIGZ1bmN0aW9uIEludG9UYWJsZUJsb2NrKG9wdGlvbnMpIHtcbiAgICAgICAgSW50b1RhYmxlQmxvY2suX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgb3B0aW9ucyk7XG4gICAgICAgIHRoaXMudGFibGUgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBJbnRvVGFibGVCbG9jay5wcm90b3R5cGUuaW50byA9IGZ1bmN0aW9uKHRhYmxlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRhYmxlID0gdGhpcy5fc2FuaXRpemVUYWJsZSh0YWJsZSwgZmFsc2UpO1xuICAgICAgfTtcblxuICAgICAgSW50b1RhYmxlQmxvY2sucHJvdG90eXBlLmJ1aWxkU3RyID0gZnVuY3Rpb24ocXVlcnlCdWlsZGVyKSB7XG4gICAgICAgIGlmICghdGhpcy50YWJsZSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImludG8oKSBuZWVkcyB0byBiZSBjYWxsZWRcIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFwiSU5UTyBcIiArIHRoaXMudGFibGU7XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gSW50b1RhYmxlQmxvY2s7XG5cbiAgICB9KShjbHMuQmxvY2spO1xuICAgIGNscy5HZXRGaWVsZEJsb2NrID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICAgICAgX19leHRlbmRzKEdldEZpZWxkQmxvY2ssIF9zdXBlcik7XG5cbiAgICAgIGZ1bmN0aW9uIEdldEZpZWxkQmxvY2sob3B0aW9ucykge1xuICAgICAgICBHZXRGaWVsZEJsb2NrLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLl9maWVsZEFsaWFzZXMgPSB7fTtcbiAgICAgICAgdGhpcy5fZmllbGRzID0gW107XG4gICAgICB9XG5cbiAgICAgIEdldEZpZWxkQmxvY2sucHJvdG90eXBlLmZpZWxkcyA9IGZ1bmN0aW9uKF9maWVsZHMsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIGFsaWFzLCBmaWVsZCwgX2ksIF9sZW4sIF9yZXN1bHRzLCBfcmVzdWx0czE7XG4gICAgICAgIGlmIChvcHRpb25zID09IG51bGwpIHtcbiAgICAgICAgICBvcHRpb25zID0ge307XG4gICAgICAgIH1cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoX2ZpZWxkcykpIHtcbiAgICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX2ZpZWxkcy5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgICAgZmllbGQgPSBfZmllbGRzW19pXTtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2godGhpcy5maWVsZChmaWVsZCwgbnVsbCwgb3B0aW9ucykpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX3Jlc3VsdHMxID0gW107XG4gICAgICAgICAgZm9yIChmaWVsZCBpbiBfZmllbGRzKSB7XG4gICAgICAgICAgICBhbGlhcyA9IF9maWVsZHNbZmllbGRdO1xuICAgICAgICAgICAgX3Jlc3VsdHMxLnB1c2godGhpcy5maWVsZChmaWVsZCwgYWxpYXMsIG9wdGlvbnMpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIF9yZXN1bHRzMTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgR2V0RmllbGRCbG9jay5wcm90b3R5cGUuZmllbGQgPSBmdW5jdGlvbihmaWVsZCwgYWxpYXMsIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKGFsaWFzID09IG51bGwpIHtcbiAgICAgICAgICBhbGlhcyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMgPT0gbnVsbCkge1xuICAgICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBmaWVsZCA9IHRoaXMuX3Nhbml0aXplRmllbGQoZmllbGQsIG9wdGlvbnMpO1xuICAgICAgICBpZiAoYWxpYXMpIHtcbiAgICAgICAgICBhbGlhcyA9IHRoaXMuX3Nhbml0aXplRmllbGRBbGlhcyhhbGlhcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX2ZpZWxkQWxpYXNlc1tmaWVsZF0gPT09IGFsaWFzKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2ZpZWxkQWxpYXNlc1tmaWVsZF0gPSBhbGlhcztcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZpZWxkcy5wdXNoKHtcbiAgICAgICAgICBuYW1lOiBmaWVsZCxcbiAgICAgICAgICBhbGlhczogYWxpYXNcbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICBHZXRGaWVsZEJsb2NrLnByb3RvdHlwZS5idWlsZFN0ciA9IGZ1bmN0aW9uKHF1ZXJ5QnVpbGRlcikge1xuICAgICAgICB2YXIgZmllbGQsIGZpZWxkcywgX2ksIF9sZW4sIF9yZWY0O1xuICAgICAgICBpZiAoIXF1ZXJ5QnVpbGRlci5nZXRCbG9jayhjbHMuRnJvbVRhYmxlQmxvY2spLl9oYXNUYWJsZSgpKSB7XG4gICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgIH1cbiAgICAgICAgZmllbGRzID0gXCJcIjtcbiAgICAgICAgX3JlZjQgPSB0aGlzLl9maWVsZHM7XG4gICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjQubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICBmaWVsZCA9IF9yZWY0W19pXTtcbiAgICAgICAgICBpZiAoXCJcIiAhPT0gZmllbGRzKSB7XG4gICAgICAgICAgICBmaWVsZHMgKz0gXCIsIFwiO1xuICAgICAgICAgIH1cbiAgICAgICAgICBmaWVsZHMgKz0gZmllbGQubmFtZTtcbiAgICAgICAgICBpZiAoZmllbGQuYWxpYXMpIHtcbiAgICAgICAgICAgIGZpZWxkcyArPSBcIiBBUyBcIiArIGZpZWxkLmFsaWFzO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoXCJcIiA9PT0gZmllbGRzKSB7XG4gICAgICAgICAgcmV0dXJuIFwiKlwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmaWVsZHM7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBHZXRGaWVsZEJsb2NrO1xuXG4gICAgfSkoY2xzLkJsb2NrKTtcbiAgICBjbHMuQWJzdHJhY3RTZXRGaWVsZEJsb2NrID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICAgICAgX19leHRlbmRzKEFic3RyYWN0U2V0RmllbGRCbG9jaywgX3N1cGVyKTtcblxuICAgICAgZnVuY3Rpb24gQWJzdHJhY3RTZXRGaWVsZEJsb2NrKG9wdGlvbnMpIHtcbiAgICAgICAgQWJzdHJhY3RTZXRGaWVsZEJsb2NrLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLmZpZWxkT3B0aW9ucyA9IFtdO1xuICAgICAgICB0aGlzLmZpZWxkcyA9IFtdO1xuICAgICAgICB0aGlzLnZhbHVlcyA9IFtdO1xuICAgICAgfVxuXG4gICAgICBBYnN0cmFjdFNldEZpZWxkQmxvY2sucHJvdG90eXBlLl9zZXQgPSBmdW5jdGlvbihmaWVsZCwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIGluZGV4O1xuICAgICAgICBpZiAob3B0aW9ucyA9PSBudWxsKSB7XG4gICAgICAgICAgb3B0aW9ucyA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnZhbHVlcy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGNhbGwgc2V0IG9yIHNldEZpZWxkcyBvbiBtdWx0aXBsZSByb3dzIG9mIGZpZWxkcy5cIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZvaWQgMCAhPT0gdmFsdWUpIHtcbiAgICAgICAgICB2YWx1ZSA9IHRoaXMuX3Nhbml0aXplVmFsdWUodmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGluZGV4ID0gdGhpcy5maWVsZHMuaW5kZXhPZih0aGlzLl9zYW5pdGl6ZUZpZWxkKGZpZWxkLCBvcHRpb25zKSk7XG4gICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICB0aGlzLnZhbHVlc1swXVtpbmRleF0gPSB2YWx1ZTtcbiAgICAgICAgICB0aGlzLmZpZWxkT3B0aW9uc1swXVtpbmRleF0gPSBvcHRpb25zO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZmllbGRzLnB1c2godGhpcy5fc2FuaXRpemVGaWVsZChmaWVsZCwgb3B0aW9ucykpO1xuICAgICAgICAgIGluZGV4ID0gdGhpcy5maWVsZHMubGVuZ3RoIC0gMTtcbiAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLnZhbHVlc1swXSkpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWVzWzBdW2luZGV4XSA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5maWVsZE9wdGlvbnNbMF1baW5kZXhdID0gb3B0aW9ucztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy52YWx1ZXMucHVzaChbdmFsdWVdKTtcbiAgICAgICAgICAgIHRoaXMuZmllbGRPcHRpb25zLnB1c2goW29wdGlvbnNdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9O1xuXG4gICAgICBBYnN0cmFjdFNldEZpZWxkQmxvY2sucHJvdG90eXBlLl9zZXRGaWVsZHMgPSBmdW5jdGlvbihmaWVsZHMsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIGZpZWxkO1xuICAgICAgICBpZiAob3B0aW9ucyA9PSBudWxsKSB7XG4gICAgICAgICAgb3B0aW9ucyA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZmllbGRzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkV4cGVjdGVkIGFuIG9iamVjdCBidXQgZ290IFwiICsgdHlwZW9mIGZpZWxkcyk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChmaWVsZCBpbiBmaWVsZHMpIHtcbiAgICAgICAgICBpZiAoIV9faGFzUHJvcC5jYWxsKGZpZWxkcywgZmllbGQpKSBjb250aW51ZTtcbiAgICAgICAgICB0aGlzLl9zZXQoZmllbGQsIGZpZWxkc1tmaWVsZF0sIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfTtcblxuICAgICAgQWJzdHJhY3RTZXRGaWVsZEJsb2NrLnByb3RvdHlwZS5fc2V0RmllbGRzUm93cyA9IGZ1bmN0aW9uKGZpZWxkc1Jvd3MsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIGZpZWxkLCBpLCBpbmRleCwgdmFsdWUsIF9pLCBfcmVmNCwgX3JlZjU7XG4gICAgICAgIGlmIChvcHRpb25zID09IG51bGwpIHtcbiAgICAgICAgICBvcHRpb25zID0ge307XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGZpZWxkc1Jvd3MpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXhwZWN0ZWQgYW4gYXJyYXkgb2Ygb2JqZWN0cyBidXQgZ290IFwiICsgdHlwZW9mIGZpZWxkc1Jvd3MpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZmllbGRzID0gW107XG4gICAgICAgIHRoaXMudmFsdWVzID0gW107XG4gICAgICAgIGZvciAoaSA9IF9pID0gMCwgX3JlZjQgPSBmaWVsZHNSb3dzLmxlbmd0aDsgMCA8PSBfcmVmNCA/IF9pIDwgX3JlZjQgOiBfaSA+IF9yZWY0OyBpID0gMCA8PSBfcmVmNCA/ICsrX2kgOiAtLV9pKSB7XG4gICAgICAgICAgX3JlZjUgPSBmaWVsZHNSb3dzW2ldO1xuICAgICAgICAgIGZvciAoZmllbGQgaW4gX3JlZjUpIHtcbiAgICAgICAgICAgIGlmICghX19oYXNQcm9wLmNhbGwoX3JlZjUsIGZpZWxkKSkgY29udGludWU7XG4gICAgICAgICAgICBpbmRleCA9IHRoaXMuZmllbGRzLmluZGV4T2YodGhpcy5fc2FuaXRpemVGaWVsZChmaWVsZCwgb3B0aW9ucykpO1xuICAgICAgICAgICAgaWYgKDAgPCBpICYmIC0xID09PSBpbmRleCkge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FsbCBmaWVsZHMgaW4gc3Vic2VxdWVudCByb3dzIG11c3QgbWF0Y2ggdGhlIGZpZWxkcyBpbiB0aGUgZmlyc3Qgcm93Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoLTEgPT09IGluZGV4KSB7XG4gICAgICAgICAgICAgIHRoaXMuZmllbGRzLnB1c2godGhpcy5fc2FuaXRpemVGaWVsZChmaWVsZCwgb3B0aW9ucykpO1xuICAgICAgICAgICAgICBpbmRleCA9IHRoaXMuZmllbGRzLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YWx1ZSA9IHRoaXMuX3Nhbml0aXplVmFsdWUoZmllbGRzUm93c1tpXVtmaWVsZF0pO1xuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy52YWx1ZXNbaV0pKSB7XG4gICAgICAgICAgICAgIHRoaXMudmFsdWVzW2ldW2luZGV4XSA9IHZhbHVlO1xuICAgICAgICAgICAgICB0aGlzLmZpZWxkT3B0aW9uc1tpXVtpbmRleF0gPSBvcHRpb25zO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy52YWx1ZXNbaV0gPSBbdmFsdWVdO1xuICAgICAgICAgICAgICB0aGlzLmZpZWxkT3B0aW9uc1tpXSA9IFtvcHRpb25zXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9O1xuXG4gICAgICBBYnN0cmFjdFNldEZpZWxkQmxvY2sucHJvdG90eXBlLmJ1aWxkU3RyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm90IHlldCBpbXBsZW1lbnRlZCcpO1xuICAgICAgfTtcblxuICAgICAgQWJzdHJhY3RTZXRGaWVsZEJsb2NrLnByb3RvdHlwZS5idWlsZFBhcmFtID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm90IHlldCBpbXBsZW1lbnRlZCcpO1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIEFic3RyYWN0U2V0RmllbGRCbG9jaztcblxuICAgIH0pKGNscy5CbG9jayk7XG4gICAgY2xzLlNldEZpZWxkQmxvY2sgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gICAgICBfX2V4dGVuZHMoU2V0RmllbGRCbG9jaywgX3N1cGVyKTtcblxuICAgICAgZnVuY3Rpb24gU2V0RmllbGRCbG9jaygpIHtcbiAgICAgICAgX3JlZjQgPSBTZXRGaWVsZEJsb2NrLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gX3JlZjQ7XG4gICAgICB9XG5cbiAgICAgIFNldEZpZWxkQmxvY2sucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKGZpZWxkLCB2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2V0KGZpZWxkLCB2YWx1ZSwgb3B0aW9ucyk7XG4gICAgICB9O1xuXG4gICAgICBTZXRGaWVsZEJsb2NrLnByb3RvdHlwZS5zZXRGaWVsZHMgPSBmdW5jdGlvbihmaWVsZHMsIG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NldEZpZWxkcyhmaWVsZHMsIG9wdGlvbnMpO1xuICAgICAgfTtcblxuICAgICAgU2V0RmllbGRCbG9jay5wcm90b3R5cGUuYnVpbGRTdHIgPSBmdW5jdGlvbihxdWVyeUJ1aWxkZXIpIHtcbiAgICAgICAgdmFyIGZpZWxkLCBmaWVsZE9wdGlvbnMsIGksIHN0ciwgdmFsdWUsIF9pLCBfcmVmNTtcbiAgICAgICAgaWYgKDAgPj0gdGhpcy5maWVsZHMubGVuZ3RoKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwic2V0KCkgbmVlZHMgdG8gYmUgY2FsbGVkXCIpO1xuICAgICAgICB9XG4gICAgICAgIHN0ciA9IFwiXCI7XG4gICAgICAgIGZvciAoaSA9IF9pID0gMCwgX3JlZjUgPSB0aGlzLmZpZWxkcy5sZW5ndGg7IDAgPD0gX3JlZjUgPyBfaSA8IF9yZWY1IDogX2kgPiBfcmVmNTsgaSA9IDAgPD0gX3JlZjUgPyArK19pIDogLS1faSkge1xuICAgICAgICAgIGZpZWxkID0gdGhpcy5maWVsZHNbaV07XG4gICAgICAgICAgaWYgKFwiXCIgIT09IHN0cikge1xuICAgICAgICAgICAgc3RyICs9IFwiLCBcIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFsdWUgPSB0aGlzLnZhbHVlc1swXVtpXTtcbiAgICAgICAgICBmaWVsZE9wdGlvbnMgPSB0aGlzLmZpZWxkT3B0aW9uc1swXVtpXTtcbiAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgc3RyICs9IGZpZWxkO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdHIgKz0gXCJcIiArIGZpZWxkICsgXCIgPSBcIiArICh0aGlzLl9mb3JtYXRWYWx1ZSh2YWx1ZSwgZmllbGRPcHRpb25zKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBcIlNFVCBcIiArIHN0cjtcbiAgICAgIH07XG5cbiAgICAgIFNldEZpZWxkQmxvY2sucHJvdG90eXBlLmJ1aWxkUGFyYW0gPSBmdW5jdGlvbihxdWVyeUJ1aWxkZXIpIHtcbiAgICAgICAgdmFyIGZpZWxkLCBpLCBwLCBzdHIsIHYsIHZhbHMsIHZhbHVlLCBfaSwgX2osIF9sZW4sIF9yZWY1LCBfcmVmNjtcbiAgICAgICAgaWYgKDAgPj0gdGhpcy5maWVsZHMubGVuZ3RoKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwic2V0KCkgbmVlZHMgdG8gYmUgY2FsbGVkXCIpO1xuICAgICAgICB9XG4gICAgICAgIHN0ciA9IFwiXCI7XG4gICAgICAgIHZhbHMgPSBbXTtcbiAgICAgICAgZm9yIChpID0gX2kgPSAwLCBfcmVmNSA9IHRoaXMuZmllbGRzLmxlbmd0aDsgMCA8PSBfcmVmNSA/IF9pIDwgX3JlZjUgOiBfaSA+IF9yZWY1OyBpID0gMCA8PSBfcmVmNSA/ICsrX2kgOiAtLV9pKSB7XG4gICAgICAgICAgZmllbGQgPSB0aGlzLmZpZWxkc1tpXTtcbiAgICAgICAgICBpZiAoXCJcIiAhPT0gc3RyKSB7XG4gICAgICAgICAgICBzdHIgKz0gXCIsIFwiO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YWx1ZSA9IHRoaXMudmFsdWVzWzBdW2ldO1xuICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBzdHIgKz0gZmllbGQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHAgPSB0aGlzLl9mb3JtYXRWYWx1ZUFzUGFyYW0odmFsdWUpO1xuICAgICAgICAgICAgaWYgKChwICE9IG51bGwgPyBwLnRleHQgOiB2b2lkIDApICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgc3RyICs9IFwiXCIgKyBmaWVsZCArIFwiID0gKFwiICsgcC50ZXh0ICsgXCIpXCI7XG4gICAgICAgICAgICAgIF9yZWY2ID0gcC52YWx1ZXM7XG4gICAgICAgICAgICAgIGZvciAoX2ogPSAwLCBfbGVuID0gX3JlZjYubGVuZ3RoOyBfaiA8IF9sZW47IF9qKyspIHtcbiAgICAgICAgICAgICAgICB2ID0gX3JlZjZbX2pdO1xuICAgICAgICAgICAgICAgIHZhbHMucHVzaCh2KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc3RyICs9IFwiXCIgKyBmaWVsZCArIFwiID0gP1wiO1xuICAgICAgICAgICAgICB2YWxzLnB1c2gocCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdGV4dDogXCJTRVQgXCIgKyBzdHIsXG4gICAgICAgICAgdmFsdWVzOiB2YWxzXG4gICAgICAgIH07XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gU2V0RmllbGRCbG9jaztcblxuICAgIH0pKGNscy5BYnN0cmFjdFNldEZpZWxkQmxvY2spO1xuICAgIGNscy5JbnNlcnRGaWVsZFZhbHVlQmxvY2sgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gICAgICBfX2V4dGVuZHMoSW5zZXJ0RmllbGRWYWx1ZUJsb2NrLCBfc3VwZXIpO1xuXG4gICAgICBmdW5jdGlvbiBJbnNlcnRGaWVsZFZhbHVlQmxvY2soKSB7XG4gICAgICAgIF9yZWY1ID0gSW5zZXJ0RmllbGRWYWx1ZUJsb2NrLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gX3JlZjU7XG4gICAgICB9XG5cbiAgICAgIEluc2VydEZpZWxkVmFsdWVCbG9jay5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oZmllbGQsIHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICAgIGlmIChvcHRpb25zID09IG51bGwpIHtcbiAgICAgICAgICBvcHRpb25zID0ge307XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX3NldChmaWVsZCwgdmFsdWUsIG9wdGlvbnMpO1xuICAgICAgfTtcblxuICAgICAgSW5zZXJ0RmllbGRWYWx1ZUJsb2NrLnByb3RvdHlwZS5zZXRGaWVsZHMgPSBmdW5jdGlvbihmaWVsZHMsIG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NldEZpZWxkcyhmaWVsZHMsIG9wdGlvbnMpO1xuICAgICAgfTtcblxuICAgICAgSW5zZXJ0RmllbGRWYWx1ZUJsb2NrLnByb3RvdHlwZS5zZXRGaWVsZHNSb3dzID0gZnVuY3Rpb24oZmllbGRzUm93cywgb3B0aW9ucykge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2V0RmllbGRzUm93cyhmaWVsZHNSb3dzLCBvcHRpb25zKTtcbiAgICAgIH07XG5cbiAgICAgIEluc2VydEZpZWxkVmFsdWVCbG9jay5wcm90b3R5cGUuX2J1aWxkVmFscyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZm9ybWF0dGVkVmFsdWUsIGksIGosIHZhbHMsIF9pLCBfaiwgX3JlZjYsIF9yZWY3O1xuICAgICAgICB2YWxzID0gW107XG4gICAgICAgIGZvciAoaSA9IF9pID0gMCwgX3JlZjYgPSB0aGlzLnZhbHVlcy5sZW5ndGg7IDAgPD0gX3JlZjYgPyBfaSA8IF9yZWY2IDogX2kgPiBfcmVmNjsgaSA9IDAgPD0gX3JlZjYgPyArK19pIDogLS1faSkge1xuICAgICAgICAgIGZvciAoaiA9IF9qID0gMCwgX3JlZjcgPSB0aGlzLnZhbHVlc1tpXS5sZW5ndGg7IDAgPD0gX3JlZjcgPyBfaiA8IF9yZWY3IDogX2ogPiBfcmVmNzsgaiA9IDAgPD0gX3JlZjcgPyArK19qIDogLS1faikge1xuICAgICAgICAgICAgZm9ybWF0dGVkVmFsdWUgPSB0aGlzLl9mb3JtYXRWYWx1ZSh0aGlzLnZhbHVlc1tpXVtqXSwgdGhpcy5maWVsZE9wdGlvbnNbaV1bal0pO1xuICAgICAgICAgICAgaWYgKCdzdHJpbmcnID09PSB0eXBlb2YgdmFsc1tpXSkge1xuICAgICAgICAgICAgICB2YWxzW2ldICs9ICcsICcgKyBmb3JtYXR0ZWRWYWx1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHZhbHNbaV0gPSAnJyArIGZvcm1hdHRlZFZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFscztcbiAgICAgIH07XG5cbiAgICAgIEluc2VydEZpZWxkVmFsdWVCbG9jay5wcm90b3R5cGUuX2J1aWxkVmFsUGFyYW1zID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpLCBqLCBwLCBwYXJhbXMsIHN0ciwgdiwgdmFscywgX2ksIF9qLCBfaywgX2xlbiwgX3JlZjYsIF9yZWY3LCBfcmVmODtcbiAgICAgICAgdmFscyA9IFtdO1xuICAgICAgICBwYXJhbXMgPSBbXTtcbiAgICAgICAgZm9yIChpID0gX2kgPSAwLCBfcmVmNiA9IHRoaXMudmFsdWVzLmxlbmd0aDsgMCA8PSBfcmVmNiA/IF9pIDwgX3JlZjYgOiBfaSA+IF9yZWY2OyBpID0gMCA8PSBfcmVmNiA/ICsrX2kgOiAtLV9pKSB7XG4gICAgICAgICAgZm9yIChqID0gX2ogPSAwLCBfcmVmNyA9IHRoaXMudmFsdWVzW2ldLmxlbmd0aDsgMCA8PSBfcmVmNyA/IF9qIDwgX3JlZjcgOiBfaiA+IF9yZWY3OyBqID0gMCA8PSBfcmVmNyA/ICsrX2ogOiAtLV9qKSB7XG4gICAgICAgICAgICBwID0gdGhpcy5fZm9ybWF0VmFsdWVBc1BhcmFtKHRoaXMudmFsdWVzW2ldW2pdKTtcbiAgICAgICAgICAgIGlmICgocCAhPSBudWxsID8gcC50ZXh0IDogdm9pZCAwKSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIHN0ciA9IHAudGV4dDtcbiAgICAgICAgICAgICAgX3JlZjggPSBwLnZhbHVlcztcbiAgICAgICAgICAgICAgZm9yIChfayA9IDAsIF9sZW4gPSBfcmVmOC5sZW5ndGg7IF9rIDwgX2xlbjsgX2srKykge1xuICAgICAgICAgICAgICAgIHYgPSBfcmVmOFtfa107XG4gICAgICAgICAgICAgICAgcGFyYW1zLnB1c2godik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHN0ciA9ICc/JztcbiAgICAgICAgICAgICAgcGFyYW1zLnB1c2gocCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJ3N0cmluZycgPT09IHR5cGVvZiB2YWxzW2ldKSB7XG4gICAgICAgICAgICAgIHZhbHNbaV0gKz0gXCIsIFwiICsgc3RyO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdmFsc1tpXSA9IFwiXCIgKyBzdHI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdmFsczogdmFscyxcbiAgICAgICAgICBwYXJhbXM6IHBhcmFtc1xuICAgICAgICB9O1xuICAgICAgfTtcblxuICAgICAgSW5zZXJ0RmllbGRWYWx1ZUJsb2NrLnByb3RvdHlwZS5idWlsZFN0ciA9IGZ1bmN0aW9uKHF1ZXJ5QnVpbGRlcikge1xuICAgICAgICBpZiAoMCA+PSB0aGlzLmZpZWxkcy5sZW5ndGgpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFwiKFwiICsgKHRoaXMuZmllbGRzLmpvaW4oJywgJykpICsgXCIpIFZBTFVFUyAoXCIgKyAodGhpcy5fYnVpbGRWYWxzKCkuam9pbignKSwgKCcpKSArIFwiKVwiO1xuICAgICAgfTtcblxuICAgICAgSW5zZXJ0RmllbGRWYWx1ZUJsb2NrLnByb3RvdHlwZS5idWlsZFBhcmFtID0gZnVuY3Rpb24ocXVlcnlCdWlsZGVyKSB7XG4gICAgICAgIHZhciBpLCBwYXJhbXMsIHN0ciwgdmFscywgX2ksIF9yZWY2LCBfcmVmNztcbiAgICAgICAgaWYgKDAgPj0gdGhpcy5maWVsZHMubGVuZ3RoKSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRleHQ6ICcnLFxuICAgICAgICAgICAgdmFsdWVzOiBbXVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgc3RyID0gXCJcIjtcbiAgICAgICAgX3JlZjYgPSB0aGlzLl9idWlsZFZhbFBhcmFtcygpLCB2YWxzID0gX3JlZjYudmFscywgcGFyYW1zID0gX3JlZjYucGFyYW1zO1xuICAgICAgICBmb3IgKGkgPSBfaSA9IDAsIF9yZWY3ID0gdGhpcy5maWVsZHMubGVuZ3RoOyAwIDw9IF9yZWY3ID8gX2kgPCBfcmVmNyA6IF9pID4gX3JlZjc7IGkgPSAwIDw9IF9yZWY3ID8gKytfaSA6IC0tX2kpIHtcbiAgICAgICAgICBpZiAoXCJcIiAhPT0gc3RyKSB7XG4gICAgICAgICAgICBzdHIgKz0gXCIsIFwiO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzdHIgKz0gdGhpcy5maWVsZHNbaV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB0ZXh0OiBcIihcIiArIHN0ciArIFwiKSBWQUxVRVMgKFwiICsgKHZhbHMuam9pbignKSwgKCcpKSArIFwiKVwiLFxuICAgICAgICAgIHZhbHVlczogcGFyYW1zXG4gICAgICAgIH07XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gSW5zZXJ0RmllbGRWYWx1ZUJsb2NrO1xuXG4gICAgfSkoY2xzLkFic3RyYWN0U2V0RmllbGRCbG9jayk7XG4gICAgY2xzLkluc2VydEZpZWxkc0Zyb21RdWVyeUJsb2NrID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICAgICAgX19leHRlbmRzKEluc2VydEZpZWxkc0Zyb21RdWVyeUJsb2NrLCBfc3VwZXIpO1xuXG4gICAgICBmdW5jdGlvbiBJbnNlcnRGaWVsZHNGcm9tUXVlcnlCbG9jayhvcHRpb25zKSB7XG4gICAgICAgIEluc2VydEZpZWxkc0Zyb21RdWVyeUJsb2NrLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLl9maWVsZHMgPSBbXTtcbiAgICAgICAgdGhpcy5fcXVlcnkgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBJbnNlcnRGaWVsZHNGcm9tUXVlcnlCbG9jay5wcm90b3R5cGUuZnJvbVF1ZXJ5ID0gZnVuY3Rpb24oZmllbGRzLCBzZWxlY3RRdWVyeSkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLl9maWVsZHMgPSBmaWVsZHMubWFwKChmdW5jdGlvbih2KSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLl9zYW5pdGl6ZUZpZWxkKHYpO1xuICAgICAgICB9KSk7XG4gICAgICAgIHJldHVybiB0aGlzLl9xdWVyeSA9IHRoaXMuX3Nhbml0aXplTmVzdGFibGVRdWVyeShzZWxlY3RRdWVyeSk7XG4gICAgICB9O1xuXG4gICAgICBJbnNlcnRGaWVsZHNGcm9tUXVlcnlCbG9jay5wcm90b3R5cGUuYnVpbGRTdHIgPSBmdW5jdGlvbihxdWVyeUJ1aWxkZXIpIHtcbiAgICAgICAgaWYgKDAgPj0gdGhpcy5fZmllbGRzLmxlbmd0aCkge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCIoXCIgKyAodGhpcy5fZmllbGRzLmpvaW4oJywgJykpICsgXCIpIChcIiArICh0aGlzLl9xdWVyeS50b1N0cmluZygpKSArIFwiKVwiO1xuICAgICAgfTtcblxuICAgICAgSW5zZXJ0RmllbGRzRnJvbVF1ZXJ5QmxvY2sucHJvdG90eXBlLmJ1aWxkUGFyYW0gPSBmdW5jdGlvbihxdWVyeUJ1aWxkZXIpIHtcbiAgICAgICAgdmFyIHFyeVBhcmFtO1xuICAgICAgICBpZiAoMCA+PSB0aGlzLl9maWVsZHMubGVuZ3RoKSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRleHQ6ICcnLFxuICAgICAgICAgICAgdmFsdWVzOiBbXVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcXJ5UGFyYW0gPSB0aGlzLl9xdWVyeS50b1BhcmFtKCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdGV4dDogXCIoXCIgKyAodGhpcy5fZmllbGRzLmpvaW4oJywgJykpICsgXCIpIChcIiArIHFyeVBhcmFtLnRleHQgKyBcIilcIixcbiAgICAgICAgICB2YWx1ZXM6IHFyeVBhcmFtLnZhbHVlc1xuICAgICAgICB9O1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIEluc2VydEZpZWxkc0Zyb21RdWVyeUJsb2NrO1xuXG4gICAgfSkoY2xzLkJsb2NrKTtcbiAgICBjbHMuRGlzdGluY3RCbG9jayA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgICAgIF9fZXh0ZW5kcyhEaXN0aW5jdEJsb2NrLCBfc3VwZXIpO1xuXG4gICAgICBmdW5jdGlvbiBEaXN0aW5jdEJsb2NrKG9wdGlvbnMpIHtcbiAgICAgICAgRGlzdGluY3RCbG9jay5fX3N1cGVyX18uY29uc3RydWN0b3IuY2FsbCh0aGlzLCBvcHRpb25zKTtcbiAgICAgICAgdGhpcy51c2VEaXN0aW5jdCA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBEaXN0aW5jdEJsb2NrLnByb3RvdHlwZS5kaXN0aW5jdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy51c2VEaXN0aW5jdCA9IHRydWU7XG4gICAgICB9O1xuXG4gICAgICBEaXN0aW5jdEJsb2NrLnByb3RvdHlwZS5idWlsZFN0ciA9IGZ1bmN0aW9uKHF1ZXJ5QnVpbGRlcikge1xuICAgICAgICBpZiAodGhpcy51c2VEaXN0aW5jdCkge1xuICAgICAgICAgIHJldHVybiBcIkRJU1RJTkNUXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBEaXN0aW5jdEJsb2NrO1xuXG4gICAgfSkoY2xzLkJsb2NrKTtcbiAgICBjbHMuR3JvdXBCeUJsb2NrID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICAgICAgX19leHRlbmRzKEdyb3VwQnlCbG9jaywgX3N1cGVyKTtcblxuICAgICAgZnVuY3Rpb24gR3JvdXBCeUJsb2NrKG9wdGlvbnMpIHtcbiAgICAgICAgR3JvdXBCeUJsb2NrLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLmdyb3VwcyA9IFtdO1xuICAgICAgfVxuXG4gICAgICBHcm91cEJ5QmxvY2sucHJvdG90eXBlLmdyb3VwID0gZnVuY3Rpb24oZmllbGQpIHtcbiAgICAgICAgZmllbGQgPSB0aGlzLl9zYW5pdGl6ZUZpZWxkKGZpZWxkKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JvdXBzLnB1c2goZmllbGQpO1xuICAgICAgfTtcblxuICAgICAgR3JvdXBCeUJsb2NrLnByb3RvdHlwZS5idWlsZFN0ciA9IGZ1bmN0aW9uKHF1ZXJ5QnVpbGRlcikge1xuICAgICAgICB2YXIgZiwgZ3JvdXBzLCBfaSwgX2xlbiwgX3JlZjY7XG4gICAgICAgIGdyb3VwcyA9IFwiXCI7XG4gICAgICAgIGlmICgwIDwgdGhpcy5ncm91cHMubGVuZ3RoKSB7XG4gICAgICAgICAgX3JlZjYgPSB0aGlzLmdyb3VwcztcbiAgICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWY2Lmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgICBmID0gX3JlZjZbX2ldO1xuICAgICAgICAgICAgaWYgKFwiXCIgIT09IGdyb3Vwcykge1xuICAgICAgICAgICAgICBncm91cHMgKz0gXCIsIFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZ3JvdXBzICs9IGY7XG4gICAgICAgICAgfVxuICAgICAgICAgIGdyb3VwcyA9IFwiR1JPVVAgQlkgXCIgKyBncm91cHM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGdyb3VwcztcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBHcm91cEJ5QmxvY2s7XG5cbiAgICB9KShjbHMuQmxvY2spO1xuICAgIGNscy5PZmZzZXRCbG9jayA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgICAgIF9fZXh0ZW5kcyhPZmZzZXRCbG9jaywgX3N1cGVyKTtcblxuICAgICAgZnVuY3Rpb24gT2Zmc2V0QmxvY2sob3B0aW9ucykge1xuICAgICAgICBPZmZzZXRCbG9jay5fX3N1cGVyX18uY29uc3RydWN0b3IuY2FsbCh0aGlzLCBvcHRpb25zKTtcbiAgICAgICAgdGhpcy5vZmZzZXRzID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgT2Zmc2V0QmxvY2sucHJvdG90eXBlLm9mZnNldCA9IGZ1bmN0aW9uKHN0YXJ0KSB7XG4gICAgICAgIHN0YXJ0ID0gdGhpcy5fc2FuaXRpemVMaW1pdE9mZnNldChzdGFydCk7XG4gICAgICAgIHJldHVybiB0aGlzLm9mZnNldHMgPSBzdGFydDtcbiAgICAgIH07XG5cbiAgICAgIE9mZnNldEJsb2NrLnByb3RvdHlwZS5idWlsZFN0ciA9IGZ1bmN0aW9uKHF1ZXJ5QnVpbGRlcikge1xuICAgICAgICBpZiAodGhpcy5vZmZzZXRzKSB7XG4gICAgICAgICAgcmV0dXJuIFwiT0ZGU0VUIFwiICsgdGhpcy5vZmZzZXRzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gT2Zmc2V0QmxvY2s7XG5cbiAgICB9KShjbHMuQmxvY2spO1xuICAgIGNscy5BYnN0cmFjdENvbmRpdGlvbkJsb2NrID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICAgICAgX19leHRlbmRzKEFic3RyYWN0Q29uZGl0aW9uQmxvY2ssIF9zdXBlcik7XG5cbiAgICAgIGZ1bmN0aW9uIEFic3RyYWN0Q29uZGl0aW9uQmxvY2soY29uZGl0aW9uVmVyYiwgb3B0aW9ucykge1xuICAgICAgICB0aGlzLmNvbmRpdGlvblZlcmIgPSBjb25kaXRpb25WZXJiO1xuICAgICAgICBBYnN0cmFjdENvbmRpdGlvbkJsb2NrLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLmNvbmRpdGlvbnMgPSBbXTtcbiAgICAgIH1cblxuICAgICAgQWJzdHJhY3RDb25kaXRpb25CbG9jay5wcm90b3R5cGUuX2NvbmRpdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYywgY29uZGl0aW9uLCBmaW5hbENvbmRpdGlvbiwgZmluYWxWYWx1ZXMsIGlkeCwgaW5WYWx1ZXMsIGl0ZW0sIG5leHRWYWx1ZSwgdCwgdmFsdWVzLCBfaSwgX2osIF9sZW4sIF9yZWY2O1xuICAgICAgICBjb25kaXRpb24gPSBhcmd1bWVudHNbMF0sIHZhbHVlcyA9IDIgPD0gYXJndW1lbnRzLmxlbmd0aCA/IF9fc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpIDogW107XG4gICAgICAgIGNvbmRpdGlvbiA9IHRoaXMuX3Nhbml0aXplQ29uZGl0aW9uKGNvbmRpdGlvbik7XG4gICAgICAgIGZpbmFsQ29uZGl0aW9uID0gXCJcIjtcbiAgICAgICAgZmluYWxWYWx1ZXMgPSBbXTtcbiAgICAgICAgaWYgKGNvbmRpdGlvbiBpbnN0YW5jZW9mIGNscy5FeHByZXNzaW9uKSB7XG4gICAgICAgICAgdCA9IGNvbmRpdGlvbi50b1BhcmFtKCk7XG4gICAgICAgICAgZmluYWxDb25kaXRpb24gPSB0LnRleHQ7XG4gICAgICAgICAgZmluYWxWYWx1ZXMgPSB0LnZhbHVlcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmb3IgKGlkeCA9IF9pID0gMCwgX3JlZjYgPSBjb25kaXRpb24ubGVuZ3RoOyAwIDw9IF9yZWY2ID8gX2kgPCBfcmVmNiA6IF9pID4gX3JlZjY7IGlkeCA9IDAgPD0gX3JlZjYgPyArK19pIDogLS1faSkge1xuICAgICAgICAgICAgYyA9IGNvbmRpdGlvbi5jaGFyQXQoaWR4KTtcbiAgICAgICAgICAgIGlmICgnPycgPT09IGMgJiYgMCA8IHZhbHVlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgbmV4dFZhbHVlID0gdmFsdWVzLnNoaWZ0KCk7XG4gICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KG5leHRWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBpblZhbHVlcyA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAoX2ogPSAwLCBfbGVuID0gbmV4dFZhbHVlLmxlbmd0aDsgX2ogPCBfbGVuOyBfaisrKSB7XG4gICAgICAgICAgICAgICAgICBpdGVtID0gbmV4dFZhbHVlW19qXTtcbiAgICAgICAgICAgICAgICAgIGluVmFsdWVzLnB1c2godGhpcy5fc2FuaXRpemVWYWx1ZShpdGVtKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZpbmFsVmFsdWVzID0gZmluYWxWYWx1ZXMuY29uY2F0KGluVmFsdWVzKTtcbiAgICAgICAgICAgICAgICBmaW5hbENvbmRpdGlvbiArPSBcIihcIiArICgoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgdmFyIF9rLCBfbGVuMSwgX3Jlc3VsdHM7XG4gICAgICAgICAgICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICAgICAgICAgICAgZm9yIChfayA9IDAsIF9sZW4xID0gaW5WYWx1ZXMubGVuZ3RoOyBfayA8IF9sZW4xOyBfaysrKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0gPSBpblZhbHVlc1tfa107XG4gICAgICAgICAgICAgICAgICAgIF9yZXN1bHRzLnB1c2goJz8nKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICAgICAgICAgICAgICB9KSgpKS5qb2luKCcsICcpKSArIFwiKVwiO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZpbmFsQ29uZGl0aW9uICs9ICc/JztcbiAgICAgICAgICAgICAgICBmaW5hbFZhbHVlcy5wdXNoKHRoaXMuX3Nhbml0aXplVmFsdWUobmV4dFZhbHVlKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGZpbmFsQ29uZGl0aW9uICs9IGM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChcIlwiICE9PSBmaW5hbENvbmRpdGlvbikge1xuICAgICAgICAgIHJldHVybiB0aGlzLmNvbmRpdGlvbnMucHVzaCh7XG4gICAgICAgICAgICB0ZXh0OiBmaW5hbENvbmRpdGlvbixcbiAgICAgICAgICAgIHZhbHVlczogZmluYWxWYWx1ZXNcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgQWJzdHJhY3RDb25kaXRpb25CbG9jay5wcm90b3R5cGUuYnVpbGRTdHIgPSBmdW5jdGlvbihxdWVyeUJ1aWxkZXIpIHtcbiAgICAgICAgdmFyIGMsIGNvbmQsIGNvbmRTdHIsIGlkeCwgcEluZGV4LCBfaSwgX2osIF9sZW4sIF9yZWY2LCBfcmVmNztcbiAgICAgICAgaWYgKDAgPj0gdGhpcy5jb25kaXRpb25zLmxlbmd0aCkge1xuICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIGNvbmRTdHIgPSBcIlwiO1xuICAgICAgICBfcmVmNiA9IHRoaXMuY29uZGl0aW9ucztcbiAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmNi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgIGNvbmQgPSBfcmVmNltfaV07XG4gICAgICAgICAgaWYgKFwiXCIgIT09IGNvbmRTdHIpIHtcbiAgICAgICAgICAgIGNvbmRTdHIgKz0gXCIpIEFORCAoXCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICgwIDwgY29uZC52YWx1ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBwSW5kZXggPSAwO1xuICAgICAgICAgICAgZm9yIChpZHggPSBfaiA9IDAsIF9yZWY3ID0gY29uZC50ZXh0Lmxlbmd0aDsgMCA8PSBfcmVmNyA/IF9qIDwgX3JlZjcgOiBfaiA+IF9yZWY3OyBpZHggPSAwIDw9IF9yZWY3ID8gKytfaiA6IC0tX2opIHtcbiAgICAgICAgICAgICAgYyA9IGNvbmQudGV4dC5jaGFyQXQoaWR4KTtcbiAgICAgICAgICAgICAgaWYgKCc/JyA9PT0gYykge1xuICAgICAgICAgICAgICAgIGNvbmRTdHIgKz0gdGhpcy5fZm9ybWF0VmFsdWUoY29uZC52YWx1ZXNbcEluZGV4KytdKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25kU3RyICs9IGM7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uZFN0ciArPSBjb25kLnRleHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBcIlwiICsgdGhpcy5jb25kaXRpb25WZXJiICsgXCIgKFwiICsgY29uZFN0ciArIFwiKVwiO1xuICAgICAgfTtcblxuICAgICAgQWJzdHJhY3RDb25kaXRpb25CbG9jay5wcm90b3R5cGUuYnVpbGRQYXJhbSA9IGZ1bmN0aW9uKHF1ZXJ5QnVpbGRlcikge1xuICAgICAgICB2YXIgY29uZCwgY29uZFN0ciwgaSwgcCwgcXYsIHJldCwgc3RyLCB2LCBfaSwgX2osIF9rLCBfbGVuLCBfbGVuMSwgX2xlbjIsIF9yZWY2LCBfcmVmNywgX3JlZjg7XG4gICAgICAgIHJldCA9IHtcbiAgICAgICAgICB0ZXh0OiBcIlwiLFxuICAgICAgICAgIHZhbHVlczogW11cbiAgICAgICAgfTtcbiAgICAgICAgaWYgKDAgPj0gdGhpcy5jb25kaXRpb25zLmxlbmd0aCkge1xuICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH1cbiAgICAgICAgY29uZFN0ciA9IFwiXCI7XG4gICAgICAgIF9yZWY2ID0gdGhpcy5jb25kaXRpb25zO1xuICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWY2Lmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgY29uZCA9IF9yZWY2W19pXTtcbiAgICAgICAgICBpZiAoXCJcIiAhPT0gY29uZFN0cikge1xuICAgICAgICAgICAgY29uZFN0ciArPSBcIikgQU5EIChcIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgc3RyID0gY29uZC50ZXh0LnNwbGl0KCc/Jyk7XG4gICAgICAgICAgaSA9IDA7XG4gICAgICAgICAgX3JlZjcgPSBjb25kLnZhbHVlcztcbiAgICAgICAgICBmb3IgKF9qID0gMCwgX2xlbjEgPSBfcmVmNy5sZW5ndGg7IF9qIDwgX2xlbjE7IF9qKyspIHtcbiAgICAgICAgICAgIHYgPSBfcmVmN1tfal07XG4gICAgICAgICAgICBpZiAoc3RyW2ldICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgY29uZFN0ciArPSBcIlwiICsgc3RyW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcCA9IHRoaXMuX2Zvcm1hdFZhbHVlQXNQYXJhbSh2KTtcbiAgICAgICAgICAgIGlmICgoKHAgIT0gbnVsbCA/IHAudGV4dCA6IHZvaWQgMCkgIT0gbnVsbCkpIHtcbiAgICAgICAgICAgICAgY29uZFN0ciArPSBcIihcIiArIHAudGV4dCArIFwiKVwiO1xuICAgICAgICAgICAgICBfcmVmOCA9IHAudmFsdWVzO1xuICAgICAgICAgICAgICBmb3IgKF9rID0gMCwgX2xlbjIgPSBfcmVmOC5sZW5ndGg7IF9rIDwgX2xlbjI7IF9rKyspIHtcbiAgICAgICAgICAgICAgICBxdiA9IF9yZWY4W19rXTtcbiAgICAgICAgICAgICAgICByZXQudmFsdWVzLnB1c2gocXYpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb25kU3RyICs9IFwiP1wiO1xuICAgICAgICAgICAgICByZXQudmFsdWVzLnB1c2gocCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpID0gaSArIDE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzdHJbaV0gIT0gbnVsbCkge1xuICAgICAgICAgICAgY29uZFN0ciArPSBcIlwiICsgc3RyW2ldO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXQudGV4dCA9IFwiXCIgKyB0aGlzLmNvbmRpdGlvblZlcmIgKyBcIiAoXCIgKyBjb25kU3RyICsgXCIpXCI7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gQWJzdHJhY3RDb25kaXRpb25CbG9jaztcblxuICAgIH0pKGNscy5CbG9jayk7XG4gICAgY2xzLldoZXJlQmxvY2sgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gICAgICBfX2V4dGVuZHMoV2hlcmVCbG9jaywgX3N1cGVyKTtcblxuICAgICAgZnVuY3Rpb24gV2hlcmVCbG9jayhvcHRpb25zKSB7XG4gICAgICAgIFdoZXJlQmxvY2suX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgJ1dIRVJFJywgb3B0aW9ucyk7XG4gICAgICB9XG5cbiAgICAgIFdoZXJlQmxvY2sucHJvdG90eXBlLndoZXJlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjb25kaXRpb24sIHZhbHVlcztcbiAgICAgICAgY29uZGl0aW9uID0gYXJndW1lbnRzWzBdLCB2YWx1ZXMgPSAyIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBfX3NsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSA6IFtdO1xuICAgICAgICByZXR1cm4gdGhpcy5fY29uZGl0aW9uLmFwcGx5KHRoaXMsIFtjb25kaXRpb25dLmNvbmNhdChfX3NsaWNlLmNhbGwodmFsdWVzKSkpO1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIFdoZXJlQmxvY2s7XG5cbiAgICB9KShjbHMuQWJzdHJhY3RDb25kaXRpb25CbG9jayk7XG4gICAgY2xzLkhhdmluZ0Jsb2NrID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICAgICAgX19leHRlbmRzKEhhdmluZ0Jsb2NrLCBfc3VwZXIpO1xuXG4gICAgICBmdW5jdGlvbiBIYXZpbmdCbG9jayhvcHRpb25zKSB7XG4gICAgICAgIEhhdmluZ0Jsb2NrLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsICdIQVZJTkcnLCBvcHRpb25zKTtcbiAgICAgIH1cblxuICAgICAgSGF2aW5nQmxvY2sucHJvdG90eXBlLmhhdmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY29uZGl0aW9uLCB2YWx1ZXM7XG4gICAgICAgIGNvbmRpdGlvbiA9IGFyZ3VtZW50c1swXSwgdmFsdWVzID0gMiA8PSBhcmd1bWVudHMubGVuZ3RoID8gX19zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkgOiBbXTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbmRpdGlvbi5hcHBseSh0aGlzLCBbY29uZGl0aW9uXS5jb25jYXQoX19zbGljZS5jYWxsKHZhbHVlcykpKTtcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBIYXZpbmdCbG9jaztcblxuICAgIH0pKGNscy5BYnN0cmFjdENvbmRpdGlvbkJsb2NrKTtcbiAgICBjbHMuT3JkZXJCeUJsb2NrID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICAgICAgX19leHRlbmRzKE9yZGVyQnlCbG9jaywgX3N1cGVyKTtcblxuICAgICAgZnVuY3Rpb24gT3JkZXJCeUJsb2NrKG9wdGlvbnMpIHtcbiAgICAgICAgT3JkZXJCeUJsb2NrLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLm9yZGVycyA9IFtdO1xuICAgICAgICB0aGlzLl92YWx1ZXMgPSBbXTtcbiAgICAgIH1cblxuICAgICAgT3JkZXJCeUJsb2NrLnByb3RvdHlwZS5vcmRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXNjLCBmaWVsZCwgdmFsdWVzO1xuICAgICAgICBmaWVsZCA9IGFyZ3VtZW50c1swXSwgYXNjID0gYXJndW1lbnRzWzFdLCB2YWx1ZXMgPSAzIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBfX3NsaWNlLmNhbGwoYXJndW1lbnRzLCAyKSA6IFtdO1xuICAgICAgICBmaWVsZCA9IHRoaXMuX3Nhbml0aXplRmllbGQoZmllbGQpO1xuICAgICAgICBpZiAoYXNjID09PSB2b2lkIDApIHtcbiAgICAgICAgICBhc2MgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhc2MgIT09IG51bGwpIHtcbiAgICAgICAgICBhc2MgPSAhIWFzYztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl92YWx1ZXMgPSB2YWx1ZXM7XG4gICAgICAgIHJldHVybiB0aGlzLm9yZGVycy5wdXNoKHtcbiAgICAgICAgICBmaWVsZDogZmllbGQsXG4gICAgICAgICAgZGlyOiBhc2NcbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICBPcmRlckJ5QmxvY2sucHJvdG90eXBlLl9idWlsZFN0ciA9IGZ1bmN0aW9uKHRvUGFyYW0pIHtcbiAgICAgICAgdmFyIGMsIGZzdHIsIGlkeCwgbywgb3JkZXJzLCBwSW5kZXgsIF9pLCBfaiwgX2xlbiwgX3JlZjYsIF9yZWY3O1xuICAgICAgICBpZiAodG9QYXJhbSA9PSBudWxsKSB7XG4gICAgICAgICAgdG9QYXJhbSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICgwIDwgdGhpcy5vcmRlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgcEluZGV4ID0gMDtcbiAgICAgICAgICBvcmRlcnMgPSBcIlwiO1xuICAgICAgICAgIF9yZWY2ID0gdGhpcy5vcmRlcnM7XG4gICAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmNi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgICAgbyA9IF9yZWY2W19pXTtcbiAgICAgICAgICAgIGlmIChcIlwiICE9PSBvcmRlcnMpIHtcbiAgICAgICAgICAgICAgb3JkZXJzICs9IFwiLCBcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZzdHIgPSBcIlwiO1xuICAgICAgICAgICAgaWYgKCF0b1BhcmFtKSB7XG4gICAgICAgICAgICAgIGZvciAoaWR4ID0gX2ogPSAwLCBfcmVmNyA9IG8uZmllbGQubGVuZ3RoOyAwIDw9IF9yZWY3ID8gX2ogPCBfcmVmNyA6IF9qID4gX3JlZjc7IGlkeCA9IDAgPD0gX3JlZjcgPyArK19qIDogLS1faikge1xuICAgICAgICAgICAgICAgIGMgPSBvLmZpZWxkLmNoYXJBdChpZHgpO1xuICAgICAgICAgICAgICAgIGlmICgnPycgPT09IGMpIHtcbiAgICAgICAgICAgICAgICAgIGZzdHIgKz0gdGhpcy5fZm9ybWF0VmFsdWUodGhpcy5fdmFsdWVzW3BJbmRleCsrXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGZzdHIgKz0gYztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGZzdHIgPSBvLmZpZWxkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3JkZXJzICs9IFwiXCIgKyBmc3RyO1xuICAgICAgICAgICAgaWYgKG8uZGlyICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgIG9yZGVycyArPSBcIiBcIiArIChvLmRpciA/ICdBU0MnIDogJ0RFU0MnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIFwiT1JERVIgQlkgXCIgKyBvcmRlcnM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIE9yZGVyQnlCbG9jay5wcm90b3R5cGUuYnVpbGRTdHIgPSBmdW5jdGlvbihxdWVyeUJ1aWxkZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2J1aWxkU3RyKCk7XG4gICAgICB9O1xuXG4gICAgICBPcmRlckJ5QmxvY2sucHJvdG90eXBlLmJ1aWxkUGFyYW0gPSBmdW5jdGlvbihxdWVyeUJ1aWxkZXIpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB0ZXh0OiB0aGlzLl9idWlsZFN0cih0cnVlKSxcbiAgICAgICAgICB2YWx1ZXM6IHRoaXMuX3ZhbHVlcy5tYXAoZnVuY3Rpb24odikge1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLl9mb3JtYXRWYWx1ZUFzUGFyYW0odik7XG4gICAgICAgICAgfSlcbiAgICAgICAgfTtcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBPcmRlckJ5QmxvY2s7XG5cbiAgICB9KShjbHMuQmxvY2spO1xuICAgIGNscy5MaW1pdEJsb2NrID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICAgICAgX19leHRlbmRzKExpbWl0QmxvY2ssIF9zdXBlcik7XG5cbiAgICAgIGZ1bmN0aW9uIExpbWl0QmxvY2sob3B0aW9ucykge1xuICAgICAgICBMaW1pdEJsb2NrLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLmxpbWl0cyA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIExpbWl0QmxvY2sucHJvdG90eXBlLmxpbWl0ID0gZnVuY3Rpb24obWF4KSB7XG4gICAgICAgIG1heCA9IHRoaXMuX3Nhbml0aXplTGltaXRPZmZzZXQobWF4KTtcbiAgICAgICAgcmV0dXJuIHRoaXMubGltaXRzID0gbWF4O1xuICAgICAgfTtcblxuICAgICAgTGltaXRCbG9jay5wcm90b3R5cGUuYnVpbGRTdHIgPSBmdW5jdGlvbihxdWVyeUJ1aWxkZXIpIHtcbiAgICAgICAgaWYgKHRoaXMubGltaXRzKSB7XG4gICAgICAgICAgcmV0dXJuIFwiTElNSVQgXCIgKyB0aGlzLmxpbWl0cztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIExpbWl0QmxvY2s7XG5cbiAgICB9KShjbHMuQmxvY2spO1xuICAgIGNscy5Kb2luQmxvY2sgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gICAgICBfX2V4dGVuZHMoSm9pbkJsb2NrLCBfc3VwZXIpO1xuXG4gICAgICBmdW5jdGlvbiBKb2luQmxvY2sob3B0aW9ucykge1xuICAgICAgICBKb2luQmxvY2suX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgb3B0aW9ucyk7XG4gICAgICAgIHRoaXMuam9pbnMgPSBbXTtcbiAgICAgIH1cblxuICAgICAgSm9pbkJsb2NrLnByb3RvdHlwZS5qb2luID0gZnVuY3Rpb24odGFibGUsIGFsaWFzLCBjb25kaXRpb24sIHR5cGUpIHtcbiAgICAgICAgaWYgKGFsaWFzID09IG51bGwpIHtcbiAgICAgICAgICBhbGlhcyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbmRpdGlvbiA9PSBudWxsKSB7XG4gICAgICAgICAgY29uZGl0aW9uID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZSA9PSBudWxsKSB7XG4gICAgICAgICAgdHlwZSA9ICdJTk5FUic7XG4gICAgICAgIH1cbiAgICAgICAgdGFibGUgPSB0aGlzLl9zYW5pdGl6ZVRhYmxlKHRhYmxlLCB0cnVlKTtcbiAgICAgICAgaWYgKGFsaWFzKSB7XG4gICAgICAgICAgYWxpYXMgPSB0aGlzLl9zYW5pdGl6ZVRhYmxlQWxpYXMoYWxpYXMpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb25kaXRpb24pIHtcbiAgICAgICAgICBjb25kaXRpb24gPSB0aGlzLl9zYW5pdGl6ZUNvbmRpdGlvbihjb25kaXRpb24pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuam9pbnMucHVzaCh7XG4gICAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgICB0YWJsZTogdGFibGUsXG4gICAgICAgICAgYWxpYXM6IGFsaWFzLFxuICAgICAgICAgIGNvbmRpdGlvbjogY29uZGl0aW9uXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH07XG5cbiAgICAgIEpvaW5CbG9jay5wcm90b3R5cGUubGVmdF9qb2luID0gZnVuY3Rpb24odGFibGUsIGFsaWFzLCBjb25kaXRpb24pIHtcbiAgICAgICAgaWYgKGFsaWFzID09IG51bGwpIHtcbiAgICAgICAgICBhbGlhcyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbmRpdGlvbiA9PSBudWxsKSB7XG4gICAgICAgICAgY29uZGl0aW9uID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5qb2luKHRhYmxlLCBhbGlhcywgY29uZGl0aW9uLCAnTEVGVCcpO1xuICAgICAgfTtcblxuICAgICAgSm9pbkJsb2NrLnByb3RvdHlwZS5yaWdodF9qb2luID0gZnVuY3Rpb24odGFibGUsIGFsaWFzLCBjb25kaXRpb24pIHtcbiAgICAgICAgaWYgKGFsaWFzID09IG51bGwpIHtcbiAgICAgICAgICBhbGlhcyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbmRpdGlvbiA9PSBudWxsKSB7XG4gICAgICAgICAgY29uZGl0aW9uID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5qb2luKHRhYmxlLCBhbGlhcywgY29uZGl0aW9uLCAnUklHSFQnKTtcbiAgICAgIH07XG5cbiAgICAgIEpvaW5CbG9jay5wcm90b3R5cGUub3V0ZXJfam9pbiA9IGZ1bmN0aW9uKHRhYmxlLCBhbGlhcywgY29uZGl0aW9uKSB7XG4gICAgICAgIGlmIChhbGlhcyA9PSBudWxsKSB7XG4gICAgICAgICAgYWxpYXMgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb25kaXRpb24gPT0gbnVsbCkge1xuICAgICAgICAgIGNvbmRpdGlvbiA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuam9pbih0YWJsZSwgYWxpYXMsIGNvbmRpdGlvbiwgJ09VVEVSJyk7XG4gICAgICB9O1xuXG4gICAgICBKb2luQmxvY2sucHJvdG90eXBlLmxlZnRfb3V0ZXJfam9pbiA9IGZ1bmN0aW9uKHRhYmxlLCBhbGlhcywgY29uZGl0aW9uKSB7XG4gICAgICAgIGlmIChhbGlhcyA9PSBudWxsKSB7XG4gICAgICAgICAgYWxpYXMgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb25kaXRpb24gPT0gbnVsbCkge1xuICAgICAgICAgIGNvbmRpdGlvbiA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuam9pbih0YWJsZSwgYWxpYXMsIGNvbmRpdGlvbiwgJ0xFRlQgT1VURVInKTtcbiAgICAgIH07XG5cbiAgICAgIEpvaW5CbG9jay5wcm90b3R5cGUuZnVsbF9qb2luID0gZnVuY3Rpb24odGFibGUsIGFsaWFzLCBjb25kaXRpb24pIHtcbiAgICAgICAgaWYgKGFsaWFzID09IG51bGwpIHtcbiAgICAgICAgICBhbGlhcyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbmRpdGlvbiA9PSBudWxsKSB7XG4gICAgICAgICAgY29uZGl0aW9uID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5qb2luKHRhYmxlLCBhbGlhcywgY29uZGl0aW9uLCAnRlVMTCcpO1xuICAgICAgfTtcblxuICAgICAgSm9pbkJsb2NrLnByb3RvdHlwZS5jcm9zc19qb2luID0gZnVuY3Rpb24odGFibGUsIGFsaWFzLCBjb25kaXRpb24pIHtcbiAgICAgICAgaWYgKGFsaWFzID09IG51bGwpIHtcbiAgICAgICAgICBhbGlhcyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbmRpdGlvbiA9PSBudWxsKSB7XG4gICAgICAgICAgY29uZGl0aW9uID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5qb2luKHRhYmxlLCBhbGlhcywgY29uZGl0aW9uLCAnQ1JPU1MnKTtcbiAgICAgIH07XG5cbiAgICAgIEpvaW5CbG9jay5wcm90b3R5cGUuYnVpbGRTdHIgPSBmdW5jdGlvbihxdWVyeUJ1aWxkZXIpIHtcbiAgICAgICAgdmFyIGosIGpvaW5zLCBfaSwgX2xlbiwgX3JlZjY7XG4gICAgICAgIGpvaW5zID0gXCJcIjtcbiAgICAgICAgX3JlZjYgPSB0aGlzLmpvaW5zIHx8IFtdO1xuICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWY2Lmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgaiA9IF9yZWY2W19pXTtcbiAgICAgICAgICBpZiAoam9pbnMgIT09IFwiXCIpIHtcbiAgICAgICAgICAgIGpvaW5zICs9IFwiIFwiO1xuICAgICAgICAgIH1cbiAgICAgICAgICBqb2lucyArPSBcIlwiICsgai50eXBlICsgXCIgSk9JTiBcIjtcbiAgICAgICAgICBpZiAoXCJzdHJpbmdcIiA9PT0gdHlwZW9mIGoudGFibGUpIHtcbiAgICAgICAgICAgIGpvaW5zICs9IGoudGFibGU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGpvaW5zICs9IFwiKFwiICsgai50YWJsZSArIFwiKVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoai5hbGlhcykge1xuICAgICAgICAgICAgam9pbnMgKz0gXCIgXCIgKyBqLmFsaWFzO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoai5jb25kaXRpb24pIHtcbiAgICAgICAgICAgIGpvaW5zICs9IFwiIE9OIChcIiArIGouY29uZGl0aW9uICsgXCIpXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBqb2lucztcbiAgICAgIH07XG5cbiAgICAgIEpvaW5CbG9jay5wcm90b3R5cGUuYnVpbGRQYXJhbSA9IGZ1bmN0aW9uKHF1ZXJ5QnVpbGRlcikge1xuICAgICAgICB2YXIgYmxrLCBjcCwgam9pblN0ciwgcCwgcGFyYW1zLCByZXQsIHYsIF9pLCBfaiwgX2ssIF9sZW4sIF9sZW4xLCBfbGVuMiwgX3JlZjYsIF9yZWY3O1xuICAgICAgICByZXQgPSB7XG4gICAgICAgICAgdGV4dDogXCJcIixcbiAgICAgICAgICB2YWx1ZXM6IFtdXG4gICAgICAgIH07XG4gICAgICAgIHBhcmFtcyA9IFtdO1xuICAgICAgICBqb2luU3RyID0gXCJcIjtcbiAgICAgICAgaWYgKDAgPj0gdGhpcy5qb2lucy5sZW5ndGgpIHtcbiAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9XG4gICAgICAgIF9yZWY2ID0gdGhpcy5qb2lucztcbiAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmNi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgIGJsayA9IF9yZWY2W19pXTtcbiAgICAgICAgICBpZiAoXCJzdHJpbmdcIiA9PT0gdHlwZW9mIGJsay50YWJsZSkge1xuICAgICAgICAgICAgcCA9IHtcbiAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiXCIgKyBibGsudGFibGUsXG4gICAgICAgICAgICAgIFwidmFsdWVzXCI6IFtdXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0gZWxzZSBpZiAoYmxrLnRhYmxlIGluc3RhbmNlb2YgY2xzLlF1ZXJ5QnVpbGRlcikge1xuICAgICAgICAgICAgYmxrLnRhYmxlLnVwZGF0ZU9wdGlvbnMoe1xuICAgICAgICAgICAgICBcIm5lc3RlZEJ1aWxkZXJcIjogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBwID0gYmxrLnRhYmxlLnRvUGFyYW0oKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYmxrLnVwZGF0ZU9wdGlvbnMoe1xuICAgICAgICAgICAgICBcIm5lc3RlZEJ1aWxkZXJcIjogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBwID0gYmxrLmJ1aWxkUGFyYW0ocXVlcnlCdWlsZGVyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGJsay5jb25kaXRpb24gaW5zdGFuY2VvZiBjbHMuRXhwcmVzc2lvbikge1xuICAgICAgICAgICAgY3AgPSBibGsuY29uZGl0aW9uLnRvUGFyYW0oKTtcbiAgICAgICAgICAgIHAuY29uZGl0aW9uID0gY3AudGV4dDtcbiAgICAgICAgICAgIHAudmFsdWVzID0gcC52YWx1ZXMuY29uY2F0KGNwLnZhbHVlcyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHAuY29uZGl0aW9uID0gYmxrLmNvbmRpdGlvbjtcbiAgICAgICAgICB9XG4gICAgICAgICAgcC5qb2luID0gYmxrO1xuICAgICAgICAgIHBhcmFtcy5wdXNoKHApO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IHBhcmFtcy5sZW5ndGg7IF9qIDwgX2xlbjE7IF9qKyspIHtcbiAgICAgICAgICBwID0gcGFyYW1zW19qXTtcbiAgICAgICAgICBpZiAoam9pblN0ciAhPT0gXCJcIikge1xuICAgICAgICAgICAgam9pblN0ciArPSBcIiBcIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgam9pblN0ciArPSBcIlwiICsgcC5qb2luLnR5cGUgKyBcIiBKT0lOIFwiO1xuICAgICAgICAgIGlmIChcInN0cmluZ1wiID09PSB0eXBlb2YgcC5qb2luLnRhYmxlKSB7XG4gICAgICAgICAgICBqb2luU3RyICs9IHAudGV4dDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgam9pblN0ciArPSBcIihcIiArIHAudGV4dCArIFwiKVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocC5qb2luLmFsaWFzKSB7XG4gICAgICAgICAgICBqb2luU3RyICs9IFwiIFwiICsgcC5qb2luLmFsaWFzO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocC5jb25kaXRpb24pIHtcbiAgICAgICAgICAgIGpvaW5TdHIgKz0gXCIgT04gKFwiICsgcC5jb25kaXRpb24gKyBcIilcIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgX3JlZjcgPSBwLnZhbHVlcztcbiAgICAgICAgICBmb3IgKF9rID0gMCwgX2xlbjIgPSBfcmVmNy5sZW5ndGg7IF9rIDwgX2xlbjI7IF9rKyspIHtcbiAgICAgICAgICAgIHYgPSBfcmVmN1tfa107XG4gICAgICAgICAgICByZXQudmFsdWVzLnB1c2godGhpcy5fZm9ybWF0Q3VzdG9tVmFsdWUodikpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXQudGV4dCArPSBqb2luU3RyO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIEpvaW5CbG9jaztcblxuICAgIH0pKGNscy5CbG9jayk7XG4gICAgY2xzLlVuaW9uQmxvY2sgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gICAgICBfX2V4dGVuZHMoVW5pb25CbG9jaywgX3N1cGVyKTtcblxuICAgICAgZnVuY3Rpb24gVW5pb25CbG9jayhvcHRpb25zKSB7XG4gICAgICAgIFVuaW9uQmxvY2suX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgb3B0aW9ucyk7XG4gICAgICAgIHRoaXMudW5pb25zID0gW107XG4gICAgICB9XG5cbiAgICAgIFVuaW9uQmxvY2sucHJvdG90eXBlLnVuaW9uID0gZnVuY3Rpb24odGFibGUsIHR5cGUpIHtcbiAgICAgICAgaWYgKHR5cGUgPT0gbnVsbCkge1xuICAgICAgICAgIHR5cGUgPSAnVU5JT04nO1xuICAgICAgICB9XG4gICAgICAgIHRhYmxlID0gdGhpcy5fc2FuaXRpemVUYWJsZSh0YWJsZSwgdHJ1ZSk7XG4gICAgICAgIHRoaXMudW5pb25zLnB1c2goe1xuICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgdGFibGU6IHRhYmxlXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH07XG5cbiAgICAgIFVuaW9uQmxvY2sucHJvdG90eXBlLnVuaW9uX2FsbCA9IGZ1bmN0aW9uKHRhYmxlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnVuaW9uKHRhYmxlLCAnVU5JT04gQUxMJyk7XG4gICAgICB9O1xuXG4gICAgICBVbmlvbkJsb2NrLnByb3RvdHlwZS5idWlsZFN0ciA9IGZ1bmN0aW9uKHF1ZXJ5QnVpbGRlcikge1xuICAgICAgICB2YXIgaiwgdW5pb25TdHIsIF9pLCBfbGVuLCBfcmVmNjtcbiAgICAgICAgdW5pb25TdHIgPSBcIlwiO1xuICAgICAgICBfcmVmNiA9IHRoaXMudW5pb25zIHx8IFtdO1xuICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWY2Lmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgaiA9IF9yZWY2W19pXTtcbiAgICAgICAgICBpZiAodW5pb25TdHIgIT09IFwiXCIpIHtcbiAgICAgICAgICAgIHVuaW9uU3RyICs9IFwiIFwiO1xuICAgICAgICAgIH1cbiAgICAgICAgICB1bmlvblN0ciArPSBcIlwiICsgai50eXBlICsgXCIgXCI7XG4gICAgICAgICAgaWYgKFwic3RyaW5nXCIgPT09IHR5cGVvZiBqLnRhYmxlKSB7XG4gICAgICAgICAgICB1bmlvblN0ciArPSBqLnRhYmxlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1bmlvblN0ciArPSBcIihcIiArIGoudGFibGUgKyBcIilcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuaW9uU3RyO1xuICAgICAgfTtcblxuICAgICAgVW5pb25CbG9jay5wcm90b3R5cGUuYnVpbGRQYXJhbSA9IGZ1bmN0aW9uKHF1ZXJ5QnVpbGRlcikge1xuICAgICAgICB2YXIgYmxrLCBwLCBwYXJhbXMsIHJldCwgdW5pb25TdHIsIHYsIF9pLCBfaiwgX2ssIF9sZW4sIF9sZW4xLCBfbGVuMiwgX3JlZjYsIF9yZWY3O1xuICAgICAgICByZXQgPSB7XG4gICAgICAgICAgdGV4dDogXCJcIixcbiAgICAgICAgICB2YWx1ZXM6IFtdXG4gICAgICAgIH07XG4gICAgICAgIHBhcmFtcyA9IFtdO1xuICAgICAgICB1bmlvblN0ciA9IFwiXCI7XG4gICAgICAgIGlmICgwID49IHRoaXMudW5pb25zLmxlbmd0aCkge1xuICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH1cbiAgICAgICAgX3JlZjYgPSB0aGlzLnVuaW9ucyB8fCBbXTtcbiAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmNi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgIGJsayA9IF9yZWY2W19pXTtcbiAgICAgICAgICBpZiAoXCJzdHJpbmdcIiA9PT0gdHlwZW9mIGJsay50YWJsZSkge1xuICAgICAgICAgICAgcCA9IHtcbiAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiXCIgKyBibGsudGFibGUsXG4gICAgICAgICAgICAgIFwidmFsdWVzXCI6IFtdXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0gZWxzZSBpZiAoYmxrLnRhYmxlIGluc3RhbmNlb2YgY2xzLlF1ZXJ5QnVpbGRlcikge1xuICAgICAgICAgICAgYmxrLnRhYmxlLnVwZGF0ZU9wdGlvbnMoe1xuICAgICAgICAgICAgICBcIm5lc3RlZEJ1aWxkZXJcIjogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBwID0gYmxrLnRhYmxlLnRvUGFyYW0oKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYmxrLnVwZGF0ZU9wdGlvbnMoe1xuICAgICAgICAgICAgICBcIm5lc3RlZEJ1aWxkZXJcIjogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBwID0gYmxrLmJ1aWxkUGFyYW0ocXVlcnlCdWlsZGVyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcC50eXBlID0gYmxrLnR5cGU7XG4gICAgICAgICAgcGFyYW1zLnB1c2gocCk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChfaiA9IDAsIF9sZW4xID0gcGFyYW1zLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICAgIHAgPSBwYXJhbXNbX2pdO1xuICAgICAgICAgIGlmICh1bmlvblN0ciAhPT0gXCJcIikge1xuICAgICAgICAgICAgdW5pb25TdHIgKz0gXCIgXCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIHVuaW9uU3RyICs9IFwiXCIgKyBwLnR5cGUgKyBcIiAoXCIgKyBwLnRleHQgKyBcIilcIjtcbiAgICAgICAgICBfcmVmNyA9IHAudmFsdWVzO1xuICAgICAgICAgIGZvciAoX2sgPSAwLCBfbGVuMiA9IF9yZWY3Lmxlbmd0aDsgX2sgPCBfbGVuMjsgX2srKykge1xuICAgICAgICAgICAgdiA9IF9yZWY3W19rXTtcbiAgICAgICAgICAgIHJldC52YWx1ZXMucHVzaCh0aGlzLl9mb3JtYXRDdXN0b21WYWx1ZSh2KSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldC50ZXh0ICs9IHVuaW9uU3RyO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIFVuaW9uQmxvY2s7XG5cbiAgICB9KShjbHMuQmxvY2spO1xuICAgIGNscy5RdWVyeUJ1aWxkZXIgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gICAgICBfX2V4dGVuZHMoUXVlcnlCdWlsZGVyLCBfc3VwZXIpO1xuXG4gICAgICBmdW5jdGlvbiBRdWVyeUJ1aWxkZXIob3B0aW9ucywgYmxvY2tzKSB7XG4gICAgICAgIHZhciBibG9jaywgbWV0aG9kQm9keSwgbWV0aG9kTmFtZSwgX2ZuLCBfaSwgX2xlbiwgX3JlZjYsIF9yZWY3LFxuICAgICAgICAgIF90aGlzID0gdGhpcztcbiAgICAgICAgUXVlcnlCdWlsZGVyLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLmJsb2NrcyA9IGJsb2NrcyB8fCBbXTtcbiAgICAgICAgX3JlZjYgPSB0aGlzLmJsb2NrcztcbiAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmNi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgIGJsb2NrID0gX3JlZjZbX2ldO1xuICAgICAgICAgIF9yZWY3ID0gYmxvY2suZXhwb3NlZE1ldGhvZHMoKTtcbiAgICAgICAgICBfZm4gPSBmdW5jdGlvbihibG9jaywgbmFtZSwgYm9keSkge1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIGJvZHkuYXBwbHkoYmxvY2ssIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgIHJldHVybiBfdGhpcztcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfTtcbiAgICAgICAgICBmb3IgKG1ldGhvZE5hbWUgaW4gX3JlZjcpIHtcbiAgICAgICAgICAgIG1ldGhvZEJvZHkgPSBfcmVmN1ttZXRob2ROYW1lXTtcbiAgICAgICAgICAgIGlmICh0aGlzW21ldGhvZE5hbWVdICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiXCIgKyAodGhpcy5fZ2V0T2JqZWN0Q2xhc3NOYW1lKHRoaXMpKSArIFwiIGFscmVhZHkgaGFzIGEgYnVpbGRlciBtZXRob2QgY2FsbGVkOiBcIiArIG1ldGhvZE5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX2ZuKGJsb2NrLCBtZXRob2ROYW1lLCBtZXRob2RCb2R5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgUXVlcnlCdWlsZGVyLnByb3RvdHlwZS5yZWdpc3RlclZhbHVlSGFuZGxlciA9IGZ1bmN0aW9uKHR5cGUsIGhhbmRsZXIpIHtcbiAgICAgICAgdmFyIGJsb2NrLCBfaSwgX2xlbiwgX3JlZjY7XG4gICAgICAgIF9yZWY2ID0gdGhpcy5ibG9ja3M7XG4gICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjYubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICBibG9jayA9IF9yZWY2W19pXTtcbiAgICAgICAgICBibG9jay5yZWdpc3RlclZhbHVlSGFuZGxlcih0eXBlLCBoYW5kbGVyKTtcbiAgICAgICAgfVxuICAgICAgICBRdWVyeUJ1aWxkZXIuX19zdXBlcl9fLnJlZ2lzdGVyVmFsdWVIYW5kbGVyLmNhbGwodGhpcywgdHlwZSwgaGFuZGxlcik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfTtcblxuICAgICAgUXVlcnlCdWlsZGVyLnByb3RvdHlwZS51cGRhdGVPcHRpb25zID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICB2YXIgYmxvY2ssIF9pLCBfbGVuLCBfcmVmNiwgX3Jlc3VsdHM7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IF9leHRlbmQoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICAgIF9yZWY2ID0gdGhpcy5ibG9ja3M7XG4gICAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjYubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICBibG9jayA9IF9yZWY2W19pXTtcbiAgICAgICAgICBfcmVzdWx0cy5wdXNoKGJsb2NrLm9wdGlvbnMgPSBfZXh0ZW5kKHt9LCBibG9jay5vcHRpb25zLCBvcHRpb25zKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgfTtcblxuICAgICAgUXVlcnlCdWlsZGVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYmxvY2s7XG4gICAgICAgIHJldHVybiAoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBfaSwgX2xlbiwgX3JlZjYsIF9yZXN1bHRzO1xuICAgICAgICAgIF9yZWY2ID0gdGhpcy5ibG9ja3M7XG4gICAgICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgICAgICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWY2Lmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgICBibG9jayA9IF9yZWY2W19pXTtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2goYmxvY2suYnVpbGRTdHIodGhpcykpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgICAgIH0pLmNhbGwodGhpcykpLmZpbHRlcihmdW5jdGlvbih2KSB7XG4gICAgICAgICAgcmV0dXJuIDAgPCB2Lmxlbmd0aDtcbiAgICAgICAgfSkuam9pbih0aGlzLm9wdGlvbnMuc2VwYXJhdG9yKTtcbiAgICAgIH07XG5cbiAgICAgIFF1ZXJ5QnVpbGRlci5wcm90b3R5cGUudG9QYXJhbSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIGJsb2NrLCBibG9ja3MsIGksIG9sZCwgcmVzdWx0LCBfcmVmNjtcbiAgICAgICAgaWYgKG9wdGlvbnMgPT0gbnVsbCkge1xuICAgICAgICAgIG9wdGlvbnMgPSB2b2lkIDA7XG4gICAgICAgIH1cbiAgICAgICAgb2xkID0gdGhpcy5vcHRpb25zO1xuICAgICAgICBpZiAob3B0aW9ucyAhPSBudWxsKSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25zID0gX2V4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQgPSB7XG4gICAgICAgICAgdGV4dDogJycsXG4gICAgICAgICAgdmFsdWVzOiBbXVxuICAgICAgICB9O1xuICAgICAgICBibG9ja3MgPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIF9pLCBfbGVuLCBfcmVmNiwgX3Jlc3VsdHM7XG4gICAgICAgICAgX3JlZjYgPSB0aGlzLmJsb2NrcztcbiAgICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjYubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICAgIGJsb2NrID0gX3JlZjZbX2ldO1xuICAgICAgICAgICAgX3Jlc3VsdHMucHVzaChibG9jay5idWlsZFBhcmFtKHRoaXMpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgICB9KS5jYWxsKHRoaXMpO1xuICAgICAgICByZXN1bHQudGV4dCA9ICgoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIF9pLCBfbGVuLCBfcmVzdWx0cztcbiAgICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gYmxvY2tzLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgICBibG9jayA9IGJsb2Nrc1tfaV07XG4gICAgICAgICAgICBfcmVzdWx0cy5wdXNoKGJsb2NrLnRleHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgICAgIH0pKCkpLmZpbHRlcihmdW5jdGlvbih2KSB7XG4gICAgICAgICAgcmV0dXJuIDAgPCB2Lmxlbmd0aDtcbiAgICAgICAgfSkuam9pbih0aGlzLm9wdGlvbnMuc2VwYXJhdG9yKTtcbiAgICAgICAgcmVzdWx0LnZhbHVlcyA9IChfcmVmNiA9IFtdKS5jb25jYXQuYXBwbHkoX3JlZjYsIChmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgX2ksIF9sZW4sIF9yZXN1bHRzO1xuICAgICAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBibG9ja3MubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICAgIGJsb2NrID0gYmxvY2tzW19pXTtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2goYmxvY2sudmFsdWVzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgICB9KSgpKTtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5uZXN0ZWRCdWlsZGVyID09IG51bGwpIHtcbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLm51bWJlcmVkUGFyYW1ldGVycyB8fCAoKG9wdGlvbnMgIT0gbnVsbCA/IG9wdGlvbnMubnVtYmVyZWRQYXJhbWV0ZXJzU3RhcnRBdCA6IHZvaWQgMCkgIT0gbnVsbCkpIHtcbiAgICAgICAgICAgIGkgPSAxO1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5udW1iZXJlZFBhcmFtZXRlcnNTdGFydEF0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgaSA9IHRoaXMub3B0aW9ucy5udW1iZXJlZFBhcmFtZXRlcnNTdGFydEF0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzdWx0LnRleHQgPSByZXN1bHQudGV4dC5yZXBsYWNlKC9cXD8vZywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiBcIiRcIiArIChpKyspO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9sZDtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH07XG5cbiAgICAgIFF1ZXJ5QnVpbGRlci5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGJsb2NrO1xuICAgICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcy5vcHRpb25zLCAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIF9pLCBfbGVuLCBfcmVmNiwgX3Jlc3VsdHM7XG4gICAgICAgICAgX3JlZjYgPSB0aGlzLmJsb2NrcztcbiAgICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZjYubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICAgIGJsb2NrID0gX3JlZjZbX2ldO1xuICAgICAgICAgICAgX3Jlc3VsdHMucHVzaChibG9jay5jbG9uZSgpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgICB9KS5jYWxsKHRoaXMpKTtcbiAgICAgIH07XG5cbiAgICAgIFF1ZXJ5QnVpbGRlci5wcm90b3R5cGUuaXNOZXN0YWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9O1xuXG4gICAgICBRdWVyeUJ1aWxkZXIucHJvdG90eXBlLmdldEJsb2NrID0gZnVuY3Rpb24oYmxvY2tUeXBlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJsb2Nrcy5maWx0ZXIoZnVuY3Rpb24oYikge1xuICAgICAgICAgIHJldHVybiBiIGluc3RhbmNlb2YgYmxvY2tUeXBlO1xuICAgICAgICB9KVswXTtcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBRdWVyeUJ1aWxkZXI7XG5cbiAgICB9KShjbHMuQmFzZUJ1aWxkZXIpO1xuICAgIGNscy5TZWxlY3QgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gICAgICBfX2V4dGVuZHMoU2VsZWN0LCBfc3VwZXIpO1xuXG4gICAgICBmdW5jdGlvbiBTZWxlY3Qob3B0aW9ucywgYmxvY2tzKSB7XG4gICAgICAgIGlmIChibG9ja3MgPT0gbnVsbCkge1xuICAgICAgICAgIGJsb2NrcyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgYmxvY2tzIHx8IChibG9ja3MgPSBbXG4gICAgICAgICAgbmV3IGNscy5TdHJpbmdCbG9jayhvcHRpb25zLCAnU0VMRUNUJyksIG5ldyBjbHMuRnVuY3Rpb25CbG9jayhvcHRpb25zKSwgbmV3IGNscy5EaXN0aW5jdEJsb2NrKG9wdGlvbnMpLCBuZXcgY2xzLkdldEZpZWxkQmxvY2sob3B0aW9ucyksIG5ldyBjbHMuRnJvbVRhYmxlQmxvY2soX2V4dGVuZCh7fSwgb3B0aW9ucywge1xuICAgICAgICAgICAgYWxsb3dOZXN0ZWQ6IHRydWVcbiAgICAgICAgICB9KSksIG5ldyBjbHMuSm9pbkJsb2NrKF9leHRlbmQoe30sIG9wdGlvbnMsIHtcbiAgICAgICAgICAgIGFsbG93TmVzdGVkOiB0cnVlXG4gICAgICAgICAgfSkpLCBuZXcgY2xzLldoZXJlQmxvY2sob3B0aW9ucyksIG5ldyBjbHMuR3JvdXBCeUJsb2NrKG9wdGlvbnMpLCBuZXcgY2xzLkhhdmluZ0Jsb2NrKG9wdGlvbnMpLCBuZXcgY2xzLk9yZGVyQnlCbG9jayhvcHRpb25zKSwgbmV3IGNscy5MaW1pdEJsb2NrKG9wdGlvbnMpLCBuZXcgY2xzLk9mZnNldEJsb2NrKG9wdGlvbnMpLCBuZXcgY2xzLlVuaW9uQmxvY2soX2V4dGVuZCh7fSwgb3B0aW9ucywge1xuICAgICAgICAgICAgYWxsb3dOZXN0ZWQ6IHRydWVcbiAgICAgICAgICB9KSlcbiAgICAgICAgXSk7XG4gICAgICAgIFNlbGVjdC5fX3N1cGVyX18uY29uc3RydWN0b3IuY2FsbCh0aGlzLCBvcHRpb25zLCBibG9ja3MpO1xuICAgICAgfVxuXG4gICAgICBTZWxlY3QucHJvdG90eXBlLmlzTmVzdGFibGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gU2VsZWN0O1xuXG4gICAgfSkoY2xzLlF1ZXJ5QnVpbGRlcik7XG4gICAgY2xzLlVwZGF0ZSA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgICAgIF9fZXh0ZW5kcyhVcGRhdGUsIF9zdXBlcik7XG5cbiAgICAgIGZ1bmN0aW9uIFVwZGF0ZShvcHRpb25zLCBibG9ja3MpIHtcbiAgICAgICAgaWYgKGJsb2NrcyA9PSBudWxsKSB7XG4gICAgICAgICAgYmxvY2tzID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBibG9ja3MgfHwgKGJsb2NrcyA9IFtuZXcgY2xzLlN0cmluZ0Jsb2NrKG9wdGlvbnMsICdVUERBVEUnKSwgbmV3IGNscy5VcGRhdGVUYWJsZUJsb2NrKG9wdGlvbnMpLCBuZXcgY2xzLlNldEZpZWxkQmxvY2sob3B0aW9ucyksIG5ldyBjbHMuV2hlcmVCbG9jayhvcHRpb25zKSwgbmV3IGNscy5PcmRlckJ5QmxvY2sob3B0aW9ucyksIG5ldyBjbHMuTGltaXRCbG9jayhvcHRpb25zKV0pO1xuICAgICAgICBVcGRhdGUuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgb3B0aW9ucywgYmxvY2tzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIFVwZGF0ZTtcblxuICAgIH0pKGNscy5RdWVyeUJ1aWxkZXIpO1xuICAgIGNscy5EZWxldGUgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gICAgICBfX2V4dGVuZHMoRGVsZXRlLCBfc3VwZXIpO1xuXG4gICAgICBmdW5jdGlvbiBEZWxldGUob3B0aW9ucywgYmxvY2tzKSB7XG4gICAgICAgIGlmIChibG9ja3MgPT0gbnVsbCkge1xuICAgICAgICAgIGJsb2NrcyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgYmxvY2tzIHx8IChibG9ja3MgPSBbXG4gICAgICAgICAgbmV3IGNscy5TdHJpbmdCbG9jayhvcHRpb25zLCAnREVMRVRFJyksIG5ldyBjbHMuRnJvbVRhYmxlQmxvY2soX2V4dGVuZCh7fSwgb3B0aW9ucywge1xuICAgICAgICAgICAgc2luZ2xlVGFibGU6IHRydWVcbiAgICAgICAgICB9KSksIG5ldyBjbHMuSm9pbkJsb2NrKG9wdGlvbnMpLCBuZXcgY2xzLldoZXJlQmxvY2sob3B0aW9ucyksIG5ldyBjbHMuT3JkZXJCeUJsb2NrKG9wdGlvbnMpLCBuZXcgY2xzLkxpbWl0QmxvY2sob3B0aW9ucylcbiAgICAgICAgXSk7XG4gICAgICAgIERlbGV0ZS5fX3N1cGVyX18uY29uc3RydWN0b3IuY2FsbCh0aGlzLCBvcHRpb25zLCBibG9ja3MpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gRGVsZXRlO1xuXG4gICAgfSkoY2xzLlF1ZXJ5QnVpbGRlcik7XG4gICAgY2xzLkluc2VydCA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgICAgIF9fZXh0ZW5kcyhJbnNlcnQsIF9zdXBlcik7XG5cbiAgICAgIGZ1bmN0aW9uIEluc2VydChvcHRpb25zLCBibG9ja3MpIHtcbiAgICAgICAgaWYgKGJsb2NrcyA9PSBudWxsKSB7XG4gICAgICAgICAgYmxvY2tzID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBibG9ja3MgfHwgKGJsb2NrcyA9IFtuZXcgY2xzLlN0cmluZ0Jsb2NrKG9wdGlvbnMsICdJTlNFUlQnKSwgbmV3IGNscy5JbnRvVGFibGVCbG9jayhvcHRpb25zKSwgbmV3IGNscy5JbnNlcnRGaWVsZFZhbHVlQmxvY2sob3B0aW9ucyksIG5ldyBjbHMuSW5zZXJ0RmllbGRzRnJvbVF1ZXJ5QmxvY2sob3B0aW9ucyldKTtcbiAgICAgICAgSW5zZXJ0Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIG9wdGlvbnMsIGJsb2Nrcyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBJbnNlcnQ7XG5cbiAgICB9KShjbHMuUXVlcnlCdWlsZGVyKTtcbiAgICBfc3F1ZWwgPSB7XG4gICAgICBWRVJTSU9OOiAnNC4yLjAnLFxuICAgICAgZXhwcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2xzLkV4cHJlc3Npb247XG4gICAgICB9LFxuICAgICAgc2VsZWN0OiBmdW5jdGlvbihvcHRpb25zLCBibG9ja3MpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjbHMuU2VsZWN0KG9wdGlvbnMsIGJsb2Nrcyk7XG4gICAgICB9LFxuICAgICAgdXBkYXRlOiBmdW5jdGlvbihvcHRpb25zLCBibG9ja3MpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjbHMuVXBkYXRlKG9wdGlvbnMsIGJsb2Nrcyk7XG4gICAgICB9LFxuICAgICAgaW5zZXJ0OiBmdW5jdGlvbihvcHRpb25zLCBibG9ja3MpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjbHMuSW5zZXJ0KG9wdGlvbnMsIGJsb2Nrcyk7XG4gICAgICB9LFxuICAgICAgXCJkZWxldGVcIjogZnVuY3Rpb24ob3B0aW9ucywgYmxvY2tzKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2xzLkRlbGV0ZShvcHRpb25zLCBibG9ja3MpO1xuICAgICAgfSxcbiAgICAgIHJlZ2lzdGVyVmFsdWVIYW5kbGVyOiBjbHMucmVnaXN0ZXJWYWx1ZUhhbmRsZXIsXG4gICAgICBmdmFsOiBjbHMuZnZhbFxuICAgIH07XG4gICAgX3NxdWVsLnJlbW92ZSA9IF9zcXVlbFtcImRlbGV0ZVwiXTtcbiAgICBfc3F1ZWwuY2xzID0gY2xzO1xuICAgIHJldHVybiBfc3F1ZWw7XG4gIH07XG5cbiAgc3F1ZWwgPSBfYnVpbGRTcXVlbCgpO1xuXG4gIGlmICh0eXBlb2YgZGVmaW5lICE9PSBcInVuZGVmaW5lZFwiICYmIGRlZmluZSAhPT0gbnVsbCA/IGRlZmluZS5hbWQgOiB2b2lkIDApIHtcbiAgICBkZWZpbmUoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gc3F1ZWw7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBtb2R1bGUgIT09IG51bGwgPyBtb2R1bGUuZXhwb3J0cyA6IHZvaWQgMCkge1xuICAgIG1vZHVsZS5leHBvcnRzID0gc3F1ZWw7XG4gIH0gZWxzZSB7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgd2luZG93ICE9PSBudWxsKSB7XG4gICAgICB3aW5kb3cuc3F1ZWwgPSBzcXVlbDtcbiAgICB9XG4gIH1cblxuICBzcXVlbC5mbGF2b3VycyA9IHt9O1xuXG4gIHNxdWVsLnVzZUZsYXZvdXIgPSBmdW5jdGlvbihmbGF2b3VyKSB7XG4gICAgdmFyIHM7XG4gICAgaWYgKGZsYXZvdXIgPT0gbnVsbCkge1xuICAgICAgZmxhdm91ciA9IG51bGw7XG4gICAgfVxuICAgIGlmICghZmxhdm91cikge1xuICAgICAgcmV0dXJuIHNxdWVsO1xuICAgIH1cbiAgICBpZiAoc3F1ZWwuZmxhdm91cnNbZmxhdm91cl0gaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgcyA9IF9idWlsZFNxdWVsKCk7XG4gICAgICBzcXVlbC5mbGF2b3Vyc1tmbGF2b3VyXS5jYWxsKG51bGwsIHMpO1xuICAgICAgcmV0dXJuIHM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkZsYXZvdXIgbm90IGF2YWlsYWJsZTogXCIgKyBmbGF2b3VyKTtcbiAgICB9XG4gIH07XG5cbiAgLypcbiAgQ29weXJpZ2h0IChjKSBSYW1lc2ggTmFpciAoaGlkZGVudGFvLmNvbSlcbiAgXG4gIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uXG4gIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dFxuICByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSxcbiAgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlXG4gIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nXG4gIGNvbmRpdGlvbnM6XG4gIFxuICBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZVxuICBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAgXG4gIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFU1xuICBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxuICBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVFxuICBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSxcbiAgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HXG4gIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1JcbiAgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICAqL1xuXG5cbiAgc3F1ZWwuZmxhdm91cnNbJ3Bvc3RncmVzJ10gPSBmdW5jdGlvbihfc3F1ZWwpIHtcbiAgICB2YXIgY2xzO1xuICAgIGNscyA9IF9zcXVlbC5jbHM7XG4gICAgY2xzLkRlZmF1bHRRdWVyeUJ1aWxkZXJPcHRpb25zLm51bWJlcmVkUGFyYW1ldGVycyA9IHRydWU7XG4gICAgY2xzLkRlZmF1bHRRdWVyeUJ1aWxkZXJPcHRpb25zLm51bWJlcmVkUGFyYW1ldGVyc1N0YXJ0QXQgPSAxO1xuICAgIGNscy5EZWZhdWx0UXVlcnlCdWlsZGVyT3B0aW9ucy5hdXRvUXVvdGVBbGlhc05hbWVzID0gZmFsc2U7XG4gICAgY2xzLlJldHVybmluZ0Jsb2NrID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICAgICAgX19leHRlbmRzKFJldHVybmluZ0Jsb2NrLCBfc3VwZXIpO1xuXG4gICAgICBmdW5jdGlvbiBSZXR1cm5pbmdCbG9jayhvcHRpb25zKSB7XG4gICAgICAgIFJldHVybmluZ0Jsb2NrLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLl9zdHIgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBSZXR1cm5pbmdCbG9jay5wcm90b3R5cGUucmV0dXJuaW5nID0gZnVuY3Rpb24ocmV0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdHIgPSB0aGlzLl9zYW5pdGl6ZUZpZWxkKHJldCk7XG4gICAgICB9O1xuXG4gICAgICBSZXR1cm5pbmdCbG9jay5wcm90b3R5cGUuYnVpbGRTdHIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuX3N0cikge1xuICAgICAgICAgIHJldHVybiBcIlJFVFVSTklORyBcIiArIHRoaXMuX3N0cjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIFJldHVybmluZ0Jsb2NrO1xuXG4gICAgfSkoY2xzLkJsb2NrKTtcbiAgICBjbHMuSW5zZXJ0ID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICAgICAgX19leHRlbmRzKEluc2VydCwgX3N1cGVyKTtcblxuICAgICAgZnVuY3Rpb24gSW5zZXJ0KG9wdGlvbnMsIGJsb2Nrcykge1xuICAgICAgICBpZiAoYmxvY2tzID09IG51bGwpIHtcbiAgICAgICAgICBibG9ja3MgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGJsb2NrcyB8fCAoYmxvY2tzID0gW25ldyBjbHMuU3RyaW5nQmxvY2sob3B0aW9ucywgJ0lOU0VSVCcpLCBuZXcgY2xzLkludG9UYWJsZUJsb2NrKG9wdGlvbnMpLCBuZXcgY2xzLkluc2VydEZpZWxkVmFsdWVCbG9jayhvcHRpb25zKSwgbmV3IGNscy5JbnNlcnRGaWVsZHNGcm9tUXVlcnlCbG9jayhvcHRpb25zKSwgbmV3IGNscy5SZXR1cm5pbmdCbG9jayhvcHRpb25zKV0pO1xuICAgICAgICBJbnNlcnQuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgb3B0aW9ucywgYmxvY2tzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIEluc2VydDtcblxuICAgIH0pKGNscy5RdWVyeUJ1aWxkZXIpO1xuICAgIGNscy5VcGRhdGUgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gICAgICBfX2V4dGVuZHMoVXBkYXRlLCBfc3VwZXIpO1xuXG4gICAgICBmdW5jdGlvbiBVcGRhdGUob3B0aW9ucywgYmxvY2tzKSB7XG4gICAgICAgIGlmIChibG9ja3MgPT0gbnVsbCkge1xuICAgICAgICAgIGJsb2NrcyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgYmxvY2tzIHx8IChibG9ja3MgPSBbbmV3IGNscy5TdHJpbmdCbG9jayhvcHRpb25zLCAnVVBEQVRFJyksIG5ldyBjbHMuVXBkYXRlVGFibGVCbG9jayhvcHRpb25zKSwgbmV3IGNscy5TZXRGaWVsZEJsb2NrKG9wdGlvbnMpLCBuZXcgY2xzLldoZXJlQmxvY2sob3B0aW9ucyksIG5ldyBjbHMuT3JkZXJCeUJsb2NrKG9wdGlvbnMpLCBuZXcgY2xzLkxpbWl0QmxvY2sob3B0aW9ucyksIG5ldyBjbHMuUmV0dXJuaW5nQmxvY2sob3B0aW9ucyldKTtcbiAgICAgICAgVXBkYXRlLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIG9wdGlvbnMsIGJsb2Nrcyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBVcGRhdGU7XG5cbiAgICB9KShjbHMuUXVlcnlCdWlsZGVyKTtcbiAgICByZXR1cm4gY2xzLkRlbGV0ZSA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgICAgIF9fZXh0ZW5kcyhEZWxldGUsIF9zdXBlcik7XG5cbiAgICAgIGZ1bmN0aW9uIERlbGV0ZShvcHRpb25zLCBibG9ja3MpIHtcbiAgICAgICAgaWYgKGJsb2NrcyA9PSBudWxsKSB7XG4gICAgICAgICAgYmxvY2tzID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBibG9ja3MgfHwgKGJsb2NrcyA9IFtcbiAgICAgICAgICBuZXcgY2xzLlN0cmluZ0Jsb2NrKG9wdGlvbnMsICdERUxFVEUnKSwgbmV3IGNscy5Gcm9tVGFibGVCbG9jayhfZXh0ZW5kKHt9LCBvcHRpb25zLCB7XG4gICAgICAgICAgICBzaW5nbGVUYWJsZTogdHJ1ZVxuICAgICAgICAgIH0pKSwgbmV3IGNscy5Kb2luQmxvY2sob3B0aW9ucyksIG5ldyBjbHMuV2hlcmVCbG9jayhvcHRpb25zKSwgbmV3IGNscy5PcmRlckJ5QmxvY2sob3B0aW9ucyksIG5ldyBjbHMuTGltaXRCbG9jayhvcHRpb25zKSwgbmV3IGNscy5SZXR1cm5pbmdCbG9jayhvcHRpb25zKVxuICAgICAgICBdKTtcbiAgICAgICAgRGVsZXRlLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIG9wdGlvbnMsIGJsb2Nrcyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBEZWxldGU7XG5cbiAgICB9KShjbHMuUXVlcnlCdWlsZGVyKTtcbiAgfTtcblxuICAvKlxuICBDb3B5cmlnaHQgKGMpIFJhbWVzaCBOYWlyIChoaWRkZW50YW8uY29tKVxuICBcbiAgUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAgb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb25cbiAgZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0XG4gIHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLFxuICBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuICBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGVcbiAgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmdcbiAgY29uZGl0aW9uczpcbiAgXG4gIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlXG4gIGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICBcbiAgVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTXG4gIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EXG4gIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUXG4gIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLFxuICBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkdcbiAgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUlxuICBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gICovXG5cblxuICBzcXVlbC5mbGF2b3Vyc1snbXlzcWwnXSA9IGZ1bmN0aW9uKF9zcXVlbCkge1xuICAgIHZhciBjbHMsIF9yZWYsIF9yZWYxO1xuICAgIGNscyA9IF9zcXVlbC5jbHM7XG4gICAgY2xzLlRhcmdldFRhYmxlQmxvY2sgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gICAgICBfX2V4dGVuZHMoVGFyZ2V0VGFibGVCbG9jaywgX3N1cGVyKTtcblxuICAgICAgZnVuY3Rpb24gVGFyZ2V0VGFibGVCbG9jaygpIHtcbiAgICAgICAgX3JlZiA9IFRhcmdldFRhYmxlQmxvY2suX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIHJldHVybiBfcmVmO1xuICAgICAgfVxuXG4gICAgICBUYXJnZXRUYWJsZUJsb2NrLnByb3RvdHlwZS50YXJnZXQgPSBmdW5jdGlvbih0YWJsZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2V0VmFsdWUodGhpcy5fc2FuaXRpemVUYWJsZSh0YWJsZSkpO1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIFRhcmdldFRhYmxlQmxvY2s7XG5cbiAgICB9KShjbHMuQWJzdHJhY3RWYWx1ZUJsb2NrKTtcbiAgICBjbHMuTXlzcWxPbkR1cGxpY2F0ZUtleVVwZGF0ZUJsb2NrID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICAgICAgX19leHRlbmRzKE15c3FsT25EdXBsaWNhdGVLZXlVcGRhdGVCbG9jaywgX3N1cGVyKTtcblxuICAgICAgZnVuY3Rpb24gTXlzcWxPbkR1cGxpY2F0ZUtleVVwZGF0ZUJsb2NrKCkge1xuICAgICAgICBfcmVmMSA9IE15c3FsT25EdXBsaWNhdGVLZXlVcGRhdGVCbG9jay5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIF9yZWYxO1xuICAgICAgfVxuXG4gICAgICBNeXNxbE9uRHVwbGljYXRlS2V5VXBkYXRlQmxvY2sucHJvdG90eXBlLm9uRHVwVXBkYXRlID0gZnVuY3Rpb24oZmllbGQsIHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zZXQoZmllbGQsIHZhbHVlLCBvcHRpb25zKTtcbiAgICAgIH07XG5cbiAgICAgIE15c3FsT25EdXBsaWNhdGVLZXlVcGRhdGVCbG9jay5wcm90b3R5cGUuYnVpbGRTdHIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGZpZWxkLCBmaWVsZE9wdGlvbnMsIGksIHN0ciwgdmFsdWUsIF9pLCBfcmVmMjtcbiAgICAgICAgc3RyID0gXCJcIjtcbiAgICAgICAgZm9yIChpID0gX2kgPSAwLCBfcmVmMiA9IHRoaXMuZmllbGRzLmxlbmd0aDsgMCA8PSBfcmVmMiA/IF9pIDwgX3JlZjIgOiBfaSA+IF9yZWYyOyBpID0gMCA8PSBfcmVmMiA/ICsrX2kgOiAtLV9pKSB7XG4gICAgICAgICAgZmllbGQgPSB0aGlzLmZpZWxkc1tpXTtcbiAgICAgICAgICBpZiAoXCJcIiAhPT0gc3RyKSB7XG4gICAgICAgICAgICBzdHIgKz0gXCIsIFwiO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YWx1ZSA9IHRoaXMudmFsdWVzWzBdW2ldO1xuICAgICAgICAgIGZpZWxkT3B0aW9ucyA9IHRoaXMuZmllbGRPcHRpb25zWzBdW2ldO1xuICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBzdHIgKz0gZmllbGQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0ciArPSBcIlwiICsgZmllbGQgKyBcIiA9IFwiICsgKHRoaXMuX2Zvcm1hdFZhbHVlKHZhbHVlLCBmaWVsZE9wdGlvbnMpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0ciA9PT0gXCJcIikge1xuICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBcIk9OIERVUExJQ0FURSBLRVkgVVBEQVRFIFwiICsgc3RyO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBNeXNxbE9uRHVwbGljYXRlS2V5VXBkYXRlQmxvY2sucHJvdG90eXBlLmJ1aWxkUGFyYW0gPSBmdW5jdGlvbihxdWVyeUJ1aWxkZXIpIHtcbiAgICAgICAgdmFyIGZpZWxkLCBpLCBzdHIsIHZhbHMsIHZhbHVlLCBfaSwgX3JlZjI7XG4gICAgICAgIHN0ciA9IFwiXCI7XG4gICAgICAgIHZhbHMgPSBbXTtcbiAgICAgICAgZm9yIChpID0gX2kgPSAwLCBfcmVmMiA9IHRoaXMuZmllbGRzLmxlbmd0aDsgMCA8PSBfcmVmMiA/IF9pIDwgX3JlZjIgOiBfaSA+IF9yZWYyOyBpID0gMCA8PSBfcmVmMiA/ICsrX2kgOiAtLV9pKSB7XG4gICAgICAgICAgZmllbGQgPSB0aGlzLmZpZWxkc1tpXTtcbiAgICAgICAgICBpZiAoXCJcIiAhPT0gc3RyKSB7XG4gICAgICAgICAgICBzdHIgKz0gXCIsIFwiO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YWx1ZSA9IHRoaXMudmFsdWVzWzBdW2ldO1xuICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBzdHIgKz0gZmllbGQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0ciArPSBcIlwiICsgZmllbGQgKyBcIiA9ID9cIjtcbiAgICAgICAgICAgIHZhbHMucHVzaCh0aGlzLl9mb3JtYXRWYWx1ZUFzUGFyYW0odmFsdWUpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB0ZXh0OiBzdHIgPT09IFwiXCIgPyBcIlwiIDogXCJPTiBEVVBMSUNBVEUgS0VZIFVQREFURSBcIiArIHN0cixcbiAgICAgICAgICB2YWx1ZXM6IHZhbHNcbiAgICAgICAgfTtcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBNeXNxbE9uRHVwbGljYXRlS2V5VXBkYXRlQmxvY2s7XG5cbiAgICB9KShjbHMuQWJzdHJhY3RTZXRGaWVsZEJsb2NrKTtcbiAgICBjbHMuSW5zZXJ0ID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICAgICAgX19leHRlbmRzKEluc2VydCwgX3N1cGVyKTtcblxuICAgICAgZnVuY3Rpb24gSW5zZXJ0KG9wdGlvbnMsIGJsb2Nrcykge1xuICAgICAgICBpZiAoYmxvY2tzID09IG51bGwpIHtcbiAgICAgICAgICBibG9ja3MgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGJsb2NrcyB8fCAoYmxvY2tzID0gW25ldyBjbHMuU3RyaW5nQmxvY2sob3B0aW9ucywgJ0lOU0VSVCcpLCBuZXcgY2xzLkludG9UYWJsZUJsb2NrKG9wdGlvbnMpLCBuZXcgY2xzLkluc2VydEZpZWxkVmFsdWVCbG9jayhvcHRpb25zKSwgbmV3IGNscy5JbnNlcnRGaWVsZHNGcm9tUXVlcnlCbG9jayhvcHRpb25zKSwgbmV3IGNscy5NeXNxbE9uRHVwbGljYXRlS2V5VXBkYXRlQmxvY2sob3B0aW9ucyldKTtcbiAgICAgICAgSW5zZXJ0Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIG9wdGlvbnMsIGJsb2Nrcyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBJbnNlcnQ7XG5cbiAgICB9KShjbHMuUXVlcnlCdWlsZGVyKTtcbiAgICByZXR1cm4gY2xzLkRlbGV0ZSA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgICAgIF9fZXh0ZW5kcyhEZWxldGUsIF9zdXBlcik7XG5cbiAgICAgIGZ1bmN0aW9uIERlbGV0ZShvcHRpb25zLCBibG9ja3MpIHtcbiAgICAgICAgaWYgKGJsb2NrcyA9PSBudWxsKSB7XG4gICAgICAgICAgYmxvY2tzID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBibG9ja3MgfHwgKGJsb2NrcyA9IFtcbiAgICAgICAgICBuZXcgY2xzLlN0cmluZ0Jsb2NrKG9wdGlvbnMsICdERUxFVEUnKSwgbmV3IGNscy5UYXJnZXRUYWJsZUJsb2NrKG9wdGlvbnMpLCBuZXcgY2xzLkZyb21UYWJsZUJsb2NrKF9leHRlbmQoe30sIG9wdGlvbnMsIHtcbiAgICAgICAgICAgIHNpbmdsZVRhYmxlOiB0cnVlXG4gICAgICAgICAgfSkpLCBuZXcgY2xzLkpvaW5CbG9jayhvcHRpb25zKSwgbmV3IGNscy5XaGVyZUJsb2NrKG9wdGlvbnMpLCBuZXcgY2xzLk9yZGVyQnlCbG9jayhvcHRpb25zKSwgbmV3IGNscy5MaW1pdEJsb2NrKG9wdGlvbnMpXG4gICAgICAgIF0pO1xuICAgICAgICBEZWxldGUuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgb3B0aW9ucywgYmxvY2tzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIERlbGV0ZTtcblxuICAgIH0pKGNscy5RdWVyeUJ1aWxkZXIpO1xuICB9O1xuXG4gIC8qXG4gIENvcHlyaWdodCAoYykgUmFtZXNoIE5haXIgKGhpZGRlbnRhby5jb20pXG4gIFxuICBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvblxuICBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXRcbiAgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsXG4gIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZVxuICBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZ1xuICBjb25kaXRpb25zOlxuICBcbiAgVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmVcbiAgaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gIFxuICBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVNcbiAgT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkRcbiAgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFRcbiAgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksXG4gIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lOR1xuICBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SXG4gIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAgKi9cblxuXG4gIF9leHRlbmQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZHN0LCBrLCBzb3VyY2VzLCBzcmMsIHYsIF9pLCBfbGVuO1xuICAgIGRzdCA9IGFyZ3VtZW50c1swXSwgc291cmNlcyA9IDIgPD0gYXJndW1lbnRzLmxlbmd0aCA/IF9fc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpIDogW107XG4gICAgaWYgKHNvdXJjZXMpIHtcbiAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gc291cmNlcy5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICBzcmMgPSBzb3VyY2VzW19pXTtcbiAgICAgICAgaWYgKHNyYykge1xuICAgICAgICAgIGZvciAoayBpbiBzcmMpIHtcbiAgICAgICAgICAgIGlmICghX19oYXNQcm9wLmNhbGwoc3JjLCBrKSkgY29udGludWU7XG4gICAgICAgICAgICB2ID0gc3JjW2tdO1xuICAgICAgICAgICAgZHN0W2tdID0gdjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRzdDtcbiAgfTtcblxuICBzcXVlbC5mbGF2b3Vyc1snbXNzcWwnXSA9IGZ1bmN0aW9uKF9zcXVlbCkge1xuICAgIHZhciBjbHM7XG4gICAgY2xzID0gX3NxdWVsLmNscztcbiAgICBjbHMuRGVmYXVsdFF1ZXJ5QnVpbGRlck9wdGlvbnMucmVwbGFjZVNpbmdsZVF1b3RlcyA9IHRydWU7XG4gICAgY2xzLkRlZmF1bHRRdWVyeUJ1aWxkZXJPcHRpb25zLmF1dG9RdW90ZUFsaWFzTmFtZXMgPSBmYWxzZTtcbiAgICBfc3F1ZWwucmVnaXN0ZXJWYWx1ZUhhbmRsZXIoRGF0ZSwgZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgcmV0dXJuIFwiJ1wiICsgKGRhdGUuZ2V0VVRDRnVsbFllYXIoKSkgKyBcIi1cIiArIChkYXRlLmdldFVUQ01vbnRoKCkgKyAxKSArIFwiLVwiICsgKGRhdGUuZ2V0VVRDRGF0ZSgpKSArIFwiIFwiICsgKGRhdGUuZ2V0VVRDSG91cnMoKSkgKyBcIjpcIiArIChkYXRlLmdldFVUQ01pbnV0ZXMoKSkgKyBcIjpcIiArIChkYXRlLmdldFVUQ1NlY29uZHMoKSkgKyBcIidcIjtcbiAgICB9KTtcbiAgICBjbHMuTXNzcWxMaW1pdE9mZnNldFRvcEJsb2NrID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICAgICAgdmFyIExpbWl0QmxvY2ssIE9mZnNldEJsb2NrLCBQYXJlbnRCbG9jaywgVG9wQmxvY2ssIF9saW1pdCwgX3JlZiwgX3JlZjEsIF9yZWYyO1xuXG4gICAgICBfX2V4dGVuZHMoTXNzcWxMaW1pdE9mZnNldFRvcEJsb2NrLCBfc3VwZXIpO1xuXG4gICAgICBmdW5jdGlvbiBNc3NxbExpbWl0T2Zmc2V0VG9wQmxvY2sob3B0aW9ucykge1xuICAgICAgICBNc3NxbExpbWl0T2Zmc2V0VG9wQmxvY2suX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgb3B0aW9ucyk7XG4gICAgICAgIHRoaXMubGltaXRzID0gbnVsbDtcbiAgICAgICAgdGhpcy5vZmZzZXRzID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgX2xpbWl0ID0gZnVuY3Rpb24obWF4KSB7XG4gICAgICAgIG1heCA9IHRoaXMuX3Nhbml0aXplTGltaXRPZmZzZXQobWF4KTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudC5saW1pdHMgPSBtYXg7XG4gICAgICB9O1xuXG4gICAgICBQYXJlbnRCbG9jayA9IChmdW5jdGlvbihfc3VwZXIxKSB7XG4gICAgICAgIF9fZXh0ZW5kcyhQYXJlbnRCbG9jaywgX3N1cGVyMSk7XG5cbiAgICAgICAgZnVuY3Rpb24gUGFyZW50QmxvY2socGFyZW50KSB7XG4gICAgICAgICAgUGFyZW50QmxvY2suX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgcGFyZW50Lm9wdGlvbnMpO1xuICAgICAgICAgIHRoaXMuX3BhcmVudCA9IHBhcmVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBQYXJlbnRCbG9jaztcblxuICAgICAgfSkoY2xzLkJsb2NrKTtcblxuICAgICAgTGltaXRCbG9jayA9IChmdW5jdGlvbihfc3VwZXIxKSB7XG4gICAgICAgIF9fZXh0ZW5kcyhMaW1pdEJsb2NrLCBfc3VwZXIxKTtcblxuICAgICAgICBmdW5jdGlvbiBMaW1pdEJsb2NrKCkge1xuICAgICAgICAgIF9yZWYgPSBMaW1pdEJsb2NrLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgIHJldHVybiBfcmVmO1xuICAgICAgICB9XG5cbiAgICAgICAgTGltaXRCbG9jay5wcm90b3R5cGUubGltaXQgPSBfbGltaXQ7XG5cbiAgICAgICAgTGltaXRCbG9jay5wcm90b3R5cGUuYnVpbGRTdHIgPSBmdW5jdGlvbihxdWVyeUJ1aWxkZXIpIHtcbiAgICAgICAgICBpZiAodGhpcy5fcGFyZW50LmxpbWl0cyAmJiB0aGlzLl9wYXJlbnQub2Zmc2V0cykge1xuICAgICAgICAgICAgcmV0dXJuIFwiRkVUQ0ggTkVYVCBcIiArIHRoaXMuX3BhcmVudC5saW1pdHMgKyBcIiBST1dTIE9OTFlcIjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBMaW1pdEJsb2NrO1xuXG4gICAgICB9KShQYXJlbnRCbG9jayk7XG5cbiAgICAgIFRvcEJsb2NrID0gKGZ1bmN0aW9uKF9zdXBlcjEpIHtcbiAgICAgICAgX19leHRlbmRzKFRvcEJsb2NrLCBfc3VwZXIxKTtcblxuICAgICAgICBmdW5jdGlvbiBUb3BCbG9jaygpIHtcbiAgICAgICAgICBfcmVmMSA9IFRvcEJsb2NrLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgIHJldHVybiBfcmVmMTtcbiAgICAgICAgfVxuXG4gICAgICAgIFRvcEJsb2NrLnByb3RvdHlwZS50b3AgPSBfbGltaXQ7XG5cbiAgICAgICAgVG9wQmxvY2sucHJvdG90eXBlLmJ1aWxkU3RyID0gZnVuY3Rpb24ocXVlcnlCdWlsZGVyKSB7XG4gICAgICAgICAgaWYgKHRoaXMuX3BhcmVudC5saW1pdHMgJiYgIXRoaXMuX3BhcmVudC5vZmZzZXRzKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJUT1AgKFwiICsgdGhpcy5fcGFyZW50LmxpbWl0cyArIFwiKVwiO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIFRvcEJsb2NrO1xuXG4gICAgICB9KShQYXJlbnRCbG9jayk7XG5cbiAgICAgIE9mZnNldEJsb2NrID0gKGZ1bmN0aW9uKF9zdXBlcjEpIHtcbiAgICAgICAgX19leHRlbmRzKE9mZnNldEJsb2NrLCBfc3VwZXIxKTtcblxuICAgICAgICBmdW5jdGlvbiBPZmZzZXRCbG9jaygpIHtcbiAgICAgICAgICB0aGlzLm9mZnNldCA9IF9fYmluZCh0aGlzLm9mZnNldCwgdGhpcyk7XG4gICAgICAgICAgX3JlZjIgPSBPZmZzZXRCbG9jay5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICByZXR1cm4gX3JlZjI7XG4gICAgICAgIH1cblxuICAgICAgICBPZmZzZXRCbG9jay5wcm90b3R5cGUub2Zmc2V0ID0gZnVuY3Rpb24oc3RhcnQpIHtcbiAgICAgICAgICBzdGFydCA9IHRoaXMuX3Nhbml0aXplTGltaXRPZmZzZXQoc3RhcnQpO1xuICAgICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQub2Zmc2V0cyA9IHN0YXJ0O1xuICAgICAgICB9O1xuXG4gICAgICAgIE9mZnNldEJsb2NrLnByb3RvdHlwZS5idWlsZFN0ciA9IGZ1bmN0aW9uKHF1ZXJ5QnVpbGRlcikge1xuICAgICAgICAgIGlmICh0aGlzLl9wYXJlbnQub2Zmc2V0cykge1xuICAgICAgICAgICAgcmV0dXJuIFwiT0ZGU0VUIFwiICsgdGhpcy5fcGFyZW50Lm9mZnNldHMgKyBcIiBST1dTXCI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gT2Zmc2V0QmxvY2s7XG5cbiAgICAgIH0pKFBhcmVudEJsb2NrKTtcblxuICAgICAgTXNzcWxMaW1pdE9mZnNldFRvcEJsb2NrLnByb3RvdHlwZS5MSU1JVCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5jb25zdHJ1Y3RvcihvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIG5ldyBMaW1pdEJsb2NrKHRoaXMpO1xuICAgICAgfTtcblxuICAgICAgTXNzcWxMaW1pdE9mZnNldFRvcEJsb2NrLnByb3RvdHlwZS5UT1AgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuY29uc3RydWN0b3Iob3B0aW9ucyk7XG4gICAgICAgIHJldHVybiBuZXcgVG9wQmxvY2sodGhpcyk7XG4gICAgICB9O1xuXG4gICAgICBNc3NxbExpbWl0T2Zmc2V0VG9wQmxvY2sucHJvdG90eXBlLk9GRlNFVCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5jb25zdHJ1Y3RvcihvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIG5ldyBPZmZzZXRCbG9jayh0aGlzKTtcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBNc3NxbExpbWl0T2Zmc2V0VG9wQmxvY2s7XG5cbiAgICB9KS5jYWxsKHRoaXMsIGNscy5CbG9jayk7XG4gICAgY2xzLk1zc3FsVXBkYXRlVG9wQmxvY2sgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gICAgICB2YXIgX2xpbWl0O1xuXG4gICAgICBfX2V4dGVuZHMoTXNzcWxVcGRhdGVUb3BCbG9jaywgX3N1cGVyKTtcblxuICAgICAgZnVuY3Rpb24gTXNzcWxVcGRhdGVUb3BCbG9jayhvcHRpb25zKSB7XG4gICAgICAgIE1zc3FsVXBkYXRlVG9wQmxvY2suX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgb3B0aW9ucyk7XG4gICAgICAgIHRoaXMubGltaXRzID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgX2xpbWl0ID0gZnVuY3Rpb24obWF4KSB7XG4gICAgICAgIG1heCA9IHRoaXMuX3Nhbml0aXplTGltaXRPZmZzZXQobWF4KTtcbiAgICAgICAgcmV0dXJuIHRoaXMubGltaXRzID0gbWF4O1xuICAgICAgfTtcblxuICAgICAgTXNzcWxVcGRhdGVUb3BCbG9jay5wcm90b3R5cGUubGltaXQgPSBfbGltaXQ7XG5cbiAgICAgIE1zc3FsVXBkYXRlVG9wQmxvY2sucHJvdG90eXBlLnRvcCA9IF9saW1pdDtcblxuICAgICAgTXNzcWxVcGRhdGVUb3BCbG9jay5wcm90b3R5cGUuYnVpbGRTdHIgPSBmdW5jdGlvbihxdWVyeUJ1aWxkZXIpIHtcbiAgICAgICAgaWYgKHRoaXMubGltaXRzKSB7XG4gICAgICAgICAgcmV0dXJuIFwiVE9QIChcIiArIHRoaXMubGltaXRzICsgXCIpXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBNc3NxbFVwZGF0ZVRvcEJsb2NrO1xuXG4gICAgfSkoY2xzLkJsb2NrKTtcbiAgICBjbHMuTXNzcWxJbnNlcnRGaWVsZFZhbHVlQmxvY2sgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gICAgICBfX2V4dGVuZHMoTXNzcWxJbnNlcnRGaWVsZFZhbHVlQmxvY2ssIF9zdXBlcik7XG5cbiAgICAgIGZ1bmN0aW9uIE1zc3FsSW5zZXJ0RmllbGRWYWx1ZUJsb2NrKG9wdGlvbnMpIHtcbiAgICAgICAgTXNzcWxJbnNlcnRGaWVsZFZhbHVlQmxvY2suX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgb3B0aW9ucyk7XG4gICAgICAgIHRoaXMub3V0cHV0cyA9IFtdO1xuICAgICAgfVxuXG4gICAgICBNc3NxbEluc2VydEZpZWxkVmFsdWVCbG9jay5wcm90b3R5cGUub3V0cHV0ID0gZnVuY3Rpb24oZmllbGRzKSB7XG4gICAgICAgIHZhciBmLCBfaSwgX2xlbiwgX3Jlc3VsdHM7XG4gICAgICAgIGlmICgnc3RyaW5nJyA9PT0gdHlwZW9mIGZpZWxkcykge1xuICAgICAgICAgIHJldHVybiB0aGlzLm91dHB1dHMucHVzaChcIklOU0VSVEVELlwiICsgKHRoaXMuX3Nhbml0aXplRmllbGQoZmllbGRzKSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBmaWVsZHMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgICAgICAgIGYgPSBmaWVsZHNbX2ldO1xuICAgICAgICAgICAgX3Jlc3VsdHMucHVzaCh0aGlzLm91dHB1dHMucHVzaChcIklOU0VSVEVELlwiICsgKHRoaXMuX3Nhbml0aXplRmllbGQoZikpKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgTXNzcWxJbnNlcnRGaWVsZFZhbHVlQmxvY2sucHJvdG90eXBlLmJ1aWxkU3RyID0gZnVuY3Rpb24ocXVlcnlCdWlsZGVyKSB7XG4gICAgICAgIGlmICgwID49IHRoaXMuZmllbGRzLmxlbmd0aCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInNldCgpIG5lZWRzIHRvIGJlIGNhbGxlZFwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCIoXCIgKyAodGhpcy5maWVsZHMuam9pbignLCAnKSkgKyBcIikgXCIgKyAodGhpcy5vdXRwdXRzLmxlbmd0aCAhPT0gMCA/IFwiT1VUUFVUIFwiICsgKHRoaXMub3V0cHV0cy5qb2luKCcsICcpKSArIFwiIFwiIDogJycpICsgXCJWQUxVRVMgKFwiICsgKHRoaXMuX2J1aWxkVmFscygpLmpvaW4oJyksICgnKSkgKyBcIilcIjtcbiAgICAgIH07XG5cbiAgICAgIE1zc3FsSW5zZXJ0RmllbGRWYWx1ZUJsb2NrLnByb3RvdHlwZS5idWlsZFBhcmFtID0gZnVuY3Rpb24ocXVlcnlCdWlsZGVyKSB7XG4gICAgICAgIHZhciBpLCBwYXJhbXMsIHN0ciwgdmFscywgX2ksIF9yZWYsIF9yZWYxO1xuICAgICAgICBpZiAoMCA+PSB0aGlzLmZpZWxkcy5sZW5ndGgpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJzZXQoKSBuZWVkcyB0byBiZSBjYWxsZWRcIik7XG4gICAgICAgIH1cbiAgICAgICAgc3RyID0gXCJcIjtcbiAgICAgICAgX3JlZiA9IHRoaXMuX2J1aWxkVmFsUGFyYW1zKCksIHZhbHMgPSBfcmVmLnZhbHMsIHBhcmFtcyA9IF9yZWYucGFyYW1zO1xuICAgICAgICBmb3IgKGkgPSBfaSA9IDAsIF9yZWYxID0gdGhpcy5maWVsZHMubGVuZ3RoOyAwIDw9IF9yZWYxID8gX2kgPCBfcmVmMSA6IF9pID4gX3JlZjE7IGkgPSAwIDw9IF9yZWYxID8gKytfaSA6IC0tX2kpIHtcbiAgICAgICAgICBpZiAoXCJcIiAhPT0gc3RyKSB7XG4gICAgICAgICAgICBzdHIgKz0gXCIsIFwiO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzdHIgKz0gdGhpcy5maWVsZHNbaV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB0ZXh0OiBcIihcIiArIHN0ciArIFwiKSBcIiArICh0aGlzLm91dHB1dHMubGVuZ3RoICE9PSAwID8gXCJPVVRQVVQgXCIgKyAodGhpcy5vdXRwdXRzLmpvaW4oJywgJykpICsgXCIgXCIgOiAnJykgKyBcIlZBTFVFUyAoXCIgKyAodmFscy5qb2luKCcpLCAoJykpICsgXCIpXCIsXG4gICAgICAgICAgdmFsdWVzOiBwYXJhbXNcbiAgICAgICAgfTtcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBNc3NxbEluc2VydEZpZWxkVmFsdWVCbG9jaztcblxuICAgIH0pKGNscy5JbnNlcnRGaWVsZFZhbHVlQmxvY2spO1xuICAgIGNscy5Nc3NxbFVwZGF0ZURlbGV0ZU91dHB1dEJsb2NrID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICAgICAgX19leHRlbmRzKE1zc3FsVXBkYXRlRGVsZXRlT3V0cHV0QmxvY2ssIF9zdXBlcik7XG5cbiAgICAgIGZ1bmN0aW9uIE1zc3FsVXBkYXRlRGVsZXRlT3V0cHV0QmxvY2sob3B0aW9ucykge1xuICAgICAgICBNc3NxbFVwZGF0ZURlbGV0ZU91dHB1dEJsb2NrLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLl9vdXRwdXRzID0gW107XG4gICAgICB9XG5cbiAgICAgIE1zc3FsVXBkYXRlRGVsZXRlT3V0cHV0QmxvY2sucHJvdG90eXBlLm91dHB1dHMgPSBmdW5jdGlvbihfb3V0cHV0cykge1xuICAgICAgICB2YXIgYWxpYXMsIG91dHB1dCwgX3Jlc3VsdHM7XG4gICAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICAgIGZvciAob3V0cHV0IGluIF9vdXRwdXRzKSB7XG4gICAgICAgICAgYWxpYXMgPSBfb3V0cHV0c1tvdXRwdXRdO1xuICAgICAgICAgIF9yZXN1bHRzLnB1c2godGhpcy5vdXRwdXQob3V0cHV0LCBhbGlhcykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICAgIH07XG5cbiAgICAgIE1zc3FsVXBkYXRlRGVsZXRlT3V0cHV0QmxvY2sucHJvdG90eXBlLm91dHB1dCA9IGZ1bmN0aW9uKG91dHB1dCwgYWxpYXMpIHtcbiAgICAgICAgaWYgKGFsaWFzID09IG51bGwpIHtcbiAgICAgICAgICBhbGlhcyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgb3V0cHV0ID0gdGhpcy5fc2FuaXRpemVGaWVsZChvdXRwdXQpO1xuICAgICAgICBpZiAoYWxpYXMpIHtcbiAgICAgICAgICBhbGlhcyA9IHRoaXMuX3Nhbml0aXplRmllbGRBbGlhcyhhbGlhcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX291dHB1dHMucHVzaCh7XG4gICAgICAgICAgbmFtZTogdGhpcy5vcHRpb25zLmZvckRlbGV0ZSA/IFwiREVMRVRFRC5cIiArIG91dHB1dCA6IFwiSU5TRVJURUQuXCIgKyBvdXRwdXQsXG4gICAgICAgICAgYWxpYXM6IGFsaWFzXG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgTXNzcWxVcGRhdGVEZWxldGVPdXRwdXRCbG9jay5wcm90b3R5cGUuYnVpbGRTdHIgPSBmdW5jdGlvbihxdWVyeUJ1aWxkZXIpIHtcbiAgICAgICAgdmFyIG91dHB1dCwgb3V0cHV0cywgX2ksIF9sZW4sIF9yZWY7XG4gICAgICAgIG91dHB1dHMgPSBcIlwiO1xuICAgICAgICBpZiAodGhpcy5fb3V0cHV0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgX3JlZiA9IHRoaXMuX291dHB1dHM7XG4gICAgICAgICAgZm9yIChfaSA9IDAsIF9sZW4gPSBfcmVmLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICAgICAgICBvdXRwdXQgPSBfcmVmW19pXTtcbiAgICAgICAgICAgIGlmIChcIlwiICE9PSBvdXRwdXRzKSB7XG4gICAgICAgICAgICAgIG91dHB1dHMgKz0gXCIsIFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3V0cHV0cyArPSBvdXRwdXQubmFtZTtcbiAgICAgICAgICAgIGlmIChvdXRwdXQuYWxpYXMpIHtcbiAgICAgICAgICAgICAgb3V0cHV0cyArPSBcIiBBUyBcIiArIG91dHB1dC5hbGlhcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgb3V0cHV0cyA9IFwiT1VUUFVUIFwiICsgb3V0cHV0cztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0cHV0cztcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBNc3NxbFVwZGF0ZURlbGV0ZU91dHB1dEJsb2NrO1xuXG4gICAgfSkoY2xzLkJsb2NrKTtcbiAgICBjbHMuU2VsZWN0ID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICAgICAgX19leHRlbmRzKFNlbGVjdCwgX3N1cGVyKTtcblxuICAgICAgZnVuY3Rpb24gU2VsZWN0KG9wdGlvbnMsIGJsb2Nrcykge1xuICAgICAgICB2YXIgbGltaXRPZmZzZXRUb3BCbG9jaztcbiAgICAgICAgaWYgKGJsb2NrcyA9PSBudWxsKSB7XG4gICAgICAgICAgYmxvY2tzID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBsaW1pdE9mZnNldFRvcEJsb2NrID0gbmV3IGNscy5Nc3NxbExpbWl0T2Zmc2V0VG9wQmxvY2sob3B0aW9ucyk7XG4gICAgICAgIGJsb2NrcyB8fCAoYmxvY2tzID0gW1xuICAgICAgICAgIG5ldyBjbHMuU3RyaW5nQmxvY2sob3B0aW9ucywgJ1NFTEVDVCcpLCBuZXcgY2xzLkRpc3RpbmN0QmxvY2sob3B0aW9ucyksIGxpbWl0T2Zmc2V0VG9wQmxvY2suVE9QKG9wdGlvbnMpLCBuZXcgY2xzLkdldEZpZWxkQmxvY2sob3B0aW9ucyksIG5ldyBjbHMuRnJvbVRhYmxlQmxvY2soX2V4dGVuZCh7fSwgb3B0aW9ucywge1xuICAgICAgICAgICAgYWxsb3dOZXN0ZWQ6IHRydWVcbiAgICAgICAgICB9KSksIG5ldyBjbHMuSm9pbkJsb2NrKF9leHRlbmQoe30sIG9wdGlvbnMsIHtcbiAgICAgICAgICAgIGFsbG93TmVzdGVkOiB0cnVlXG4gICAgICAgICAgfSkpLCBuZXcgY2xzLldoZXJlQmxvY2sob3B0aW9ucyksIG5ldyBjbHMuR3JvdXBCeUJsb2NrKG9wdGlvbnMpLCBuZXcgY2xzLk9yZGVyQnlCbG9jayhvcHRpb25zKSwgbGltaXRPZmZzZXRUb3BCbG9jay5PRkZTRVQob3B0aW9ucyksIGxpbWl0T2Zmc2V0VG9wQmxvY2suTElNSVQob3B0aW9ucyksIG5ldyBjbHMuVW5pb25CbG9jayhfZXh0ZW5kKHt9LCBvcHRpb25zLCB7XG4gICAgICAgICAgICBhbGxvd05lc3RlZDogdHJ1ZVxuICAgICAgICAgIH0pKVxuICAgICAgICBdKTtcbiAgICAgICAgU2VsZWN0Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIG9wdGlvbnMsIGJsb2Nrcyk7XG4gICAgICB9XG5cbiAgICAgIFNlbGVjdC5wcm90b3R5cGUuaXNOZXN0YWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBTZWxlY3Q7XG5cbiAgICB9KShjbHMuUXVlcnlCdWlsZGVyKTtcbiAgICBjbHMuVXBkYXRlID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICAgICAgX19leHRlbmRzKFVwZGF0ZSwgX3N1cGVyKTtcblxuICAgICAgZnVuY3Rpb24gVXBkYXRlKG9wdGlvbnMsIGJsb2Nrcykge1xuICAgICAgICBpZiAoYmxvY2tzID09IG51bGwpIHtcbiAgICAgICAgICBibG9ja3MgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGJsb2NrcyB8fCAoYmxvY2tzID0gW25ldyBjbHMuU3RyaW5nQmxvY2sob3B0aW9ucywgJ1VQREFURScpLCBuZXcgY2xzLk1zc3FsVXBkYXRlVG9wQmxvY2sob3B0aW9ucyksIG5ldyBjbHMuVXBkYXRlVGFibGVCbG9jayhvcHRpb25zKSwgbmV3IGNscy5TZXRGaWVsZEJsb2NrKG9wdGlvbnMpLCBuZXcgY2xzLk1zc3FsVXBkYXRlRGVsZXRlT3V0cHV0QmxvY2sob3B0aW9ucyksIG5ldyBjbHMuV2hlcmVCbG9jayhvcHRpb25zKV0pO1xuICAgICAgICBVcGRhdGUuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgb3B0aW9ucywgYmxvY2tzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIFVwZGF0ZTtcblxuICAgIH0pKGNscy5RdWVyeUJ1aWxkZXIpO1xuICAgIGNscy5EZWxldGUgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gICAgICBfX2V4dGVuZHMoRGVsZXRlLCBfc3VwZXIpO1xuXG4gICAgICBmdW5jdGlvbiBEZWxldGUob3B0aW9ucywgYmxvY2tzKSB7XG4gICAgICAgIGlmIChibG9ja3MgPT0gbnVsbCkge1xuICAgICAgICAgIGJsb2NrcyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgYmxvY2tzIHx8IChibG9ja3MgPSBbXG4gICAgICAgICAgbmV3IGNscy5TdHJpbmdCbG9jayhvcHRpb25zLCAnREVMRVRFJyksIG5ldyBjbHMuRnJvbVRhYmxlQmxvY2soX2V4dGVuZCh7fSwgb3B0aW9ucywge1xuICAgICAgICAgICAgc2luZ2xlVGFibGU6IHRydWVcbiAgICAgICAgICB9KSksIG5ldyBjbHMuSm9pbkJsb2NrKG9wdGlvbnMpLCBuZXcgY2xzLk1zc3FsVXBkYXRlRGVsZXRlT3V0cHV0QmxvY2soX2V4dGVuZCh7fSwgb3B0aW9ucywge1xuICAgICAgICAgICAgZm9yRGVsZXRlOiB0cnVlXG4gICAgICAgICAgfSkpLCBuZXcgY2xzLldoZXJlQmxvY2sob3B0aW9ucyksIG5ldyBjbHMuT3JkZXJCeUJsb2NrKG9wdGlvbnMpLCBuZXcgY2xzLkxpbWl0QmxvY2sob3B0aW9ucylcbiAgICAgICAgXSk7XG4gICAgICAgIERlbGV0ZS5fX3N1cGVyX18uY29uc3RydWN0b3IuY2FsbCh0aGlzLCBvcHRpb25zLCBibG9ja3MpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gRGVsZXRlO1xuXG4gICAgfSkoY2xzLlF1ZXJ5QnVpbGRlcik7XG4gICAgcmV0dXJuIGNscy5JbnNlcnQgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gICAgICBfX2V4dGVuZHMoSW5zZXJ0LCBfc3VwZXIpO1xuXG4gICAgICBmdW5jdGlvbiBJbnNlcnQob3B0aW9ucywgYmxvY2tzKSB7XG4gICAgICAgIGlmIChibG9ja3MgPT0gbnVsbCkge1xuICAgICAgICAgIGJsb2NrcyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgYmxvY2tzIHx8IChibG9ja3MgPSBbbmV3IGNscy5TdHJpbmdCbG9jayhvcHRpb25zLCAnSU5TRVJUJyksIG5ldyBjbHMuSW50b1RhYmxlQmxvY2sob3B0aW9ucyksIG5ldyBjbHMuTXNzcWxJbnNlcnRGaWVsZFZhbHVlQmxvY2sob3B0aW9ucyksIG5ldyBjbHMuSW5zZXJ0RmllbGRzRnJvbVF1ZXJ5QmxvY2sob3B0aW9ucyldKTtcbiAgICAgICAgSW5zZXJ0Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIG9wdGlvbnMsIGJsb2Nrcyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBJbnNlcnQ7XG5cbiAgICB9KShjbHMuUXVlcnlCdWlsZGVyKTtcbiAgfTtcblxufSkuY2FsbCh0aGlzKTtcbiIsInZhciB0ZXN0SlF1ZXJ5ID0gcmVxdWlyZSgnLi90ZXN0SnF1ZXJ5LmpzJyk7XG52YXIgY3JlYXRlID0gcmVxdWlyZSgnLi9jcmVhdGVTdGF0ZW1lbnRHZW5lcmF0ZS5qcycpO1xuXG5jcmVhdGUoKTtcbnRlc3RKUXVlcnkoKTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSByeXUgb24gMTUvMDkvMTguXG4gKi9cbnZhciBzcXVlbCA9IHJlcXVpcmUoJ3NxdWVsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXtcbiAgLyogT09QIEluaGVyaXRhbmNlIG1lY2hhbmlzbSAoc3Vic3RpdHV0ZSB5b3VyIG93biBmYXZvdXJpdGUgbGlicmFyeSBmb3IgdGhpcyEpICovXG4gIEZ1bmN0aW9uLnByb3RvdHlwZS5pbmhlcml0c0Zyb20gPSBmdW5jdGlvbiggcGFyZW50Q2xhc3NPck9iamVjdCApIHtcbiAgICB0aGlzLnByb3RvdHlwZSA9IG5ldyBwYXJlbnRDbGFzc09yT2JqZWN0O1xuICAgIHRoaXMucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gdGhpcztcbiAgICB0aGlzLnByb3RvdHlwZS5wYXJlbnQgPSBwYXJlbnRDbGFzc09yT2JqZWN0LnByb3RvdHlwZTtcbiAgICB0aGlzLnByb3RvdHlwZS5wYXJlbnQuY29uc3RydWN0b3IgPSBwYXJlbnRDbGFzc09yT2JqZWN0O1xuICB9O1xuXG4gIHZhciBDcmVhdGVUYWJsZUJsb2NrID0gZnVuY3Rpb24ob3B0aW9ucyl7XG4gICAgdGhpcy5wYXJlbnQuY29uc3RydWN0b3IuYXBwbHkodGhpcyxvcHRpb25zKTtcbiAgfTtcblxuICBDcmVhdGVUYWJsZUJsb2NrLmluaGVyaXRzRnJvbShzcXVlbC5jbHMuQWJzdHJhY3RUYWJsZUJsb2NrKTtcblxuXG4gIENyZWF0ZVRhYmxlQmxvY2sucHJvdG90eXBlLnRhYmxlID0gZnVuY3Rpb24odGFibGUsYWxpYXMpe1xuICAgIGlmIChhbGlhcyA9PSBudWxsKSB7XG4gICAgICBhbGlhcyA9IG51bGw7XG4gICAgfVxuICAgICAgcmV0dXJuIHRoaXMuX3RhYmxlKHRhYmxlLGFsaWFzKTtcbiAgfTtcblxuXG4gIHZhciBDb2x1bW5CbG9jayA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBfY29sdW1ucyA9IFtdO1xuXG4gICAgQ29sdW1uQmxvY2sucHJvdG90eXBlLmNvbHVtbnMgPSBmdW5jdGlvbihjb2x1bm1zKXtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGNvbHVubXMpKXtcbiAgICAgICAgX2NvbHVtbnMucHVzaChjb2x1bm1zLmpvaW4oXCIsIFwiKSk7XG4gICAgICB9XG4gICAgICBlbHNle1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGNvbHVubXMgKyBcImlzIG5vdCBBcnJheVwiKVxuICAgICAgfVxuXG4gICAgfVxuICAgIENvbHVtbkJsb2NrLnByb3RvdHlwZS5jb2x1bW4gPSBmdW5jdGlvbihjb2x1bW4pIHtcbiAgICAgIGNvbHVtbiA9IHRoaXMuX3Nhbml0aXplTmFtZShjb2x1bW4sXCJjb2x1bW4gcHJvcGVydHlcIilcbiAgICAgIF9jb2x1bW5zLnB1c2goY29sdW1uKTtcbiAgICB9XG5cbiAgICBDb2x1bW5CbG9jay5wcm90b3R5cGUuYnVpbGRTdHIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBcIihcIiArIF9jb2x1bW5zLmpvaW4oXCIsIFwiKSArIFwiKVwiO1xuICAgIH1cbiAgfTtcblxuICBDb2x1bW5CbG9jay5pbmhlcml0c0Zyb20oc3F1ZWwuY2xzLkJsb2NrKTtcblxuICAvKiBDcmVhdGUgdGhlICdDcmVhdGUnIHF1ZXJ5IGJ1aWxkZXIgKi9cblxuICB2YXIgQ3JlYXRlUXVlcnkgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdGhpcy5wYXJlbnQuY29uc3RydWN0b3IuY2FsbCh0aGlzLCBvcHRpb25zLCBbXG4gICAgICBuZXcgc3F1ZWwuY2xzLlN0cmluZ0Jsb2NrKG9wdGlvbnMsICdDUkVBVEUgVEFCTEUnKSxcbiAgICAgIG5ldyBDcmVhdGVUYWJsZUJsb2NrKHtzaW5nbGVUYWJsZTogdHJ1ZX0pLFxuICAgICAgbmV3IENvbHVtbkJsb2NrKClcbiAgICBdKTtcbiAgfTtcbiAgQ3JlYXRlUXVlcnkuaW5oZXJpdHNGcm9tKHNxdWVsLmNscy5RdWVyeUJ1aWxkZXIpO1xuXG5cbiAgLyogQ3JlYXRlIHNxdWVsLmNyZWF0ZSgpIGNvbnZlbmllbmNlIG1ldGhvZCAqL1xuXG4gIHNxdWVsLmNyZWF0ZSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gbmV3IENyZWF0ZVF1ZXJ5KG9wdGlvbnMpXG4gIH07XG5cblxuICAvKiBUcnkgaXQgb3V0ISAqL1xuICB2YXIgY29sID0gW1wiY2NcIixcImRkXCJdXG5cbiAgY29uc29sZS5sb2coXG4gICAgc3F1ZWwuY3JlYXRlKClcbiAgICAgIC50YWJsZSgndGVzdCcpXG4gICAgICAuY29sdW1uKFwiYSBiXCIpXG4gICAgICAuY29sdW1ucyhjb2wpXG4gICAgICAuY29sdW1uKFwiYyBkXCIpXG4gICAgICAudG9TdHJpbmcoKVxuICApO1xufSIsIi8qKlxuICogQ3JlYXRlZCBieSByeXUgb24gMTUvMDkvMTguXG4gKi9cbnZhciAkID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJyQnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJyQnXSA6IG51bGwpO1xudmFyIHNxdWVsID0gcmVxdWlyZSgnc3F1ZWwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpXG57XG4gICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgdmFyIHF1ZXJ5ID0gc3F1ZWwuc2VsZWN0KCkuZnJvbShcInN0dWRlbnRzXCIpLnRvU3RyaW5nKCk7XG4gICAgJCgnLmlubmVyJykuYXBwZW5kKFwiSGVsbG9cIik7XG4gICAgJCgnLnF1ZXJ5JykuYXBwZW5kKHF1ZXJ5KTtcbiAgfSk7XG59OyJdfQ==
