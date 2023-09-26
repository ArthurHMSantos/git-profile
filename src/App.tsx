import { useState } from 'react';
import './App.css'
import axios from 'axios'

type GithubUser = {
  login: string;
  name: string;
  bio: string;
  avatarUrl: string;
  repos: [];
}

function App() {
  
  const [search, setSearch] = useState("");
  const [login, setLogin] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [repos, setRepos] = useState([]);
  

  const handleSearch = () => {
    axios
    .get<GithubUser>(`https://api.github.com/users/${search}`)
    .then(response => {
      setLogin(response.data.login)
      setName(response.data.name)
      setBio(response.data.bio)
      setRepos(response.data.repos)
    })
  }


  return (
    <div className='container-app'>
      <div className='container'>
        <main>
          <div className='form'>
            <h1>Github Readme Stats Maker</h1>
            <input type="text"
            placeholder='Type a username'
            onChange={(e) => setSearch(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
          </div>
          <div className='user-info'>
            <div>
            <img src={`https://avatars.githubusercontent.com/${login}`} alt="user image" />
             <h1>{name}</h1>
             <h2>{login}</h2>
            </div>
          <div className='user-content'>
            <h1>Hi, im {name} &#128075;</h1>
            <hr />
            <p>{bio}</p>
            <h2>Languages that i use:</h2>
            <hr />
            <div className='cards'>
              <img height="180em" src={`https://github-readme-stats.vercel.app/api?username=${login}&show_icons=true&theme=tokyonight&locale=en`} alt="github status card"/>
              <img height="180em" src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${login}&layout=compact&langs_count=7&theme=tokyonight`}/>
            </div>
          </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
