document.addEventListener("DOMContentLoaded", function () {
  const recentActivity = document.querySelector('#recent_activity');
  if (recentActivity == null) return;
  /**
   * 作成日を表示
   * @param {string} dateString "2025-02-10T08:22:59Z"
   * @returns {string} "9日前"
   */
  function timeAgo(dateString) {
    const createdDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - createdDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return (diffDays === 0) ? '今日' : `${diffDays}日前`;
  }
  /**
   * HTMLタグを除去
   * @param {string} htmlString "<p>本文</p>"
   * @returns {string} "本文"
   */
  function extractTextAndTruncate(htmlString) {
    const maxLen = 70;
    const divElm = document.createElement("div");
    divElm.innerHTML = htmlString;
    const text = divElm.innerText || divElm.textContent;
    return text.length > maxLen ? text.slice(0, maxLen) + "…" : text;
  }
  /**
   * 記事データを取得
   * @returns {object} 記事オブジェクト
   */
  async function getArticles() {
    // 1. 全カテゴリを取得
    const categoriesResponse = await fetch('/api/v2/help_center/ja/categories.json?per_page=100');
    const categoriesData = await categoriesResponse.json();
    const categories = Object.fromEntries(categoriesData.categories.map(category => [category.id, { ...category }]))
    // 2. 全セクションデータを取得
    const sectionsResponse = await fetch('/api/v2/help_center/sections.json?per_page=100');
    const sectionsData = await sectionsResponse.json();
    const sections = Object.fromEntries(sectionsData.sections.map(section => [section.id, { ...section }]))
    // 3. 記事データを取得
    const articlesResponse = await fetch('/api/v2/help_center/articles.json?sort_by=created_at&per_page=9');
    const articlesData = await articlesResponse.json();
    // 4. 記事データにカテゴリ名とセクション名を追加
    const articles = articlesData.articles.map(article => {
      const { section_id } = article;
      const section = sections[section_id]
      const { category_id } = section
      const category = categories[category_id]
      return {
        ...article,
        section_name: section.name,
        category_name: category.name,
      }
    })
    return articles
  }
  getArticles().then(articles => {
    const articlesElms = articles.map(article => {
      const { body, created_at, name, html_url, section_name, category_name } = article;
      const html = `
      <a href="${html_url}" class="border border-slate-200 rounded-lg hover:bg-gray-50">
        <div class="flex flex-col gap-2 p-4 h-full">  
          <div>
            <nav class="flex text-gray-400" aria-label="Breadcrumb">
              <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li>
                  <div class="flex items-center">
                    <svg class="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                    </svg>
                    <span">${category_name}</span>
                  </div>
                </li>
                <li aria-current="page">
                  <div class="flex items-center">
                    <svg class="rtl:rotate-180 w-3 h-3 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                    </svg>
                    <span>${section_name}</span>
                  </div>
                </li>
              </ol>
            </nav>
            <p class="font-bold text-xl text-gray-700 mb-1 truncate">
              ${name}
            </p>
            <p class="text-gray-500">
              ${extractTextAndTruncate(body)}
            </p>
          </div>
          <p class="text-right text-sm text-gray-500 mt-auto">${timeAgo(created_at)}</p>
        </div>
      </a>`;
      return html;
    });
    recentActivity.innerHTML = articlesElms.join('');
  })
});
