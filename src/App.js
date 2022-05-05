import React, {Component} from "react";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import Rank from "./components/Rank/Rank";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import './App.css';
import "tachyons";
import particleOptions from  "./components/particleOptions";
import Clarifai from "clarifai";


      const particlesInit = async (main) => {
    // console.log(main);
  // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(main);
  };
    const particlesLoaded = (container) => {
    // console.log(container);
  };

  const initialState = {
    input: '',
    imageUrl: '',
    box: {},
    route: 'signin',
    isSignedIn : false,
    user: {
      email: '',
      id: '',
      name: '',
      entries: 0,
      joined: ''
    },
  }
class App extends React.Component {
constructor(){
  super()
  this.state = initialState;
}

// componentDidMount() {
//   fetch("http://localhost:3000")
//   .then(response => response.json())
//   .then(console.log)
// }

calculateFaceLocation = (data) => {
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById("inputimage");
  const width = Number(image.width);
  const height = Number(image.height);
  console.log("width:", width, ", height:", height);
  return {
    leftCol: clarifaiFace.left_col * width + 10,
    topRow: clarifaiFace.top_row * height + 10,
    rightCol: width - clarifaiFace.right_col * width + 10,
    bottomRow: height - clarifaiFace.bottom_row * height + 20
  };
}
displayFaceBox = (box) => {
  console.log("in displayFaceBox, box: ", box);
  this.setState({box: box});
}
loadUser = (data) => {
this.setState({
  user: {
    email: data.email,
    id: data.id,
    name: data.name,
    entries: data.entries,
    joined: data.joined
  }
})
}

onInputChange = (event) => {
  this.setState({input: event.target.value})
}

// "https://www.film.ru/sites/default/files/filefield_paths/shutterstock_9669042a.jpg"
onButtonSubmit = async () => {
  try {
  this.setState({imageUrl: this.state.input})
const response1 = await fetch('http://localhost:3000/imageurl', {
  method: "post",
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    input: this.state.input
  })
})
.catch(e => console.log(e))
const response = await response1.json();
  if(response) {
    try {
     // console.log(this.state);
     const backendResponse = await fetch('http://localhost:3000/image', {
        method: "put",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          id: this.state.user.id
        })
      });
      if(backendResponse) {
        const count = await backendResponse.json();
        this.setState(Object.assign(this.state.user, {entries: count}))
      }
    }catch(e) {
console.log("error," , e)
      }
  }
    const calculatedBox = this.calculateFaceLocation(response);
     console.log("calculated box: ", );
    this.displayFaceBox(calculatedBox);
  }catch(err) {
      console.log(err);
    };
}
onRouteChange = (route) => {
  if(route === 'signout') {
    this.setState(initialState)
  } else if(route === 'home') {
    console.log("in App.onRouteChange")
    this.setState({isSignedIn: true})
  }
  this.setState({route: route})
}

  render(){
   const {isSignedIn, imageUrl, route, box} = this.state;
  return (
    <div className="App" >
    
  <Particles className="particles"
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
     options={particleOptions}
    />
<Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>

{route === 'home'  
? ( <div>
  <Logo />
    <Rank name={this.state.user.name}
     entries={this.state.user.entries} />
   <ImageLinkForm 
   onInputChange={this.onInputChange} 
   onButtonSubmit={this.onButtonSubmit}/>
  <FaceRecognition box={box} imageUrl={imageUrl} /> 
    </div>)
: (
  route === 'signin'
  ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> 
  : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> 
)
  }
  </div>
  );
  }
}

export default App;
