document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.article-body img').forEach(elm => {
    elm.addEventListener('click', event => {
      const { target } = event
      const { src } = target
      Swal.fire({
        imageUrl: src,
        showConfirmButton: false,
      });
    })
  })
})