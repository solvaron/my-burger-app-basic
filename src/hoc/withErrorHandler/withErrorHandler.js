import React, {Component} from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Fragment/Aux';

const withErrorHandler = (WrappedComponent, axios) => {
    return class extends Component { //Returning an annonymous class, so no name is needed
        state = {
            error: null
        }
        
        componentWillMount () {
            this.reqInterceptor = axios.interceptors.request.use(req => {
                this.setState({error: null});
                return req
            }); //Will clear any existing errors each time we make a new request

            this.resInterceptor = axios.interceptors.response.use(resp => resp, error => {
                this.setState({error: error});
            }); //Will display any errors we receive in the axios response in the Modal   
        }

        componentWillUnmount() {
            axios.interceptors.request.eject(this.reqInterceptor);
            axios.interceptors.response.eject(this.resInterceptor);
        }

        closeErrorHandler = () => {
            this.setState({error: null}); //Closes the error modal
        }
        
        render() {
            return (
                <Aux>
                    <Modal show={this.state.error}
                           modalClosed={this.closeErrorHandler} >
                        {this.state.error ? this.state.error.message : null}
                    </Modal>
                    <WrappedComponent {...this.props} />
                </Aux>
            );
        }
    } 
}

export default withErrorHandler;