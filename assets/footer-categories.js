import { getCategories } from "getZendeskAPI";
import { serviceClasses } from "getClasses";

document.addEventListener("DOMContentLoaded", function () {
  getCategories().then(categories => {
    const html = categories.map(category => {
      const { html_url, name } = category
      const serviceColor = serviceClasses(name, ['text', 'border', 'hover']) || "";
      return `
      <a href="${html_url}" class="no-underline w-30">
        <div class="border-1 text-center h-full py-2 rounded-lg ${serviceColor}">
          ${name}
        </div>
      </a>
      `
    }).join('')
    document.querySelector('#footer_categories').innerHTML = html
  })

})