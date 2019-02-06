const express = require('express')
const app = express()
const morgan = require('morgan')
const mysql = require('mysql')
const bodyParser = require('body-parser')


app.use(express.static("./public"))

app.use(bodyParser.urlencoded(({extended: false})))

app.use(morgan('short')) // komunikaty w konsoli

function getConnection(){
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'sedit',
        port: 3307 // domyślny 3306
    })
}

app.get("/news/:id", (req, res) => {
    console.log('pobieram news o :id')

    const connection = getConnection()

    const newsId = req.params.id;
    const queryString = "SELECT * FROM news WHERE id = ?";
    connection.query(queryString, [newsId], (err,  rows, fields) => {

        // wyświetlanie błędu zapytania
        if(err){
            console.log('Błąd' + err)
            res.sendStatus(500)
            return
        }

        // formatowanie wyglądy
        var news = rows.map((row) => {
            return {
                id: row.id,
                tytul: row.title,
                tresc: row.content
            }
        })

        // res nie może by duplikowane
        console.log('Działa baza!')
        res.json(news)
    })

})

app.get("/news", (req, res) => {
    const connection = getConnection()
    const queryString = "SELECT * FROM news";
    connection.query(queryString, (err, rows, fields) => {
        // wyświetlanie błędu zapytania
        if (err) {
            console.log('Błąd' + err)
            res.sendStatus(500)
            return
        }
        // formatowanie wyglądy
        var news = rows.map((row) => {
            return {
                id: row.id,
                tytul: row.title,
                tresc: row.content
            }
        })
        // res nie może by duplikowane
        console.log('Działa baza!')
        res.json(news)
    })
})

app.get("", (req, res) => {
    res.send("SEDIT REST API")
})


// Dodawanie nowego rekordu
app.post("/news_create", (req, res) => {
    console.log('Dodawanie nowego posta')

    const title = req.body.title
    const content = req.body.content

    console.log('Tytul: ' + title + ' | Tresc: ' + content)

    const queryString = "INSERT INTO `news` (`title`, `content`) VALUES (?, ?);"

    getConnection().query(queryString, [title, content], (err, results, fields) => {
        if (err) {
            console.log('Błąd' + err)
            res.sendStatus(500)
            return
        }
        console.log('News został dodany!')
        res.end()
    })
})


// Kasowanie rekordu
app.get("/delete/:id", (req, res) => {
    console.log('kasowanie posta')

    const newsId = req.params.id;
    const queryString = "DELETE FROM `news` WHERE (`id` = ?);"

    getConnection().query(queryString, [newsId], (err, results, fields) => {
        if (err) {
            console.log('Błąd' + err)
            res.sendStatus(500)
            return
        }
        console.log('News został skasowany!')
        res.end()
    })
})


// localhost:3005/news
app.listen(3005, () => {
    console.log('Serwer wystatrował 3003')
})