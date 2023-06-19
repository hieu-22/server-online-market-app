require("dotenv").config()

const allowOrigins = [process.env.URL_REACT, undefined]

export const corsOptions = {
    origin: function (origin, callback) {
        if (allowOrigins.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
}
