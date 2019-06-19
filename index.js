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


app.post("/",(req,res)=>{  
  if (req.body.result.action === "schedule") {
  
  }
  else if (req.body.result.action === "teaminfo")
  {
    
    app.get('/team_info/:id', (req, res, next) => {
  
      Teaminfo.findByPk(req.params.id)
      .then(team => {    
        if (!team){
          res.json({
            speech: 'Something went wrong!',
            displayText: 'Something went wrong!',
            source: 'game schedule'
        })
          
        }
        else{
          return res.json({
            speech: team.description,
            displayText: team.description,
            source: 'team info'
        });
        }
      })
      .catch(error => next(error))
    })
  
  }
})












 const port =process.env.PORT|| 5000
 app.listen(port, () => console.log(`Example app listening on port ${port}!`))
