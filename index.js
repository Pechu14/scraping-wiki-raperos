const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const app = express();






        app.get('/', async (req, res) => {
            try {
                const url = 'https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap'
                const { data } = await axios.get(url);
                const $ = cheerio.load(data)
            
                const links =[];
                $('#mw-pages a').each((index,element)=>{
                    const link = $(element).attr('href')
                    if (link) {
                        links.push(`https://es.wikipedia.org${link}`);
                    }
                });

                    const raperos = [];
                for (let link of links) {
                    const { data: raperosData } = await axios.get(link);
                    const $$ = cheerio.load(raperosData);
                    const h1 = $$('h1').text();

                    const imagenes = [];
                $$('img').each((index, element) => {
                    imagenes.push($$(element).attr('src'));
                });

                const textos = [];
                $$('p').each((index, element) => {
                    textos.push($$(element).text());
                });

                raperos.push({
                    h1,
                    imagenes,
                    textos
                });
            }
                res.json(raperos);
            //res.send(raperos)
            
        }catch (error) {
            console.error(error);
            res.status(500).send('Error al realizar el scraping');
            }
    })



app.listen(3000,()=>{
    console.log("escuchando en http://localhost:3000")
})