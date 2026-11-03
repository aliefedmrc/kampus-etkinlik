import { Link } from "react-router-dom";
import AccountForm from "../components/forms/AccountForm";

export default function RegisterPage() {
  return (
    <>
      <h2>Kayıt Ol</h2>
      <AccountForm mode="register">
        <p><Link to="/login">Girişe dön</Link></p>
      </AccountForm>
    </>
  );
}
