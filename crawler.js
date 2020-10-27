const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const writeStream = fs.createWriteStream('norwegian.csv');

//Write Headers for tickets csv
writeStream.write(`Departure, Duration, Arrival, Cheapest Price \n`);

// Array of days ( October 2018-10-01 to 2018-10-31)
let id = [01, 02, 03, 04, 05, 07, 08, 09, 10, 11, 12, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 28, 29, 30, 31];

// loop every day to collect all data from each day
for (i = 0; i <= id.length; i++) {
  request(`https://www.norwegian.com/en/ipc/availability/avaday?D_City=OSLALL&A_City=RIX&TripType=1&D_Day=${id[i]}&D_Month=201810&D_SelectedDay=${id[i]}&R_Day=02&R_Month=201810&R_SelectedDay=02&dFlight=DY1072OSLRIX&dCabinFareType=1&IncludeTransit=false&AgreementCodeFK=-1&CurrencyCode=EUR&rnd=75087&mode=ab`, (error, response, html) => {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html);

      $('.bodybox').each((i, el) => {
        const price = $(el)
          .find('.standardlowfare .seatsokfare')
          .text()
          .replace(/\s\s+/g, '');

        const depdest = $(el)
          .find('.depdest div.content')
          .text()
          .replace(/Oslo-Gardermoen/gi, "  Oslo-Gardermoen ");

        const arrdest = $(el)
          .find('.arrdest')
          .text()
          .replace(/Riga/gi, "  Riga ");

        const duration = $(el)
          .find('.duration div.content')
          .text()
          .replace(/DirectDuration:/gi, "");

        //Write Row to CSV
        writeStream.write(`${depdest}, ${duration}, ${arrdest}, ${price} \n`);

        // console.log(depdest, duration, arrdest, price); //terminale parašyti "node crawler", ir turėtų terminle pasirodyti ištraukti duomenys.

      });
      console.log("Data Extract");

    } else {
      console.log(error);
    }
  });
}
