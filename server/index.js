const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser'); //used to process data sent in an HTTP request body.
const cors = require('cors')    //an HTTP-header based mechanism that allows a server to indicate any origins (domain, scheme, or port) other than its own from which a browser should permit loading resources

const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser')
  

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))



app.use(cors(

    {
        origin :["http://localhost:3000"],
        methods:["POST , GET ,PUT , DELETE"],
        credentials:true
    }
)) 

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "cms"
})

app.get("/api/get", (req, res) => {
    const sqlGet = "SELECT * FROM pages";       //This endpoint retrieves all pages from the database table named "pages" and returns the results as a JSON response.
    db.query(sqlGet, (error, result) => {

        res.send(result)
    })

})



app.delete("/api/delete/:id", (req, res) => {
    const { id } = req.params;
    const sqlDelete = "DELETE FROM pages WHERE id=?";  //This endpoint takes an ID parameter and deletes the corresponding page from the "pages" table in the database.
    db.query(sqlDelete, id, (error, result) => {
        if (error) {
            console.log(error)
        }
    })
})

app.get("/:id", (req, res) => {
    const {id} = req.params;
    const sqlGetid = "SELECT * FROM pages WHERE id= ?";   //This endpoint retrieves a single page from the "pages" table based on the ID parameter and returns the result as a JSON response.
    db.query(sqlGetid, id , (error, result) => {
        if (error) {
            console.log(error)
        }
        res.send(result)
    })


})




app.get("/api/:url", (req, res) => {
   
    console.log(req.query.url)
    const sqlGet = "SELECT * FROM pages WHERE link_url = ?  ";   //This endpoint retrieves a single page from the "pages" table based on the ID parameter and returns the result as a JSON response.
    db.query(sqlGet,[req.query.url], (error, result) => {
        if (error) {
            console.log(error)
        }
        console.log({error, result})
        res.send(result)
    })


})





// app.get("/api/data", (req, res) => {
//     console.log(req.query.url);
//     const sqlUrl = "SELECT * FROM  pages  WHERE  link_url= ?";  //This endpoint retrieves a single page from the "pages" table based on the ID parameter and returns the result as a JSON response.
//     db.query(sqlUrl, [req.query.url], (error, result) => {
//         if (error) {
//             console.log(error)
//         }
//         res.send(result)
//     })

// })

app.put("/api/update/:id", (req, res) => {
    const { id } = req.params;
    const { page_title, link_text, link_url, page_content } = req.body;
    const sqlUpdate = "UPDATE pages SET  page_title = ? ,link_text = ?,link_url = ?,page_content = ? WHERE id = ?";
    // This endpoint takes an ID parameter and updates the corresponding page in the "pages" table with the data provided in the request body (page_title, link_text, link_url, and page_content).
    db.query(sqlUpdate, [page_title, link_text, link_url, page_content, id], (error, result) => {
        if (error) {
            console.log(error)
        }
    })
})


app.post("/api/post", (req, res) => {
    const { page_title, link_text, link_url, page_content } = req.body;
    const sqlInsert = "INSERT INTO pages (page_title,link_text,link_url,page_content) VALUES (?,?,?,?)";
    //This endpoint inserts a new page into the "pages" table with the data provided in the request body (page_title, link_text, link_url, and page_content).
    db.query(sqlInsert, [page_title, link_text, link_url, page_content], (error, result) => {
        if (error) {
            console.log(error)
        }
    })
})
// app.get("/", (req, res) => {
//     // const sqlInsert ="INSERT INTO pages (page_title,link_text,link_url,page_content) VALUES ('Landing Page','Landing','http://localhost:3000/landing','lorem ipsum')";
//     //  db.query(sqlInsert,(error,result)=>{
//     //     console.log(error);
//     //     console.log(result);
//     //     res.send("hello express")
//     // })

// })


// app.post('/login', (req, res) => {
//     const sql = "SELECT * FROM admin WHERE email = ? AND PASSWORD= ?"; 
//     db.query(sql, [req.body.email, req.body.PASSWORD], (err, data) => {
//     if (err) return res.json({Message: "Server Side Error"});
//     if(data.length > 0) {
//     const name = data[0].name;
//     const token = jwt.sign({name}, "our-jsonwebtoken-secret-key", {expiresIn: '1d'}); res.cookie('token', token);
//     res.cookie('token',token)
//     return res.json({Status : "Success"})
//     } else {
//         return res.json({Message: "NO Records existed"});
//     }
   
//     })
//     })



app.post("/register", (req, res) => {
    const {email , password} = req.body;
    const sqlInsert = "INSERT INTO admin (email,password) VALUES (?,?)";
    //This endpoint inserts a new page into the "pages" table with the data provided in the request body (page_title, link_text, link_url, and page_content).
    db.query(sqlInsert, [email,password], (error, result) => {
        if (error) {
            console.log(error)
        }
    })
}) 



app.post("/login", (req, res) => {
    const {email , password} = req.body;
    const sqlLog = "SELECT * FROM admin WHERE email = ? AND password = ? ";
    //This endpoint inserts a new page into the "pages" table with the data provided in the request body (page_title, link_text, link_url, and page_content).
    db.query(sqlLog, [email,password], (error, result) => {
        if (error) {
            res.send({error:error});
        }
        if(result){
            res.send(result);
        }else {
            res.send({message:"wrong email and password combination "})
        }
    })
}) 




// header 

app.get("/header/get", (req, res) => {
    const sqlGet = "SELECT * FROM header";       //This endpoint retrieves all pages from the database table named "pages" and returns the results as a JSON response.
    db.query(sqlGet, (error, result) => {

        res.send(result)
    })

})

app.post("/header/post", (req, res) => {
    const { link_text, link_url,header_content } = req.body;
    const sqlInsert = "INSERT INTO header (link_text,link_url,header_content) VALUES (?,?,?)";
    //This endpoint inserts a new page into the "pages" table with the data provided in the request body (page_title, link_text, link_url, and page_content).
    db.query(sqlInsert, [link_text, link_url, header_content], (error, result) => {
        if (error) {
            console.log(error)
        }
    })
})


app.delete("/header/delete/:id", (req, res) => {
    const { id } = req.params;
    const sqlDelete = "DELETE FROM header WHERE id=?";  //This endpoint takes an ID parameter and deletes the corresponding page from the "pages" table in the database.
    db.query(sqlDelete, id, (error, result) => {
        if (error) {
            console.log(error)
        }
    })
})

app.put("/header/update/:id", (req, res) => {
    const { id } = req.params;
    const {  link_text, link_url,header_content } = req.body;
    const sqlUpdate = "UPDATE header SET link_text = ?,link_url = ?,header_content = ? WHERE id = ?";
    // This endpoint takes an ID parameter and updates the corresponding page in the "pages" table with the data provided in the request body (page_title, link_text, link_url, and page_content).
    db.query(sqlUpdate, [ link_text, link_url, header_content, id], (error, result) => {
        if (error) {
            console.log(error)
        }
    })
})


app.get("/header/:url", (req, res) => {
   
    console.log(req.query.url)
    const sqlGet = "SELECT * FROM header WHERE link_url = ?  ";   //This endpoint retrieves a single page from the "pages" table based on the ID parameter and returns the result as a JSON response.
    db.query(sqlGet,[req.query.url], (error, result) => {
        if (error) {
            console.log(error)
        }
        console.log({error, result})
        res.send(result)
    })


})



//footer 

app.get("/footer/get", (req, res) => {
    const sqlGet = "SELECT * FROM footer";       //This endpoint retrieves all pages from the database table named "pages" and returns the results as a JSON response.
    db.query(sqlGet, (error, result) => {

        res.send(result)
    })

})

app.post("/footer/post", (req, res) => {
    const { link_text, link_url,footer_content } = req.body;
    const sqlInsert = "INSERT INTO footer(link_text,link_url,footer_content) VALUES (?,?,?)";
    //This endpoint inserts a new page into the "pages" table with the data provided in the request body (page_title, link_text, link_url, and page_content).
    db.query(sqlInsert, [link_text, link_url, footer_content], (error, result) => {
        if (error) {
            console.log(error)
        }
    })
})


app.delete("/footer/delete/:id", (req, res) => {
    const { id } = req.params;
    const sqlDelete = "DELETE FROM footer WHERE id=?";  //This endpoint takes an ID parameter and deletes the corresponding page from the "pages" table in the database.
    db.query(sqlDelete, id, (error, result) => {
        if (error) {
            console.log(error)
        }
    })
})

app.put("/footer/update/:id", (req, res) => {
    const { id } = req.params;
    const {  link_text, link_url,footer_content } = req.body;
    const sqlUpdate = "UPDATE footer SET link_text = ?,link_url = ?,footer_content = ? WHERE id = ?";
    // This endpoint takes an ID parameter and updates the corresponding page in the "pages" table with the data provided in the request body (page_title, link_text, link_url, and page_content).
    db.query(sqlUpdate, [ link_text, link_url, footer_content, id], (error, result) => {
        if (error) {
            console.log(error)
        }
    })
})

app.get("/footer/:url", (req, res) => {
   
    console.log(req.query.url)
    const sqlGet = "SELECT * FROM footer WHERE link_url = ?  ";   //This endpoint retrieves a single page from the "pages" table based on the ID parameter and returns the result as a JSON response.
    db.query(sqlGet,[req.query.url], (error, result) => {
        if (error) {
            console.log(error)
        }
        console.log({error, result})
        res.send(result)
    })


})




app.listen(5000, () => {
    //create a server that listens on port 5000.The app.listen function starts a server instance and takes two arguments:
    // the port number to listen on and a callback function that is executed once the server is running.
    //In this case, the callback function simply logs a message to the console indicating that the server is running on port 5000.




    console.log("server is running on port 5000")
})

