<?php
class BookingActivity {
    // database connection and table name
    private $conn;
    private $table_name = "bookingsactivities";

    // object properties
    public $idBookingActivity;
    public $idBooking;
    public $codeActivity;
    public $dateActivity;
    public $halfDaySelect;
    

    public function __construct($db)
    {
        $this->conn = $db;
    }

    /** Create bookingActivity */
    public function create()
    {
        // query to insert record
        $query = "INSERT INTO 
                    {$this->table_name} (idBooking, codeActivity, dateActivity, halfDaySelect)
                VALUES 
                    (:idBooking, :codeActivity, :dateActivity, :halfDaySelect)";

        // prepare query
        $stmt =  $this->conn->prepare($query);

        // sanitize
        $this->idBooking = htmlspecialchars(strip_tags($this->idBooking));
        $this->codeActivity = htmlspecialchars(strip_tags($this->codeActivity));
        $this->dateActivity = htmlspecialchars(strip_tags($this->dateActivity));
        $this->halfDaySelect = htmlspecialchars(strip_tags($this->halfDaySelect));

        // bind values
        $stmt->bindParam(":idBooking", $this->idBooking);
        $stmt->bindParam(":codeActivity", $this->codeActivity);
        $stmt->bindParam(":dateActivity", $this->dateActivity);
        $stmt->bindParam(":halfDaySelect", $this->halfDaySelect);

        // execute query
        if ($stmt->execute()) {
            $lastId = $this->conn->lastInsertId();
            return $lastId;
        }
        return 0;
    }

    /** Read all booking activities
     * get all activities data according to one booking ID */
    public function readActivitiesDetails()
    {
        //select all data
        $query = "SELECT
                        b.idBooking,
                        ba.codeActivity, ba.dateActivity, ba.halfDaySelect, ba.idBookingActivity,
                        a.name as nameActivity
                    FROM
                        {$this->table_name} ba
                    INNER JOIN 
                        bookings b
                            ON b.idBooking = ba.idBooking
                    INNER JOIN 
                        activities a
                            ON ba.codeActivity = a.codeActivity
                    WHERE
                        ba.idBooking = :idBooking
                    ORDER BY
                        idBooking";

        //prepare query
        $stmt = $this->conn->prepare($query);

        // bind param
        $stmt->bindParam(':idBooking', $this->idBooking);

        // execute query
        $stmt->execute();

        return $stmt;
    }

    /** Read one booking activity
     * get one activity data according to its bookingActivity ID
     * used before update of one bookingActivity */
    public function readOne()
    {
        $query = "SELECT
                    ba.idBookingActivity, ba.codeActivity, ba.dateActivity, ba.halfDaySelect, a.name as nameActivity
                FROM
                    {$this->table_name} ba
                INNER JOIN
                    activities a
                        ON ba.codeActivity = a.codeActivity 
                WHERE 
                    ba.idBookingActivity = :idBookingActivity";

        //prepare query
        $stmt = $this->conn->prepare($query);

        // bind param
        $stmt->bindParam(':idBookingActivity', $this->idBookingActivity);

        // execute query
        $stmt->execute();

        return $stmt;
    }

    /** Update one booking activity
     * update all datas of one activity according to its bookingActivity ID */
    public function updateOne()
    {
        $query = "UPDATE
                    {$this->table_name}
                SET
                    codeActivity = :codeActivity, dateActivity = :dateActivity, halfDaySelect = :halfDaySelect
                WHERE 
                    idBookingActivity = :idBookingActivity";

        // prepare query
        $stmt = $this->conn->prepare($query);
        
        // bind values
        $stmt->bindParam(":codeActivity", $this->codeActivity);
        $stmt->bindParam(":dateActivity", $this->dateActivity);
        $stmt->bindParam(":halfDaySelect", $this->halfDaySelect);
        $stmt->bindParam(":idBookingActivity", $this->idBookingActivity);

        if($stmt->execute()) {
            return 1;
        }
        return 0;
    }


    /** Remove one booking activity 
     * remove one activity according to its bookingActivity ID */
    public function removeOne()
    {
        $query = "DELETE FROM
                    {$this->table_name}
                WHERE
                    idBookingActivity = :idBookingActivity";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // bind value
        $stmt->bindParam(':idBookingActivity', $this->idBookingActivity);

        // execute query
        if($stmt->execute()) {
            return 1;
        }
        return 0;
    }

    /** Remove all booking activities 
     * remove all activities of one booking according its ID */
    public function removeAll()
    {
        $query = "DELETE FROM
                    {$this->table_name}
                WHERE
                    idBooking = :idBooking";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // bind value
        $stmt->bindParam(':idBooking', $this->idBooking);

        // execute query
        if($stmt->execute()) {
            return 1;
        }
        return 0;
    }
}