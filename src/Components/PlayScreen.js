import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../Context.js';
import Card from './Card.js';
import spinner from '../Res/spinner.gif';

const PlayScreen = (props) => {
  const { playing, time, setTime, playingCards, randomizePlayingCards, revealMsg,
          setRevealMsg, finalScore, finalTime, updateFinalScoreAndTime, gameEndToResults } = useContext(Context); 
  //must use 'useState' here to rerender page after every update (instead of a let variable; whereby page wouldn't show updated value because no rerender with let/const)
  const [randomPlayingCards, setRandomPlayingCards] = useState([]);

  const decrTimeBySec = () => {
    const tick = () => {
      if(time === 0){
        updateFinalScoreAndTime(0);
        gameEndToResults(props);
      } else {
        //correct syntax to decr/incr 'useState' value; 'time-=1'/'time+=1', causes assignment to const variable error
        setTime(time => time - 1);
      }
    };

    setTimeout(tick, 1000);
  };

  useEffect(() => {
    decrTimeBySec()
  }, [time])

  useEffect(() => {
    const shuffledCards = randomizePlayingCards(playingCards);
    setRandomPlayingCards(shuffledCards);
  }, [])

  useEffect(() => {
    if(revealMsg){
      //if game is not completed (finalScore and finalTime aren't set), display 'revealMsg'; prevent typeerror bug since page has navigated away from 'PlayScreen'
      if(!finalScore && !finalTime){
        document.querySelector('.playscreen__revealMsg').classList.add('reveal');

        setTimeout(() => {
          document.querySelector('.playscreen__revealMsg').classList.remove('reveal');
          setRevealMsg('');
        }, 500);
      }
    }
  }, [revealMsg])

  //if player completes game before timer, 'finalTime' and 'finalScore' are set (in Context.js), then navigate to 'ResultsScreen'
  //putting this useeffect in this component to have access to this component's 'props' to navigate screen
  useEffect(() => {
    if(finalTime && finalScore)
      gameEndToResults(props);
  },[finalTime, finalScore])

  return (
    <div className={playing ? 'screen col' : 'blur'}>
      <h1>Match all pairs of cards - {time} seconds remaining!</h1>

      <div className='playScreen__grid'>
        {
          randomPlayingCards.length !== 0 ? 
          randomPlayingCards.map((curr, index) => 
            <Card 
              key={index}
              cardType={curr}
            />
          ) :
          <img src={spinner} alt='loading-spinner' className='spinner'/>
        }
      </div>

      <h2 className='playscreen__revealMsg transition'>{revealMsg}</h2>
    </div>
  ) 
}

export default PlayScreen;