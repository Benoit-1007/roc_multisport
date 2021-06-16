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
    public function readList()
    {
        //select all data
        $query = "SELECT
                    b.idBooking, b.dateOfBooking, b.comment, b.idContact, b.typeOfBooking,
                    c.lastName, c.firstName, c.organisation, c.phoneNumber, c.mail, c.adress, c.postalCode, c.city
                    
                FROM
                    " . $this->table_name . " b
                    LEFT JOIN
                        contacts c
                            ON b.idContact = c.idContact
                    
                ORDER BY
                    idBooking";



        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    public function readOne()
    {
        $query = "SELECT
                    b.idBooking, b.dateOfBooking, b.comment, b.idContact, b.typeOfBooking
                FROM
                    " . $this->table_name . " b
                WHERE
                    b.idBooking = ?
                ORDER BY
                    idBooking";



        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->idBooking);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // set values to object properties
        $this->dateOfBooking = $row['dateOfBooking'];
        $this->comment = $row['comment'];
        $this->idContact = $row['idContact'];
        $this->typeOfBooking = $row['typeOfBooking'];
    }

    // Read all bookings
    public function readDetails()
    {
        //select all data
        $query = "SELECT
                        b.idBooking, b.dateOfBooking, b.comment, b.idContact, b.typeOfBooking,
                        c.lastName, c.firstName, c.organisation, c.phoneNumber, c.mail, c.adress, c.postalCode, c.city,
                        ba.codeActivity, ba.dateActivity, ba.halfDaySelect,
                        a.name as nameActivity,
                        u.lastName as uLastName, u.firstName as uFirstName
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
                        INNER JOIN
                            bookingsActivitiesUsers bau
                                ON ba.idBookingActivity = bau.idBookingActivity
                        INNER JOIN
                            users u
                                ON u.idUser = bau.idUser
                    WHERE
                        b.idBooking = ?
                    ORDER BY
                        idBooking";



        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->idBooking);
        $stmt->execute();

        return $stmt;
    }

// Read all bookings
public function readActivityDetails()
{
    //select all data
    $query = "SELECT
                    b.idBooking,
                    ba.codeActivity, ba.dateActivity, ba.halfDaySelect,
                    a.name as nameActivity
                FROM
                    " . $this->table_name . " b
                    INNER JOIN 
                        bookingsactivities ba
                            ON b.idBooking = ba.idBooking
                    INNER JOIN 
                        activities a
                            ON ba.codeActivity = a.codeActivity
                WHERE
                    b.idBooking = ?
                ORDER BY
                    idBooking";



    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(1, $this->idBooking);
    $stmt->execute();

    return $stmt;
}

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
