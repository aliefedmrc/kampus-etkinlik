import { Link } from "react-router-dom";
import AccountForm from "../components/forms/AccountForm";

export default function LoginPage() {
  return (
    <>
      <h2>Giriş Yap</h2>
      <AccountForm mode="login">
        <p><Link to="/forgot-password">Şifremi Unuttum</Link></p>
        <p><Link to="/register">Kayıt Ol</Link></p>
      </AccountForm>
    </>
  );
}
