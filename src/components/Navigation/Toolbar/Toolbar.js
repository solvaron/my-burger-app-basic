import React from 'react';
import classes from './Toolbar.css';
import Logo from '../../Logo/Logo';
import NavigationList from '../NavigationList/NavigationList';
import HamburgerMenu from '../SideDrawer/HamburgerMenu/HamburgerMenu';

const toolbar = (props)  => (
    <header className={classes.Toolbar}>
        <HamburgerMenu clicked={props.clicked}/>
        <div className={classes.Logo}>
            <Logo />
        </div>
        <nav className={classes.DesktopOnly}>
            <NavigationList />
        </nav>
    </header>
);

export default toolbar;