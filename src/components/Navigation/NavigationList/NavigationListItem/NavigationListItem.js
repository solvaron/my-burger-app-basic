import React from 'react';
import classes from './NavigationListItem.css';
import {NavLink} from 'react-router-dom';


const navigationListItem = (props) => (
    <li className={classes.NavigationListItem}>
        <NavLink 
            to={props.link}
            exact
            activeClassName={classes.active}>{props.children}</NavLink>
    </li>
);

export default navigationListItem;