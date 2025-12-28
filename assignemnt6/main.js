const mysql2 = require("mysql2");
const express = require("express");
const app = express();
const port = 3000;
app.use(express.json());
const db = mysql2.createConnection({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "",
  database: "musicana_db",
});
db.connect((error) => {
  if (error) {
    console.log("fail", error);
  } else {
    console.log("success");
  }
});

app.post("/add", (req, res, next) => {
  const { column, constraint } = req.body;

  /* 'SELECT * FROM USERS WHERE u_email=?' */
  const sqlQuery = `ALTER TABLE sales 
ADD COLUMN ${column} ${constraint};`;
  //here i know its susceptible to sql injection ,i tried Parameterized Queries which didnt work so didnt know what to do
  db.execute(sqlQuery, (error, data, fields) => {
    if (error) {
      return res.status(500).json({ message: error });
    }
    /* const insertQuery = `INSERT INTO USERS (u_first_name, u_middle_name, u_last_name , u_email ,u_password ,u_DOB)
        values(?,?,?,?,?,?)`; */
    return res.status(201).json({ message: "done", data });
  });
});
app.delete("/table", (req, res, next) => {
  const { column } = req.body;
  const sqlQuery = `ALTER TABLE sales 
drop COLUMN ${column};`;
  db.execute(sqlQuery, (error, data, fields) => {
    if (error) {
      return res.status(500).json({ message: error });
    }
    return res.status(200).json({ message: "done", data });
  });
});

app.put("/alter", (req, res, next) => {
  const { column, constraint } = req.body;
  console.log({ column, constraint });

  const checkQuery = `
    SELECT COUNT(*) as column_exists 
    FROM information_schema.columns 
    WHERE table_schema = DATABASE() 
    AND table_name = 'suppliers' 
    AND column_name = ?
  `;

  db.execute(checkQuery, [column], (Error, checkResults) => {
    if (Error) {
      return res.status(500).json({ message: "Database error", error: Error });
    }

    const columnExists = checkResults[0]?.column_exists > 0;
    if (!columnExists) {
      return res.status(400).json({
        message: `Column '${column}' does not exist in table 'suppliers'`,
      });
    }

    const sqlQuery = `alter table suppliers 
  modify column ${column} ${constraint}`;

    db.execute(sqlQuery, (error, data, fields) => {
      console.log({ fields });

      if (error) {
        return res.status(500).json({ message: error });
      }
      return res.status(200).json({ data });
    });
  });
});

app.put("/constraint", (req, res, next) => {
  const { column, constraint } = req.body;
  console.log({ column, constraint });

  const checkQuery = `
    SELECT COUNT(*) as column_exists 
    FROM information_schema.columns 
    WHERE table_schema = DATABASE() 
    AND table_name = 'products' 
    AND column_name = ?
  `;

  db.execute(checkQuery, [column], (Error, checkResults) => {
    if (Error) {
      return res.status(500).json({ message: "Database error", error: Error });
    }

    const columnExists = checkResults[0]?.column_exists > 0;
    if (!columnExists) {
      return res.status(400).json({
        message: `Column '${column}' does not exist in table 'products'`,
      });
    }

    const sqlQuery = `ALTER TABLE products   MODIFY COLUMN ${column} varchar(100) ${constraint};`;

    db.execute(sqlQuery, (error, data, fields) => {
      if (error) {
        return res.status(500).json({ message: error });
      }
      return res.status(200).json({ data });
    });
  });
});

app.post("/suppliers", (req, res, next) => {
  const { name, number } = req.body;
  const insertQuery = `INSERT INTO suppliers (supplier_name , contact_number)
        values(?,?)`;

  db.execute(insertQuery, [name, number], (error, data, fields) => {
    if (error) {
      return res.status(500).json({ message: "Database error", error: error });
    }
    return res.status(201).json({ data });
  });
});
app.post("/products", (req, res, next) => {
  const { name, price, quantity, supplier_id } = req.body;
  const insertQuery = `INSERT INTO products ( product_name, price, stock_quantity , supplier_Id)
        values(?,?,?,?)`;

  db.execute(
    insertQuery,
    [name, price, quantity, supplier_id],
    (error, data, fields) => {
      if (error) {
        return res
          .status(500)
          .json({ message: "Database error", error: error });
      }
      return res.status(201).json({ data });
    }
  );
});

app.post("/sales", (req, res, next) => {
  const { number, id, date } = req.body;
  const insertQuery = `INSERT INTO sales ( quantity_sold, product_id , sale_date	)
        values(?,?,?)`;

  db.execute(insertQuery, [number, id, date], (error, data, fields) => {
    if (error) {
      return res.status(500).json({ message: "Database error", error: error });
    }
    return res.status(201).json({ data });
  });
});

app.put("/products", (req, res, next) => {
  const { newPrice, id } = req.body;
  const insertQuery = `UPDATE products SET price = ? WHERE product_id = ?`;

  /**/

  db.execute(insertQuery, [newPrice, id], (error, data, fields) => {
    if (error) {
      return res.status(500).json({ message: "Database error", error: error });
    }
    return res.status(200).json({ data });
  });
});

app.delete("/products/:id", (req, res, next) => {
  const { id } = req.params;
  const sqlQuery = `SELECT * FROM products WHERE product_id = ? `;
  db.execute(sqlQuery, [id], (error, data, fields) => {
    if (error) {
      return res.status(500).json({ message: "Database error", error: error });
    }
    if (data?.length == 0) {
      return res.status(404).json({ message: "no prduct found with such id " });
    }

    const deleteQuery = `DELETE FROM products 
WHERE product_id = ?;`;
    db.execute(deleteQuery, [id], (error, data) => {
      if (error) {
        return res
          .status(500)
          .json({ message: "Database error", error: error });
      }
      return res.status(200).json({ data });
    });
  });
});

app.get("/sales", (req, res, next) => {
  const maxQuery = `SELECT 
    product_id,
    SUM(quantity_sold) as total_quantity_sold
FROM sales 
GROUP BY product_id;`;
  db.execute(maxQuery, (error, data) => {
    if (error) {
      return res.status(500).json({ message: "Database error", error: error });
    }
    return res.status(200).json({ data });
  });
});

app.get("/products/stock", (req, res, next) => {
  const maxQuery = `SELECT * FROM products
WHERE stock_quantity = (SELECT MAX(stock_quantity) FROM products);`;
  db.execute(maxQuery, (error, data) => {
    if (error) {
      return res.status(500).json({ message: "Database error", error: error });
    }
    return res.status(200).json({ data });
  });
});

app.get("/suppliers", (req, res, next) => {
  const { name } = req.query;
  console.log(name);

  const likeQuery = `SELECT * 
FROM suppliers 
WHERE supplier_Name LIKE ?;`;
  db.execute(likeQuery, [`${name}%`], (error, data) => {
    if (error) {
      return res.status(500).json({ message: "Database error", error: error });
    }
    return res.status(200).json({ data });
  });
});

app.get("/products/notSold", (req, res, next) => {
  const joinQuery = `SELECT *
FROM products
LEFT JOIN sales ON products.Product_Id = sales.product_id
WHERE sales.sale_Id IS null;`;
  db.execute(joinQuery, (error, data) => {
    if (error) {
      return res.status(500).json({ message: "Database error", error: error });
    }
    return res.status(200).json({ data });
  });
});

app.get("/sales", (req, res, next) => {
  const joinQuery = `SELECT sales.sale_date , products.product_name
FROM sales
LEFT JOIN products ON sales.product_id = products.Product_Id `;
  db.execute(joinQuery, (error, data) => {
    if (error) {
      return res.status(500).json({ message: "Database error", error: error });
    }
    return res.status(200).json({ data });
  });
});

app.post("/users/:username/:par1/:par2/:par3", (req, res, next) => {
  const { username, par1, par2, par3 } = req.params;
  console.log(username);
  console.log({ par1, par2, par3 });

  const userQuery = `CREATE USER IF NOT EXISTS ${username} @'localhost' IDENTIFIED BY 'SecurePass123!';
    `;
  db.execute(userQuery, (error, data) => {
    if (error) {
      return res.status(500).json({ message: "Database error", error: error });
    }
    const permissionsQuery = `GRANT ${par1} , ${par2} , ${par3} ON *.* TO ${username}@'localhost';`;
    db.execute(permissionsQuery, [par1, par2, par3], (error, data) => {
      if (error) {
        return res
          .status(500)
          .json({ message: "Database error", error: error });
      }
      return res.status(201).json({ data });
    });
  });
});

app.put("/users/:username/:par1", (req, res, next) => {
  const { username, par1 } = req.params;
  const grantQuery = `REVOKE ${par1} ON *.* FROM ${username}@'localhost';`;
  db.execute(grantQuery, (error, data) => {
    if (error) {
      return res.status(500).json({ message: "Database error", error: error });
    }
    return res.status(200).json({ data });
  });
});

app.post("/users/:username/:par1", (req, res, next) => {
  const { username, par1 } = req.params;
  const grantQuery = `GRANT ${par1} ON musicana_db.sales TO ${username}@'localhost';`;
  db.execute(grantQuery, (error, data) => {
    if (error) {
      return res.status(500).json({ message: "Database error", error: error });
    }
    return res.status(201).json({ data });
  });
});

app.all("/*qwerty", (req, res) => {
  return res.status(404).json({ message: "wrong routing" });
});
app.listen(port, () => {
  console.log("server running");
});
