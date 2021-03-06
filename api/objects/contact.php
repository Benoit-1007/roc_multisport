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
    public $address;
    public $postalCode;
    public $city;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    /** Create contact */ 
    public function create()
    {
        // query to insert record
        $query = "INSERT INTO 
                    {$this->table_name} (lastName, firstName, organisation, phoneNumber, mail, address, postalCode, city)
                VALUES 
                    (:lastName, :firstName, :organisation, :phoneNumber, :mail, :address, :postalCode, :city)";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->lastName = htmlspecialchars(strip_tags($this->lastName));
        $this->firstName = htmlspecialchars(strip_tags($this->firstName));
        $this->organisation = htmlspecialchars(strip_tags($this->organisation));
        $this->phoneNumber = htmlspecialchars(strip_tags($this->phoneNumber));
        $this->mail = htmlspecialchars(strip_tags($this->mail));
        $this->address = htmlspecialchars(strip_tags($this->address));
        $this->postalCode = htmlspecialchars(strip_tags($this->postalCode));
        $this->city = htmlspecialchars(strip_tags($this->city));

        // bind values
        $stmt->bindParam(":lastName", $this->lastName);
        $stmt->bindParam(":firstName", $this->firstName);
        $stmt->bindParam(":organisation", $this->organisation);
        $stmt->bindParam(":phoneNumber", $this->phoneNumber);
        $stmt->bindParam(":mail", $this->mail);
        $stmt->bindParam(":address", $this->address);
        $stmt->bindParam(":postalCode", $this->postalCode);
        $stmt->bindParam(":city", $this->city);

        // execute query
        if ($stmt->execute()) {
            $lastId = $this->conn->lastInsertId();
            return $lastId;
        }
        return 0;
    }

    /** Read all contacts 
     * (future proof)*/ 
    public function readAll()
    {
        //select all data
        $query = "SELECT
                    idContact, firstName, lastName, organisation, phoneNumber, mail, address, postalCode, city
                FROM
                    {$this->table_name}
                ORDER BY
                    idContact";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // execute query
        $stmt->execute();

        return $stmt;
    }

    /** Read one contact
     * get one contact coordinates according to its ID */  
    public function readOne()
    {
        $query = "SELECT
                    idContact, lastName, firstName, organisation, phoneNumber, mail, address, postalCode, city
                FROM
                    {$this->table_name}
                WHERE
                    idContact = ?";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // bind value
        $stmt->bindParam(1, $this->idContact);

        //execute query
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // set values to object properties
        $this->idContact = $row['idContact'];
        $this->lastName = $row['lastName'];
        $this->firstName = $row['firstName'];
        $this->organisation = $row['organisation'];
        $this->phoneNumber = $row['phoneNumber'];
        $this->mail = $row['mail'];
        $this->address = $row['address'];
        $this->postalCode = $row['postalCode'];
        $this->city = $row['city'];
    }

    /** Update one contact 
     * Update all datas of one contact according to its ID */
    public function updateOne()
    {
        $query = "UPDATE
                    {$this->table_name}
                SET
                    lastName = :lastName, firstName = :firstName, organisation = :organisation, phoneNumber = :phoneNumber, mail = :mail, address = :address, postalCode = :postalCode, city = :city
                WHERE 
                    idContact = :id";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->lastName = htmlspecialchars(strip_tags($this->lastName));
        $this->firstName = htmlspecialchars(strip_tags($this->firstName));
        $this->organisation = htmlspecialchars(strip_tags($this->organisation));
        $this->phoneNumber = htmlspecialchars(strip_tags($this->phoneNumber));
        $this->mail = htmlspecialchars(strip_tags($this->mail));
        $this->address = htmlspecialchars(strip_tags($this->address));
        $this->postalCode = htmlspecialchars(strip_tags($this->postalCode));
        $this->city = htmlspecialchars(strip_tags($this->city));
        
        // bind values
        $stmt->bindParam(":id", $this->idContact);
        $stmt->bindParam(":lastName", $this->lastName);
        $stmt->bindParam(":firstName", $this->firstName);
        $stmt->bindParam(":organisation", $this->organisation);
        $stmt->bindParam(":phoneNumber", $this->phoneNumber);
        $stmt->bindParam(":mail", $this->mail);
        $stmt->bindParam(":address", $this->address);
        $stmt->bindParam(":postalCode", $this->postalCode);
        $stmt->bindParam(":city", $this->city);

        // execute query
        if($stmt->execute()) {
            return 1;
        }
        return 0;
    }

    /** Remove one contact
     * remove one contact(the related booking, bookingActivities, bookingActivitiesUsers) according to its ID */ 
    public function removeOne()
    {
        $query = "DELETE FROM 
                    {$this->table_name}
                WHERE 
                    idContact = ?";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // bind value
        $stmt->bindParam(1, $this->idContact);

        // execute query
        if($stmt->execute()) {
            return 1;
        }
        return 0;
    }
}
