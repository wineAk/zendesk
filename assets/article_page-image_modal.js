document.addEventListener('DOMContentLoaded', function () {
  const bodyElm = document.querySelector('body');
  const modalElm = document.querySelector('#image-modal');
  const sectionElm = modalElm.querySelector('section');
  const imgElm = modalElm.querySelector('img');
  /**
   * モーダルを閉じる関数
   */
  function modalClose() {
    modalElm.classList.add('hidden');
    modalElm.setAttribute('aria-hidden', 'true');
    modalElm.setAttribute('aria-modal', 'false');
    bodyElm.style.paddingRight = null;
    bodyElm.style.overflow = null;
  }
  // モーダルクリック時にイベントの伝播を止める
  sectionElm.addEventListener('click', event => event.stopPropagation());
  // 特定の要素をクリックでモーダルを閉じる
  modalElm.querySelectorAll('[data-modal-hide="image-modal"]').forEach(elm => {
    elm.addEventListener('click', _ => modalClose())
  })
  // Escapeキーでモーダルを閉じる
  document.addEventListener('keydown', e => {
    if (e.key === "Escape") modalClose()
  });
  // 画像をクリックしたらモーダルを開く
  document.querySelectorAll('.article-body img').forEach(elm => {
    elm.addEventListener('click', e => {
      const src = e.target.src;
      if (src == null || src == '') return;
      imgElm.src = src;
      modalElm.classList.remove('hidden');
      modalElm.setAttribute('aria-hidden', 'false');
      modalElm.setAttribute('aria-modal', 'true');
      bodyElm.style.paddingRight = '.5rem';
      bodyElm.style.overflow = 'hidden';
    });
  })
})