import React, { useState, useEffect } from 'react'
import { KATAKANA } from './katakana';
import './App.css'
import { db } from "./firabaseConfig";

const CHECK_CHAR = "aiueoAIUEO"
const NUM_QUEST = 200


function App() {
  const [data, setData] = useState([])
  const [value, setValue] = useState("")
  const [username, setUsername] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [listUser, setListUser] = useState([])
  const [isLogin, setIsLogin] = useState(false)
  const [uuid, setUuid] = useState()

  const generateUuid = () => {
    var temp_url = URL.createObjectURL(new Blob());
    var uuid = temp_url.toString();
    URL.revokeObjectURL(temp_url);
    setUuid(uuid.substr(uuid.lastIndexOf('/') + 1))
  }

  const generateData = () => {
    let data = [];
    let keys = Object.keys(KATAKANA);
    for (let index = 0; index < NUM_QUEST; index++) {
      let rand = Math.floor(Math.random() * keys.length)
      data.push({
        "japan": KATAKANA[keys[rand]],
        "alphabet": keys[rand],
        "status": 0,
      })
    }

    setData(data)
  }

  const getListUser = () => {
    db.ref("/users/").on("value", snapshot => {
      let list = []
      const keys = Object.keys(snapshot.val())
      const vals = snapshot.val()
      for (let index = 0; index < keys.length; index++) {
        list.push(vals[keys[index]])

      }

      // console.log(list)
      list.sort((a, b) => (a.score < b.score) ? 1 : -1)
      // console.log(list)
      setListUser(list)
    })
  }

  useEffect(() => {
    generateData()
    getListUser()
    generateUuid()
  }, [])

  const handleChange = value => {
    setValue(value)
    let lastChar = value[value.length - 1]
    if (CHECK_CHAR.includes(lastChar)) {
      if (value === data[currentIndex].alphabet) {
        setCurrentIndex(currentIndex + 1)
        data[currentIndex].status = 1
        setData(data)
        setScore(score + 5)
      } else {
        setCurrentIndex(currentIndex + 1)
        data[currentIndex].status = -1
        setData(data)
        setScore(score - 10)
      }
      submitUser()
      setValue("")
    }
  }

  const submitUser = () => {
    db.ref("/users/" + uuid).set({
      name: username,
      score: score,
    }).then(setIsLogin(true))
  }

  return (
    <div >
      {!isLogin ? (
        <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
          <div style={{ display: 'flex', flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <h4>Your name: </h4>
            <div style={{ marginLeft: 30 }}>
              <input placeholder="" onChange={e => setUsername(e.target.value)} value={username} />
            </div>
          </div>
          <button style={{ height: 30, width: 200 }} onClick={() => submitUser()}>go</button>
        </div>
      ) : (
          <div style={{ width: "100vw", height: "100vh", display: 'flex' }}>
            <div style={{ width: "70vw", height: "100vh", textAlign: 'center' }}>
              <div style={{ width: "100%", height: 500, display: "flex", flexWrap: "wrap", padding: 20 }}>
                {data.length > 0 && data.map((e, index) => (
                  <div style={{
                    background: index === currentIndex ? "yellow" : "white",
                    padding: 5
                  }} className="word__container"
                    key={index}>
                    <p style={{ color: e.status === -1 ? "red" : e.status === 1 ? "green" : "blue", marginTop: 7 }} className="word">{e.japan}</p>
                  </div>
                ))}
                <div style={{ height: 200, width: "100%" }}></div>
              </div>
              <div style={{ position: "fixed", width: "100%", bottom: 20, background: "white", }}>
                <h3>Score: {score}</h3>
                <input placeholder="" onChange={e => handleChange(e.target.value)} value={value} />
              </div>
            </div>
            <div style={{ width: "30vw", height: "100vh", position: "fixed", right: 0 }}>
              <div style={{ height: "10vh", width: "100%", justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                <h1 style={{ color: "orange" }}>Rank</h1>
              </div>
              <div style={{ width: "100%", height: "90vh" }} >
                {listUser.length > 0 && listUser.map((e, index) => (
                  <div key={index} style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", paddingLeft: "3vw", paddingRight: "3vw" }}>
                    <h3>{e.name}</h3>
                    <h4>{e.score}</h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
}

export default App;
