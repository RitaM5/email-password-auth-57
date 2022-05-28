import { useState } from 'react'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";
import './App.css'
import app from './firebase.init'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
const auth = getAuth(app);

function App() {
  const [validated, setValidated] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [email, setEmail] = useState('');
  const [name , setName] = useState('');
  const [password, setPassword] = useState('')
  const [error, setError] = useState('');

  const handleNameBlur = event =>{
    setName(event.target.value);
  }

  const handleEmailBlur = (event) => {
    setEmail(event.target.value);
  }

  const handlePasswordBlur = (event) => {
    setPassword(event.target.value);
  }

  const handleRegisterChange = event => {
    console.log(event.target.checked);
    setRegistered(event.target.checked);
  }

  const handleFormSubmit = event => {
    //console.log('form submit', email, password);
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    }

    if (!/(?=^.{6,}$)(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9])/.test(password)) {
      setError('password should contain al least one special charecter');
      return;
    }
    setValidated(true);
    setError('');

    if (registered) {
      console.log(email, password);
      signInWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user;
          console.log(user);
        })
        .catch(error => {
          console.log(error);
          setError(error.message);
          setError('');
        });
    }

    else {
      createUserWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user;
          console.log(user);
          setEmail('');
          setPassword('')//tahole register ar sathe sathe box clear hoye jabe.
          varifyEmail();
          setUserName();
        })
        .catch(error => {
          console.log(error);
          setError(error.message);//email akbr use ar por r akbar use krle error msg asbe
        })
    }
    event.preventDefault(); //default code
  }
  //reset pass
  const handlePasswordReset = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log('email sent');
      })
  }
//set user name
const setUserName = () =>{
  updateProfile(auth.currentUser, {
    displayName: name
  })
  .then (() =>{
    console.log('updating name');
  })
  .catch(error =>{
    setError(error.message);
  })
}

  //varify email
  const varifyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        console.log('email varification send');
      })
  }

  return (
    <div className="App">
      <div className="w-50 mx-auto mt-5">
        <h2 className="text-primary"> {registered ? 'Please Login' : 'Please Register'}</h2>
        <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
          {!registered &&
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Your name</Form.Label>
              <Form.Control onBlur={handleNameBlur} type="email" placeholder="Enter email" required />
              <Form.Control.Feedback type="invalid">
                Please provide your name.
              </Form.Control.Feedback>
            </Form.Group>
          }
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control onBlur={handleEmailBlur} type="email" placeholder="Enter email" required />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              Please provide a valid email.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control onBlur={handlePasswordBlur} type="password" placeholder="Password" required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check onChange={handleRegisterChange} type="checkbox" label="Already Registered" />
          </Form.Group>
          <p className="text-danger">{error}</p>
          <Button onClick={handlePasswordReset} variant="link">Forget Password</Button>
          <br />
          <Button variant="primary" type="submit">
            {registered ? 'Login' : 'Register'}
          </Button>
        </Form>
      </div>
    </div>
  )
}

export default App
