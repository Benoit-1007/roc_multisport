<?php
declare(strict_types=1);

class Session {
    public static function init(): void {
        // test if session exists or not
        if(session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }

    public static function login(...$params): void {
        $_SESSION['user']['id']     = $params[0]['idAdmin'];
        $_SESSION['user']['lastName']   = $params[0]['lastName'];
        $_SESSION['user']['firstName']   = $params[0]['firstName'];
        $_SESSION['user']['mail']  = $params[0]['mail'];
    }

    public static function logout(): void {
        if(!empty($_SESSION)) {
            unset($_SESSION);
            session_destroy();
        }
    }

}