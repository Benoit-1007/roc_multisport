<?php
class User
{

    // database connection and table name
    private $conn;
    private $table_name = "users";

    // object properties
    public $idUser;
    public $lastName;
    public $firstName;
    public $birthdate;
    public $size;
    public $level;
    

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
            lastName=:lastName, firstName=:firstName, birthdate=:birthdate, size=:size, level=:level";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->lastName = htmlspecialchars(strip_tags($this->lastName));
        $this->firstName = htmlspecialchars(strip_tags($this->firstName));
        $this->birthdate = htmlspecialchars(strip_tags($this->birthdate));
        $this->size = htmlspecialchars(strip_tags($this->size));
        $this->level = htmlspecialchars(strip_tags($this->level));

        // bind values
        $stmt->bindParam(":lastName", $this->lastName);
        $stmt->bindParam(":firstName", $this->firstName);
        $stmt->bindParam(":birthdate", $this->birthdate);
        $stmt->bindParam(":size", $this->size);
        $stmt->bindParam(":level", $this->level);

        // execute query
        if ($stmt->execute()) {
            $lastId = $this->conn->lastInsertId();
            return $lastId;
        }

        return 0;

    }
}