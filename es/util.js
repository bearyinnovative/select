import React from 'react';

export function getValuePropValue(child) {
  var props = child.props;
  if ('value' in props) {
    return props.value;
  }
  if (child.key) {
    return child.key;
  }
  if (child.type && child.type.isSelectOptGroup && props.label) {
    return props.label;
  }
  throw new Error('Need at least a key or a value or a label (only for OptGroup) for ' + child);
}

export function getPropValue(child, prop) {
  if (prop === 'value') {
    return getValuePropValue(child);
  }
  return child.props[prop];
}

export function isCombobox(props) {
  return props.combobox;
}

export function isMultipleOrTags(props) {
  return props.multiple || props.tags;
}

export function isMultipleOrTagsOrCombobox(props) {
  return isMultipleOrTags(props) || isCombobox(props);
}

export function isSingleMode(props) {
  return !isMultipleOrTagsOrCombobox(props);
}

export function toArray(value) {
  var ret = value;
  if (value === undefined) {
    ret = [];
  } else if (!Array.isArray(value)) {
    ret = [value];
  }
  return ret;
}

export function preventDefaultEvent(e) {
  e.preventDefault();
}

export function findIndexInValueByKey(value, key) {
  var index = -1;
  for (var i = 0; i < value.length; i++) {
    if (value[i].key === key) {
      index = i;
      break;
    }
  }
  return index;
}

export function findIndexInValueByLabel(value, label) {
  var index = -1;
  for (var i = 0; i < value.length; i++) {
    if (toArray(value[i].label).join('') === label) {
      index = i;
      break;
    }
  }
  return index;
}

export function getSelectKeys(menuItems, value) {
  if (value === null || value === undefined) {
    return [];
  }
  var selectedKeys = [];
  React.Children.forEach(menuItems, function (item) {
    if (item.type.isMenuItemGroup) {
      selectedKeys = selectedKeys.concat(getSelectKeys(item.props.children, value));
    } else {
      var itemValue = getValuePropValue(item);
      var itemKey = item.key;
      if (findIndexInValueByKey(value, itemValue) !== -1 && itemKey) {
        selectedKeys.push(itemKey);
      }
    }
  });
  return selectedKeys;
}

export var UNSELECTABLE_STYLE = {
  userSelect: 'none',
  WebkitUserSelect: 'none'
};

export var UNSELECTABLE_ATTRIBUTE = {
  unselectable: 'unselectable'
};

export function findFirstMenuItem(children) {
  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    if (child.type.isMenuItemGroup) {
      var found = findFirstMenuItem(child.props.children);
      if (found) {
        return found;
      }
    } else if (!child.props.disabled) {
      return child;
    }
  }
  return null;
}

export function includesSeparators(string, separators) {
  for (var i = 0; i < separators.length; ++i) {
    if (string.lastIndexOf(separators[i]) > 0) {
      return true;
    }
  }
  return false;
}

export function splitBySeparators(string, separators) {
  var reg = new RegExp('[' + separators.join() + ']');
  var array = string.split(reg);
  while (array[0] === '') {
    array.shift();
  }
  while (array[array.length - 1] === '') {
    array.pop();
  }
  return array;
}

export function defaultFilterFn(input, child) {
  return String(getPropValue(child, this.props.optionFilterProp)).indexOf(input) > -1;
}

export function addClassNamesSuffix(classnames, suffix) {
  var classes = classnames.replace(/\s+/g, ' ').trim().split(' ');
  return classes.map(function (className) {
    return '' + className + suffix;
  }).join(' ');
}