import React, { useState } from 'react';
import './index.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

function Classes() {
    const [visibleFloors, setVisibleFloors] = useState('');
    const [selectedFloor, setSelectedFloor] = useState('');

    const showNbFloors = () => {
        setVisibleFloors('nb-floors'); 
        setSelectedFloor(''); // Reset when switching to another building
    };
    
    const showSamsungFloors = () => {
        setVisibleFloors('samsung-floors'); 
        setSelectedFloor(''); // Reset when switching to another building
    };
    
    const showMcecFloors = () => {
        setVisibleFloors('MCEC-floors'); 
        setSelectedFloor(''); // Reset when switching to another building
    };

    const handleFloorSelection = (floor) => {
        setSelectedFloor(floor);
    };

    return (
        <div>
            <nav>
                <ul>
                    <li>
                        <Link to="/home">Home</Link>
                    </li>
                    <li>
                        <Link to="/class">Class Status</Link>
                    </li>
                    <li>
                        <Link to="/schedule">Class Queue</Link>
                    </li>
                </ul>
            </nav>
            <div className="container2">
            <h3>Building</h3>
            <div className="blocks">
                <div className="building">
                    <button className="NB" onClick={showNbFloors}>NB</button>
                    <button className="samsung" onClick={showSamsungFloors}>SAMSUNG</button>
                    <button className="MCEC" onClick={showMcecFloors}>MCEC</button>
                </div>
                <div className="floors">
                    <ul className={`nb-floors ${visibleFloors === 'nb-floors' ? 'show' : ''}`}>
                        <li><button className='ground-floor' onClick={() => handleFloorSelection('ground')}>Ground Floor</button></li>
                        <li><button className='first-floor' onClick={() => handleFloorSelection('first')}>1st Floor</button></li>
                        <li><button className='second-floor' onClick={() => handleFloorSelection('second')}>2nd Floor</button></li>
                    </ul>
                    <ul className={`samsung-floors ${visibleFloors === 'samsung-floors' ? 'show' : ''}`}>
                        <li><button className='ground-floor' onClick={() => handleFloorSelection('ground1')}>Ground Floor</button></li>
                        <li><button className='second-floor' onClick={() => handleFloorSelection('second1')}>2nd Floor</button></li>
                    </ul>
                    <ul className={`MCEC-floors ${visibleFloors === 'MCEC-floors' ? 'show' : ''}`}>
                        <li><button className="D-block" onClick={() => handleFloorSelection('DB')}>D-block</button></li>
                        <li><button className="E-block" onClick={() => handleFloorSelection('EB')}>E-block</button></li>
                        <li><button className='second-floor'onClick={() => handleFloorSelection('second2')}>2nd Floor</button></li>
                        <li><button className='third-floor' onClick={() => handleFloorSelection('third2')}>3rd Floor</button></li>
                        <li><button className='fourth-floor' onClick={() => handleFloorSelection('fourth2')}>4th Floor</button></li>

                    </ul>
                </div>
            </div>
            <div className="rooms">
                <h3>Rooms</h3>

                <div className="classrooms">
                    <div className="NB">

                        <div id="ground" style={{ display: selectedFloor === 'ground' ? 'flex' : 'none' }}>
                                <div className="nb002 box">002</div>
                                <div className="nb003A box">003A</div>
                                <div className="nb003B box">003B</div>
                                <div className="nb012A box">012A</div>
                                <div className="nb011 box">011</div>
                                <div className="nb107 box">107</div>
                            </div>
                            <div id="first-floor" style={{ display: selectedFloor === 'first' ? 'flex' : 'none' }}>
                                <div className="nb108 box">108</div>
                            </div>
                                <div id="second-floor"  style={{ display: selectedFloor === 'second' ? 'flex' : 'none' }}>
                                    <div className="nb204 box">204</div>
                                    <div className="nb205 box">205</div>
                                    <div className="nb207 box">207</div>
                                    <div className="nb208 box">208</div>
                                    <div className="nb210 box">210</div>
                                    <div className="nb211 box">211</div>
                                    <div className="nb212 box">212</div>
                                    <div className="nb213 box">213</div>
                                    <div className="nb215 box">215</div>
                                </div>
                                
                            </div>

                    <div className="samsung">
                        <div id="ground1" style={{ display: selectedFloor === 'ground1' ? 'flex' : 'none' }}>
                            <div className="N020 box">N020</div>
                        </div>
                        <div id="second-floor1" style={{ display: selectedFloor === 'second1' ? 'flex' : 'none' }}>
                            <div className="N113 box">N113</div>
                            <div className="N114 box">N114</div>
                        </div>
                    </div>
                    <div className="MECER">
                        <div id="DB" style={{ display: selectedFloor === 'DB' ? 'flex' : 'none' }}>
                            <div className="D027 box">027</div>
                            <div className="D028 box">028</div>
                        </div>
                        <div id="EB" style={{ display: selectedFloor === 'EB' ? 'flex' : 'none' }}>
                            <div className="E122 box">E122</div>
                            <div className="E124 box">E124</div>
                            <div className="E129 box">E129</div>
                            <div className="E131 box">E131</div>
                        </div>
                        <div id="second-floor" style={{ display: selectedFloor === 'second2' ? 'flex' : 'none' }}>
                            <div className="s118 box">118</div>
                            <div className="s121 box">121</div>
                            <div className="s131 box">131</div>
                            <div className="s132 box">132</div>
                            <div className="s137 box">137</div>
                            <div className="s138 box">138</div>
                            <div className="s139 box">139</div>
                            <div className="s155 box">155</div>
                        </div>
                            <div id="third-floor"  style={{ display: selectedFloor === 'third2' ? 'flex' : 'none' }}>
                                <div className="T201 box">201</div>
                                <div className="T206 box">206</div>
                                <div className="T207 box">207</div> 
                                <div className="T213 box">213</div>
                                <div className="T215 box">215</div>
                                <div className="T216 box">216</div>
                                <div className="T233 box">233</div>
                                <div className="T246 box">246</div>

                            </div>
                            <div id="fourth-floor" style={{ display: selectedFloor === 'fourth2' ? 'flex' : 'none' }}>
                                <div className="F310 box">310</div>
                                <div className="F311 box">311</div>
                                <div className="F313 box">313</div> 
                                <div className="F319 box">319</div>
                                <div className="F337 box">337</div>
                                <div className="F338 box">338</div>
                                <div className="F339 box">339</div>
                            </div>
                        </div>

                </div>
            </div>
        </div>
    </div>
            
            
            
        
    )
}
export default Classes