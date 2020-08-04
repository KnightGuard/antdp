'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.patchRoutes = patchRoutes;

var _icons = _interopRequireDefault(require('@@/plugin-antd-icon/icons'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var react = require('react'); // @ts-ignore

function toHump(name) {
  return name.replace(/\-(\w)/g, function (all, letter) {
    return letter.toUpperCase();
  });
}

function formatter(data) {
  if (!Array.isArray(data)) {
    return data;
  }

  (data || []).forEach(function () {
    var item =
      arguments.length > 0 && arguments[0] !== undefined
        ? arguments[0]
        : {
            path: '/',
          };

    if (item.icon) {
      var icon = item.icon;
      var v4IconName = toHump(icon.replace(icon[0], icon[0].toUpperCase()));

      var NewIcon =
        _icons.default[icon] ||
        _icons.default[''.concat(v4IconName, 'Outlined')] ||
        _icons.default[''.concat(v4IconName, 'Filled')] ||
        _icons.default[''.concat(v4IconName, 'TwoTone')];

      if (NewIcon) {
        try {
          item.icon = react.createElement(NewIcon);
        } catch (error) {
          console.log(error);
        }
      }
    }

    if (item.routes || item.children) {
      var children = formatter(item.routes || item.children); // Reduce memory usage

      item.children = children;
    }
  });
  return data;
}

function patchRoutes(_ref) {
  var routes = _ref.routes;
  formatter(routes);
}