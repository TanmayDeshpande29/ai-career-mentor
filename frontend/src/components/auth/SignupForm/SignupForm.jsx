function SignupForm() {
  return (
    <div>

      <h2>Signup</h2>

      <form>

        <input
          type="text"
          placeholder="Enter Name"
        />

        <br />

        <br />

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
          Signup
        </button>

      </form>

    </div>
  );
}

export default SignupForm;