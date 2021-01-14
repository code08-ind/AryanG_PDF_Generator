const express = require('express');
const path = require("path");
const puppeteer = require('puppeteer');
const bodyparser = require("body-parser");
const app = express();

app.use(express.static(__dirname + '/static'));

app.set("view engine", "ejs");

app.set('views', path.join(__dirname, 'views'));


app.get("/", (req, res) => {
    res.render("index");
});

app.get("/pdf", async (req, res) => {
    // let query = req.query.Search.toString();
    let link = req.query.link.toString();
    const url = link;
    const browser = await puppeteer.launch({
        headless: true,
    });
    const webPage = await browser.newPage();

    await webPage.goto(url, {
        waitUntil: "networkidle0"
    });
    const pdf = await webPage.pdf({
        printBackground: true,
        format: "Letter",
        margin: {
            top: "20px",
            bottom: "40px",
            left: "20px",
            right: "20px"
        }
    });
    await browser.close();
    res.contentType("application/pdf");
    res.send(pdf);
});

app.listen(3000, () => {
    console.log("Server Listening At Port 3000");
});