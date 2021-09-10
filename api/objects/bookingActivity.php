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

    // Create bookingActivity
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

    public function readOneActivity()
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

    public function updateOneActivity()
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
}