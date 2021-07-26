import React, { useContext } from 'react';
import { Context } from '../Context.js';
import { Link } from 'react-router-dom';

const ResultsScreen = () => {
    const { finalTime, finalScore, replayGame } = useContext(Context);

    const titleScreenOnClick = () => {
        replayGame(false);
    }

    const playScreenOnClick = () => {
        replayGame(true);
    }

    return (
        <div className='screen col'>
            <h1>Your results</h1>

            <h2>Score: {finalScore}/18 cards!</h2>

            <h2>Time Remaining: {finalTime} seconds!</h2>

            <div className='row' style={{width: '20%'}}>
                <Link exact='true' to='/' className='link' onClick={titleScreenOnClick}>Title Screen</Link>

                <Link exact='true' to='/PlayScreen' className='link' onClick={playScreenOnClick}>Replay</Link>
            </div>
        </div>
    )
}

export default ResultsScreen;