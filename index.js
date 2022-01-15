// create express server

var express = require('express')
const { param } = require('express/lib/request')
const { send } = require('express/lib/response')
var fs = require('fs')

const app = express()

// root route sends index.html
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html')
})

app.get('/filter', function (req, res) {
    console.log(req.query)
    let year = req.query.year
    let name = req.query.name
    let location = req.query.location

    // Capitalize first letter of name and location
    name = name.charAt(0).toUpperCase() + name.slice(1)
    location = location.charAt(0).toUpperCase() + location.slice(1)
    // Remove diacritics from name and location
    name = name.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
    location = location.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
    // Remove trailing whitespace from name and location
    name = name.trim()
    location = location.trim()

    if(year === "") {
        res.send({
            year: year,
            store: {},
            students: studentsCount
        })
        return
    }

    let studentsCount = 0
    // Else
    try {
        // store the file ecn/${year}.txt in a variable
        var file = fs.readFileSync(`./ecn/${year}.txt`, 'utf8')

        let reg = /\n\s*(\d{1,4}).*(?:\)|\d), (?:(?:nom d'usage|famille|épouse|époux) [^,]+, )?([^\d]*) (?:au |à l'|à la |aux |en |à )(?:.* (?:de |d'))?(.*)\./gm
        let match = reg.exec(file)

        let store = []

        while(match != null) {

            // Capitalize the first letter of each group of the match
            match[2] = match[2].charAt(0).toUpperCase() + match[2].slice(1)
            match[3] = match[3].charAt(0).toUpperCase() + match[3].slice(1)
            // Remove diacritics from each group of the match
            let match2 = match[2].normalize('NFD').replace(/[\u0300-\u036f]/g, "")
            let match3 = match[3].normalize('NFD').replace(/[\u0300-\u036f]/g, "")

            // Add match to store
            // if name starts with the second element or is empty
            // and location starts with the third element or is empty
            
            if((match2.startsWith(name) || name === "") && (match3.startsWith(location) || location === "")) {
                // if store contains a match with the same second and third element, overwrite it
                if(store.find(function (element) {
                    return element[1] === match[2] && (element[2] === match[3] || name === "")
                })) {
                    store.splice(store.findIndex(function (element) {
                        return element[1] === match[2] && (element[2] === match[3] || name === "")
                    }), 1, match.slice(1))
                } else {
                    store.push(match.slice(1))
                }
            }
            studentsCount = match[1]
            match = reg.exec(file)
        }

        res.send({
            year: year,
            store: store,
            students: studentsCount
        })
        return
    } catch (error) {
        console.log(error)
        res.send({
            year: year,
            store: {},
            students: studentsCount
        })
        return
    }
})

// route to get all the years
app.get('/years', function (req, res) {
    // Find all files in ecn folder
    let files = fs.readdirSync('./ecn')
    // Remove the .txt extension
    files = files.map(function (file) {
        return file.slice(0, -4)
    })
    // Sort the files
    files.sort()
    // Send the files
    res.send(files)
})

// route to get all spe names
app.get('/names', function (req, res) {
    let year = req.query.year
    try {
        // store the file ecn/${year}.txt in a variable
        var file = fs.readFileSync(`./ecn/${year}.txt`, 'utf8')
        let reg = /\n\s*(\d{1,4}).*(?:\)|\d), (?:(?:nom d'usage|famille|épouse|époux) [^,]+, )?([^\d]*) (?:au |à l'|à la |aux |en |à )(?:.* (?:de |d'))?(.*)\./gm
        let match = reg.exec(file)

        let store = []

        while(match != null) {
            // Capitalize the first letter of each group of the match
            match[2] = match[2].charAt(0).toUpperCase() + match[2].slice(1)

            // Add match[2] to store if it's not already in it
            if(!store.includes(match[2])) {
                store.push(match[2])
            } 

            match = reg.exec(file)
        }

        res.send(store)
        return
    } catch (error) {
        console.log(error)
        res.send(store)
        return
    }
})

// route to get all locations
app.get('/locations', function (req, res) {
    let year = req.query.year
    try {
        // store the file ecn/${year}.txt in a variable
        var file = fs.readFileSync(`./ecn/${year}.txt`, 'utf8')

        let reg = /\n\s*(\d{1,4}).*(?:\)|\d), (?:(?:nom d'usage|famille|épouse|époux) [^,]+, )?([^\d]*) (?:au |à l'|à la |aux |en |à )(?:.* (?:de |d'))?(.*)\./gm
        let match = reg.exec(file)

        let store = []

        while(match != null) {
            // Capitalize the first letter of each group of the match
            match[3] = match[3].charAt(0).toUpperCase() + match[3].slice(1)

            // Add match[2] to store if it's not already in it
            if(!store.includes(match[3])) {
                store.push(match[3])
            } 

            match = reg.exec(file)
        }

        res.send(store)
        return
    } catch (error) {
        console.log(error)
        res.send(store)
        return
    }
})

// add 404 default error handler
app.use(function (req, res, next) {
    res.status(404).send('404 Not Found')
})

// run server
app.listen(process.env.PORT, () => {
    console.log(`server running on port ${process.env.PORT}`)
})