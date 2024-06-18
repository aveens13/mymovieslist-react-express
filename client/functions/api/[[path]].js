export async function onRequest({ request }) {
  const url = new URL(request.url);
  url.hostname = "movieridge.eastus.cloudapp.azure.com";
  url.protocol = "http:";
  url.pathname = "api" + url.pathname.slice(url.pathname.indexOf("/", 1));
  url.port = "";
  return fetch(url.toString(), request);
}
