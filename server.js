const express = require("express");
const cors = require("cors");

const api = require("./api");

///////////////////////////////////////////////APP CONFIG/////////////////////////////////////////////
const app = express();
const port = process.env.PORT || 5000;

///////////////////////////////////////////////APP MIDDLEWARE/////////////////////////////////////////
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

///////////////////////////////////APP STATIC FILES FOR PRODUCTION/////////////////////////////////////
if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "client/build")));
}

//////////////////////////////////////////APP BASE ROUTE///////////////////////////////////////////////
app.use("/api", api);

//////////////////////////////////////////ERROR HANDLING///////////////////////////////////////////////
//Handle basic routing errors
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

//Handle errors thrown from anywhere else in the app
app.use((err, req, res, next) => {
    return res.status(err.status || 500).json({
        error: {
            message: err.message
        }
    });
});


//////////////////////////////////////////////APP LISTEN//////////////////////////////////////////////
app.listen(port, () => console.log(`Listening on port ${port}`));