document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.article-body img').forEach(elm => {
    // 画像に `x-on:click` を動的に追加
    elm.setAttribute('x-on:click', `modalOpen = true; imgSrc = '${elm.src}'`)
    // Alpine.js に要素を認識させる
    Alpine.initTree(elm)
  })
})