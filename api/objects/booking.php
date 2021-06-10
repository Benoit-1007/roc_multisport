<?php
class Booking
{

    // database connection and table name
    private $conn;
    private $table_name = "bookings";

    // object properties
    public $idBooking;
    public $dateOfBooking;
    public $comment;
    public $idContact;
    public $typeBooking;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Read all bookings
    public function readAll()
    {
        //select all data
        $query = "SELECT
                    id, dateOfBooking, comment, idContact
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
            comment=:comment, idContact=:idContact, typeBooking=:typeBooking";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->comment = htmlspecialchars(strip_tags($this->comment));
        $this->idContact = htmlspecialchars(strip_tags($this->idContact));
        $this->typeBooking = htmlspecialchars(strip_tags($this->typeBooking));

        // bind values
        $stmt->bindParam(":comment", $this->comment);
        $stmt->bindParam(":idContact", $this->idContact);
        $stmt->bindParam(":typeBooking", $this->typeBooking);

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
