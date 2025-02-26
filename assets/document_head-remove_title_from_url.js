const pathSegments = window.location.pathname.split("/");
if (pathSegments.length > 3) {
    let type = pathSegments[3]; // categories, sections, articles など
    let idPart = pathSegments[4]?.split("-")[0];
    if (idPart) {
        let cleanUrl = `/hc/ja/${type}/${idPart}`;
        if (window.location.pathname !== cleanUrl) {
            history.replaceState(null, "", cleanUrl);
        }
    }
}
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('a[href^="/hc/ja/"]').forEach(function(elm) {
        const url = elm.href;
        const cleanUrl = url.split('-')[0];
        elm.href = cleanUrl;
    });
});