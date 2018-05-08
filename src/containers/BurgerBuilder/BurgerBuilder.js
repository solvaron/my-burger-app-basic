import React, {Component} from 'react';
import Aux from '../../hoc/Fragment/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 2,
    bacon: 1.3
}
class BurgerBuilder extends Component {
    state = {
        ingredients: null,
        totalPrice: 0,
        checkout: false,
        displayOrderSummary: false,
        loading: false,
        error: false
    }

    componentDidMount () {
        axios.get('https://react-my-burger-2dfb5.firebaseio.com/ingredients.json')
             .then(response => {
                this.setState({ingredients: response.data});
             })
             .catch(error => {
                 this.setState({error: true});
             });
    }

    updatePurchaseState(ingredients) {
        //This gets complicated, bear with us...
        // 1. Creates a new array of string entries with the keys from ingredients so salad, bacon, cheese, etc. with the .keys operation
        // 2. Maps the current VALUES of those keys using the .map operation using igKey to access each value
        // 3. Reduces all of the VALUES assigned to each KEY (el) down to the single SUM using .reduce.  We have a starting value of zero in case no ingredients have been added.
        const sum = Object.keys(ingredients)
                           .map(igKey => {
                               return ingredients[igKey];
                           })
                           .reduce((sum, el) => {
                               return sum + el;
                           }, 0);
        this.setState({checkout: sum > 0})
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if(oldCount <= 0) {
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }

    orderSummaryHandler = () => {
        this.setState({displayOrderSummary: true});
    }

    orderCancelHandler = () => {
        this.setState({displayOrderSummary: false});
    }

    orderContinueHandler = () => {
        //alert('Purchase complete, have a nice day! :-D');
        const queryParams = [];
        for (let i in this.state.ingredients) {
            queryParams.push(encodeURIComponent(i) + '=' + 
                             encodeURIComponent(this.state.ingredients[i]));
            console.log('Value of i in queryParams PUSH:', i);
        }
        queryParams.push('price=' + this.state.totalPrice);
        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        });
    }
    
    render() {
        const disabledInfo = {
            ...this.state.ingredients
        };
        for(let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
            // {salad: true, meat: false, ...} etc.
        } 
        let orderSummary = null;
        let burger = this.state.error ? <p>No ingredients found :( </p>: <Spinner />;

        if(this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients} />
                
                    <BuildControls 
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        checkout={this.state.checkout}
                        displayOrderModal={this.orderSummaryHandler}
                        price={this.state.totalPrice}/>
                </Aux>
            );
            orderSummary = <OrderSummary 
                                ingredients={this.state.ingredients}
                                purchaseCanceled={this.orderCancelHandler}
                                purchaseContinued={this.orderContinueHandler} 
                                price={this.state.totalPrice}/>;
        }
        if(this.state.loading) {
            orderSummary = <Spinner />;
        }
        return (
           <Aux>
               <Modal show={this.state.displayOrderSummary}
                      modalClosed={this.orderCancelHandler}>
                      {orderSummary}
               </Modal>
               {burger}
           </Aux>

        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);