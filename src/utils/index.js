
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