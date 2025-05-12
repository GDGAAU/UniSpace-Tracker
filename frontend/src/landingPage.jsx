import React from 'react';
import './landing_page.css';
import students from './assets/students.svg';
import building from './assets/building.svg';
import calendar from './assets/calendar.svg';
import time from './assets/time.svg';
import one from './assets/one.svg';
import two from './assets/two.svg';
import three from './assets/three.svg';

import AOS from 'aos';
import 'aos/dist/aos.css';

import { useEffect } from 'react';





function LandingPage() {
    
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);
    return (
    
    <>
    <h1  className='page_title'>UniSpace</h1>

<section className='section1'>
    <div className='intro'>
        <h1 className='intro_text'>Simplify Your Class <br></br> 
        Representative Duties</h1>
        <p className='intro_subtext'>Effortlessly manage classroom reservations, track important dates,<br></br>
        and keep your classmates informed with our all-in-one platform.</p>
   
    <div className='buttons'>
        <button className='signup'>Sign Up</button>
        <button className='login'>Login</button>
    </div>
    </div>

    <img className='students' alt='students' src={students}></img>
    
</section>

<section >
    <h1 className='feature_text'>Everything You Need as a Class Rep </h1>
    <p className='feature_subtext'>Our platform is designed specifically for class representatives to streamline <br></br>
    administrative  tasks and improve communication.</p>

    <div className='card_container'>
        <div className='card'>
            <img src={building} alt='building' className='icons'></img>
            <h2 className='card_name'>Classroom Reservations</h2>
            <p className='card_text'>
                Easily book classrooms for study 
                sessions, group projects, or special
                 events with real-time availability.
                 
            </p>
            <ul className='card_list'>
                <li>✓Real-time availability checking</li>
                <li>✓Recurring reservation options</li>
                <li>✓Room capacity and equipment filters</li>
            </ul>    
        </div>
        <div className='card'>
            <img src={calendar} alt='calendar' className='icons'></img>
            <h2 className='card_name'>Important Date Tracking</h2>
            <p className='card_text'>
            Important Date Tracking
            Never miss a deadline again. Track 
            exams, assignments, and other 
            important class dates in one place.
                
            </p>
            <ul className='card_list'>
                <li>✓Customizable reminder notifications</li>
                <li>✓Priority labeling system</li>
                <li>✓Sync with popular calendar apps</li>
            </ul>
        </div>
        <div className='card'>
            <img src={time} alt='time' className='icons'></img>
            <h2 className='card_name'>Class Communication</h2>
            <p className='card_text'>
            Keep everyone in the loop with
             announcements, updates, and 
             important information sharing.
                 
                
            </p>
            <ul className='card_list'>
                <li>✓Bulk messaging to classmates</li>
                <li>✓File sharing capabilities</li>
               
            </ul>
        </div>
        
    </div>
</section>

<section className='section3'>
    <h1 className='manual_text'>How UniSpace Works</h1>
    <p className='manual_subtext'>Get started in minutes and transform how you manage your class representative responsibilities.</p>
    

    <div className='steps'>

        <div>
            <img src={one} className='number'></img>
            <h2 className='step'>Create an Account or Log In</h2>
            <p className='description'>Sign up with your school email and set
                 up your class profile with course
                  details.</p>

        </div>
        <div>
            <img src={two} className='number'></img>
            <h2 className='step'>Invite Classmates </h2>
            <p className='description'>Add your classmates via email or share
                 a unique invitation link with your class.</p>
        </div>

        <div>
            <img src={three} className='number'></img>
            <h2 className='step'>Start Managing</h2>
            <p className='description'> Begin reserving rooms,
                 tracking important dates, and communicating
                  with your class..</p>
        </div>
    </div>

    <button className='get_started'>Get Started</button>
</section>
    </>
    )
}

export default LandingPage;