import React from 'react';
import classes from './Burger.css';
import Ingredient from './Ingredient/Ingredient';

const burger = (props) => {
    let inputIngredients = Object.keys(props.ingredients)
        .map(igKey => {
            return [...Array(props.ingredients[igKey])]
        .map((_, i) => {
               return <Ingredient key={igKey + i} type={igKey} />;
            });
        })
        .reduce((arr, el) => {
            return arr.concat(el)
        }, []);
        if (inputIngredients.length === 0) {
            inputIngredients = <p>Please start adding ingredients :) </p>;
        }
        console.log('Transformed array:', inputIngredients);
    return (
        <div className={classes.Burger}>
            <Ingredient type="bread-top"/>
            {inputIngredients}
            <Ingredient type="bread-bottom"/>
        </div>
    );
}

export default burger;