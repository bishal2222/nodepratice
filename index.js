const bodyParser = require('body-parser');
var express = require('express');
// var cors = require('cors')
var fs = require('fs');
const Joi = require('joi');


var app = express();
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static('./'))
// app.use(cors())

const schema = Joi.object({
    name: Joi.string().required().alphanum().min(3) .max(30),
    id: Joi.string().required().min(3).max(30).alphanum() 
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'index.html'));
});

app.get('/products', async function (req, res) {
   const productData = getProductData()
   try{
    await schema.validateAsync(productData.products[0]);
    res.json({data:productData.products})
   }catch(err){
    res.send(err.message)
   }
})   

app.post('/product',async(req,res)=>{
   const productData = getProductData()
   const productDataFromBody = req.body
   try{
    await schema.validateAsync(productDataFromBody);
    productData.products.push(productDataFromBody)
    saveProductData(productData)
    res.json({msg:'Data added successfully',data:req.body})
   }catch(err){
    res.send(err.message)
   }
})

app.put('/product/:id',async(req,res)=>{
    const productData = getProductData()
    const item = productData.products.find((item)=>{
        return item.id == req.params.id
    })
    if(!item){
        res.json({msg:`Product with ${req.params.id} does not exists`})
    }else{
        try{
            const item = productData.products.filter((item)=>{
                return item.id != req.params.id
            })
            await schema.validateAsync({id: req.params.id,name:req.body.name})
            item.push({id: req.params.id,name:req.body.name })
            saveProductData({products:item})
            res.json({msg:"Data updated successfully."})
           }catch(err){
            res.send(err.message)
           }
    }
})

app.delete('/product/:id',(req,res)=>{
    const productData = getProductData()
    const item = productData.products.find((item)=>{
        return item.id == req.params.id
    })
    if(!item){
        res.json({msg:`Product with ${req.params.id} does not exists`})
    }else{
        const items = productData.products.filter((item)=>{
            return item.id != req.params.id 
        })
        saveProductData({products: items})
        res.json({msg:"Data deleted successfully"})
    }
    
})

// schema.validateAsync({ username: 'abc', birth_year: 1994 });


saveProductData = (data)=>{   
    const stringifyData = JSON.stringify( data)
    fs.writeFileSync('db.json', stringifyData)
}

getProductData = ()=>{
    const data = fs.readFileSync('db.json')
    console.log(JSON.parse(data))
    return JSON.parse(data)
}

var server = app.listen(3000, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})