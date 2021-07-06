<?php

// call dependencies
include_once 'Session.php';

Session::init();

Session::logout();

require 'views/backBookings.phtml';
