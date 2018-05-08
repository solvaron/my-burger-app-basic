import React from 'react';

import classes from './NavigationList.css';
import NavigationListItem from './NavigationListItem/NavigationListItem';
//import {NavLink, Switch, Route, Redirect} from 'react-router-dom';

const navigationList = () => (
    <div>
    <ul className={classes.NavigationList}>
        <NavigationListItem link="/" >Burger Builder</NavigationListItem>
        <NavigationListItem link="/orders">Orders</NavigationListItem>
    </ul>
    </div>
);

export default navigationList;