<?php
class Activities {
    // database connection and table name
    private $conn;
    private $table_name = "activities";

    // object properties
    public $codeActivity;
    public $name;
    public $minCount;
    public $maxCount;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Create activity
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
}