const path = require("path");

exports.sendSqlQuery = function (db, sql, params, res) {
  db.query(sql, params, (err, rows) => {
    if (err) {
      console.log("Error: " + err.message);
      res.status(500).json({ message: "database error" });
    } else {
      let response = [];
      rows.forEach((row) => {
        response.push(row);
      });
      res.status(200).json(response);
    }
  });
};

exports.executeSqlQuery = function (db, sql, params, res, success) {
  db.query(sql, params, (err, rows) => {
    if (err) {
      console.log("Error: " + err.message);
      res.status(500).json({ message: "database error" });
    } else res.status(200).json({ message: success });
  });
};

exports.getImagePaths = function (images) {
  let paths = [];
  if (images.length > 0) for (const image of images) paths.push(image.filename);
  else paths.push("Default.png");
  return paths;
};

async function generateQR(input, filename) {
  require("fs").writeFileSync(
    path.join(__dirname, filename + ".png"),
    require("qr-image").imageSync(input)
  );
}

exports.generatePDF = async function (rows) {
  const PDFDocument = require("pdfkit");
  const fs = require("fs");

  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(path.join(__dirname, "/temp/labels.pdf")));
  let pages = 0;
  for (let i = 0; i < rows.length; i++) {
    const location = rows[i];
    let posX = (i % 2) * 200 + 30;
    let posY = Math.floor(i / 2) * 100 + 30 - pages * 700;

    doc.fontSize(25).text(location.locationName, posX + 90, posY + 8);
    doc.fontSize(15).text("ID: " + location.locationID, posX + 90, posY + 30);
    await generateQR(
      "/locations/" + location.locationID,
      "/temp/" + location.locationID
    );
    doc.image(
      path.join(__dirname, "/temp/" + location.locationID + ".png"),
      posX,
      posY,
      {
        width: 80,
        height: 80,
      }
    );

    if (posY == 630 && posX == 230) {
      doc.addPage();
      pages++;
    }
  }
  doc.end();
  setTimeout(() => {}, 1000);
};
