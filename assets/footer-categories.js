import { getCategories } from "getZendeskAPI";

document.addEventListener("DOMContentLoaded", function () {
  getCategories().then(categories => {
    const html = categories.map(category => {
      const { html_url, name } = category
      return `
      <a href="${html_url}" class="border border-slate-200 rounded-lg hover:bg-gray-50 no-underline w-32">
        <div class="px-4 py-2 text-gray-500 text-center">
          ${name}
        </div>
      </a>
      `
    }).join('')
    document.querySelector('#footer_categories').innerHTML = html
  })

})