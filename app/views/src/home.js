let COLUMNS = 3;
let bookCounter = 0;
let books = [];
$(document).ready(function () {
  makeGrid();
  $('#txtBookSearch').autocomplete({
    source: function (request, response) {
      var booksUrl = 'https://www.googleapis.com/books/v1/volumes?printType=books&q=' + encodeURIComponent(request.term);
      $.ajax({
        url: booksUrl,
        dataType: 'jsonp',
        success: function(data) {
          response($.map(data.items, function (item) {
            if (item.volumeInfo.authors && item.volumeInfo.title
              && item.volumeInfo.industryIdentifiers && item.volumeInfo.publishedDate) {
              return {
                // label value will be shown in the suggestions
                label: item.volumeInfo.title + ', ' + item.volumeInfo.authors[0] + ', ' + item.volumeInfo.publishedDate,
                // value is what gets put in the textbox once an item selected
                value: item.volumeInfo.title,
                // other individual values to use later
                title: item.volumeInfo.title,
                author: item.volumeInfo.authors[0],
                isbn: item.volumeInfo.industryIdentifiers,
                publishedDate: item.volumeInfo.publishedDate,
                image: (item.volumeInfo.imageLinks == null ? '' : item.volumeInfo.imageLinks.thumbnail),
                description: item.volumeInfo.description
              };
            }
          }));
        }
      });
    },
    select: function (event, ui) {
      bookCounter++;
      let bookCoverSrc=ui.item.image;
      let isCoverAvailable = true;
      if (ui.item.image == '') {
        bookCoverSrc = 'assets/img/no-cover.gif';
        isCoverAvailable = false;
      }
      let book = {
        'id': 'bookId'+String(bookCounter),
        'src': bookCoverSrc,
        'isCoverAvailable': isCoverAvailable
      };
      books.push(book);
      makeGrid();
      $(this).val(''); return false;

    },
    minLength: 2 
  });
});


const makeGrid = function(){
  document.getElementById('booksDisplay').innerHTML = ''; 
  setColumnValue();
  let counter = 0;
  let numberRows = Math.ceil(books.length/COLUMNS);
  for (let row=1;row<=numberRows;row++){
    let ROW = document.createElement('div');
    ROW.setAttribute('class',"row");
    for (let col = 1; col <= COLUMNS; col++){
      if (counter == books.length){ 
        break;
      }
      let COL = document.createElement('div');
      COL.setAttribute('class',"col s"+String(12/COLUMNS));
      let CONT = document.createElement('div');
      CONT.setAttribute('class',"tooltip");
      IMG = document.createElement('img');
      IMG.src = String(books[counter].src);
      IMG.id = String(books[counter].id);
      counter++;
      IMG.setAttribute('onclick',"clickHandler(this)");
      IMG.setAttribute('width',"auto");
      IMG.setAttribute('height','250px');
      let SPAN = document.createElement('span');
      SPAN.setAttribute('class', 'tooltiptext');
      SPAN.innerHTML = "Click to Remove";
      CONT.appendChild(IMG);
      CONT.appendChild(SPAN);
      COL.appendChild(CONT);
      ROW.appendChild(COL);
    }
    document.getElementById('booksDisplay').appendChild(ROW);    
  }
}

const clickHandler = function(evt){
  let idToRemove = evt.id;
  let index;
  for (index=0;index<books.length;index++){
    if (books[index].id == idToRemove){
      break;
    }
  }
  books.splice(index,1);
  makeGrid();

}

const hoverHandler = function(evt){
  console.log('hover');
}

const setColumnValue = function(){
  let totalBooks = books.length;
  if (totalBooks < 3){
    COLUMNS = 1;
  }
  else if (totalBooks < 5){
    COLUMNS = 2;
  }
  else if (totalBooks < 9){
    COLUMNS = 3;
  }
  else if (totalBooks > 9){
    COLUMNS = 4;
  }
}

const generatePoster = function(){
  $.ajax({
    url: "/generatePoster",
    type: "GET", //send it through get method
    dataType: "json",
    data: { 
      books: JSON.stringify(books), 
    },
    success: function(response) {
      console.log(response);
    },
    error: function(xhr) {
      //Do Something to handle error
    }
  });
}

