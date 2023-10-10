import { useEffect, useState, useRef } from 'react';
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
  const [topLanguages, setTopLanguages] = useState([]); // State to store top languages

  const myRef = useRef<HTMLDivElement>(null);

  function copyToClipboard() {
    const innerHTMLString: string = myRef.current?.innerHTML as string;
    navigator.clipboard.writeText(innerHTMLString)
      .then(() => {
        alert('Text copied to clipboard');
      })
      .catch((err) => {
        console.error('Error copying text: ', err);
      });
  }
  
  const fetchTopLanguages = (username: string) => {
    setTopLanguages([]); // Reset top languages state when fetching new user
    axios
      .get(`https://api.github.com/users/${username}/repos`)
      .then((response) => {
        const repositories = response.data;
        const languageCounts: { [key: string]: number } = {};

        repositories.forEach((repo: any) => {
          axios.get(repo.languages_url).then((languagesResponse) => {
            const languages = languagesResponse.data;

            for (const language in languages) {
              if (languageCounts[language]) {
                languageCounts[language] += languages[language];
              } else {
                languageCounts[language] = languages[language];
              }
            }

            const languageArray = Object.keys(languageCounts).map((language) => ({
              name: language,
              count: languageCounts[language],
            }));

            const topLanguages = languageArray
              .sort((a, b) => b.count - a.count); // Get the top 5 languages

            setTopLanguages(topLanguages as any);
          });
        });
      })
      .catch((error) => {
        console.error('Error fetching user repositories:', error);
      });
  };

const handleSearch = () => {
  axios
    .get<GithubUser>(`https://api.github.com/users/${search}`)
    .then(response => {
      setLogin(response.data.login)
      setName(response.data.name)
      setBio(response.data.bio)

      fetchTopLanguages(response.data.login);
    })
    .catch(error => {
      if (error.response && error.response.status === 404) {
        alert('User not found');
        // Add code here to alert the user that the user was not found
      } else {
        console.error('Error fetching user data:', error);
      }
    });
}

  useEffect(() => {
    // Fetch top languages when the component mounts (initial load)
    if (login) {
      fetchTopLanguages(login);
    }
  }, [login]);

  return (
    <div className='container'>
      <div className='container-app'>
          <div className='form'>
            <h1>Github Readme Stats Maker</h1>
            <input type="text"
              className="search-input"
              placeholder='Type a username'
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="search-btn" onClick={handleSearch}>Search</button>
          </div>
          {login && (<div className='user-info'>
            <div className='user-logo'>
              <img className='user-img' src={`https://avatars.githubusercontent.com/${login}`} alt="user image" />
              <h1>{name}</h1>
              <button className="copy-btn" onClick={() => copyToClipboard()} >Copy Readme</button>
            </div>
            <div  ref={myRef} className='user-content'>
              <h1>Hi, im {name} &#128075;</h1>
              <hr />
              {bio && <p>{bio}</p>}
              <h2>My languages:</h2>
              <div >
                {topLanguages.map((language: any, index: number) => (
                  <span  key={`language.name_${index}`}>
                     <img src={`https://cdn.jsdelivr.net/npm/programming-languages-logos/src/${language.name.toLowerCase()}/${language.name.toLowerCase()}.png`} alt={`${language.name}`}  height="30"/>
                  </span>
                ))}
              </div>
              <hr />
              <div className='cards'>
                <img  className='card-stats' height="130em"src={`https://github-readme-stats.vercel.app/api?username=${login}&show_icons=true&theme=tokyonight&locale=en`} alt="github status card" />
                <img className='card-lang'height="130em"  src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${login}&layout=compact&langs_count=7&theme=tokyonight`} />
              </div>
            </div>
          </div>)}
      </div>
    </div>
  )
}

export default App
