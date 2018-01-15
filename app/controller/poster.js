const makePoster = function(books){
  var PSD = require('psd');
  PSD.open("app/views/assets/pea.psd").then(function (psd) {
    psd.parse();
    console.log(psd.tree().export());
    return psd.image.saveAsPng('./output.png');
  }).then(function () {
    console.log("Finished!");
  });

  return "hello";
};

module.exports = {makePoster: makePoster}
