import httpReq from "@l/http-req";
// 获取路由信息
function getRoutesApi() {
  return httpReq.getQuery({ url: "/getRoute", notLogin: true, data: { a: 1 } });
  // return httpReq.postJson({ url: "/getRoute", notLogin: true });
}
export { getRoutesApi };
