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
 */

/**
 * カテゴリー情報を取得する関数
 * @returns {Promise<Category[]>} カテゴリー情報のオブジェクト
 */
async function fetchZendeskCategories() {
  const name = 'categories'
  // 0. ローカルストレージにキャッシュがあれば返す
  const cacheName = `C.${name}`
  const cache = retrieveZendeskCache(cacheName)
  if (cache) return cache
  // 1. カテゴリを取得
  const categories = await fetchZendeskContentByType(name)
  // 2. ローカルストレージにキャッシュとして保存
  cacheZendeskData(cacheName, categories)
  return categories
}

/**
 * @typedef {Object} Section
 * @property {number} id - セクションのID
 * @property {string} url - APIエンドポイントのURL
 * @property {string} html_url - ヘルプセンターのHTML URL
 * @property {number} category_id - 所属するカテゴリーのID
 * @property {number} position - セクションの表示順
 * @property {string} sorting - ソート方法 (例: 'manual')
 * @property {string} created_at - 作成日時 (ISO 8601 形式)
 * @property {string} updated_at - 更新日時 (ISO 8601 形式)
 * @property {string} name - セクション名
 * @property {string} description - セクションの説明 (空の場合もあり)
 * @property {string} locale - 言語ロケール
 * @property {string} source_locale - 元の言語ロケール
 * @property {boolean} outdated - 古い情報かどうか
 * @property {number|null} parent_section_id - 親セクションのID (null の場合なし)
 * @property {string} theme_template - 使用されるテーマテンプレート
 */

/**
 * セクション情報を取得する関数
 * @returns {Promise<Sections[]>} セクション情報のオブジェクト
 */
async function fetchZendeskSections() {
  const name = 'sections'
  // 0. ローカルストレージにキャッシュがあれば返す
  const cacheName = `C.${name}`
  const cache = retrieveZendeskCache(cacheName)
  if (cache) return cache
  // 1. セクションを取得
  const sections = await fetchZendeskContentByType(name)
  // 2. ローカルストレージにキャッシュとして保存
  cacheZendeskData(cacheName, sections)
  return sections
}

/**
 * @typedef {Object} Article
 * @property {number} id - 記事のID
 * @property {string} url - APIエンドポイントのURL
 * @property {string} html_url - ヘルプセンターのHTML URL
 * @property {number} author_id - 作成者のID
 * @property {boolean} comments_disabled - コメントの有効/無効
 * @property {boolean} draft - 下書き状態かどうか
 * @property {boolean} promoted - プロモート済みかどうか
 * @property {number} position - 記事の表示順
 * @property {number} vote_sum - 投票の合計値
 * @property {number} vote_count - 投票数
 * @property {number} section_id - 所属するセクションのID
 * @property {string} created_at - 作成日時 (ISO 8601 形式)
 * @property {string} updated_at - 更新日時 (ISO 8601 形式)
 * @property {string} name - 記事の名前
 * @property {string} title - 記事のタイトル
 * @property {string} source_locale - 元の言語ロケール
 * @property {string} locale - 言語ロケール
 * @property {boolean} outdated - 古い情報かどうか
 * @property {Array<string>} outdated_locales - 古いロケールのリスト
 * @property {string|null} edited_at - 最終編集日時 (ISO 8601 形式, null の場合なし)
 * @property {number|null} user_segment_id - ユーザーセグメントID (null の場合なし)
 * @property {number} permission_group_id - 記事のアクセス権グループID
 * @property {Array<number>} content_tag_ids - 記事のコンテンツタグID一覧
 * @property {Array<string>} label_names - 記事のラベル一覧
 */

/**
 * アーティクル情報を取得する関数
 * @returns {Promise<Article[]>} アーティクル情報のオブジェクト
 */
async function fetchZendeskArticles() {
  const name = 'articles'
  // 0. ローカルストレージにキャッシュがあれば返す
  const cacheName = `C.${name}`
  const cache = retrieveZendeskCache(cacheName)
  if (cache) return cache
  // 1. アーティクルを取得
  const articles = await fetchZendeskContentByType(name)
  // 2. bodyを70文字に制限する
  const mappedArticles = articles.map(article => {
    const { body, ...rest } = article
    const divElm = document.createElement('div')
    divElm.innerHTML = body
    const text = divElm.innerText || divElm.textContent
    const replaceText = text.replace(/\n/g, '')
    const maxLen = 70
    const maxBody = replaceText.length > maxLen ? replaceText.slice(0, maxLen) + '…' : replaceText
    return { body: maxBody, ...rest }
  })
  // 3. ローカルストレージにキャッシュとして保存
  cacheZendeskData(cacheName, mappedArticles)
  return mappedArticles
}

/**
 * API経由でZendeskのコンテンツを取得
 * @param {string} name categories | sections | articles
 * @returns {Category[] | Sections[] | Article[]}
 */
async function fetchZendeskContentByType(name) {
  let list = []
  let next_page = `/api/v2/help_center/${name}.json?page=1&per_page=100`
  while (next_page) {
    const response = await fetch(next_page)
    const data = await response.json()
    if (data[name]) list = [...list, ...data[name]]
    next_page = data.next_page
  }
  return list
}

/**
 * ローカルストレージにキャッシュとして保存
 * @param {string} cacheName storage名
 * @param {Category[] | Sections[] | Article[]} data データ
 */
function cacheZendeskData(cacheName, data) {
  const cacheData = {
    data: data,
    timestamp: Date.now() // 現在の時刻を記録
  }
  localStorage.setItem(cacheName, JSON.stringify(cacheData))
}

/**
 * ローカルストレージからキャッシュを取得する関数
 * @param {string} cacheName - 取得するキャッシュのキー名。
 * @param {number} [cacheTime=24] - キャッシュの有効時間（時間単位）。
 * @returns {Category[] | Sections[] | Article[] | null} 有効なキャッシュデータがあれば返し、なければ null を返す。
 */
function retrieveZendeskCache(cacheName, cacheTime = 24) {
  const cacheLifetime = cacheTime * 60 * 60 * 1000 // 指定時間（ミリ秒）
  const cachedData = localStorage.getItem(cacheName)
  if (!cachedData) {
      console.log('No cache exists.')
      return null
  }
  try {
      const { data, timestamp } = JSON.parse(cachedData)
      const isValid = (Date.now() - timestamp) < cacheLifetime 
      if (isValid) {
          console.log('Returning cached data.')
          return data
      }
      console.log('Cache expired. Removing old cache.')
      localStorage.removeItem(cacheName)
      return null
  } catch (error) {
      console.log('Cache is incorrect.')
      return null
  }
}

/**
 * Zendeskの全記事を取得する関数
 */
async function fetchAllZendeskArticles(options) {
  const { sort_by = 'created_at', per_page} = options
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
  // 1. カテゴリを取得
  const categories = await fetchZendeskCategories()
  // 2. セクションを取得
  const sections = await fetchZendeskSections()
  // 3. 記事を取得
  const articlesData = await fetchZendeskArticles()
  // 3. ソート
  const articlesSort = [...articlesData].sort((a, b) => new Date(b[sort_by]) - new Date(a[sort_by]))
  // 4. 表示数を制限
  const articlesSlice = per_page ? articlesSort.slice(0, per_page) : articlesSort
  // 5. ｎ日前を追加
  const articlesReplaceTime = articlesSlice.map(article => {
    const {created_at, updated_at} = article
    const created_at_timeAgo = timeAgo(created_at)
    const updated_at_timeAgo = timeAgo(updated_at)
    return { ...article, created_at_timeAgo, updated_at_timeAgo }
  })
  const articles = articlesReplaceTime.map(article => {
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

/**
 * Zendeskの全記事を取得する関数
 */
async function fetchZendeskHierarchy() {
  // 1-1. 記事を取得
  const articles = await fetchZendeskArticles()
  // 1-2. 記事をセクションIDごとにする
  const articlesBySection = articles.reduce((acc, article) => {
    const { section_id } = article
    if (!acc[section_id]) acc[section_id] = []
    acc[section_id].push(article)
    return acc
  }, {})
  // 2-1. セクションを取得
  const sections = await fetchZendeskSections()
  // 2-2. セクションごとに記事を含める
  const sectionsInArticles = sections.map(section => {
    return { ...section, articles: articlesBySection[section.id] }
  })
  // 2-3. セクションをカテゴリIDごとにする
  const sectionsByCategories = sectionsInArticles.reduce((acc, section) => {
    const { category_id } = section
    if (!acc[category_id]) acc[category_id] = []
    acc[category_id].push(section)
    return acc
  }, {})
  // 3-1. カテゴリを取得
  const categories = await fetchZendeskCategories()
  // 3-2. カテゴリごとにセクションを含める
  const categoriesInSections = categories.map(category => {
    return { ...category, sections: sectionsByCategories[category.id] }
  })
  return categoriesInSections
}