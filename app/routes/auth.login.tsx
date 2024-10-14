import { Link } from "@remix-run/react";

const Login = () => {
  return (
    <div>
      Choose your authentication provider:
      <div>
        <Link to="/auth/github">Login with GitHub</Link>
      </div>
    </div>
  );
};
export default Login;
