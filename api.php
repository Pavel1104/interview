<?php
  header("Content-Type: application/json");
  header('Access-Control-Allow-Origin: *');

  $file = new File();

  if ( $_GET['action'] == 'index' ) {
    $data = $file -> get_data();

    $json = json_encode($data);
    if ($json === false) {
      $json = json_encode( array( "jsonError", json_last_error_msg() ) );
      http_response_code(500);
    } else {
      echo $json;
    }
  }

  if ( $_POST['action'] == 'update' ) {
    $data = $_POST['data'];
    $file -> update_data( $data );
  }
?>

<?php
  class File {
    function __construct( $file_name = 'data.json') {
      $this->file_name = $file_name;
    }

    function get_data ( ) {
      return trim ( file_get_contents ( $this->file_name ) );
    }

    function update_data ( $data ) {
      $handle = fopen($this->file_name, "wb");
      fwrite ($handle, $data);
      fclose($file_name);
    }
  }
?>
