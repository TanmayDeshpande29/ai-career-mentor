function LoginForm() {
  return (
    <div>
      <h2>Login</h2>

      <form>

        <input
          type="email"
          placeholder="Enter Email"
        />

        <br />

        <br />

        <input
          type="password"
          placeholder="Enter Password"
        />

        <br />

        <br />

        <button>
          Login
        </button>

      </form>

    </div>
  );
}

export default LoginForm;