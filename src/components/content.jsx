import React from "react";
import '../css/content.css';

const Content =() =>{
    return (
       <div className="contaier">
        <div className="headers">
            <img src="" alt="" />
            <p>Upcoming Reservations</p>
            <a href="">View all 
                <img src="" alt="" />
            </a>
        </div>

        <div className="Stright-Line"></div>

        <div className="cardCntainer">
            <div className="card">
               <p>class:Nb 107 </p> 
                
               <p> Date: May 25 2025 </p> 
                 
               <p> Time :9:00am -11:00am </p> 
               
              <p>  <a href="">View details </a> </p> 
            </div>

             <div className="card">
                <p>class:Nb 107 </p> 
                
               <p> Date: May 25 2025 </p> 
                 
               <p> Time :9:00am -11:00am </p> 
               
              <p>  <a href="">View details </a> </p> 
            </div>

             <div className="card">
                <p>class:Nb 107 </p> 
                
               <p> Date: May 25 2025 </p> 
                 
               <p> Time :9:00am -11:00am </p> 
               
              <p>  <a href="">View details </a> </p> 
            </div>
            
        </div>


        <div className="headers">
            <img src="" alt="" />
            <p>empty Class Rooms</p>
            <a href="">View all 
                <img src="" alt="" />
            </a>
        </div>

        <div className="Stright-Line"></div>

        <div className="cardCntainer">
            <div className="card">
                <p>class:Nb 107 </p>
                 
               <p> size: 100 students </p>
                 
               <p> open :9:00am -11:00am </p>
                 
              <p>  <a href="">View details </a> </p>
            </div>

             <div className="card">
                 <p>class:Nb 107 </p>
                 
               <p> size: 100 students </p>
                 
               <p> open :9:00am -11:00am </p>
                 
              <p>  <a href="">View details </a> </p>
            </div>

             <div className="card">
               <p>class:Nb 107 </p>
                 
               <p> size: 100 students </p>
                 
               <p> open :9:00am -11:00am </p>
                 
              <p>  <a href="">View details </a> </p>
            </div>
            
        </div>


        </div>
    );
};

export default Content;