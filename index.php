<?php

// Display all errors
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Appels de dépendances
require 'Session.php';

// Fill Session
Session::init();

// var_dump($_SESSION);

require 'views/home.phtml';