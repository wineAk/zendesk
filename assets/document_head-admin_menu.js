document.addEventListener('DOMContentLoaded', function () {
  const adminMenu = document.querySelector('#navbar-container, #preview-bar-container');
  if (!adminMenu) return;
  const footer = document.querySelector("body > footer");
  if (!footer) return;
  // キャッシュを削除するボタンを追加
  removeCache(footer);
});

function removeCache(footer) {
  const buttonElm = document.createElement('button');
  buttonElm.classList = "text-white bg-gradient-to-r from-purple-500 to-pink-500 focus:ring-4 focus:outline-none focus:ring-purple-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2";
  buttonElm.innerText = "キャッシュを削除する";
  footer.appendChild(buttonElm);
  buttonElm.addEventListener('click', function () {
    const isConfirm = window.confirm("キャッシュを削除しますか？");
    if (!isConfirm) return;
    const cacheKeys = ["articles", "categories", "sections"];
    cacheKeys.forEach(key => window.localStorage.removeItem(`C.${key}`));
    alert("キャッシュを削除しました。ページを再読み込みします。");
    window.location.reload();
  })
}