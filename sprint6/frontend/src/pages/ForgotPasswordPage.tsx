import { Link } from "react-router-dom";
import AccountForm from "../components/forms/AccountForm";

export default function ForgotPasswordPage() {
  return (
    <>
      <h2>Şifremi Unuttum</h2>
      <AccountForm mode="forgot">
        <p><Link to="/login">Girişe dön</Link></p>
      </AccountForm>
    </>
  );
}
