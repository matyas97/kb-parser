const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.text());

// This is the object we'll loop over and run regexes on request body
const parseTemplate = {
  // typ simply matches first line
  typ: /(.*)/,
  // castka is able to match only payments in CZK currency
  // could be modified to match exaclty 3 capital letters for any currency
  castka: /Částka a měna:\s(.*)(?=\sCZK)/,
  ucet: /Číslo vašeho účtu:\s(\d+-\d+\/\d+)/,
  protiucet: /Číslo protiúčtu:\s(.*)(?=\sJméno\sprotiúčtu)/,
  jmenoProtiuctu: /Jméno protiúčtu:\s(.*)(?=\sDatum\ssplatnosti)/,
  datum: /Datum splatnosti:\s(\d+.\d+.\d+)/,
  vs: /Variabilní symbol:\s(\d+)/,
  ks: /Konstantní symbol:\s(\d+)/,
  ss: /Specifický symbol:\s(\d+)/,
  zprava: /Zpráva pro příjemce:\s(.*)(?=\sV\spřípadě)/,
};

app.get('/', (req, res) => {
  res.send('Hello from KB parser!');
});

app.post('/', (req, res) => {
  const rawData = req.body;

  // Object for storing parsed data
  // Will be returned as a response
  const parsedData = {};

  // Loop over the parseTemplate which contains all regexes
  // Use every regex on rawData and store result in parsedData
  for (const key in parseTemplate) {
    if (Object.hasOwnProperty.call(parseTemplate, key)) {
      const regex = parseTemplate[key];
      const regexResult = regex.exec(rawData);
      const result = regexResult !== null ? regexResult[1] : 'null';
      parsedData[key] = result;
      console.log('Regex match: ', key, ': ', result);
    }
  }

  // Format castka to number by removing comma and making it float
  const removeComma = parsedData.castka.replace(',', '.');
  const removeWhitespace = removeComma.replace(/\s/g, '');
  const formatedCastka = parseFloat(removeWhitespace);

  // If the typ contains "odchozi" make it negative
  if (parsedData.typ.includes('Odchozí')) {
    parsedData.castka = formatedCastka - formatedCastka * 2;
  } else {
    parsedData.castka = formatedCastka;
  }

  // Trim whitespace for typ in parsedData
  parsedData.typ = parsedData.typ.trim();

  // Split our bank account to have number and code separate
  const ucetSplitted = parsedData.ucet.split('/');
  const cisloUctu = ucetSplitted[0];
  const kodBanky = ucetSplitted[1];

  // Save splitted bank account into parsedData to include it in response
  parsedData.cisloUctu = cisloUctu;
  parsedData.kodBanky = kodBanky;

  // Split oposite party bank account to have number and code separate
  const protiucetSplitted = parsedData.protiucet.split('/');
  const cisloProtiuctu = protiucetSplitted[0];
  const kodBankyProtiuctu = protiucetSplitted[1];

  // Save oposite party splitted bank account into parsedData to include it in response
  parsedData.cisloProtiuctu = cisloProtiuctu;
  parsedData.kodBankyProtiuctu = kodBankyProtiuctu;

  // Send parsedDate as a response to request
  console.log('Parsed data, sending as response: ', parsedData);
  res.status(200).json(parsedData);
});

app.listen(port, () => {
  console.log(`Server at http://localhost:${port}`);
});
