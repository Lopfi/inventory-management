const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');

exports.sendSqlQuery = function(db, sql, params, res) {
    db.all(sql, params, (err, rows) => {
        if (err) {
            console.log("Error: " + err.message);
            res.status(500).json({message: "database error"})
        } else {
            let response = [];
            rows.forEach((row) => {
                response.push(row);
            });
            res.status(200).json(response);
        }
    });
}

exports.getImagePaths = function(images) {
    let paths = [];
    if (images.length > 0) for (const image of images) paths.push(image.filename);
    else paths.push("Default.png");
    console.log(paths);
    return paths;
}

exports.getIp = function() {
    let address;
    require('dns').lookup(require('os').hostname(), function (err, add, fam) {
        address = add;
    })
    return address;
}

exports.generateQR = function () {
    QRCode.toDataURL('I am a pony!', function (err, url) {
        console.log(url)
      })
}

exports.generatePDF = function() {
    let res;
    const doc = new PDFDocument;
// Embed a font, set the font size, and render some text
doc
  .font('fonts/PalatinoBold.ttf')
  .fontSize(25)
  .text('Some text with an embedded font!', 100, 100);

// Add an image, constrain it to a given size, and center it vertically and horizontally
doc.image('path/to/image.png', {
  fit: [250, 300],
  align: 'center',
  valign: 'center'
});

// Add another page
doc
  .addPage()
  .fontSize(25)
  .text('Here is some vector graphics...', 100, 100);

// Draw a triangle
doc
  .save()
  .moveTo(100, 150)
  .lineTo(100, 250)
  .lineTo(200, 250)
  .fill('#FF3300');

// Apply some transforms and render an SVG path with the 'even-odd' fill rule
doc
  .scale(0.6)
  .translate(470, -380)
  .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
  .fill('red', 'even-odd')
  .restore();

// Add some text with annotations
doc
  .addPage()
  .fillColor('blue')
  .text('Here is a link!', 100, 100)
  .underline(100, 100, 160, 27, { color: '#0000FF' })
  .link(100, 100, 160, 27, 'http://google.com/');

// Finalize PDF file
doc.end();
}