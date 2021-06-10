<?php
class Bookingactivityuser
{

    // database connection and table name
    private $conn;
    private $table_name = "bookingsactivities";

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
}