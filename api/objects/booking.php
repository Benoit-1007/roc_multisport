<?php
class Booking {
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

    /** Create booking */
    function create()
    {
        // query to insert record
        $query = "INSERT INTO 
                    {$this->table_name} (dateOfBooking, comment, idContact, typeOfBooking)
                VALUES 
                    (NOW(), :comment, :idContact, :typeOfBooking)";

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

    public function readLast()
    {
        $query = "SELECT MAX(idBooking) FROM bookings";

        // prepare query
        $stmt = $this->conn->prepare($query);

        //execute query
        $stmt->execute();

        $lastId = $stmt->fetch(PDO::FETCH_ASSOC);

        $this->idBooking = $lastId['MAX(idBooking)'];
    }

    /** Read all bookings 
     * get all booking data and contact data for each booking */
    public function readList()
    {
        $query = "SELECT
                    b.idBooking, b.dateOfBooking, b.comment, b.idContact, b.typeOfBooking,
                    c.idContact, c.lastName, c.firstName, c.organisation, c.phoneNumber, c.mail, c.address, c.postalCode, c.city
                FROM
                    {$this->table_name} b
                    LEFT JOIN
                        contacts c
                            ON b.idContact = c.idContact
                ORDER BY
                    idBooking";

        // prepare query
        $stmt = $this->conn->prepare($query);

        //execute query
        $stmt->execute();

        return $stmt;
    }

    /** Read one booking
     * get one booking's data according to its ID */
    public function readOne()
    {
        $query = "SELECT
                    idBooking, dateOfBooking, comment, idContact, typeOfBooking
                FROM
                    {$this->table_name}
                WHERE
                    idBooking = :idBooking";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // bind param
        $stmt->bindParam(':idBooking', $this->idBooking);

        //execute query
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // set values to object properties
        $this->dateOfBooking = $row['dateOfBooking'];
        $this->comment = $row['comment'];
        $this->idContact = $row['idContact'];
        $this->typeOfBooking = $row['typeOfBooking'];
    }

    // Read all bookings
    // public function readDetails()
    // {
    //     //select all data
    //     $query = "SELECT
    //                     b.idBooking, b.dateOfBooking, b.comment, b.idContact, b.typeOfBooking,
    //                     c.lastName, c.firstName, c.organisation, c.phoneNumber, c.mail, c.adress, c.postalCode, c.city,
    //                     ba.codeActivity, ba.dateActivity, ba.halfDaySelect,
    //                     a.name as nameActivity,
    //                     u.lastName as uLastName, u.firstName as uFirstName
    //                 FROM
    //                     {$this->table_name} b
    //                 LEFT JOIN
    //                     contacts c
    //                         ON b.idContact = c.idContact
    //                 INNER JOIN 
    //                     bookingsactivities ba
    //                         ON b.idBooking = ba.idBooking
    //                 INNER JOIN 
    //                     activities a
    //                         ON ba.codeActivity = a.codeActivity
    //                 INNER JOIN
    //                     bookingsActivitiesUsers bau
    //                         ON ba.idBookingActivity = bau.idBookingActivity
    //                 INNER JOIN
    //                     users u
    //                         ON u.idUser = bau.idUser
    //                 WHERE
    //                     b.idBooking = :idBooking
    //                 ORDER BY
    //                     idBooking";

    //     // prepare query
    //     $stmt = $this->conn->prepare($query);

    //     // bind param
    //     $stmt->bindParam(":idBooking", $this->idBooking);

    //     //execute query
    //     $stmt->execute();

    //     return $stmt;
    // }
}
