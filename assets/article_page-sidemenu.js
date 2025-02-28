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
 * @typedef {Object} Categories
 * @property {Array.<Category>} categories - カテゴリーのリスト
 * @property {number} page - 現在のページ番号
 * @property {number|null} previous_page - 前のページ番号 (null の場合なし)
 * @property {number|null} next_page - 次のページ番号 (null の場合なし)
 * @property {number} per_page - 1ページあたりのカテゴリー数
 * @property {number} page_count - 総ページ数
 * @property {number} count - 総カテゴリー数
 * @property {string} sort_by - ソート基準 (例: "position")
 * @property {string} sort_order - ソート順 (例: "asc")
 */

/**
 * @typedef {Object} Section
 * @property {number} id - セクションのID
 * @property {string} url - APIエンドポイントのURL
 * @property {string} html_url - ヘルプセンターのHTML URL
 * @property {number} category_id - 所属するカテゴリーのID
 * @property {number} position - セクションの表示順
 * @property {string} sorting - ソート方法 (例: "manual")
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
 * @typedef {Object} Sections
 * @property {Array.<Section>} sections - セクションのリスト
 * @property {number} page - 現在のページ番号
 * @property {number|null} previous_page - 前のページ番号 (null の場合なし)
 * @property {number|null} next_page - 次のページ番号 (null の場合なし)
 * @property {number} per_page - 1ページあたりのセクション数
 * @property {number} page_count - 総ページ数
 * @property {number} count - 総セクション数
 * @property {string} sort_by - ソート基準 (例: "position")
 * @property {string} sort_order - ソート順 (例: "asc")
 */


document.addEventListener('DOMContentLoaded', function () {
  /**
   * キャッシュがあれば期限切れを確認して返す
   * @param {string} cacheName storage名
   * @param {number} cacheTime hour
   * @returns {Categories|Sections|null} データ または null
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
   * @param {Categories|Sections} data データ
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
    const cacheName = 'C.categories'
    const cache = getCached(cacheName)
    if (cache) return cache
    // 1. カテゴリを取得
    const categoriesResponse = await fetch('/api/v2/help_center/ja/categories.json?per_page=100')
    const categories = await categoriesResponse.json()
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
    const cacheName = 'C.sections'
    const cache = getCached(cacheName)
    if (cache) return cache
    // 1. セクションを取得
    const sectionsResponse = await fetch('/api/v2/help_center/sections.json?per_page=100')
    const sections = await sectionsResponse.json()
    // 2. ローカルストレージにキャッシュとして保存
    setCached(cacheName, sections)
    return sections
  }

  async function setSidemenu() {
    // セクションをカテゴリIDごとにする
    const sectionsData = await getSections()
    const { sections } = sectionsData
    const newSections = sections.reduce((acc, section) => {
      const { category_id } = section
      if (!acc[category_id]) acc[category_id] = []
      acc[category_id].push(section)
      return acc
    }, {})
    // カテゴリごとにセクションを含める
    const categoriesData = await getCategories()
    const { categories } = categoriesData
    const newCategories = categories.map(category => {
      return { ...category, sections: newSections[category.id] }
    })
    // HTML作成
    const categoryHtml = newCategories.map(category => {
      const sectionsHtml = category.sections.map(section => {
        return `
          <div class="truncate">
            <a href="${section.html_url}" title="${section.name}">${section.name}</a>
          </div>`
      }).join('')
      const html = `
        <div class="flex flex-col gap-2 bg-gray-50 rounded-md p-2" data-accordion="collapse">
          <div class="flex items-center gap-1">
            <button class="hover:bg-gray-200 rotate-270">
              <svg aria-hidden="true" class="w-6 h-6 pointer-events-none" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
            </button>
            <a href="${category.html_url}">${category.name}</a>
          </div>
          <div class="hidden flex-col gap-2 pl-2">
            ${sectionsHtml}
          </div>
        </div>`
      return html
    }).join('')
    document.getElementById('categories').innerHTML = categoryHtml
    // ボタンクリック
    document.querySelectorAll('[data-accordion="collapse"]').forEach(collapseElm => {
      collapseElm.querySelector('button').addEventListener('click', event => {
        const buttonElm = event.target
        const categoryElm = buttonElm.closest('[data-accordion="collapse"]')
        const sectionsElm = categoryElm.lastElementChild
        const isSectionsHidden = sectionsElm.classList.contains('hidden')
        if (isSectionsHidden) {
          sectionsElm.classList.replace('hidden', 'flex')
          buttonElm.classList.remove('rotate-270')
        } else {
          sectionsElm.classList.replace('flex', 'hidden')
          buttonElm.classList.add('rotate-270')
        }
      })

    })
  }

  setSidemenu().then(e => console.log('Side menu has been added.'))

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