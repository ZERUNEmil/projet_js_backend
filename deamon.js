const { Pool } = require('pg');
const {Auctions} = require("./model/auctions");
const auctionModel = new Auctions();

require("dotenv").config();

main();


async function main(){
    const pool = new Pool({
        user: process.env.USERNAMEDB,
        host: process.env.HOST,
        database: process.env.DATABASE,
        password: process.env.PASSWORD,
        port: process.env.PORTDB,
        ssl: {
          rejectUnauthorized: false
        }
    });

    while (true){
        await update(pool);
    
        await sleep(30000);
    }
} 


async function update(pool){
    await auctionModel.updateAll(pool);

    console.log("Update finish");
}


async function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}


