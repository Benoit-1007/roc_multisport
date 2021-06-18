<?php
class Bookingactivityuser
{

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

    // Create bookingActivity
    public function create()
    {

        // query to insert record
        $query = "INSERT INTO
                " . $this->table_name . "
            SET
            idBookingActivity=:idBookingActivity, idUser=:idUser";

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

    public function readAllUsers()
    {
        //select all data
        $query = "SELECT
                    bau.idBookingActivity, u.lastName, u.firstName
                FROM
                " . $this->table_name . " bau
                INNER JOIN 
                    users u
                        ON u.idUser = bau.idUser
                WHERE
                    bau.idBookingActivity = :idBookingActivity
                ORDER BY
                    bau.idBookingActivity";



        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':idBookingActivity', $this->idBookingActivity);
        $stmt->execute();



        return $stmt;
    }
}
