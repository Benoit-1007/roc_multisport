<?php
class Bookingactivityuser {
    // database connection and table name
    private $conn;
    private $table_name = "bookingsactivitiesusers";

    // object properties
    public $idBookingActivityUser;
    public $idBookingActivity;
    public $idUser;


    public function __construct($db)
    {
        $this->conn = $db;
    }

    /** Create bookingActivity */
    public function create()
    {
        $query = "INSERT INTO
                    {$this->table_name} (idBookingActivity, idUser)
                VALUES 
                    (:idBookingActivity, :idUser)";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->idBookingActivity = htmlspecialchars(strip_tags($this->idBookingActivity));
        $this->idUser = htmlspecialchars(strip_tags($this->idUser));

        // bind values
        $stmt->bindParam(":idBookingActivity", $this->idBookingActivity);
        $stmt->bindParam(":idUser", $this->idUser);

        // execute query
        if ($stmt->execute()) {
            $lastId = $this->conn->lastInsertId();
            return $lastId;
        }
        return 0;
    }

    /** Read all users
     * get all participants of one activity according to one bookingActivity ID
     */
    public function readAllUsers()
    {
        //select all data
        $query = "SELECT
                    bau.idBookingActivity, u.idUser, u.lastName, u.firstName, u.birthdate, u.size, u.level, ba.idBooking
                FROM
                    {$this->table_name} bau
                INNER JOIN 
                    users u
                        ON u.idUser = bau.idUser
                INNER JOIN
                    bookingsactivities ba
                        ON ba.idBookingActivity = bau.idBookingActivity
                WHERE
                    bau.idBookingActivity = :idBookingActivity
                ORDER BY
                    bau.idBookingActivity";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // bind values
        $stmt->bindParam(':idBookingActivity', $this->idBookingActivity);

        // execute query
        $stmt->execute();

        return $stmt;
    }


    /** Remove all users 
     * Remove all participants of one activity or cocktail according to one bookingActivity ID */
    public function removeAllUsers()
    {
        $query = "DELETE 
                    u.*
                FROM 
                    users u
                LEFT JOIN
                    {$this->table_name} bau
                        ON u.idUser = bau.idUser
                WHERE
                    bau.idBookingActivity = :idBookingActivity
                    ";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':idBookingActivity', $this->idBookingActivity);

        if($stmt->execute()) {
            return 1;
        }
        return 0;
    }
}
