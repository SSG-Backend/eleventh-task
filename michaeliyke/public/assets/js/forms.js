(function(w, sapi, jQuery) {
  const a = alert;

  jQuery(function($) {

    const cookies = map_cookies();
    if (cookies.checkCookie("errorMessage")) {
      toss(cookies.getCookie("errorMessage"));
    }


    const details = {
      types: ["text", "password", "email"],
      names: null
    };

    [].forEach.call(sapi.forms, (form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();

        var formData = createFormData(form, details);

        for (const field of formData.fields) {
          if (!formData[field]) {
            toss(`Attention: please ensure that ${field == "repassword" ? "repeat-password" : field} is not empty`);
            return
          } else {
            console.log(field, ": ", formData[field], " ", formData[field], " ", typeof (formData[field]));
          }
        }

        const invalidForm = !validate({
            email: formData.email,
        });

        if (invalidForm) {
          toss("Validation Error: Please enter a valid email address");
          return
        }

        const ajax = jQuery.ajax({
          url: form.getAttribute("action"),
          type: "POST",
          dataType: "json",
          data: formData
        });

        ajax.done(function(data) {
          if (data.authorized === true && data.authorization) {
            toss(data.successMessage);
            const timer = setTimeout(() => {
              clearTimeout(timer);
              location.href = data.route
            }, 2500);
          // `${window.location.host}/${data.route}`.replace("//", "/");
          } else {
            toss(data.errorMessage);
            console.error("Else in done", data.errorMessage);
          }
        });

        ajax.fail(function(error) {
          toss("Error: Please try again.");
        });

        ajax.always(function() {
          console.log("complete");
        });


      });
    });

  });







  function validate(obj) {
    for (const x of ["email"]) {
      if (!(x in obj)) {
        toss("Please fill all required details");
        throw new Error("Please fill all required details");
      }
    }
    let {email} = obj; //michael.iyke.ike@gmail.google.com
    email = email.replace(/[._-]/g, "");
    const parts = email.split("@");
    for (const part of parts) {
      if (parts.length > 2 || /\W/.test(part) || +part[0] == part[0]) {
        return false;
      }
    }
    return true;
  }
  // names to limit reach or skip certain fields which are to be handled differently
  function createFormData(form, details) {
    const formData = {};
    formData.details = {};
    formData.fields = [];
    formData.values = [];

    (function glob(node) {
      if (node instanceof HTMLInputElement && details.types.indexOf(node.type) != -1) {
        formData[node.name] = node.value;
        formData.details[node.name] = node.value;
        formData.fields.push(node.name);
        formData.values.push(node.value);
      }
      node = node.firstChild;
      while (node) {
        glob(node);
        node = node.nextSibling;
      }
    }(form));
    return formData;
  }

  function toss(msg) {
    jQuery("#error-display").html(msg).slideDown(800).delay(8000).slideUp(800);
  }

  function map_cookies() {
    const records = document.cookie.split(";");

    const cookies = {

      setCookie(key, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${key + "=" + value + "; expires=" + date.toUTCString()}; path=/`;
      },

      getCookie(key) {
        return this[key];
      },

      checkCookie(key) {
        return key in this;
      }

    };

    for (const record of records) {
      let [key, value] = record.split("=");
      cookies[key.trim()] = value.trim();
    }
    return cookies;
  }

}(window, document, jQuery))