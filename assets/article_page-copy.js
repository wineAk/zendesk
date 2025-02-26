document.addEventListener('DOMContentLoaded', function () {
  const copyButton = document.querySelector('[data-copy-to-clipboard-target]')
  const defaultMessage = document.getElementById('default-message')
  const successMessage = document.getElementById('success-message')
  if (!copyButton || !defaultMessage || !successMessage) return
  // コピー開始
  function showSuccess() {
    defaultMessage.style.display = 'none'
    successMessage.style.display = null
  }
  // コピー終了
  function resetToDefault() {
    defaultMessage.style.display = null
    successMessage.style.display = 'none'
  }
  // コピークリック
  copyButton.addEventListener("click", function () {
    const textToCopy = copyButton.getAttribute('data-copy-to-clipboard-target').replace(/\\n/g, '\n')
    navigator.clipboard.writeText(textToCopy).then(() => {
      showSuccess()
      setTimeout(() => resetToDefault(), 2000)
    }).catch(err => {
      console.error('クリップボードにコピーできませんでした：', err)
    })
  })

})