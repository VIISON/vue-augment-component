/**
 * @param {Vue} component
 * @return {(String|undefined)}
 */
export default function getComponentTag(component) {
  if (component.$vnode && component.$vnode.componentOptions) {
    const opts = component.$vnode.componentOptions;

    return opts.Ctor.options.name || opts.tag;
  }

  return undefined;
}
