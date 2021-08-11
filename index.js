const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const app = express();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true,
  })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`listening on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.render("home", { title: "About" });
});

app.get("/home", (req, res) => {
  res.redirect("/");
});

app.get("/product-details", (req, res) => {

  Product.find(function (err, products) {
    if (err) {
      console.log(err);
    } else {
      products.forEach((product) => {
        res.render("product_details", { product: product });
      });
      mongoose.connection.close();
    }
  });
  


  
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

app.get("/create", (req, res) => {
  res.render("create", { title: "Create A Blog" });
});

app.use((req, res) => {
  res.status(404).render("404", { title: "Lost Page" });
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter fruit name as well!"], //Data Validation
  },
  description: {
    type: String,
  },
  cost: String,
  availability: String,
});

// const oppoPhone = new Product({
//   name: "Oppo A92s",
//   description: "Times Now Oppo phones | Oppo A92s is the new 5G mid-ranger with 48-megapixel square-shaped camera bump",
//   cost: "19,400",
//   availability: "In stock"
// })

// oppoPhone.save(); //to save one doc only

const Product = mongoose.model("Product", productSchema);

