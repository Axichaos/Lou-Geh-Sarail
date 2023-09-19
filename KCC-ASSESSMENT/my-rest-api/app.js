const express = require('express');
const app = express();
const PORT = 2090;
//Replace these with current xamp settings
const host = "localhost";
const user = "root";
const password = "";
const database = "lougehdb";
global.sqljson = {"host":host,"user":user,"password":password,"database":database}

//Routes Setup
const productRoute = require("./routes/productRoutes");
const componentRoute = require("./routes/componentRoutes");
const prodtocompRoute = require("./routes/prodtocompRoutes");
const supplierRoute = require("./routes/supplierRoutes");
const comptosuppRoute = require("./routes/comptosuppRoutes");
app.use("/product",productRoute);
app.use("/component",componentRoute);
app.use("/prodtocomp",prodtocompRoute);
app.use("/supplier",supplierRoute);
app.use("/comptosupp",comptosuppRoute)

//Server Listen
app.listen(PORT, () => {
    console.log(`Server Running at port ${PORT}`)
});

