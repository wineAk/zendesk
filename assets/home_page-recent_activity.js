import { getCategories, getSections, getArticles } from "getZendeskAPI";

document.addEventListener("DOMContentLoaded", function () {
  const recentActivity = document.querySelector('#recent_activity')
  const recentUpdates = document.querySelector('#recent_updates')
  if (recentActivity == null || recentUpdates == null) return

  /**
   * 作成日を表示
   * @param {string} dateString 2025-02-10T08:22:59Z
   * @returns {string} 今日 / 9日前 / 2か月前 / 1年前
   */
  function timeAgo(dateString) {
    const createdDate = new Date(dateString)
    const now = new Date()
    const diffTime = now - createdDate
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const diffMonths = Math.floor(diffDays / 30)
    const diffYears = Math.floor(diffDays / 365)
    if (diffDays === 0) return '今日'
    if (diffDays < 30) return `${diffDays}日前`
    if (diffMonths < 12) return `${diffMonths}か月前`
    return `${diffYears}年前`
  }

  /**
   * HTMLを書き込む
   * @param {string} sort_by ソート順 ( created_at | updated_at )
   * @param {Element} element 対象の要素
   * @param {Articles} articles 記事情報のオブジェクト
   */
  function HTMLRewriting(sort_by, element, articles) {
    const articlesElms = articles.map(article => {
      const { body, name, html_url, section_name, category_name } = article
      const html = `
      <a href="${html_url}" class="border border-slate-200 rounded-lg hover:bg-gray-50 no-underline">
        <div class="flex flex-col gap-2 p-4 h-full">  
          <div>
            <nav class="flex text-gray-400 text-xs mb-1" aria-label="Breadcrumb">
              <ol class="inline-flex items-center truncate">
                <li>
                  <svg class="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                  </svg>
                </li>
                <li>
                    <span>${category_name}</span>
                </li>
                <li>
                    <svg class="w-3 h-3 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                    </svg>
                </li>
                <li class="truncate">
                    <span class="truncate">${section_name}</span>
                </li>
              </ol>
            </nav>
            <p class="font-bold text-xl text-gray-700 mb-1 truncate">
              ${name}
            </p>
            <p class="text-gray-500">
              ${body}
            </p>
          </div>
          <p class="text-right text-sm text-gray-500 mt-auto">${timeAgo(article[sort_by])}</p>
        </div>
      </a>`
      return html
    })
    element.innerHTML = articlesElms.join('')
  }

  /**
   * 記事情報を取得する関数
   * @param {string} sort_by ソート順 ( created_at | updated_at )
   * @returns {Articles} 記事情報のオブジェクト
   */
  async function getArticlesData(sort_by) {
    // 1. カテゴリを取得
    const categories = await getCategories()
    // 2. セクションを取得
    const sections = await getSections()
    // 3. 記事を取得
    const articlesData = await getArticles()
    const articlesSort = [...articlesData].sort((a, b) => new Date(b[sort_by]) - new Date(a[sort_by])) // ソート
    const articlesSlice = articlesSort.slice(0, 12) // 最大12記事に絞り込み
    const articles = articlesSlice.map(article => {
      const { section_id } = article
      const section = sections.find((section) => section.id === section_id)
      const { category_id } = section
      const category = categories.find((category) => category.id === category_id)
      const object = {
        ...article,
        section_name: section.name,
        category_name: category.name,
      }
      return object
    })
    return articles
  }

  getArticlesData('created_at').then(articles => HTMLRewriting('created_at', recentActivity, articles))
  getArticlesData('updated_at').then(articles => HTMLRewriting('updated_at', recentUpdates, articles))

})
