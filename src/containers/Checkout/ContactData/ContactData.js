import React, { Component } from 'react';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component {
    state = {
        orderForm: {
                name: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'Your Name'
                    },
                    value: '',
                    validation: {
                        required: true
                    },
                    valid: false,
                    modified: false
                },
                street: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'Your Street'
                    },
                    value: '',
                    validation: {
                        required: true
                    },
                    valid: false,
                    modified: false
                },
                zipCode: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'Zipcode'
                    },
                    value: '',
                    validation: {
                        required: true,
                        minLength: 5,
                        maxLength: 5
                    },
                    valid: false,
                    modified: false
                },
                country: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'Country Name'
                    },
                    value: '',
                    validation: {
                        required: true
                    },
                    valid: false,
                    modified: false
                },
                email: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'email',
                        placeholder: 'example@example.com'
                    },
                    value: '',
                    validation: {
                        required: true,
                        emailChar: true
                    },
                    valid: false,
                    modified: false
                },
                deliveryMethod: {
                    elementType: 'select',
                    elementConfig: {
                        options: [
                            {value: 'immediate', displayValue: 'Immediately'},
                            {value: 'future', displayValue: 'Future'}
                        ]
                    },
                    validation: {
                        required: false
                    },
                    value: 'immediate',
                    valid: true
                },
        },
        formIsValid: false,
        loading: false
    }

    orderHandler = (event) => {
        event.preventDefault();
        this.setState({loading: true});
        const formData = {};
        for (let formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value; //Creates key value pairs such as Country and the value the user entered
        }
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price, // In a real app, validate and calc price on the server
            orderData: formData 
        }
        axios.post('/orders.json', order)
             .then(response => {
                this.setState({loading: false});
                console.log(response);
                this.props.history.push('/');
             })
             .catch(error => {
                 console.log(error);
                 this.setState({loading: false});
            }); // orders.json is a Firebase specific way to target the backend
    }

    validationHandler(value, rules) {
        let isValid = true;
        
        if(rules.required) {
            isValid = value.trim() !== '' && isValid; //updates to true or false if the trimmed value is not empty whitespace
        }

        if(rules.minLength) {
            isValid = value.length >= rules.minLength && isValid; //updates to true or false if the value is greater than or equal to the minlength
        }

        if(rules.maxLength) {
            isValid = value.length <= rules.minLength && isValid;
        }

        if(rules.emailChar) {
            isValid = value.indexOf('@') !== -1 && isValid;
        }

        return isValid;
    }

    //Generic input handler that will take the user input, and correctly update the state so that
    //the user input is reflected back on the screen through two-way binding
    inputChangeHandler = (event, inputIdentifier) => {
       const updatedOrderForm = {
           ...this.state.orderForm
           //Clones the orderForm and gets top level identifiers, so name, street, etc.
       };
       const updatedFormElement = {
           ...updatedOrderForm[inputIdentifier]
           //Performs a deep copy of the children values for name, street, etc.
       };
       updatedFormElement.value = event.target.value; //Gets the value as entered into the field
       updatedFormElement.valid = this.validationHandler(updatedFormElement.value, updatedFormElement.validation);
        //Checks whether the new element passes the validation rules
        updatedFormElement.modified = true;
       updatedOrderForm[inputIdentifier] = updatedFormElement; //Updates the appropriate form field

       let formIsValid = true;
       for (let inputIdentifier in updatedOrderForm) {
           /* Prevents us from falling into the trap of the last valid value causing the form to incorrectly report that the form is or is not valid by checking to see if the variable itself is still valid */
           formIsValid  = updatedOrderForm[inputIdentifier].valid && formIsValid; 
       }

       this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid }); //Finally, update the state to reflect the change on screen
    }

    render() {
        const formElementsArrary = [];
        for (let key in this.state.orderForm) {
            //each key represents 'name', 'street', 'zipcode', etc.
            formElementsArrary.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }

        let form = (
            <form onSubmit={this.orderHandler}>
                {formElementsArrary.map(formElement => (
                    <Input
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        shouldValidate={formElement.config.validation}
                        invalid={!formElement.config.valid}
                        modified={formElement.config.modified}
                        changed={(event) => this.inputChangeHandler(event, formElement.id)}
                    />
                ))}
                <Button btnType="Success" disabled={!this.state.formIsValid} >PLACE ORDER</Button>
            </form>
        );
        if (this.state.loading) {
            form = <Spinner />;
        }

        return ( 
        <div className={classes.ContactData}>
            <h4>Enter your contact info</h4>
            {form}
        </div> 
        );
    }
}
 
export default ContactData;