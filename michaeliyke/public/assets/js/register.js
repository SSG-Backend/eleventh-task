


(function(doc) {
  const find = document.querySelector.bind(document);
  const toggler = find(".toggle-password");
  const password = toggler.parentNode.querySelector("input");
  toggler.addEventListener("click", handler.bind(password));



  function handler(e) {
    password.type = (password.type == "text") ? "password" : "text";
  }
})(document);