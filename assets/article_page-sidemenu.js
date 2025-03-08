import { getCategories, getSections, getArticles } from "getZendeskAPI";

document.addEventListener('DOMContentLoaded', function () {

  /**
   * サイドメニューを実装する関数
   */
  async function setSidemenu() {
    // 記事を取得
    const articles = await getArticles()
    // 記事をセクションIDごとにする
    const articlesBySection = articles.reduce((acc, article) => {
      const { section_id } = article
      if (!acc[section_id]) acc[section_id] = []
      acc[section_id].push(article)
      return acc
    }, {})

    // セクション取得
    const sections = await getSections()
    // セクションごとに記事を含める
    const sectionsInArticles = sections.map(section => {
      return { ...section, articles: articlesBySection[section.id] }
    })
    // セクションをカテゴリIDごとにする
    const sectionsByCategories = sectionsInArticles.reduce((acc, section) => {
      const { category_id } = section
      if (!acc[category_id]) acc[category_id] = []
      acc[category_id].push(section)
      return acc
    }, {})

    // カテゴリを取得
    const categories = await getCategories()
    // カテゴリごとにセクションを含める
    const categoriesInSections = categories.map(category => {
      return { ...category, sections: sectionsByCategories[category.id] }
    })

    // HTML作成
    const categoryHtml = categoriesInSections.map(category => {
      const sectionsHtml = category.sections.map(section => {
        const { articles } = section
        const articlesHtml = articles.map(article => `<div class="truncate pl-2"><a href="${article.html_url}" title="${article.name}">${article.name}</a></div>`).join('')
        return `
        <div class="flex flex-col gap-2 bg-gray-50 rounded-md p-2" data-accordion="collapse">
          <div class="flex items-center gap-1">
            <button class="hover:bg-gray-200 rotate-270">
              <svg aria-hidden="true" class="w-6 h-6 pointer-events-none" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd">
                </path>
              </svg>
            </button>
            <a href="${section.html_url}" title="${section.name}">${section.name}</a>
          </div>
          <div class="hidden flex-col gap-2">
            ${articlesHtml}
          </div>
        </div>`
      }).join('')
      const html = `
        <div class="flex flex-col gap-2 bg-gray-50 rounded-md p-2" data-accordion="collapse">
          <div class="flex items-center gap-1">
            <button class="hover:bg-gray-200 rotate-270">
              <svg aria-hidden="true" class="w-6 h-6 pointer-events-none" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd">
                </path>
              </svg>
            </button>
            <a href="${category.html_url}">${category.name}</a>
          </div>
          <div class="hidden flex-col gap-2">
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