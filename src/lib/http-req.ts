import HttpRequest from "./request";
const origin: string = window.location.origin;
let baseUrl: string = `${origin}/play/index.php/`;
if (~origin.indexOf("play.hahaipi.com")) {
  baseUrl = `${origin}/index.php/`;
}
const httpReq = new HttpRequest(baseUrl);
export default httpReq;
