$(function () {
  //ANCHOR: определяем Internet Explorer и задаём свои стили
  const userAgent = window.navigator.userAgent;
  const is_ie = /trident/gi.test(userAgent) || /msie/gi.test(userAgent);

  if (is_ie) $("body").addClass("ie-active");
  //!ANCHOR

  // ANCHOR: функция для открытия модального окна
  // NOTE: весь контент модальных окон открывается в одном окне(блоке). Для вызова модального окна вызывающий элемент должен иметь класс js-modal-call и дата-атрибут data-modal со значением, равным ID обёртки вызываемого контента. Вызываемый контент оборачивается обёрткой с классом modal__content-wrapper. В случае, если заданного ID нет, внутри модального окна появится сообщение об ошибке.
  $(".js-modal-call").click(function () {
    const $modal = $(this).data("modal");
    $("body").addClass("no-scroll");
    $(".modal").fadeIn(260);
    $($modal).siblings().hide();
    $($modal).show();
    $("body *:not(.modal *)").attr("tabindex", -1); //NOTE - запрещает фокус элементов с клавиатуры, находящихся вне модального окна
  });
  // !ANCHOR

  // ANCHOR: функция для закрытия модального окна
  $(".modal__overlay, .modal__close").click(function () {
    $("body").removeClass("no-scroll");
    $(".modal").fadeOut(260);
    $(".modal .modal__content-wrapper").fadeOut(300);
    $("body *:not(.modal *)").removeAttr("tabindex");
  });
  // !ANCHOR

  // ANCHOR: функция аккордеона
  $(".js-info-open").on("click focus", function () {
    $(this).toggleClass("info-box__title--open");

    $(this).siblings(".info-box__content").slideToggle(260);

    if ($(this).parent().hasClass("modal__info-box")) {
      $(".modal").animate(
        {
          scrollTop: $(this).offset().top,
        },
        260
      );
    } else {
      $("body").animate(
        {
          scrollTop: $(this).offset().top,
        },
        260
      );
    }
  });
  // !ANCHOR

  //ANCHOR: функция показа фото при смене в настройках
  $(".settings-user-photo").change(function () {
    if (this.files && this.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        $(".settings__input-wrapper--picture>img").attr("src", e.target.result);
      };
      reader.readAsDataURL(this.files[0]);
    }
  });

  $(".new-article-pic").change(function () {
    if (this.files && this.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        $(".new-article__image").attr("src", e.target.result);
      };
      reader.readAsDataURL(this.files[0]);
    }
  });
  //!ANCHOR

  // ANCHOR: функция вызова плагина для выбора одинарной даты
  if (window.innerWidth >= 1024) {
    $(".js-date, #registration-borth-date, #settings-borth-date").datepicker({
      maxDate: new Date(),
      dateFormat: "dd.mm.yyyy", //NOTE: можно включить полное отображение даты: 29 февраля 2020, задав значение dd MM yyyy но оно не всегда помещается в поле ввода целиком.
      position: "top left",
      view: "years",
      range: false,
      clearButton: true,
      todayButton: new Date(),
      autoClose: true,
      language: {
        months: [
          "января",
          "февраля",
          "марта",
          "апреля",
          "мая",
          "июня",
          "июля",
          "августа",
          "сентября",
          "октября",
          "ноября",
          "декабря",
        ],
      },
    });
  }

  $(".js-date, #registration-borth-date, #settings-borth-date").inputmask({
    mask: "99.99.9999",
    // greedy: true,
    validator: "[0-9]",
  });
  // !ANCHOR

  // ANCHOR: функция вызова плагина для выбора двойной даты
  $("#settings-work-date").datepicker({
    maxDate: new Date(),
    dateFormat: "dd.mm.yyyy", //NOTE: можно включить полное отображение даты: 29 февраля 2020, задав значение dd MM yyyy но оно не всегда помещается в поле ввода целиком.
    position: "top left",
    view: "years",
    range: true,
    clearButton: true,
    todayButton: new Date(),
    multipleDatesSeparator: " - ",
    autoClose: true,
    language: {
      months: [
        "января",
        "февраля",
        "марта",
        "апреля",
        "мая",
        "июня",
        "июля",
        "августа",
        "сентября",
        "октября",
        "ноября",
        "декабря",
      ],
    },
  });

  // !ANCHOR

  // ANCHOR: маски форм
  $(".registration-username, .settings-username").inputmask({
    mask: "*{3,30} *{3,30} *{3,30}",
    greedy: true,
    validator: "[0-9A-Za-z!]",
    onincomplete: function () {
      $(this).parent().addClass("invalid");
      setTimeout(() => {
        $(this).parent().removeClass("invalid");
      }, 3000);
    },
  });

  $("input[type='tel']").inputmask({
    mask:
      "+7" + " " + "(" + "999" + ")" + " " + "999" + "-" + "99" + "-" + "99",
    greedy: true,
    validator: "[0-9]",
  });

  $(".contact-form-email, .settings-email, .registration-email").inputmask({
    alias: "email",
    definitions: {
      "*": {
        validator: "[0-9A-Za-z!_-]",
        cardinality: 1,
        casing: "lower",
      },
    },
  });

  $(".settings-insta").inputmask({
    mask: "https://inst\\agr\\am.com/*{1,30}",
    greedy: false,
    definitions: {
      "*": {
        validator: "[.@0-9A-Za-z!#$%&'*+/=?^_`{|}~-]",
        cardinality: 1,
        casing: "lower",
      },
    },
  });

  $(".settings-fb").inputmask({
    mask: "https://f\\acebook.com/*{1,30}",
    greedy: false,
    definitions: {
      "*": {
        validator: "[.@0-9A-Za-z!#$%&'*+/=?^_`{|}~-]",
        cardinality: 1,
        casing: "lower",
      },
    },
  });
  // !ANCHOR

  //ANCHOR: функция для скрытия формы добавления картинки, пока в фокусе поле для ввода текста
  $(".new-article__content").on("focus", function () {
    $(".new-article__input-wrapper--image").addClass("go-back");
  });

  $(".new-article__content").on("focusout", function () {
    $(".new-article__input-wrapper--image").removeClass("go-back");
  });
  //!ANCHOR

  //ANCHOR: функция для бургерного меню
  $(".header__burger").click(function () {
    $(".header__burger-row").toggleClass("header__burger-row--open");
    $(".header__menu").slideToggle(260);
  });

  $(document).mouseup(function (e) {
    const $targ = $(".header__menu, .header__burger");
    const maxWidth = window.matchMedia("(max-width: 1023px)").matches;
    if (!$targ.is(e.target) && $targ.has(e.target).length === 0 && maxWidth) {
      $(".header__menu").slideUp(260);
      $(".header__burger-row").removeClass("header__burger-row--open");
    }
  });
  //!!ANCHOR

  //ANCHOR: замена заполняющего текста для инпута при разрешении экрана меньше 699px
  $(window).on("load resize orientationchange", function () {
    if (window.matchMedia("(max-width: 699px)").matches) {
      $(".registration-add-spec, .settings-add-spec").attr(
        "placeholder",
        "Доп. специальность"
      );
    } else {
      $(".registration-add-spec, .settings-add-spec").attr(
        "placeholder",
        "Дополнительная специальность"
      );
    }
  });
  //!ANCHOR

  //ANCHOR: инициалитзация слайдеров
  new Swiper(".partners swiper-container", {
    loop: false,
    pagination: false,
    navigation: false,
    scrollbar: false,
    slidesPerView: 1,
    breakpoints: {
      565: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 3,
      },
      1024: {
        slidesPerView: 4,
      },
    },
  });

  new Swiper(".spec .swiper-container, .past-events .swiper-container", {
    loop: false,
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
    },
    navigation: false,
    scrollbar: false,
    slidesPerView: 1,
    spaceBetween: 20,
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 40,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 70,
      },
    },
  });
  //!ANCHOR

  //ANCHOR: ajax forms submit
  $(".ajax-form").submit(function (e) {
    e.preventDefault();

    const errors = [];

    const $password = $(this).find(".js-password");
    const $passwordConfirm = $(this).find(".js-password-confirm");

    if ($password.length > 0) {
      const password = String($password.val()).trim();
      const passwordConfirm = String($passwordConfirm.val()).trim();

      if (password && password.length < 6)
        errors.push("Пароль должен быть не менее 6 символов длиной.");
      else if (password && password !== passwordConfirm)
        errors.push("Неверное подтверждение пароля.");
    }

    if (errors.length > 0) {
      showMessage(this, errors, "error");
    } else {
      const action = $(this).attr("action");

      $.ajax({
        type: "POST",
        url: action,
        dataType: "json",
        data: new FormData(this),
        processData: false,
        contentType: "multipart/form-data",
        timeout: 3000,
        error: () => {
          showMessage(
            this,
            "Что-то пошло не так! Обновите страницу и попробуйте позже.",
            "error"
          );
        },
        success: (data) => {
          if (data.url) {
            window.location.href = data.url;
          } else {
            showMessage(
              this,
              data.message,
              data.type === "ok" ? "success" : "error"
            );
          }
        },
      });
    }
  });

  /**
   * @param {jQuery|HTMLElement} form
   * @param {(string|string[]|undefined)} content
   * @param {('success'|'error')} type
   */
  function showMessage(form, content, type = "success") {
    let $container;

    if ($(form).parent("#modal-settings").length > 0) {
      $container = $(form).find(".settings__top-box");
    } else $container = $(form);

    $container.find(".modal__error").remove();
    $container.find(".modal__success").remove();

    if (content && content.length > 0) {
      $container.prepend(generateMessage(content, type));
    }
  }

  /**
   * @param {(string|string[])} content
   * @param {('success'|'error')} type
   */
  function generateMessage(content, type = "success") {
    let message = `<div class="modal__${type}">`;

    if (Array.isArray(content)) {
      errors.forEach(function (e) {
        message += e + "<br>";
      });
    } else {
      message += content;
    }

    message += "<p>";

    return message;
  }
  //!ANCHOR

  //ANCHOR: workplaces update
  $(".js-workplace").each(function () {
    const $container = $(this);
    const $addButton = $container.find(".settings__add-workplace");
    const $cancelButton = $container.find(".js-workplace-cancel");
    const $formWrapper = $container.find(".settings__workplace-wrapper");
    const $form = $container.find(".settings__workplace");
    const action = $container.attr("action");

    $addButton.click(function (e) {
      e.preventDefault();

      showWorkplaceForm({ $container });
    });

    $container.on("click", ".js-workplace-edit", function (e) {
      e.preventDefault();

      const $item = $(this).closest(".js-workplace-item");
      const id = $item.data("id");
      const data = [];
      $item.find(".info-box__col[data-name]").each(function () {
        const name = $(this).data("name");
        const value = $(this).html();

        data.push({ name, value });
      });

      showWorkplaceForm({ $container, id, data });
    });

    $container.on("click", ".js-workplace-remove", function (e) {
      e.preventDefault();

      const $item = $(this).closest(".js-workplace-item");
      const id = $item.data("id");

      updateWorkplace({
        action,
        TYPE: "DELETE",
        id,
        $container,
      });
    });

    $cancelButton.click(function (e) {
      e.preventDefault();

      hideWorkplaceForm($container);
    });

    $container.submit(function (e) {
      e.preventDefault();

      const TYPE = $form.find("input[name=id]").val() == 0 ? "NEW" : "EDIT";
      const data = {};

      $form.find("input").each(function () {
        const key = $(this).attr("name");
        const value = $(this).val();

        data[key] = value;
      });

      updateWorkplace({
        action,
        TYPE,
        data,
        $container,
      });
    });
  });

  /**
   * @param {object} args
   * @param {string} args.action
   * @param {('NEW'|'EDIT'|'DELETE')} args.TYPE
   * @param {(number|string|undefined)} args.id
   * @param {object?} args.data
   * @param {JQuery|HTMLElement} args.$container
   */
  function updateWorkplace({ action, TYPE, id, data, $container }) {
    const $list = $container.find(".js-workplace-list");
    const $form = $container.find(".settings__workplace");

    $.ajax({
      type: "POST",
      url: action,
      dataType: "json",
      data: { TYPE, id, ...data },
      timeout: 3000,
    })
      .done(function (result) {
        $list.html(result.data);
        hideWorkplaceForm($container);
      })
      .fail(function () {
        showMessage(
          $form,
          "Что-то пошло не так! Обновите страницу и попробуйте позже.",
          "error"
        );
      });
  }

  /**
   * @param {object} args
   * @param {jQuery} args.$container
   * @param {(number|string|undefined)} args.id
   * @param {object[]?} args.data input'ы в форме будут заполнены значениями из data
   */
  function showWorkplaceForm({ $container, id = 0, data = [] }) {
    const $addButton = $container.find(".settings__add-workplace");
    const $form = $container.find(".settings__workplace");

    showMessage($container); // Удаление сообщения об ошибке если они есть

    if (data.length > 0) {
      data.forEach((i) => {
        $form.find(`input[name=${i.name}]`).val(i.value);
      });
    } else {
      $form.closest("form").trigger("reset");
    }

    $form.find("input[name=id]").val(id);

    $addButton.removeClass("active");
    $form.addClass("active");
  }

  function hideWorkplaceForm($container) {
    const $addButton = $container.find(".settings__add-workplace");
    const $form = $container.find(".settings__workplace");

    $form.removeClass("active");
    $addButton.addClass("active");
  }
  //!ANCHOR

  if ($(".new-article__content").length > 0)
    tinymce.init({
      selector: ".new-article__content",
      menubar: "",
      toolbar:
        "undo redo | bold italic underline strikethrough | fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange removeformat",
      content_style: `
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
      .mce-content-body { 
        font-family: Montserrat, Arial, sans-serif;
        font-size: 20px;
        line-height: 1.6;
        margin: 0px 24px;
      }`,
      setup: function (editor) {
        editor.on("change", function () {
          tinymce.triggerSave();
        });

        editor.on("focus", function (e) {
          $(".new-article__input-wrapper--image").addClass("go-back");
        });

        editor.on("blur", function (e) {
          $(".new-article__input-wrapper--image").removeClass("go-back");
        });
      },
    });
});
