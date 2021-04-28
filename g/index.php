<?php
require_once("../php/connect.php");
session_start();
include_once("../php/cookielogin.php");
if($_SESSION["loggedin"]=="yes")
	header("Location: ../index.php");
$err = array();
if(isset($_POST['register'])){
	global $err;
	include_once("../php/formvalidation.php");
	signup();
	if(empty($err)) { //inserting in database
		$pass= md5($_POST[password]);
		//echo "<script>alert('".$_POST[mobile]."');</script>"
		$name= ucwords(strtolower($_POST['name']));
		//nothing to subscribe for now
		//if(isset($_POST['subscribe']))
			//include("templates/subscribe.php");
		$query = "INSERT INTO users (name, email) VALUES ('$name', '$_POST[email]')";
		if(mysql_query($query)) {
			$user_id = mysql_insert_id();
			mysql_query("INSERT INTO password (user_id, password, method) VALUES ('$user_id', '$pass', 'first')");
			$_SESSION['loggedin']="yes";
			$_SESSION['user_id']=$user_id;
			$_SESSION['name']=$_POST['name'];
			$_SESSION['email']=$_POST['email'];
			$_SESSION['mobile']=$_POST['mobile'];
			$_SESSION['cookietime'] = time()+(60*24*60*60); //2 month time
			setcookie("_ui", $user_id['user_id'], $_SESSION['cookietime']);
			setcookie("_pedh", md5(sha1($pass.$_POST['email'])), $_SESSION['cookietime']);
			
			
			
			//send email-verification email
			$code = md5($_POST['email'].date("Y-m-d"));
			$link = "poddarri.5gbfree.com/emailverification.php?action=emailverification&email=$_POST[email]&code=$code";
			$subject = "Email Verification Link";
			$message = "<div style=\"font-family:verdana;color:#333;background-color:#5f5f5f;font-size:14px\">
			<p style=\"font-size:22px;font-weight:bold;color:F8FFF3;margin:0 0 10px 10px\">Tasks</p>
       			 <div style=\"padding:5px 10px 20px;background-color:#dedede;color:#333\">
            		<p>Hello,</p>
            		<p>&nbsp;&nbsp;We received a user registration request for this email account.</p>
            		<p>You can verify your email address by clicking on this link </p>
            		<p><a style=\"font-family:monospace\" href=".$link." target=\"_blank\"></a>".$link."</p>
           		 <p>If you havent requested for user registration then we appologize for this email. You can ignore this email and that will be just fine. We wont bug you any more.</p>
            		<p style=\"margin-bottom:2px\">Thanks,</p>
            		<p style=\"font-size:15px;margin-top:3px\">Tasks Team</p>
       			</div>
        		<p style=\"color:#f8fff3;font-size:13px;padding:0px 10px\">Please do not reply to this message; it was sent from an unmonitored email address.  This message is a service email related to your use of Tasks.  For general inquiries or to request support with your Tasks account, please mail us at <a style=\"color:#fff\" href=\"mailto:support@Tasks.com\" target=\"_blank\">support@tasks.com</a> or call us at +91 9092024765.</p><div class=\"yj6qo\"></div>
        		</div>";
			$headers  = "From: noreply@borebandar.com\r\n"; 
    			$headers .= "Content-type: text/html\r\n"; 
			mail($_POST['email'],$subject,$message, $headers);
			header("Location: ../index.php?action=profile");
		}
		else
					echo "Unable to register User at the moment. Please try again later.";
	}
}
if(!isset($_POST['register']) || !empty($err)) 
{
//include("../fbaccess.php");
if($user){
	$row = mysql_fetch_array(mysql_query("SELECT * FROM users WHERE email='$user_info[email]'"));
	if($row['email']){
		include("../php/loginsession.php");
		$fbid=$user_profile['id'];
		$pic = file_get_contents("https://graph.facebook.com/$fbid/picture?type=large");
		$path="images/dp/$_SESSION[email].jpg";
		file_put_contents($path, $pic);
		header("Location: ../index.php");
	}
	$_POST['name']=$user_info['name'];
 	$_POST['email']=$user_info['email'];
}
//header.php to contain the top portion of all pages
//include_once("templates/include/header.php");
?>

<script type="text/javascript" src="../js/jquery-2.0.3.min.js"></script>
<script type="text/javascript" src="../js/formvalidation.js"></script>
<a href="../p/">Already have an account? Log in here.</a>
<form name="form" action="<?php echo $PHP_SELF; ?>" method="post" onsubmit="return jssignup()" style="width: 70%;">
<?php
include("../registerform.php");
//No subscription form for now
//include("../subscriptionform.php");
?>
<input type="submit" name="register" value="Register" />
</form>
<?php
}
//footer.php to contain the footer portion of all pages
//include "templates/include/footer.php";
?>