import React, { createContext, useState, useEffect, useRef } from 'react';

export const Context = createContext();

const ContextProvider = ({ children }) => {
    const hasSetDifficulty = useRef(false);
    const hasSelectedReplay = useRef(false);
    const [difficulty, setDifficulty] = useState('');
    const [playing, setPlaying] = useState(false);
    const [time, setTime] = useState(undefined);
    const [isNightmareMode, setNightmareMode] = useState(false);
    const [playingCards, setPlayingCards] = useState([]);
    const [typePlayingCardsFlipped, setTypePlayingCardsFlipped] = useState([]);
    const [prevChosenCards, setPrevChosenCards] = useState([]);
    const [prevChosenType, setPrevChosenType] = useState([]);
    const [revealMsg, setRevealMsg] = useState('');
    const [finalTime, setFinalTime] = useState('');
    const [finalScore, setFinalScore] = useState('');
    const cardTypes = ['two', 'four', 'seven', 'nine', 'eleven', 'Ace', 'Jack', 'Queen', 'King'];
    const cardSuits = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];

    const modes = [
        {
            name: 'easy',
            modeTime: 60
        },
        {
            name: 'medium',
            modeTime: 45
        },
        {
            name: 'hard',
            modeTime: 30
        },
        {
            name: 'expert',
            modeTime: 15
        },
        {
            name: 'nightmare',
            modeTime: 15
        }
    ]

    const updateTimeStates = mode => {
        const modeObj = modes.find(curr => curr.name === mode);
        setTime(modeObj.modeTime);
    }

    const randomElement = array => {
        //.random() gets a number from 0-1; .length is always 1 higher than the last index's number 
        const randomNum = Math.round(Math.random() * (array.length - 1));

        return array[randomNum];
    }

    const addToPlayingCards = () => {
        const cardtype = randomElement(cardTypes);
        const cardsuit = randomElement(cardSuits);
        const card = `${cardtype}-${cardsuit}`;
        
        if(isNightmareMode){
            const cardsuit2nd = randomElement(cardSuits);
            const card2nd = `${cardtype}-${cardsuit2nd}`;

            if(prevChosenType.find(curr => curr === cardtype)){
                addToPlayingCards();
                return;
            }

            setPrevChosenType([...prevChosenType, cardtype]);
            setPlayingCards([...playingCards, card, card2nd]);
        } else {
            if(prevChosenCards.find(curr => curr === card)){
                addToPlayingCards();
                return;
            }

            setPrevChosenCards([...prevChosenCards, card]);
            //two copies of a card are added (to be matched)
            setPlayingCards([...playingCards, card, card]);
        }   
    }

    const randomizePlayingCards = inputArray => {
        for (let i = inputArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = inputArray[i];
            inputArray[i] = inputArray[j];
            inputArray[j] = temp;
        }  
        return inputArray;
    }

    const flipCard = (event) => {
        //if user double clicks same flipped card
        if(event.classList.contains('card__inner--flipped') || event.closest('.card__inner--flipped'))
            return;

        if(event.classList.contains('card')){
            event.firstElementChild.classList.toggle('card__inner--flipped');
            setTypePlayingCardsFlipped([...typePlayingCardsFlipped, event.classList[1]]);
        } else if (event.closest('.card')){
            event.closest('.card').firstElementChild.classList.toggle('card__inner--flipped');
            setTypePlayingCardsFlipped([...typePlayingCardsFlipped, event.closest('.card').classList[1]]);
        }
    }

    const compareCards = () => {
        return typePlayingCardsFlipped[0] === typePlayingCardsFlipped[1];
    }

    const unMatchedCards = () => {
        updateRevealMsg(false);

        setTimeout(() => {
            document.querySelectorAll('.card__inner--flipped').forEach(curr => curr.classList.remove('card__inner--flipped'));
            setTypePlayingCardsFlipped([]);
        }, 400);
    }

    //if matching (remove '--flipped' class, and add '--correct' class to make the 2 cards stay flipped, but not to be unflipped during 'unMatchedCards()')
    const matchedCards = () => {
        document.querySelectorAll(`.${typePlayingCardsFlipped[0]}`).forEach(curr => {
            curr.firstElementChild.classList.add('card__inner--correct');
            curr.firstElementChild.classList.remove('card__inner--flipped');
        })
          
        updateRevealMsg(true);
        setTypePlayingCardsFlipped([]);
    }

    const updateRevealMsg = (areCardsMatched) => {
        areCardsMatched ? setRevealMsg('Matched!') : setRevealMsg('Un-Matching!');
    }

    const updateFinalScoreAndTime = (timeRemain) => {
        setFinalTime(timeRemain);
        setFinalScore(document.querySelectorAll('.card__inner--correct').length);
    }

    const gameEndToResults = (componentProps) => {
        setPlaying(false);
        componentProps.history.push('/ResultsScreen');
    }

    const replayGame = (isReplay) => {
        if(isReplay){
            hasSelectedReplay.current = true;
            updateTimeStates(difficulty);
            setPlaying(true);
        } else {
            hasSetDifficulty.current = false;
            setDifficulty('');
            setTime(undefined);
            setNightmareMode(false);
            setPlayingCards([]);
        }
        setPrevChosenCards([]);
        setPrevChosenType([]);
        setRevealMsg('');
        setFinalScore('');
        setFinalTime('');  
    }

    //whenever user changes difficulty on 'titleScreen'
    useEffect(() => {
        if(hasSetDifficulty.current){
            updateTimeStates(difficulty);
            //setNightmareMode(false);

            if(difficulty === 'nightmare'){
                setNightmareMode(true);
                //regenerate 'nightmare' cards
                setPlayingCards([]);
            }       
        } else {
            hasSetDifficulty.current = true;
        }
    }, [difficulty])

    //generating 18 cards on component render
    useEffect(() => {
        if(playingCards.length < 18)
            addToPlayingCards();
    }, [playingCards]);

    //runs whenever 2 cards are flipped; checks for matching or unmatching; if all cards are matching update final score and time
    useEffect(() => {
        if(typePlayingCardsFlipped.length === 2){
            compareCards() ? matchedCards() : unMatchedCards();

            if(document.querySelectorAll('.card__inner--correct').length === 18)
                updateFinalScoreAndTime(time);
        }
    }, [typePlayingCardsFlipped])

    //if selects to replay; watch for when 'prevChosenCards' array has been cleared, then clear 'playingCards' to trigger useEffect above above
    useEffect(() => {
        if(hasSelectedReplay.current && prevChosenCards.length === 0)
            setPlayingCards([]);
    }, [prevChosenCards, hasSelectedReplay])

    return (
        <Context.Provider value={{difficulty, playing, time, playingCards, revealMsg, finalTime, finalScore, isNightmareMode, setDifficulty, setPlaying, 
                                    setTime, randomizePlayingCards, flipCard, setRevealMsg, updateFinalScoreAndTime, gameEndToResults, replayGame}}>
            {children}
        </Context.Provider>
    )
}

export default ContextProvider;