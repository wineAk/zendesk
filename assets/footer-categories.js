import { getCategories } from "getZendeskAPI";

document.addEventListener("DOMContentLoaded", function () {
  getCategories().then(categories => {
    const html = categories.map(category => {
      const { html_url, name } = category
      return `
      <li class="w-full text-center">
        <a href="${html_url}">
          ${name}
        </a>
      </li>
      `
    }).join('')
    document.querySelector('#footer_categories').innerHTML = html
  })

})