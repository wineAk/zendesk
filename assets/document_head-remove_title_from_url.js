/**
 * URLからタイトルを削除
 * @param {string} url /hc/ja/articles/35749118295321-%E3%82%B9%E3%82%B3%E3%82%A2-%E8%A8%AD%E5%AE%9A
 * @returns /hc/ja/articles/35749118295321
 */
function removeTitle(url) {
  return url.replace(/(categories|sections|articles)(\/\d+)(\-.*)/, '$1$2') 
}

// 現在のページ
const pathname = window.location.pathname
const replacePath = removeTitle(pathname)
if (pathname !== replacePath) history.replaceState(null, '', replacePath)

// aタグ
document.addEventListener('load', function () {
  document.querySelectorAll('a').forEach(function(elm) {
    const href = elm.href
    const replaceHref = removeTitle(href)
    if (href !== replaceHref) elm.href = replaceHref
  })
})
