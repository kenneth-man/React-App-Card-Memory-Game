import React, { useContext } from 'react';
import { Context } from '../Context.js';
import { Link } from 'react-router-dom';

const TitleScreen = () => {
    const { difficulty, setDifficulty, setPlaying } = useContext(Context);

    const playBtnOnClick = () => {
        setPlaying(true);
    }

    const alertDifficultyNotChosen = () => {
        alert('Please choose a difficulty mode');
    }

    return (
        <div className='screen col'>
            <h1>Card Memory Game</h1>

            <h2>Flip 2 cards to match all pairs within the time remaining. The harder the difficulty, the less time given to complete</h2>

            <div className='col'>
                <label htmlFor='modes'>Choose a difficulty mode</label> 

                <select name='modes' onChange={(e) => setDifficulty(e.target.value)}>
                    <option value="" defaultValue>&nbsp; ↓ &nbsp; Modes below &nbsp; ↓</option>
                    <option disabled value="">_____________________________</option>
                    <option value="easy">😎 Easy (60 seconds)</option>
                    <option value="medium">😅 Medium (45 seconds)</option>
                    <option value="hard">😰 Hard (30 seconds)</option>
                    <option value="expert">🥵 Expert (15 seconds)</option>
                    <option value="nightmare">😈 Nightmare (15 seconds + random suits)</option>
                </select>
            </div>

            <Link exact='true' to={difficulty ? '/PlayScreen' : '/'} onClick={difficulty ? playBtnOnClick : alertDifficultyNotChosen} className='link'>Play Game</Link>
        </div>
    )
}

export default TitleScreen;