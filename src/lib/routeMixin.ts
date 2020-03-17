import { appModule } from "@s/index";
import frontstageRoutes from "@/routes/modules";
import { Error404, Layout, ReplacePage } from "@/routes/base";
import router from "@/routes";
async function getRouteAndAddRoute() {
  return appModule
    .APP_GETAUTHORIZATIONLIST_ACTION({
      frontstageRoutes,
      initialRoutes: [ReplacePage]
    })
    .then(res => {
      if (res.code === 1000) {
        const children = [...appModule.routesList];
        Layout.children = children;
        const routerList = [Layout, Error404];
        router.addRoutes(routerList);
      }
      return res;
    });
}
export default getRouteAndAddRoute;
