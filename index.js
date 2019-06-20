 const Sequelize = require('sequelize')
 const sequelize = new Sequelize(process.env.DATABASE_URL||'postgres://postgres:secret@localhost:5432/game', { define: { timestamps: false } })
 const express = require('express')
 const app = express()


const bodyParser = require('body-parser')
//app.use(express.static('public'))
app.use(bodyParser.json())

sequelize.sync() .then(() => {
  console.log('Sequelize updated database schema')
})
.catch(console.error)
//////////////////////////////////////////////////////////////////
const Teaminfo = sequelize.define('teaminfos',
  {
    description: {
      type: Sequelize.STRING,
      field: "description",
      allowNull: false
    },   
  },
  {
    timestamps: false,
    tableName: 'teaminfos',

  })
//////////////////////////////////////////////////////////////
  const GameSchedule = sequelize.define('gameschedules',
  {
    score: {
      type: Sequelize.STRING,
      field: "score",
      allowNull: false
    },
    isWinner: {
      type: Sequelize.BOOLEAN,
      field: "isWinner",
      allowNull: false
    },  
    hasBeenPlayed: {
      type: Sequelize.BOOLEAN,
      field: "hasBeenPlayed",
      allowNull: false
    },
    opponent: {
      type: Sequelize.STRING,
      field: "opponent",
      allowNull: false
    }, 
    date: {
      type: Sequelize.DATE,
      field: "date",
      allowNull: false
    },  
  },
  {
    timestamps: false,
    tableName: 'gameschedules',

  })

app.get("/",(req,res)=>{
  res.send("hello world")
})

/////////////////////////////////////////////////////
const Type = sequelize.define('types',
    {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        }
    },
    {
        timestamps: false,
        tableName: 'types'
    })

const Dish = sequelize.define('dishes',
    {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        }
    },
    {
        timestamps: false,
        tableName: 'dishes'
    })

Dish.belongsTo(Type)

const Menu = sequelize.define('menu',
    {
        date: {
            type: Sequelize.DATEONLY,
            allowNull: false
        }
    },
    {
        timestamps: false,
        tableName: 'menu'
    })
    
Menu.belongsTo(Dish)

//////////////
app.get('/types',(req,res)=>{
  res.send("add types")
})
app.get('/dishes',(req,res)=>{
  res.send("add dishes")
})
app.get('/menu',(req,res)=>{
  res.send("add menu")
})


app.post('/types', function(req, res, next) {
  const type = {
    name: "soup",
  };
  Type.create(type)
    .then(type => {
      if (!type) {
        return res.status(404).send({
          message: `Something went wrong`
        });
      }
    })
    .catch(err => next(err));
})

///////////////
app.post('/dishes', function(req, res, next) {
  const dish = {
    name: "dish1",
    typeId: 1
  };
  Dish.create(dish)
    .then(dish => {
      if (!dish) {
        return res.status(404).send({
          message: `Something went wrong`
        });
      }
      Type.findByPk(
        req.body.typeId,
        { include: [{ model: Dish }] },
        req.body.id
      ).then(type => {
        return res.status(201).send(type);
      });
    })
    .catch(err => next(err));
})

///////////////
app.post("/menu", function(req, res, next) {
  Menu.create({
    date:"2019-06-02 00:00:00+00",
    dishId:1
  })
    .then(menuItem => {
      if (!menuItem) {
        return res.status(404).send({
          message: `Something went wrong`
        });
      }
      return res.status(201).send(menuItem);
    })
    .catch(err => next(err));
});


app.post("/hooks", (req, res, next) => {  

  
  let response_chatbot={
    queryResult:{
      queryText: "what is date today?",
      action:"menu",
      parameters:{
        date:""
      }
    }
  }

    switch(req.body.queryResult.action){
      case "menu": 
      if(req.body.queryResult.parameters.hasOwnProperty("date")){

        Menu.findOne({
          where:{id:1}
        })
        .then(item => { 
          console.log(new Date(item.date).toDateString().split(" ")[0])   
          if (!item){
                  res.json({
                    fulfillmentText:"request"+req.body.queryResult.queryText,
                    fulfillmentMessages: "response nothing"               
                })            
          }
          else{

            response_chatbot.queryResult.parameters.date=item.date 
            console.log("response date",response_chatbot)
                return  res.json({                 
                    fulfillmentText: "request"+req.body.queryResult.queryText,
                    fulfillmentMessages:[
                      {
                        "text": {
                          "text": [
                            "response: today is :"+item.date  
                          ]
                        }
                      }
                    ]                              
              })  
          }
        })
        .catch(error => next(error)) 
      }
     
      


      break    
      default:
      res.json({
           fulfillmentText: "Great! I've set your reservation for $number person on "+req.body.queryResult.parameters.date+" at"+ req.body.queryResult.parameters.time+". Do you have any special occasion?",
       });
    }        
   
   
})












 const port =process.env.PORT|| 5000
 app.listen(port, () => console.log(`Example app listening on port ${port}!`))
