import React from "react";
import { ReactComponent as NotificationIcon } from '../assets/images/Notification.svg';
import profile from '../assets/images/profile.png';
import '../css/header.css';

const Header=()=>{
    return(
        <div className="headContainer">
            <h1 className="head-header">Unispace</h1>
            <div className="iconsContainer">
                       <NotificationIcon />

            <div className="profile">
            <img src={profile} alt="profile " />
            </div>
            </div>
        </div>
    );
};

export default Header;