<?php
if(!empty($_POST['email']) && !empty($_POST['password'])){
    if($_POST['password'] == $_POST['password2']){
        echo 'Inscription ok';
    }else echo 'Erreur mot de passe';
}else echo 'error';
?>