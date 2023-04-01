
const express = require('express')
let MetaApi = require('metaapi.cloud-sdk').default;



const app = express()


//Environment variables
const token = process.env.ACCOUNT_TOKEN
let accountId = process.env.ACCOUNT_ID ;


const api = new MetaApi(token);








//Fetch all the currently running positions from the mt4 account

app.get('/positions',async (req,res) => {
   try {
      const account = await api.metatraderAccountApi.getAccount(accountId);
      const connection = account.getStreamingConnection();
      await connection.connect();
      const terminalState = connection.terminalState;
      await connection.waitSynchronized();
      res.status(200).json({
         "positions":terminalState.positions
      })
      console.log(terminalState.positions);
   }   
   catch(err) {
         console.log("FETCHERROR",err)
   }
})

app.get('/account',async (req,res) => {
   try {
      const account = await api.metatraderAccountApi.getAccount(accountId);
      const connection = account.getStreamingConnection();
      await connection.connect();
      const terminalState = connection.terminalState;
      await connection.waitSynchronized();
      console.log(terminalState.accountInformation)
      res.status(200).json(terminalState.accountInformation)
   }   
   catch(err) {
         console.log(err)
   }
})

app.get("/history",async (req,res) => {
   startTime = "2020-09-10 15:00:00.000"
   endTime = "2020-10-10 15:00:00.000"

   const account = await api.metatraderAccountApi.getAccount(accountId);

   const connection = account.getRPCConnection();

    await connection.connect();
    await connection.waitSynchronized();
    const orders = await connection.getHistoryOrdersByTimeRange(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), new Date())
     res.status(200).json({"orders" : orders})
})


app.post("/mt4info",(req,res) => {
   console("MT4 Posting data....")
   console.log(req.body)
})

app.listen(process.env.PORT,() => {
   console.log("Server running on port: 8000")
})
