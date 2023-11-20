const express=require('express')
const cors=require('cors')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')

const app=express()
app.use(bodyParser.json())
app.use(cors({
    origin:['http://localhost:3000'],
}))
const port=process.env.PORT || 4000

async function databaseConnect(){
    try{
        await mongoose.connect("mongodb+srv://root:root@cluster2.lrczczf.mongodb.net/?retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology: true})
        console.log("connected to the database")
    }catch(error){
        console.error("Error connecting to MongoDB",error)
    }
}
databaseConnect()

//schema for stock data
const stockSchema=new mongoose.Schema({
    name:{type:String},
    price:{type:Number},
})

const Stock = mongoose.model("Stock",stockSchema)

// Add a new stock
app.post('/stocks', async (req, res) => {
    const { name, price } = req.body;
    try {
      const newStock = new Stock({ name, price });
      await newStock.save();
      res.status(201).json(newStock);
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  });
  

  //get endpoint to get a stock's price by name
  app.get('/stock-price/:stockName', async (req, res) => {
    const stockName = req.params.stockName;
    try {
      const stock = await Stock.findOne({ name: stockName });
      if (!stock) {
        return res.status(400).json('No such stock found');
      } else {
        const randomChange = Math.round(Math.random() * 10 - 5); 
        const newPrice = +(stock.price + randomChange).toFixed(2);
        stock.price = newPrice;
        await stock.save();
        res.json({ price: newPrice }); 
      }
    } catch (error) {
      console.error('Error fetching or updating stock price', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // PUT endpoint to update a stock's price by name
app.put('/stock/:stockName', async (req, res) => {
  const stockName = req.params.stockName;
  const newPrice = req.body.price; // Assuming the request body includes the new price

  try {
    const stock = await Stock.findOne({ name: stockName });
    if (!stock) {
      return res.status(400).json('No such stock found');
    }
    stock.price = newPrice;
    await stock.save();
    res.json({ message: 'Stock price updated successfully', updatedStock: stock });
  } catch (error) {
    console.error('Error updating stock price', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

  // DELE endpoint to update a stock's price by name
app.delete('/stocks/:stockName', async (req, res) => {
  const stockName = req.params.stockName;
  try {
    const deletedStock = await Stock.findOneAndDelete({ name: stockName });
    if (!deletedStock) {
      return res.status(400).json('No such stock found');
    }
    res.json({ message: 'Stock deleted successfully' });
  } catch (error) {
    console.error('Error deleting stock', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

  


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})