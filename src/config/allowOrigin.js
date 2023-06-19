require("dotenv").config()

const allowOrigins = ["http://localhost:3000", undefined, process.env.URL_REACT]

export const corsOptions = {
    origin: function (origin, callback) {
        if (allowOrigins.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
}
