interface ObjInF {
  [key: string]: ObjInF | ObjInF[] | string | number | undefined;
}
/**
 * 判断对象类型
 * @param {*} obj
 * @param {String|Array} type
 */
export const judgementTypeTool = <T>(
  obj: T, //ObjInF | string | number | ObjInF[] | undefined,
  type: string | string[] | undefined
): boolean | string => {
  const objType = Object.prototype.toString
    .call(obj)
    .replace(/^(\[object )|(\])$/g, "")
    .toLocaleLowerCase();
  if (type === void 0) {
    return objType;
  }
  const typeType = Object.prototype.toString
    .call(type)
    .replace(/^(\[object )|(\])$/g, "")
    .toLocaleLowerCase();
  if (typeType === "string") {
    return objType === type;
  }
  // if (typeType === "array") {
  return type.includes(objType);
  // }
  // return false;
};
/**
 * 判断两个对象是否相同
 * @param {JSON|Array} obj1
 * @param {JSON|Array} obj2
 */
export const isSameObjTool = (
  obj1: string | ObjInF | undefined | ObjInF[] | number,
  obj2: string | ObjInF | undefined | ObjInF[] | number,
  type: string = "=="
): boolean => {
  if (judgementTypeTool(obj1, "object") && judgementTypeTool(obj2, "object")) {
    let arr: string[] = Object.keys(obj1 as ObjInF);
    for (let i = 0; i < arr.length; ++i) {
      let key: string = arr[i];
      let items1 = (obj1 as ObjInF)[key];
      let items2 = (obj2 as ObjInF)[key];
      if (!isSameObjTool(items1, items2)) {
        return false;
      }
    }
    return true;
  } else if (
    judgementTypeTool(obj1, "array") &&
    judgementTypeTool(obj2, "array")
  ) {
    for (let i = 0; i < (obj1 as ObjInF[]).length; ++i) {
      let items1 = (obj1 as ObjInF[])[i];
      let items2 = (obj2 as ObjInF[])[i];
      if (!isSameObjTool(items1, items2)) {
        return false;
      }
    }
    return true;
  } else if (
    judgementTypeTool(obj1, ["string", "number"]) &&
    judgementTypeTool(obj2, ["string", "number"])
  ) {
    if (type === "==") {
      return (
        (obj1 as number | string).toString() ===
        (obj2 as number | string).toString()
      );
    }
    return (obj1 as number | string) === (obj2 as number | string);
  }
  return true;
};
/**
 * 获取当前对象对父级定位对象的距离
 * @param {HTMLElement} selfEle 当前对象
 * @param {HTMLElement} parentsEle 父级定位对象如果没有祖级dom
 */
function getParentsOffsetTop(
  selfEle: HTMLElement,
  parentsEle: HTMLElement | undefined = document.documentElement ||
    document.body
): number {
  let parentEle = selfEle.offsetParent; // 父级dom
  let distance = selfEle.offsetTop;
  if (parentEle === parentsEle || parentEle === null) {
    return distance;
  }
  return distance + getParentsOffsetTop(parentEle as HTMLElement, parentsEle);
}
function delayExecute(delayTime = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, delayTime);
  });
}
/**
 * 异步函数补货错误信息
 * @param {*} asyncFunc promise函数
 * @param  {...any} arg promise函数的参数
 */
async function errorCaptured(
  asyncFunc: (...arg: any[]) => Promise<any>,
  ...arg: any[]
) {
  try {
    let res = await asyncFunc(...arg);
    return [null, res];
  } catch (err) {
    return [err, null];
  }
}
// 获取随机颜色
function getRandomColor(
  options: {
    red?: number;
    green?: number;
    blue?: number;
    opacity?: number;
  } = {}
) {
  let { red = 255, green = 255, blue = 255, opacity = 1 } = options;
  const colFunc = (color: number): number =>
    Math.floor(Math.random() * (color + 1)); // +1 防止不能随机到当前color值
  const [r, g, b, a] = [colFunc(red), colFunc(green), colFunc(blue), opacity];
  return `rgba(${r},${g},${b},${a})`;
  // return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).substr(-6)
}
// url拼接
function urlJoin(query?: {
  [key: string]: string | (string | null)[];
}): string {
  if (query) {
    let keysArr = Object.keys(query);
    if (keysArr.length === 0) {
      return "";
    }
    return keysArr
      .map(v => {
        let value = query[v];
        if (Array.isArray(value)) {
          return value.map(its => `${v}=${its}`).join("&");
        }
        return `${v}=${query[v]}`;
      })
      .join("&");
  }
  return "";
}
/*
 * 格式化数字显示方式 个位必须是0其它位要么全部为0要么全部为#符号不算
 * 用法 0 #0 #,##0 0000 0,000 0.## 0.00
 * formatNumber(12345,'#,##0.00'); 12,345.00
 * @param num
 * @param pattern
 */
function formatNumber(num: number, format?: string): string {
  if (!format) {
    // format = num.toString().replace(/\d/g, "#");
    return num.toString();
  }
  const formatArr = format.split(".");
  // 小数的长度
  const formatDecimalStr = formatArr[1];
  const formatDecimalLen = (formatDecimalStr && formatDecimalStr.length) || 0;
  // 根据小数的长度进行原数字的整理
  num =
    Math.round(num * Math.pow(10, formatDecimalLen)) /
    Math.pow(10, formatDecimalLen);
  let resultStr = "";
  //   // 整数与小数分开
  const numStr = num.toString().split(".");
  /** 整数部分 start **/
  const numIntegerStr = numStr[0];
  const numIntegerStrLen = numIntegerStr.length;
  let newNumIntegerStr = "";
  // 格式整数部分
  const formatIntegerStr = formatArr[0];
  const formatIntegerLen = formatIntegerStr.length;
  let formatIntegerIndex = formatIntegerLen;
  let numIntegerIndex = numIntegerStrLen;
  while (numIntegerIndex >= 0) {
    --formatIntegerIndex;
    const formatIntegerIndexStr = formatIntegerStr[formatIntegerIndex];
    // 当数字消耗完但是格式还有保留0的时候
    if (
      numIntegerIndex === 0 &&
      formatIntegerIndexStr &&
      formatIntegerStr[0] === "0"
    ) {
      newNumIntegerStr = formatIntegerIndexStr + newNumIntegerStr;
      continue;
    } else if (numIntegerIndex === 0) {
      break;
    }
    --numIntegerIndex;
    const numIntegerIndexStr = numIntegerStr[numIntegerIndex];
    // 符号位
    if (formatIntegerIndexStr && /[^(#|0)]/.test(formatIntegerIndexStr)) {
      newNumIntegerStr =
        numIntegerIndexStr + formatIntegerIndexStr + newNumIntegerStr;
      --formatIntegerIndex;
      continue;
    }
    newNumIntegerStr = numIntegerIndexStr + newNumIntegerStr;
  }
  resultStr = newNumIntegerStr;
  if (formatDecimalLen === 0) {
    return resultStr;
  }
  /** 整数部分 end **/
  /** 小数部分 start **/
  const numDecimalStr = numStr[1] || "";
  const numDecimalStrLen = numDecimalStr.length;
  let newNumDecimalStr = "";
  // 格式小数部分
  let formatDecimalIndex = -1;
  let numDecimalIndex = -1;
  while (numDecimalIndex <= numDecimalStrLen - 1) {
    ++formatDecimalIndex;
    const formatDecimalIndexStr = formatDecimalStr[formatDecimalIndex];
    if (
      numDecimalIndex === numDecimalStrLen - 1 &&
      formatDecimalIndexStr &&
      formatDecimalStr[formatDecimalLen - 1] === "0"
    ) {
      newNumDecimalStr += formatDecimalIndexStr;
      continue;
    } else if (numDecimalIndex === numDecimalStrLen - 1) {
      break;
    }
    ++numDecimalIndex;
    const numDecimalIndexStr = numDecimalStr[numDecimalIndex];
    // 符号位
    if (formatDecimalIndexStr && /[^(#|0)]/.test(formatDecimalIndexStr)) {
      newNumDecimalStr += formatDecimalIndexStr + numDecimalIndexStr;
      ++formatDecimalIndex;
      continue;
    }
    newNumDecimalStr += numDecimalIndexStr;
  }

  return `${resultStr}.${newNumDecimalStr}`;
}
// 太智能太复杂 不适合
// function formatNumber(num: number, format: string): string {
//   const formatArr = format.split(".");
//   // 小数的长度
//   const decimalsLen = (formatArr[1] && formatArr[1].length) || 0;
//   // 根据小数的长度进行原数字的整理
//   num = Math.round(num * Math.pow(10, decimalsLen)) / Math.pow(10, decimalsLen);
//   let resultStr = "";
//   // 整数与小数分开
//   const numStr = num.toString().split(".");

//   /** 整数部分 start**/
//   const numIntegerStr = numStr[0];
//   const numIntegerLen = numIntegerStr.length;
//   let newNumIntegerStr = "";
//   // 格式整数部分
//   const formatIntegerStr = formatArr[0];
//   const formatIntegerLen = formatIntegerStr.length;
//   let newFormatIntegerStr = "";
//   // 第一个数字是0的
//   if (numIntegerLen === 0) {
//     newFormatIntegerStr = "#";
//   } else {
//     newFormatIntegerStr = formatIntegerStr
//       .slice(0, formatIntegerLen - 1)
//       .replace(/[#|0]/g, "#"); // 最后一个数一定是0 不要
//   }
//   let formatIntegerArrStr = ""; // formatIntegerArrStr的长度一定>=numIntegerStr
//   const times = Math.ceil(numIntegerLen / formatIntegerLen);
//   let i = times;
//   while (i >= 0) {
//     --i;
//     if (i === times - 1) {
//       formatIntegerArrStr = formatIntegerStr + formatIntegerArrStr;
//       continue;
//     }
//     formatIntegerArrStr = newFormatIntegerStr + formatIntegerArrStr;
//   }
//   let formatIntegerArrStrLen = formatIntegerArrStr.length;
//   let formatIntegerArrStrIndex = formatIntegerArrStrLen;
//   let numIntegerStrIndex = numIntegerLen;
//   while (formatIntegerArrStrIndex >= 0) {
//     --formatIntegerArrStrIndex;
//     --numIntegerStrIndex;
//     if (
//       numIntegerStrIndex < 0 &&
//       formatIntegerArrStr[formatIntegerArrStrIndex] === "0"
//     ) {
//       // 当前下标已经没有整数部分&&格式为0的时候
//       newNumIntegerStr = "0" + newNumIntegerStr;
//       continue;
//     } else if (
//       numIntegerStrIndex < 0 &&
//       formatIntegerArrStr[formatIntegerArrStrIndex - 1] === "0"
//     ) {
//       // 当前下标已经没有整数部分&&下一个为0的时候
//       newNumIntegerStr = formatIntegerArrStr[formatIntegerArrStrIndex];
//       continue;
//     } else if (numIntegerStrIndex < 0) {
//       break;
//     }
//     if (/[^(#|0)]/.test(formatIntegerArrStr[formatIntegerArrStrIndex])) {
//       // 为符号的时候
//       ++numIntegerStrIndex;
//       newNumIntegerStr =
//         formatIntegerArrStr[formatIntegerArrStrIndex] + newNumIntegerStr;
//       continue;
//     }
//     newNumIntegerStr = numIntegerStr[numIntegerStrIndex] + newNumIntegerStr;
//   }
//   resultStr = newNumIntegerStr;
//   /** 整数部分 end**/
//   /** 小数部分 start**/
//   const numDecimalStr = numStr[1];
//   const numDecimalStrLen = (numDecimalStr && numDecimalStr.length) || 0;
//   // 格式小数部分
//   const formatDecimalStr = formatArr[1] || "";
//   const formatDecimalStrLen = formatDecimalStr.length;
//   if (formatDecimalStrLen === 0) {

//   }
//   return "";
// }
export {
  getParentsOffsetTop,
  errorCaptured,
  delayExecute,
  getRandomColor,
  urlJoin,
  formatNumber
};
