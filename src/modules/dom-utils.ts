export const getParentsUntil = (
  elem: HTMLElement,
  parent?: string,
  selector?: string
) => {
  var parents = [];
  if (parent) {
    var parentType = parent.charAt(0);
  }
  if (selector) {
    var selectorType = selector.charAt(0);
  }

  // Get matches
  for (; elem && elem !== (document as any); elem = elem.parentElement) {
    // Check if parent has been reached
    if (parent) {
      // If parent is a class
      if (parentType === ".") {
        if (elem.classList.contains(parent.substr(1))) {
          break;
        }
      }

      // If parent is an ID
      if (parentType === "#") {
        if (elem.id === parent.substr(1)) {
          break;
        }
      }

      // If parent is a data attribute
      if (parentType === "[") {
        if (elem.hasAttribute(parent.substr(1, parent.length - 1))) {
          break;
        }
      }

      // If parent is a tag
      if (elem.tagName.toLowerCase() === parent) {
        break;
      }
    }

    if (selector) {
      // If selector is a class
      if (selectorType === ".") {
        if (elem.classList.contains(selector.substr(1))) {
          parents.push(elem);
        }
      }

      // If selector is an ID
      if (selectorType === "#") {
        if (elem.id === selector.substr(1)) {
          parents.push(elem);
        }
      }

      // If selector is a data attribute
      if (selectorType === "[") {
        if (elem.hasAttribute(selector.substr(1, selector.length - 1))) {
          parents.push(elem);
        }
      }

      // If selector is a tag
      if (elem.tagName.toLowerCase() === selector) {
        parents.push(elem);
      }
    } else {
      parents.push(elem);
    }
  }

  // Return parents if any exist
  if (parents.length === 0) {
    return null;
  } else {
    return parents;
  }
};

/**
 * Get the closest matching element up the DOM tree.
 * @param  {Element} elem     Starting element
 * @param  {String}  selector Selector to match against (class, ID, data attribute, or tag)
 * @return {Boolean|Element}  Returns null if not match found
 */
export const getClosest = (elem: HTMLElement, selector: string) => {
  // Variables
  var firstChar = selector.charAt(0);
  var supports = "classList" in document.documentElement;
  var attribute, value;

  // If selector is a data attribute, split attribute from value
  if (firstChar === "[") {
    selector = selector.substr(1, selector.length - 2);
    attribute = selector.split("=");

    if (attribute.length > 1) {
      value = true;
      attribute[1] = attribute[1].replace(/"/g, "").replace(/'/g, "");
    }
  }

  // Get closest match
  for (
    ;
    elem && elem !== (document as any) && elem.nodeType === 1;
    elem = elem.parentNode as any
  ) {
    // If selector is a class
    if (firstChar === ".") {
      if (supports) {
        if (elem.classList.contains(selector.substr(1))) {
          return elem;
        }
      } else {
        if (
          new RegExp("(^|\\s)" + selector.substr(1) + "(\\s|$)").test(
            elem.className
          )
        ) {
          return elem;
        }
      }
    }

    // If selector is an ID
    if (firstChar === "#") {
      if (elem.id === selector.substr(1)) {
        return elem;
      }
    }

    // If selector is a data attribute
    if (firstChar === "[") {
      if (elem.hasAttribute(attribute[0])) {
        if (value) {
          if (elem.getAttribute(attribute[0]) === attribute[1]) {
            return elem;
          }
        } else {
          return elem;
        }
      }
    }

    // If selector is a tag
    if (elem.tagName.toLowerCase() === selector) {
      return elem;
    }
  }

  return null;
};
