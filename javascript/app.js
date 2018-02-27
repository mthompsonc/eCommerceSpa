(function($) {
  var app = $.sammy('#main', function() {
    this.use('Template');
    this.use('Session');
    this.around(function(callback) {
      var context = this;
      this.load('data/data.json')
        .then(function(items) {
          context.items = items;
        })
        .then(callback);
    });
    // Cuando se cliqueen los botones en registro
    $('#register-btn').click(function(e) {
      e.preventDefault();
      var emailReg = $('#inputEmailReg').val();
      var passReg = $('#inputPassReg').val();
      console.log(emailReg);
      console.log('registrado');
      firebase.auth().createUserWithEmailAndPassword(emailReg, passReg)
        .then(function() {
          var user = firebase.auth().currentUser;
          user.sendEmailVerification().then(function() {
          }).catch(function(error) {
          });
        })
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
        });
    }); // fin funcion click en boton registro

    // FIREBASE
    $('#log-btn').click(function(e) {
      e.preventDefault();
      var emailLog = $('#inputEmailLog').val();
      var passLog = $('#inputPassLog').val();
      firebase.auth().signInWithEmailAndPassword(emailLog, passLog).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
      });
    }); // fin funcion click en boton log in
    // ver si hay usuario activo
    function observardor() {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          $('.cart-info').show();
          $('#logOut').show();
          $('#logIn').hide();
          $('#register').hide();
          // User is signed in.
        } else {
          $('.cart-info').hide();
          $('#logOut').hide();
          $('#logIn').show();
          $('#register').show();
          // User is signed out.
          // ...
        }
      });
    }; // fin funcion observador
    observardor();

    // Log out
    $('#logOut').click(function() {
      firebase.auth().signOut().then(function() {
      });
      firebase.auth().signOut().catch(function(error) {
      });
    }); // fin funcion click en boton log out

    $('#forgotPass').click(function() {
      var auth = firebase.auth();
      var emailAddress = prompt('Enter your E-mail address');
      auth.sendPasswordResetEmail(emailAddress).then(function() {
        // Email sent.
      }).catch(function(error) {
      });
    }); // fin funcion click en forgot pass

    // email validation
    function validateEmail($email) {
      var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
      return emailReg.test($email);
    }

    this.get('#/', function(context) {
      context.app.swap('');
      $.each(this.items, function(i, item) {
        context.render('templates/item.template', {
          id: i,
          item: item
        })
          .appendTo(context.$element());
      });
    });

    this.get('#/item/:id', function(context) {
      this.item = this.items[this.params['id']];
      if (!this.item) {
        return this.notFound();
      }
      this.partial('templates/item_detail.template');
    });

    this.post('#/cart', function(context) {
      var itemId = this.params['item_id'];
      // fetch the current cart
      var cart = this.session('cart', function() {
        return {};
      });
      if (!cart[itemId]) {
        // this item is not yet in our cart
        // initialize its quantity with 0
        cart[itemId] = 0;
      }
      cart[itemId] += parseInt(this.params['quantity'], 10);
      // store the cart
      this.session('cart', cart);
      this.trigger('update-cart');
    });

    this.bind('update-cart', function() {
      var sum = 0;
      $.each(this.session('cart') || {}, function(id, quantity) {
        sum += quantity;
      });
      $('.cart-info')
        .find('.cart-items').text(sum).end()
        .animate({paddingTop: '30px'})
        .animate({paddingTop: '10px'});
    });

    this.bind('run', function() {
      // initialize the cart display
      this.trigger('update-cart');
    });
  });
  $(function() {
    app.run('#/');
  });
})(jQuery);

/*
* botón de pagp por Stripe, se puso en item_detail.template
* el botón llama al servidor de stripe con la API (data key)
* de prueba que el sitio entrega a los desarrolladores
* para que funcione hay que ingresar el número de TC de prueba
* 4242 4242 4242 4242 más una fecha de vencimiento creíble
* y 3 digitos al azar
$(".pay").append("<script src='https://checkout.stripe.com/checkout.js'" + "class='stripe-button'" +
    "data-key='pk_test_LMeQ66Q4hSaSh774qEv4EzwZ'" +
    "data-image='/images/marketplace.png'" +
    "data-name='SPA test'" +
    "data-description='test de compra de 1 producto'" +
    "data-amount='2000'" +
    "data-label='Buy'></script>")
*/