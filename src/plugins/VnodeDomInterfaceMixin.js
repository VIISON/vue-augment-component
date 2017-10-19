const VnodeDomInterfaceMixin = Vue => ({
  beforeCreate() {
    // Check whether the VNode is already patched
    /* eslint-disable no-underscore-dangle */
    const VNode = Vue.prototype._e('').constructor;
    if (Object.prototype.hasOwnProperty.call(VNode.prototype, 'nodeType')) {
      return;
    }

    // Apply patch
    Object.defineProperty(VNode.prototype, 'nodeType', {
      get: function nodeType() {
        return 1;
      },
    });
    Object.defineProperty(VNode.prototype, 'nodeName', {
      get: function nodeName() {
        if (this.componentOptions) {
          return this.componentOptions.tag.toLowerCase();
        } else if (this.tag) {
          return this.tag.toLowerCase();
        }
        return undefined;
      },
    });
    Object.defineProperty(VNode.prototype, 'parentNode', {
      get: function parentNode() {
        return this.parent;
      },
    });
    Object.defineProperty(VNode.prototype, 'childNodes', {
      get: function childNodes() {
        return this.children || [];
      },
    });
    VNode.prototype.getElementById = function getElementById(id) {
      if (this.data && this.data.attr) {
        return this.data.attr.id === id;
      }
      return undefined;
    };
    VNode.prototype.getElementsByTagName = function getElementsByTagName(tagName) {
      const lcTagName = tagName.toLowerCase();
      const matchingElements = [];
      this.childNodes.forEach((child) => {
        if (child.nodeName === lcTagName) {
          matchingElements.push(child);
        }
        child.getElementsByTagName(tagName).forEach((result) => {
          matchingElements.push(result);
        });
      });

      return matchingElements;
    };
  },
});

export default VnodeDomInterfaceMixin;
