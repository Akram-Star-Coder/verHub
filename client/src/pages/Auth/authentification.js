import './authentification.css';
import { useState } from 'react';
import {Link} from 'react-router-dom';
import axios  from "axios";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import {useDispatch} from 'react-redux';
import { ReactComponent as LoadingIcon } from './Spinner-1s-200px.svg';


const OTHO = () => {
  
  //fct useDispatch
  const dispatch = useDispatch();


  //state of cancel the pop up window 
  const [popUp, setPopUp] = useState(false);


  //current Date
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // add 1 to get the month number from 1 to 12
  const currentDay = currentDate.getDate();
  const years = Array.from(new Array(100), (val, index)=> (currentYear-1)-index)
  const months = [
    { number: 1, days: 31 },
    { number: 2, days: 28 },
    { number: 3, days: 31 },
    { number: 4, days: 30 },
    { number: 5, days: 31 },
    { number: 6, days: 30 },
    { number: 7, days: 31 },
    { number: 8, days: 31 },
    { number: 9, days: 30 },
    { number: 10, days: 31 },
    { number: 11, days: 30 },
    { number: 12, days: 31 },
  ];

  //state of loading 
  const [Loading, setLoading] = useState(false);

  //declaration of sueNavigate
  const navigate =  useNavigate();


  //state of the backend errors for register
  const [error, setError] = useState("");
  
  //state of the backend errors for login
  const [errorL, setErrorL] = useState("");
  
  //success state for register
  const [success, setSuccess] = useState("");
  //success state for login
  const [successL, setSuccessL] = useState("");

  //declaration of states of Login
  const [loginData, setLoginData] = useState({
    email    : "", 
    password : ""
  });
  //declaration of states of Register
  const [registerData, setregisterData] = useState({
    firstName : "", 
    lastName  : "", 
    email     : "", 
    password  : "", 
    gender    : "", 
    birthdayMonth : currentMonth,
    birthdayDay :  currentDay, 
    birthdayYear: currentYear

  });

  const handleChange = (e)=>{
    setError('');
    setErrorL('');
    setLoginData({
      ...loginData, 
      [e.target.name] : e.target.value
    })
    
  }
  const handleChange2 =  (e)=>{
    setError('');
    setErrorL('');
    setregisterData({
      ...registerData, 
      [e.target.name] : e.target.value
    })
  }
  const handleSubmit1 = async (e)=>{
    e.preventDefault();
    try{
      setLoading(true);
      if(registerData){
        
        
        const resp = await axios.post("http://localhost:3001/auth/register", registerData);
        
        if(resp){
          setError('');
          setSuccess('Registered Successfully');
          setLoading(false);          
          
          
          setTimeout(function() {
            setPopUp(false);
          }, 2000);
          //insert data inside the Redux Store
          dispatch({type:"LOGIN", payload:resp.data})
          //insert data in cookies
          Cookies.set('user', JSON.stringify(resp.data))
          
        }
      }
    } 
    catch(err){
      setError('')
      setLoading(false);
      if(err.response.status === 406){
        setSuccess('');
        setError('User Already Exists');
      }
      else if(err.response.status === 400){
        setSuccess('');
        setError('Error occuried. Try again');
      }
      else if(err.response.status===666){
        setSuccess('');
        setError('Error occuried. Try again');
      }
    }
  }


  const handlePopup = ()=>{
    if(popUp){
      setError('')
      setPopUp(false);
      setSuccess('');
      setErrorL('');
      setSuccessL('');
    }
    else{
      setError('')
      setErrorL('')
      setPopUp(true);
      setSuccess('');
      setSuccessL('');
    }
  }



  const handleSubmit2 = async (e)=>{
    e.preventDefault();
    try{
      setErrorL('');
      setLoading(true);
      if(loginData){
        const resp = await axios.post("http://localhost:3001/auth/login", loginData);
        if(resp){

          setErrorL('');
          setLoading(false);
          setSuccessL('Loggedin Successfully');
          console.log(resp.data);
          setTimeout(function() {
            navigate('/')
          }, 1500); 
          //insert data inside the Redux Store
          dispatch({type:"LOGIN", payload:resp.data})
          //insert data in cookies
          Cookies.set('user', JSON.stringify(resp.data))
        }
      }
    }
    catch(err){
        setLoading(false);
       if(err.response.status === 400){
        setSuccessL('');
        setErrorL('Invalid credentials');
       }
       else if(err.response.status === 404){
        setSuccessL('');
        setErrorL('User Not found');
       }
       else{
        setSuccessL('');
        setErrorL('Server Error ');
       }
    }
  }


  return (
    <>
    <div className="loginPage">
          
          
          
          <img src="https://static.vecteezy.com/ti/vecteur-libre/p3/5879539-cloud-computing-modern-flat-concept-for-web-banner-design-man-enters-password-and-login-to-access-cloud-storage-for-uploading-and-processing-files-vector-illustration-avec-scene-de-personnes-isolees-gratuit-vectoriel.jpg" alt="" />
          
          <div className="wrapper">
            <h1>Login</h1>
            {
              errorL && (<div className='errorDiv'><span>{errorL}</span></div>)
            }
            {
              Loading && (<div className="LoadingSVG">
                <LoadingIcon className="Loading"/>
              </div>)
            }
            {
              successL && (<div className=' errorDiv successDiv'><span>{successL}</span></div>)
            }
            <form className='form' onSubmit={handleSubmit2}>
              <input type="text" name="email" placeholder='Email adress' onChange={handleChange}/>
              <input type="password" name="password" placeholder='Password'  onChange={handleChange} />
              <button type='submit'>Log In</button>
            </form>
            <p>No account ? <button onClick={handlePopup}>Sign In</button></p>
            <p><Link  to='/createPage'>Create a page</Link> for a celebrity, brand or business.</p>

          </div>
 
      
     
          {
            popUp && (
              <div className="blur">
                
                <div className="wrapper2 ">
                  <div className="icon">
                    <button  onClick={handlePopup}  className='pop'><i className="fa-solid fa-xmark"></i></button>
                  </div>
                  <h1>Register</h1>
                  {
                    error && (<div className='errorDiv'><span>{error}</span></div>)
                  }
                  {
                    success && (<div className='errorDiv successDiv'><span>{success}</span></div>)
                  }
                  <span>It's quick and easy!</span>
                  <form className='form' onSubmit={handleSubmit1}>
                    

                    <input type="text" name="firstName" placeholder='First Name' onChange={handleChange2}/>
                    <input type="text" name="lastName" placeholder='Last Name' onChange={handleChange2}/>
                    <input type="text" name="email" placeholder='Email adress' onChange={handleChange2}/>
                    <input type="password" name="password" placeholder='Password' onChange={handleChange2}/>
                    <div className="birthday">
                      

                      <div className="select">
                        <select name="birthdayDay">
                        
                        <option value={currentDay}>{currentDay}</option>
                        {Array.from(
                          new Array(
                          months.find((m) => m.number === registerData.birthdayMonth)
                          ?.days || 31
                          ),
                          (val, index) => index + 1
                          ).map((d) => (
                          <option key={d} value={d}>
                          {d}
                          </option>
                        ))
                        }
                        </select>
                      </div>
                      

                      <div className="select">
                        <select name="birthdayMonth">
                        <option value={currentMonth}>{currentMonth}</option>
                        {months.map((m) => (
                          <option key={m.number} value={m.number}>
                            {m.number}
                            </option>
                            ))}
                        </select>
                      </div>  
                      <div className="select">
                        <select name="birthdayYear">
                        <option value={currentYear}>{currentYear}</option>
                          {
                            years.map((year, i)=>{
                              return(
                                <option key={i} value={year}>{year}</option>
                              )
                            })
                          }
                        </select>
                      </div>
                    </div>
                    <div className="gender">
                      <div className="genderOp">
                        <label htmlFor="Male">
                          Male
                        </label>
                        <input type="radio" name="gender" id='Male' value="Male" onChange={handleChange2} />
                      </div>  
                      <div className="genderOp">
                        <label htmlFor="Female">
                            Female
                        </label>
                        <input type="radio" name="gender" id='Female' value="Female" onChange={handleChange2} />
                      </div>    
                    </div>  
                    <div className="infos">
                      <span>
                        By clicking Sign Up, you agree to our Terms, Data Policy and Cookie Policy.
                      </span>
                    </div>
                    
                    <button type='submit'>Sign Up</button>
                  </form>
                </div>

              </div>
            )
          }
      

      </div>
    </>
  )
}

export default OTHO;