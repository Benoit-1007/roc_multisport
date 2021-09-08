<?php
class User {
    // database connection and table name
    private $conn;
    private $table_name = "users";

    // object properties
    public $idUser;
    public $lastName;
    public $firstName;
    public $birthdate;
    public $size;
    public $level;


    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Create user
    public function create()
    {
        // query to insert record
        $query = "INSERT INTO 
                    {$this->table_name} (lastName, firstName, birthdate, size, level)
                VALUES 
                    (:lastName, :firstName, :birthdate, :size, :level)";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->lastName = htmlspecialchars(strip_tags($this->lastName));
        $this->firstName = htmlspecialchars(strip_tags($this->firstName));
        $this->birthdate = htmlspecialchars(strip_tags($this->birthdate));
        $this->size = htmlspecialchars(strip_tags($this->size));
        $this->level = htmlspecialchars(strip_tags($this->level));

        // bind values
        $stmt->bindParam(":lastName", $this->lastName);
        $stmt->bindParam(":firstName", $this->firstName);
        $stmt->bindParam(":birthdate", $this->birthdate);
        $stmt->bindParam(":size", $this->size);
        $stmt->bindParam(":level", $this->level);

        // execute query
        if ($stmt->execute()) {
            $lastId = $this->conn->lastInsertId();
            return $lastId;
        }
        return 0;
    }

    // Read one user with ID
    public function readOne()
    {
        $query = "SELECT
                    lastName, firstName, birthdate, size, level
                FROM 
                    {$this->table_name}
                WHERE
                    idUser = ?";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // bind value
        $stmt->bindParam(1, $this->idUser);

        //execute query
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // set values to object properties
        $this->lastName = $row['lastName'];
        $this->firstName = $row['firstName'];
        $this->birthdate = $row['birthdate'];
        $this->size = $row['size'];
        $this->level = $row['level'];

    }

    // Update one user with ID
    public function updateOne()
    {
        $query = "UPDATE
                    {$this->table_name}
                SET
                    lastName = :lastName, firstName = :firstName, birthdate = :birthdate, size = :size
                WHERE
                    idUser = :id";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->lastName = htmlspecialchars(strip_tags($this->lastName));
        $this->firstName = htmlspecialchars(strip_tags($this->firstName));
        $this->birthdate = htmlspecialchars(strip_tags($this->birthdate));
        $this->size = htmlspecialchars(strip_tags($this->size));

        // bind values
        $stmt->bindParam(":id", $this->idUser);
        $stmt->bindParam(":lastName", $this->lastName);
        $stmt->bindParam(":firstName", $this->firstName);
        $stmt->bindParam(":birthdate", $this->birthdate);
        $stmt->bindParam(":size", $this->size);


        // execute query
        if($stmt->execute()) {
            return 1;
        }
        return 0;
    }

    // Delete one user with ID
    public function remove()
    {
        $query = "DELETE FROM 
                    " . $this->table_name . "
                WHERE 
                    users.idUser = ?";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->idUser);

        if($stmt->execute()) {
            return 1;
        }
        return 0;
    }
}
