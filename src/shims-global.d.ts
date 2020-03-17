// declare module "*.vue" {
//   export interface MapINF {
//     [key: string]: string | number | undefined;
//   }
// }
declare namespace GLOBAL {
  interface MapINF<T> {
    [key: string]: T;
  }
}
