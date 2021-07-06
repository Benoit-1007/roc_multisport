<?php

class Contact {
    // database connection and table name
    private $conn;
    private $table_name = "contacts";

    // object properties
    public $idContact;
    public $lastName;
    public $firstName;
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
                    idContact, firstName, lastName, organisation, phoneNumber, mail, adress, postalCode, city
                FROM
                    " . $this->table_name . "
                ORDER BY
                idContact";

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
            lastName=:lastName, firstName=:firstName, organisation=:organisation, phoneNumber=:phoneNumber, mail=:mail, adress=:adress, postalCode=:postalCode, city=:city";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->lastName = htmlspecialchars(strip_tags($this->lastName));
        $this->firstName = htmlspecialchars(strip_tags($this->firstName));
        $this->organisation = htmlspecialchars(strip_tags($this->organisation));
        $this->phoneNumber = htmlspecialchars(strip_tags($this->phoneNumber));
        $this->mail = htmlspecialchars(strip_tags($this->mail));
        $this->adress = htmlspecialchars(strip_tags($this->adress));
        $this->postalCode = htmlspecialchars(strip_tags($this->postalCode));
        $this->city = htmlspecialchars(strip_tags($this->city));

        // bind values
        $stmt->bindParam(":lastName", $this->lastName);
        $stmt->bindParam(":firstName", $this->firstName);
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
        $query = "SELECT
                    c.lastName, c.firstName, c.organisation, c.phoneNumber, c.mail, c.adress, c.postalCode, c.city
                FROM
                    " . $this->table_name . " c
                WHERE
                    c.idContact = ?";



        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->idContact);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // set values to object properties
        $this->lastName = $row['lastName'];
        $this->firstName = $row['firstName'];
        $this->organisation = $row['organisation'];
        $this->phoneNumber = $row['phoneNumber'];
        $this->mail = $row['mail'];
        $this->adress = $row['adress'];
        $this->postalCode = $row['postalCode'];
        $this->city = $row['city'];
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
