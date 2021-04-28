<?php
require_once("../php/connect.php");
session_start();
include_once("../php/cookielogin.php");
if($_SESSION["loggedin"]=="yes")
	header("Location: index.php");
$err = array();
if(isset($_POST['signin'])) {
	include("../php/formvalidation.php");
	signin();
	global $err;
	if(empty($err)) {
		$email=$_POST['email'];
		$row = mysql_fetch_array(mysql_query("SELECT * FROM users WHERE email = '$email'"));
		if($row['email']) {
				$tryhash = md5($_POST['password']);
				$real = mysql_fetch_array(mysql_query("SELECT password FROM password WHERE id in (SELECT MAX(id) FROM password WHERE user_id='$row[user_id]')"));
				$realhash = $real['password'];
				if ($realhash == $tryhash) {
					include("../php/loginsession.php");
					header("Location: ../index.php");
				}
				else
					$err['login'] = "Username and Password do not match. Forgot password?";
		}
		else
			$err['login'] = "User not found. Are you trying to register?";
	}
}
//header.php contains the starting of each page
//include("templates/include/header.php");
?>
<style>
/*Toast Notification */
div.message {
    position: fixed;
    top: 0;
    left: 20px;
    right: 20px;
    padding: 3px;
    background: teal;
    border-radius: 0 0 3px 3px;
    display: none;
}
/*Clickable Text*/
.pointer {
cursor: pointer;
color: #2e92cf;
}
/*Clickable Text when Hovered over*/
.pointer:hover {
color: rgba(45, 173, 237, 0.8);
}

</style>
<script src="../js/formvalidation.js" ></script>
<script src="../js/jquery-2.0.3.min.js" ></script>
<script>
function forgot() {
	$(".message").fadeIn();
	setTimeout(function () {
    	$(".message").fadeOut();
	}, 1000);
	var emailval = document.getElementById("email").value;
	if (!emailval)
		alert("Enter your email-id");
	else if(!jsemail())
		alert("Invalid entry in the field: Email");
	else {
		var xmlhttp;
		if(window.XMLHttpRequest)// code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp=new XMLHttpRequest();
		else	// code for IE6, IE5
			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4  && xmlhttp.status==200)
			alert(xmlhttp.responseText);
		}
		xmlhttp.open("GET","../php/forgot.php?email="+emailval,true);
		xmlhttp.send();
	}
}
</script>
<!-- Toast Notification Message-->
<div class="message">
    Sucess! An email with instructions to reset your password has been sent.
</div>
<a href="../g/">Dont have an account? Sign Up here</a>
<form name="form"  action="<?php echo $PHP_SELF;?>" method="post" onsubmit="return jslogin()" >
<fieldset>
<legend>
Sign In
</legend>
<div>
	<input id="email" type="text" name="email" title="Enter Email" placeholder="Email" value="<?php echo $_POST['email']?>" onchange="jsemail()" pattern="([a-zA-Z0-9._-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z]+)*)" required autofocus/> 
	<span style="color:#e11" id="err-email"><?php echo $err['email']; ?></span>
</div>
<div>
	<input id="password" type="password" name="password" title="Password - Minimum 5 char" placeholder="Password" value="<?php echo $_POST['password']?>" maxlength="20" pattern="^.{5,20}$"  required/>
</div>
<div style="color:#e11" id="err-login"><?php echo $err['login']; ?></div>
<input type="submit" name="signin" value="Log In"/>
<span class="pointer" id="forgot" onclick="forgot()">Forgot Password?</span>
</fieldset>
</form>