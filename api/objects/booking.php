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
    public $typeOfBooking;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Read all bookings
    public function readAll()
    {
        //select all data
        $query = "SELECT
                    b.idBooking, b.dateOfBooking, b.comment, b.idContact, b.typeOfBooking,
                    c.lastName, c.firstName, c.organisation, c.phoneNumber, c.mail, c.adress, c.postalCode, c.city,
                    ba.codeActivity, ba.dateActivity, ba.halfDaySelect,
                    a.name as nameActivity
                FROM
                    " . $this->table_name . " b
                    LEFT JOIN
                        contacts c
                            ON b.idContact = c.idContact
                    INNER JOIN 
                        bookingsactivities ba
                            ON b.idBooking = ba.idBooking
                    INNER JOIN 
                        activities a
                            ON ba.codeActivity = a.codeActivity
                ORDER BY
                    idBooking";



        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }
    // Read all bookings
    public function read()
    {
        //select all data
        $query = "SELECT
                    idBooking, dateOfBooking, comment, idContact, typeOfBooking
                FROM
                    " . $this->table_name . "
                ORDER BY
                    idBooking";

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
            comment=:comment, idContact=:idContact, typeOfBooking=:typeOfBooking";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->comment = htmlspecialchars(strip_tags($this->comment));
        $this->idContact = htmlspecialchars(strip_tags($this->idContact));
        $this->typeOfBooking = htmlspecialchars(strip_tags($this->typeOfBooking));

        // bind values
        $stmt->bindParam(":comment", $this->comment);
        $stmt->bindParam(":idContact", $this->idContact);
        $stmt->bindParam(":typeOfBooking", $this->typeOfBooking);

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
