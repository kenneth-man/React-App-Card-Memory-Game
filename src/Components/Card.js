import React, { useContext } from 'react';
import { Context } from '../Context.js';

const Card = ({ cardType }) => {
    const { flipCard, isNightmareMode } = useContext(Context);

    return (
        <div className={isNightmareMode ? `card ${cardType.slice(0,3)}` : `card ${cardType}`} onClick={(e) => flipCard(e.target)}>
            <div className="card__inner transition">
                <div className="card__front">
                    <img src={require('../Res/cardback.svg').default} alt="card-back" className='card__img'/>
                </div>

                <div className="card__back">
                    <img src={require(`../Res/${cardType}.svg`).default} alt="card-type" className='card__img'/>
                </div>
            </div>
        </div>
    )
}

export default Card;