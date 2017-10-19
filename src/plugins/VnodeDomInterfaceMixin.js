const VnodeDomInterfaceMixin = Vue => ({
  beforeCreate() {
    // Check whether the VNode is already patched
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
    VNode.prototype.getAttribute = function getAttribute(attributeName) {
      if (!this.data) {
        return undefined;
      }

      if (attributeName === 'class') {
        return this.data.staticClass;
      }

      if (this.data.attrs && this.data.attrs[attributeName]) {
        return String(this.data.attrs[attributeName]);
      }

      return undefined;
    };
    VNode.prototype.getElementById = function getElementById(id) {
      if (this.data && this.data.attrs && this.data.attrs.id === id) {
        return this;
      }
      if (!this.children) {
        return undefined;
      }
      for (let i = 0; i < this.children.length; i += 1) {
        const result = this.children[i].getElementById(id);
        if (result) {
          return result;
        }
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
