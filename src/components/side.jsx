 import React from "react";
 import '../css/side.css';

 const Side=() =>{
    return(
    <div className="sideContainer">
        <div className="strightline"></div>

        <div className="dashboard">
            <img src="" alt="" />
            <p>Dashboard</p>
        </div>
        <div className="strightline"></div>


      <div className="link-hold">
        <div className="links">
            <img src="" alt="" />
            <p>Class</p>
            </div>

             <div className="links">
            <img src="" alt="" />
            <p>Reserved Classes</p>
            </div>

             <div className="links">
            <img src="" alt="" />
            <p>Reminder</p>
            </div>
            </div>

            <div className="strightline"></div>

            <div className="links">
                <img src="" alt="" />
                <p>Account Setting</p></div>

                 <div className="links">
                <img src="" alt="" />
                <p>log Out</p></div>
    </div>
    );
 };

 export default Side;