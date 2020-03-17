/**
 * 判断当前是否在该祖级dom中
 * @param {Document} ele 子集dom
 * @param {Document|void 0} parentEle 祖级dom不存在就是body
 * @returns {Boolean} true存在false不存在
 */
function isInDom(ele, parentEle) {
  let pE = parentEle || document.body;
  return pE.contains(ele);
}
export { isInDom };
