$(document)
  .ready(function () {
    /**
   * Login Handler
   * I save JWT to the localstorage
   */
    $('#login').submit(e => {
      e.preventDefault();
      let username = $('#username');
      let password = $('#password');

      if (username.val() && password.val()) {
        $.post('/login', {
          username: username
            .val()
            .trim(),
          password: password
            .val()
            .trim()
        }).done(data => {
          window
            .localStorage
            .setItem('token', data.token);
        }).fail(e => console.log(e));
      }
    });

    /**
   * Patch json request to api
   */

    $('#json-patch').click(function () {
      let json = {
        baz: 'qux',
        foo: 'bar'
      };

      let patch = [
        {
          op: 'replace',
          path: '/baz',
          value: 'Hackerbay'
        }
      ];

      let token = window
        .localStorage
        .getItem('token');

      /**
     * Set Up All ajax request to make use of Authorization header
     */
      $.ajaxSetup({
        headers: {
          Authorization: token
        }
      });

      $.post('/patch', {
        json: JSON.stringify(json),
        patch: JSON.stringify(patch)
      }).done(success => {
        let container;
        for (let key in success.patchedObj) {
          container = $('#json-patch-result');
          container.append('<div class="item">' + key + ':  <b>' + success.patchedObj[key] + '</b></div>');
        }
      }).fail(e => {
        $('#json-patch-result').html(`<b style"color:pink">An Error Occured</b>`);
      });
    });

    /**
   * Thumbnail request to api
   */
    $('#thumbnail').click(function () {
      let url = $('#image-url').val();
      let token = window
        .localStorage
        .getItem('token');

      /**
     * Set Up All ajax request to make use of Authorization header
     */
      $.ajaxSetup({
        headers: {
          Authorization: token
        }
      });

      $.ajax({
        url: `/thumbnail?url=${url}`,
        type: 'POST',
        cache: false,
        xhr: function () {
          let xhr = new XMLHttpRequest();
          xhr.responseType = 'blob';
          return xhr;
        },
        success: function (data) {
          console.log(data)
          let img = document.getElementById('thumbnail-result');
          let urlData = window.URL || window.webkitURL;
          img.src = urlData.createObjectURL(data);
        },
        error: function () {}
      });
    });
  });
