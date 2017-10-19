export default class SizzleNode {
  /**
   * @param {VNode} vnode
   * @param {(SizzleNode|undefined)} parentNode
   */
  constructor(vnode, parentNode) {
    this.configure(vnode, parentNode);
    this.nodeType = 1;
  }

  /**
   * @param {VNode} vnode
   * @param {(SizzleNode|undefined)} parentNode
   */
  configure(vnode, parentNode) {
    this.vnode = vnode;
    this.internalParentNode = parentNode;
    this.lazyChildNodes = undefined;
  }

  /**
   * @returns {String}
   */
  get nodeName() {
    if (this.vnode.componentOptions) {
      return this.vnode.componentOptions.tag.toLowerCase();
    } else if (this.vnode.tag) {
      return this.vnode.tag.toLowerCase();
    }

    return undefined;
  }

  /**
   * @returns {SizzleNode}
   */
  get parentNode() {
    return this.internalParentNode || this;
  }

  /**
   * @returns {Array}
   */
  get childNodes() {
    if (typeof this.lazyChildNodes === 'undefined') {
      // Lazily create child nodes
      this.lazyChildNodes = [];
      if (this.vnode.children) {
        for (let i = 0; i < this.vnode.children.length; i += 1) {
          this.childNodes.push(new SizzleNode(this.vnode.children[i], this));
        }
      }
    }

    return this.lazyChildNodes;
  }

  /**
   * @param {String} attributeName
   * @returns {String}
   */
  getAttribute(attributeName) {
    if (!this.vnode.data) {
      return undefined;
    }
    if (attributeName === 'class') {
      return this.vnode.data.staticClass;
    }
    if (this.vnode.data.attrs && this.vnode.data.attrs[attributeName]) {
      return String(this.vnode.data.attrs[attributeName]);
    }

    return undefined;
  }

  /**
   * @param {String} id
   * @returns {(SizzleNode|undefined)}
   */
  getElementById(id) {
    if (this.vnode.data && this.vnode.data.attrs && this.vnode.data.attrs.id === id) {
      return this;
    }
    if (!this.childNodes) {
      return undefined;
    }
    for (let i = 0; i < this.childNodes.length; i += 1) {
      const result = this.childNodes[i].getElementById(id);
      if (result) {
        return result;
      }
    }

    return undefined;
  }

  /**
   * @param {String} id
   * @returns {Array}
   */
  getElementsByTagName(tagName) {
    const matchingElements = [];
    for (let i = 0; i < this.childNodes.length; i += 1) {
      const child = this.childNodes[i];
      if (child.nodeName === tagName.toLowerCase()) {
        matchingElements.push(child);
      }
      Array.prototype.push.apply(matchingElements, child.getElementsByTagName(tagName));
    }

    return matchingElements;
  }
}
