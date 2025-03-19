document.addEventListener('DOMContentLoaded', function () {
  /**
   * サイドメニューの高さをスクロールに合わせて可変
   */
  let lastSetPx = 0
  addEventListener("scroll", (event) => {
    const scrollPosition = window.scrollY
    // 24を差し引かないといけない謎
    // mb-4(16px)*2 や .article-containerの20pxあたり？
    const setPx = scrollPosition < 168 - 24 ? scrollPosition : 168 - 24
    if (lastSetPx === setPx) return
    lastSetPx = setPx
    document.querySelectorAll('.article-container > aside').forEach(elm => {
      elm.style.setProperty('--js-scroll', `${setPx}px`)
    })
  });
})