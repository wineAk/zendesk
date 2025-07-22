document.addEventListener("DOMContentLoaded", function () {
  tocbot.init({
    // 目次を表示させる先のクラス名
    tocSelector: '.js-toc',
    // 目次を抽出したい要素のクラス名
    contentSelector: '.article-body',
    // 目次として抽出する見出しタグ
    headingSelector: 'h1, h2, h3, h4',
    // コンテンツ内の相対配置または絶対配置のコンテナ内にある見出しの場合
    hasInnerContainers: true,
    // リンクに追加するメインのクラスです。
    linkClass: 'toc-link',
    // リンクに追加するエクストラクラス。
    extraLinkClasses: '',
    // アクティブなリンクに追加するクラスです。
    // ページの一番上の見出しに対応するリンクです。
    activeLinkClass: 'is-active-link font-bold',
    // リストに追加するメインクラス
    listClass: 'toc-list list-decimal list-inside pr-1',
    // リストに追加するエクストラクラスです。
    extraListClasses: '',
    // リストが折りたたまれるべき時に追加されるクラス。
    isCollapsedClass: 'is-collapsed',
    // リストが折り畳まれるべき時に追加されるクラスです。
    // 折りたたまれるべきだが、必ずしも折りたたまれていない場合に追加されるクラスです。
    collapsibleClass: 'is-collapsible',
    // リストアイテムに追加するクラスです。
    listItemClass: 'toc-list-item my-2 pl-2',
    // アクティブなリストアイテムに追加するクラスです。
    activeListItemClass: 'is-active-li',
  });
  // 目次描画後に、空リンクをテキストに置換
  setTimeout(() => {
    document.querySelectorAll('.js-toc a[href="#"]').forEach((a) => {
      const span = document.createElement('span');
      span.textContent = a.textContent;
      span.className = 'text-gray-600 cursor-not-allowed';
      a.replaceWith(span);
    });
  }, 0);
})