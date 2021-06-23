<?php

include_once 'Session.php';

unset($_SESSION['user']);

Session::logout();

// Notif


header('Location: index.php');
exit;