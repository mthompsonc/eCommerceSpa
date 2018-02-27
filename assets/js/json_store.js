// Cuando se cliqueen los botones en registro
$("#register-btn").click(function(e) {
    e.preventDefault();
    var emailReg = $("#inputEmailReg").val();
    var passReg = $("#inputPassReg").val();

    console.log(emailReg);
    console.log("registrado");
    firebase.auth().createUserWithEmailAndPassword(emailReg, passReg)
        .then(function() {
            var user = firebase.auth().currentUser;
            user.sendEmailVerification().then(function() {
                console.log('enviando correo');
            }).catch(function(error) {
                console.log(error);
            });
        })
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);
            console.log(errorCode);
        });
}); // fin funcion click en boton registro

// FIREBASE
$("#log-btn").click(function(e) {
    e.preventDefault();
    var emailLog = $("#inputEmailLog").val();
    var passLog = $("#inputPassLog").val();
    firebase.auth().signInWithEmailAndPassword(emailLog, passLog).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorCode);
    });

    
}); // fin funcion click en boton log in

// ver si hay usuario activo
function observardor() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log("usario ingresado")
            // User is signed in.
        } else {
            console.log("no existe usuario activo")
                // User is signed out.
                // ...
        }
    });
}; // fin funcion observador
observardor();

// Log out
$("#logOut").click(function() {
    firebase.auth().signOut().then(function() {

    });
    firebase.auth().signOut().catch(function(error) {
        console.log("error");
    })
}); // fin funcion click en boton log out

$('#forgotPass').click(function() {
    var auth = firebase.auth();
    var emailAddress = prompt('Enter your E-mail address');
    auth.sendPasswordResetEmail(emailAddress).then(function() {
        // Email sent.
    }).catch(function(error) {
        console.log(error);
    });
}); // fin funcion click en forgot pass





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

    this.get('#/', function(context) {
      context.app.swap('');
      $.each(this.items, function(i, item) {
        context.render('templates/item.template', {id: i, item: item})
               .appendTo(context.$element());
      });
    });

    this.get('#/item/:id', function(context) {
      this.item = this.items[this.params['id']];
      if (!this.item) { return this.notFound(); }
      this.partial('templates/item_detail.template');
    });

    

    this.post('#/cart', function(context) {
      var item_id = this.params['item_id'];
      console.log(this.items[item_id]);
      // fetch the current cart
      var cart  = this.session('cart', function() {
        return {};
      });
      if (!cart[item_id]) {
        // this item is not yet in our cart
        // initialize its quantity with 0
        cart[item_id] = 0;
      }
      cart[item_id] += parseInt(this.params['quantity'], 10);
      // store the cart
              console.log(cart[item_id])
      this.session('cart', cart);
      this.trigger('update-cart');

      if(this.items[item_id] === item_id ){

 this.items.forEach(el => {
    $('#main').append(`${el.name}`)
  })
}
    
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
