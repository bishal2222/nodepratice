import path from "path";
import * as bodyParser from "body-parser";
import express from "express";
import fs from "fs";
import Joi from "joi";

let app: any = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./"));
// app.use(cors())

interface Schema {
  name: string;
  id: number;
}

let schema: Joi.ObjectSchema<Schema> = Joi.object({
  name: Joi.string().required().alphanum().min(3).max(30),
  id: Joi.number().required().min(1).max(5000),
});

app.get("/", (req: any, res: any) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/products", async function (req: any, res: any) {
  const productData = getProductData();
  try {
    await schema.validateAsync(productData.products[0]);
    res.json({ data: productData.products });
  } catch (err: any) {
    res.send(err.message);
  }
});

app.post("/product", async (req: any, res: any) => {
  const productData = getProductData();
  const productDataFromBody = req.body;
  try {
    await schema.validateAsync(productDataFromBody);
    productData.products.push(productDataFromBody);
    saveProductData(productData);
    res.json({ msg: "Data added successfully", data: req.body });
  } catch (err: any) {
    res.send(err.message);
  }
});

app.put("/product/:id", async (req: any, res: any) => {
  const productData = getProductData();
  const item = productData.products.find((item: any) => {
    return item.id === parseInt(req.params.id);
  });
  if (!item) {
    res.json({
      msg: `Product with ${parseInt(req.params.id)} does not exists`,
    });
  } else {
    try {
      const item = productData.products.filter((item: any) => {
        return item.id !== req.params.id;
      });
      await schema.validateAsync({
        id: parseInt(req.params.id),
        name: req.body.name,
      });
      item.push({ id: parseInt(req.params.id), name: req.body.name });
      saveProductData({ products: item });
      res.json({ msg: "Data updated successfully." });
    } catch (err: any) {
      res.send(err.message);
    }
  }
});

app.delete("/product/:id", (req: any, res: any) => {
  const productData = getProductData();
  const item = productData.products.find((item: any) => {
    return item.id === parseInt(req.params.id);
  });
  if (!item) {
    res.json({ msg: `Product with ${req.params.id} does not exists` });
  } else {
    let items: any = productData.products.filter((item: any) => {
      return item.id !== parseInt(req.params.id);
    });
    saveProductData({ products: items });
    res.json({ msg: "Data deleted successfully" });
  }
});

// schema.validateAsync({ username: 'abc', birth_year: 1994 });

let saveProductData = (data: any) => {
  const stringifyData = JSON.stringify(data);
  fs.writeFileSync("db.json", stringifyData);
};

let getProductData: any = () => {
  const data: any = fs.readFileSync("db.json");
  console.log(JSON.parse(data));
  return JSON.parse(data);
};

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});
