  $(document).ready(function() {
    var listItems = $('#list li');
    listItems.hide();
    var i = 0;
    var interval = setInterval(function() {
      var randomDelay = Math.floor(Math.random() * 500) + 100; // случайная задержка от 100 до 600 мс
      setTimeout(function() {
        listItems.eq(i).show();
        i++;
        if (i === listItems.length) {
          clearInterval(interval);
        }
      }, randomDelay);
    }, 700); // задержка между появлением элементов списка - 700 мс
  });