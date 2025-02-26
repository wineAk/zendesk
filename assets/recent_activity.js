/**
 * @typedef {Object} Category
 * @property {number} id - カテゴリーのID
 * @property {string} url - APIエンドポイントのURL
 * @property {string} html_url - ヘルプセンターのHTML URL
 * @property {number} position - カテゴリーの表示順
 * @property {string} created_at - 作成日時 (ISO 8601 形式)
 * @property {string} updated_at - 更新日時 (ISO 8601 形式)
 * @property {string} name - カテゴリー名
 * @property {string} description - カテゴリーの説明 (空の場合もあり)
 * @property {string} locale - 言語ロケール
 * @property {string} source_locale - 元の言語ロケール
 * @property {boolean} outdated - 古い情報かどうか
 * @typedef {Object.<string, Category>} Categories
 */

/**
 * @typedef {Object} Section
 * @property {number} id - セクションのID
 * @property {string} url - APIエンドポイントのURL
 * @property {string} html_url - ヘルプセンターのHTML URL
 * @property {number} category_id - カテゴリーID
 * @property {number} position - セクションの表示順
 * @property {string} sorting - 並び順の方法 (例: "manual")
 * @property {string} created_at - 作成日時 (ISO 8601 形式)
 * @property {string} updated_at - 更新日時 (ISO 8601 形式)
 * @property {string} name - セクション名
 * @property {string} description - セクションの説明 (空の場合もあり)
 * @property {string} locale - 言語ロケール
 * @property {string} source_locale - 元の言語ロケール
 * @property {boolean} outdated - 古い情報かどうか
 * @property {number|null} parent_section_id - 親セクションID (nullの場合もあり)
 * @property {string} theme_template - テーマテンプレートの種類
 * @typedef {Object.<string, Section>} Sections
 */

/**
 * @typedef {Object} Article
 * @property {number} id - 記事のID
 * @property {string} url - APIエンドポイントのURL
 * @property {string} html_url - ヘルプセンターのHTML URL
 * @property {number} author_id - 記事の作成者ID
 * @property {boolean} comments_disabled - コメントが無効かどうか
 * @property {boolean} draft - 下書きかどうか
 * @property {boolean} promoted - 推奨記事かどうか
 * @property {number} position - 記事の表示順
 * @property {number} vote_sum - 投票の合計
 * @property {number} vote_count - 投票数
 * @property {number} section_id - 記事が属するセクションのID
 * @property {string} created_at - 作成日時 (ISO 8601 形式)
 * @property {string} updated_at - 更新日時 (ISO 8601 形式)
 * @property {string} name - 記事の名前
 * @property {string} title - 記事のタイトル
 * @property {string} source_locale - 記事の元言語
 * @property {string} locale - 言語ロケール
 * @property {boolean} outdated - 記事が古いかどうか
 * @property {Array.<string>} outdated_locales - 古いロケールのリスト
 * @property {string} edited_at - 最終編集日時 (ISO 8601 形式)
 * @property {number|null} user_segment_id - ユーザーセグメントID (nullの場合もあり)
 * @property {number} permission_group_id - 権限グループID
 * @property {Array.<number>} content_tag_ids - コンテンツタグのIDリスト
 * @property {Array.<string>} label_names - ラベル名のリスト
 * @property {string} body - 記事の本文 (HTML形式)
 * @property {string} section_name - セクション名
 * @property {string} category_name - カテゴリー名
 * @typedef {Array.<Article>} Articles
 */

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
   * HTMLタグを除去
   * @param {string} htmlString <p>本文</p>
   * @returns {string} 本文
   */
  function extractTextAndTruncate(htmlString) {
    const maxLen = 70
    const divElm = document.createElement("div")
    divElm.innerHTML = htmlString
    const text = divElm.innerText || divElm.textContent
    return text.length > maxLen ? text.slice(0, maxLen) + "…" : text
  }

  /**
   * キャッシュがあれば期限切れを確認して返す
   * @param {string} cacheName storage名
   * @param {number} cacheTime hour
   * @returns {Categories|Sections|Articles|null} データ または null
   */
  function getCached(cacheName, cacheTime = 24) {
    const cacheLifetime = 60 * 60 * 1000 * cacheTime // n時間（ミリ秒）
    const cachedData = localStorage.getItem(cacheName)
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData)
      const now = Date.now()
      if (now - timestamp < cacheLifetime) {
        console.log("Returning cached data.")
        return data // 有効期限内ならキャッシュを返す
      } else {
        console.log("Cache expired. Removing old cache.")
        localStorage.removeItem(cacheName) // 期限切れなら削除
      }
    }
    return null // キャッシュがないか期限切れなら null を返す
  }

  /**
   * ローカルストレージにキャッシュとして保存
   * @param {string} cacheName storage名
   * @param {Categories|Sections|Articles} data データ
   */
  function setCached(cacheName, data) {
    const cacheData = {
      data: data,
      timestamp: Date.now() // 現在の時刻を記録
    }
    localStorage.setItem(cacheName, JSON.stringify(cacheData))
  }

  /**
   * カテゴリー情報を取得する関数
   * @returns {Categories} カテゴリー情報のオブジェクト
   */
  async function getCategories() {
    // 0. ローカルストレージにキャッシュがあれば返す
    const cacheName = `C.${location.pathname}.categories`
    const cache = getCached(cacheName)
    if (cache) return cache
    // 1. カテゴリを取得
    const categoriesResponse = await fetch('/api/v2/help_center/ja/categories.json?per_page=100')
    const categoriesData = await categoriesResponse.json()
    const categories = Object.fromEntries(categoriesData.categories.map(category => [category.id, { ...category }]))
    // 2. ローカルストレージにキャッシュとして保存
    setCached(cacheName, categories)
    return categories
  }

  /**
   * セクション情報を取得する関数
   * @returns {Sections} セクション情報のオブジェクト
   */
  async function getSections() {
    // 0. ローカルストレージにキャッシュがあれば返す
    const cacheName = `C.${location.pathname}.sections`
    const cache = getCached(cacheName)
    if (cache) return cache
    // 1. セクションを取得
    const sectionsResponse = await fetch('/api/v2/help_center/sections.json?per_page=100')
    const sectionsData = await sectionsResponse.json()
    const sections = Object.fromEntries(sectionsData.sections.map(section => [section.id, { ...section }]))
    // 2. ローカルストレージにキャッシュとして保存
    setCached(cacheName, sections)
    return sections
  }

  /**
   * 記事情報を取得する関数
   * @param {string} sort_by ソート順 ( created_at | updated_at )
   * @returns {Articles} 記事情報のオブジェクト
   */
  async function getArticles(sort_by) {
    // 0. ローカルストレージにキャッシュがあれば返す
    const cacheName = `C.${location.pathname}.articles.${sort_by}`
    const cache = getCached(cacheName)
    if (cache) return cache
    // 1. カテゴリを取得
    const categories = await getCategories()
    // 2. セクションを取得
    const sections = await getSections()
    // 3. 記事を取得
    const articlesResponse = await fetch(`/api/v2/help_center/articles.json?sort_by=${sort_by}&per_page=9`)
    const articlesData = await articlesResponse.json()
    // 4. 記事にカテゴリ名とセクション名を追加
    const articles = articlesData.articles.map(article => {
      const { section_id } = article
      const section = sections[section_id]
      const { category_id } = section
      const category = categories[category_id]
      return {
        ...article,
        section_name: section.name,
        category_name: category.name,
      }
    })
    // 5. ローカルストレージにキャッシュとして保存
    setCached(cacheName, articles)
    return articles
  }

  /**
   * HTMLを書き込む
   * @param {string} sort_by ソート順 ( created_at | updated_at )
   * @param {Element} element 対象の要素
   * @param {Articles} articles 記事情報のオブジェクト
   */
  function HTMLRewriting(sort_by, elm, articles) {
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
              ${extractTextAndTruncate(body)}
            </p>
          </div>
          <p class="text-right text-sm text-gray-500 mt-auto">${timeAgo(article[sort_by])}</p>
        </div>
      </a>`
      return html
    })
    elm.innerHTML = articlesElms.join('')
  }

  getArticles("created_at").then(articles => HTMLRewriting("created_at", recentActivity, articles))
  getArticles("updated_at").then(articles => HTMLRewriting("updated_at", recentUpdates, articles))
})
