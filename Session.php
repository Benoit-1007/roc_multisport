<?php
declare(strict_types=1);

class Session {
    public static function init(): void {
        // test if session exists or not
        if(session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }
}