type Props = {
  payload: {
    setName: (name: string) => void;
    setEmail: (email: string) => void;
    setPass: (password: string) => void;
  };
};

const RegisterForm = ({ payload }: Props) => {
  const handleNameChange = (e: any) => {
    const name = e.target.value;
    payload.setName(name);
  };

  const handleEmailChange = (e: any) => {
    const email = e.target.value;
    payload.setEmail(email);
  };

  const handlePassChange = (e: any) => {
    const pass = e.target.value;
    payload.setPass(pass);
  };

  return (
    <>
      <input
        name="name"
        type="text"
        placeholder="Type your username..."
        className="input input-bordered w-full max-w-xs my-2"
        onChange={handleNameChange}
      />

      <input
        name="email"
        type="email"
        placeholder="Type your email..."
        className="input input-bordered w-full max-w-xs"
        onChange={handleEmailChange}
      />

      <input
        name="password"
        type="password"
        placeholder="Type your password..."
        className="input input-bordered w-full max-w-xs my-2"
        onChange={handlePassChange}
      />
    </>
  );
};

export default RegisterForm;
