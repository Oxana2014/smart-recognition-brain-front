import React from "react";

class SignIn extends React.Component  {
  constructor(props) {
    super(props);
    this.state = {
      signInEmail: '',
      signInPassword: ''
    }
  }
  onEmailChange = (event) => {
    this.setState({signInEmail: event.target.value})
  }
  onPasswordChange = (event) => {
    this.setState({signInPassword: event.target.value})
  }
onSubmitSignIn = async () => {
  try {
  console.log(this.state);
 const response = await fetch('http://localhost:3000/signin', {
    method: "post",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      email: this.state.signInEmail,
      password: this.state.signInPassword
    })
  });
   // console.log("status: ", response.status)
    if(response.status === 200) {      
      const user = await response.json(); 
      // console.log("user:", user);
       if(user.id) {
         this.props.loadUser(user);
         this.props.onRouteChange('home');
       }
       
    } else {
      const data = await response.json()
       console.log("error, ", data)  
    } 
  } catch(e) {
    console.log(e)
  } 
    
  } 

  render() {
    const {onRouteChange} = this.props;
return (
    <article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
    <main className="pa4 black-80">
  <form className="measure">
    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
      <legend className="f1 fw6 ph0 mh0">Sign In</legend>
      <div className="mt3">
        <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
        <input onChange={this.onEmailChange}
         className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address"  id="email-address"/>
      </div>
      <div className="mv3">
        <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
        <input onChange={this.onPasswordChange}
         className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password"  id="password"/>
      </div>
      {/* <label class="pa0 ma0 lh-copy f6 pointer">
          <input type="checkbox"/> Remember me</label> */}
    </fieldset>
    <div className="">
      <input onClick={this.onSubmitSignIn}
      className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
      type="button"
       value="Sign in"/>
    </div>
    <div className="lh-copy mt3">
      <p onClick={() => onRouteChange('register')} className="f6 link dim black db pointer">Register</p>
      {/* <a href="#0" class="f6 link dim black db">Forgot your password?</a> */}
    </div>
  </form>
</main>
</article>
)
}
}

export default SignIn;