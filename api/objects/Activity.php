<?php
class Activity {
    // database connection and table name
    private $conn;
    private $table_name = "activities";

    // object properties
    public $codeActivity;
    public $name;
    public $price;
    public $minCount;
    public $maxCount;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Create activity (future proof)
    public function create()
    {
        // query to insert record
        $query = "INSERT INTO 
                    {$this->table_name}
                SET
                    codeActivity = :codeActivity, name = :name, minCount = :minCount, maxCount = :maxCount";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->codeActivity = htmlspecialchars(strip_tags($this->codeActivity));
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->minCount = htmlspecialchars(strip_tags($this->minCount));
        $this->maxCount = htmlspecialchars(strip_tags($this->maxCount));

        // bind values
        $stmt->bindParam(":codeActivity", $this->codeActivity);
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":minCount", $this->minCount);
        $stmt->bindParam(":maxCount", $this->maxCount);

        // execute query
        if ($stmt->execute()) {
            $lastId = $this->conn->lastInsertId();
            return $lastId;
        }
        return 0;
    }


    // Read one activity
    public function readOne()
    {
        $query = "SELECT 
                    a.codeActivity, a.name, a.price, a.minCount, a.maxCount
                FROM
                    {$this->table_name} a
                WHERE
                    a.codeActivity = :codeActivity";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // bind param
        $stmt->bindParam(':codeActivity', $this->codeActivity);
        
        //execute query
        $stmt->execute();

        return $stmt;
    }

    // Read all activities
    public function readAll()
    {
        $query = "SELECT * From {$this->table_name}";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        // var_dump($stmt);

        return $stmt;
    }
    
    // Update one activity with codeActivity
    public function updateOne()
    {
        $query = "UPDATE
                    {$this->table_name}
                SET
                    name = :name, price = :price, minCount = :minCount, maxCount = :maxCount
                WHERE
                    codeActivity = :codeActivity";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->price = htmlspecialchars(strip_tags($this->price));
        $this->minCount = htmlspecialchars(strip_tags($this->minCount));
        $this->maxCount = htmlspecialchars(strip_tags($this->maxCount));

        // bind values
        $stmt->bindParam(":codeActivity", $this->codeActivity);
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":price", $this->price);
        $stmt->bindParam(":minCount", $this->minCount);
        $stmt->bindParam(":maxCount", $this->maxCount);

        // execute query
        if($stmt->execute()) {
            return 1;
        }
        return 0;
    }
}