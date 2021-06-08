<?php
class Contact
{

    // database connection and table name
    private $conn;
    private $table_name = "contacts";

    // object properties
    public $idContact;
    public $firstName;
    public $lastName;
    public $organisation;
    public $phoneNumber;
    public $mail;
    public $adress;
    public $postalCode;
    public $city;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Read all bookings
    public function readAll()
    {
        //select all data
        $query = "SELECT
                    id, firstName, lastName, organisation, phoneNumber, mail, adress, postalCode, city
                FROM
                    " . $this->table_name . "
                ORDER BY
                    id";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    // Create booking
    function create()
    {

        // query to insert record
        $query = "INSERT INTO
                " . $this->table_name . "
            SET
            firstName=:firstName, lastName=:lastName, organisation=:organisation, phoneNumber=:phoneNumber, mail=:mail, adress=:adress, postalCode=:postalCode, city=:city";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->firstName = htmlspecialchars(strip_tags($this->firstName));
        $this->lastName = htmlspecialchars(strip_tags($this->lastName));
        $this->organisation = htmlspecialchars(strip_tags($this->organisation));
        $this->phoneNumber = htmlspecialchars(strip_tags($this->phoneNumber));
        $this->mail = htmlspecialchars(strip_tags($this->mail));
        $this->adress = htmlspecialchars(strip_tags($this->adress));
        $this->postalCode = htmlspecialchars(strip_tags($this->postalCode));
        $this->city = htmlspecialchars(strip_tags($this->city));

        // bind values
        $stmt->bindParam(":firstName", $this->firstName);
        $stmt->bindParam(":lastName", $this->lastName);
        $stmt->bindParam(":organisation", $this->organisation);
        $stmt->bindParam(":phoneNumber", $this->phoneNumber);
        $stmt->bindParam(":mail", $this->mail);
        $stmt->bindParam(":adress", $this->adress);
        $stmt->bindParam(":postalCode", $this->postalCode);
        $stmt->bindParam(":city", $this->city);

        // execute query
        if ($stmt->execute()) {
            $lastId = $this->conn->lastInsertId();
            return $lastId;
        }

        return 0;
    }

    // Read one booking with id
    function readOne()
    {
    }

    // Update one booking with id
    function update()
    {
    }

    // Delete one booking with id
    function delete()
    {
    }

    // Search one booking with keywords
    function search()
    {
    }
}