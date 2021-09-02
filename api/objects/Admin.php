<?php

class Admin {
    // database connection and table name
    private $conn;
    private $table_name = "admin";

    // object properties
    public $idAdmin;
    public $lastName;
    public $firstName;
    public $mail;
    public $password;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function create()
    {
        $query = "INSERT INTO 
                    {$this->table_name}
                SET 
                    lastName = :lastName, firstName = :firstName, mail = :mail, password = :password";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->lastName = htmlspecialchars(strip_tags($this->lastName));
        $this->firstName = htmlspecialchars(strip_tags($this->firstName));
        $this->mail = htmlspecialchars(strip_tags($this->mail));

        // bind values
        $stmt->bindParam(":lastName", $this->lastName);
        $stmt->bindParam(":firstName", $this->firstName);
        $stmt->bindParam(":mail", $this->mail);
        $stmt->bindParam(":password", password_hash($this->password, PASSWORD_DEFAULT));
        

        // execute query
        if ($stmt->execute()) {
            $lastId = $this->conn->lastInsertId();
            return $lastId;
        }
    }

    /** Find admin by email
     * @param string $mail
     */
    public function findByEmail(string $email) {
        $query = "SELECT 
                    idAdmin, lastName, firstName, mail, password
                FROM 
                    {$this->table_name} 
                WHERE 
                    mail = :mail";
        
        // prepare query
        $stmt = $this->conn->prepare($query);

        // bind values
        $stmt->bindParam(":mail", $email);

        // execute query
        $stmt->execute();

        $user = $stmt->fetch();

        return $user;
    }

}