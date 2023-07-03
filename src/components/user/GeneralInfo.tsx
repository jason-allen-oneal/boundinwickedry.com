import { ChangeEvent, useCallback, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import dashboardSchema, { DashboardInput } from "@/lib/validation/dashboard";
import { useNotification } from "@/lib/contexts/notification";
import { yupResolver } from "@hookform/resolvers/yup";

type Props = {
  user: User;
};

const UserGeneralInfo = ({ user }: Props) => {
  const [file, setFile] = useState<File>();
  const { toast } = useNotification();

  const onFileUploadChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      toast('error', "Files list is empty");
      return;
    }

    for (let i = 0; i < e.target.files.length; i++) {
      const fileInput = e.target.files[i];

      if (!fileInput.type.startsWith("image")) {
        toast('error', `File '${fileInput.name}' is invalid`);
      }

      setFile(file);
    }
  };

  const { handleSubmit, control } = useForm<DashboardInput>({
    defaultValues: {
      username: user?.name || "",
      email: user?.email || "",
      password: "",
      bio: user?.bio || "",
    },
    resolver: yupResolver(dashboardSchema),
  });

  const onSubmit = useCallback(
    async (data: DashboardInput) => {
      const input: DashboardInput = {
        username: data.username,
        email: data.email,
        bio: data.bio,
        password: "",
      };

      if (data.password !== "Password") {
        input.password = data.password;
      }

      try {
        const formData = new FormData();
        formData.append('username', input.username as string);
        formData.append('email', input.email as string);
        formData.append('bio', input.bio as string);
        formData.append('password', input.password as string);

        const request = await fetch("/api/user/profile", {
          method: "POST",
          body: JSON.stringify(formData),
        });

        const result = await request.json();

        if (result.status === 201) {
          // toast success
          toast('success', "You have updated your information!");
        } else {
          // toast error
          toast('error', "Something went wrong: " + result.message);
        }
      } catch (err) {
        console.error(err);
      }
    },
    [toast]
  );

  return (
    <form
      className="max-w-md border-primary border-2 rounded bg-base-200 text-base-content mx-auto p-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="avatar">
        <div className="w-24 rounded-xl">
          <img src={`/images/avatars/${user?.avatar}`} />
        </div>
      </div>

      <div className="form-control my-4">
        <label className="input-group input-group-vertical">
          <span className="text-base-content">Avatar</span>
          <input
            type="file"
            onChange={(e) => onFileUploadChange(e)}
            className="file-input file-input-sm file-input-bordered w-full text-base-content placeholder-base-content"
          />
        </label>
      </div>

      <Controller
        name="username"
        control={control}
        defaultValue={user?.name}
        render={({ field }) => (
          <div className="form-control my-4">
            <label className="input-group input-group-vertical">
              <span className="text-base-content">Username</span>
              <input
                type="text"
                className="input input-bordered border-secondary w-full max-w-xs my-2"
                {...field}
              />
            </label>
          </div>
        )}
      />

      <Controller
        name="email"
        control={control}
        defaultValue={user?.email}
        render={({ field }) => (
          <div className="form-control my-4">
            <label className="input-group input-group-vertical">
              <span className="text-base-content">Email</span>
              <input
                type="text"
                placeholder="info@site.com"
                className="input input-bordered border-secondary w-full max-w-xs my-2"
                {...field}
              />
            </label>
          </div>
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <div className="form-control my-4">
            <label className="input-group input-group-vertical">
              <span className="text-base-content">Password</span>
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered border-secondary w-full max-w-xs my-2"
                {...field}
              />
            </label>
          </div>
        )}
      />

      <Controller
        name="bio"
        control={control}
        render={({ field }) => (
          <div className="form-control my-4">
            <label className="input-group input-group-vertical">
              <span className="text-base-content">Bio</span>
              <textarea
                rows={4}
                className="textarea textarea-bordered border-secondary w-full max-w-xs my-2"
                {...field}
              ></textarea>
            </label>
          </div>
        )}
      />

      <button
        id="profileSubmit"
        type="submit"
        className="btn btn-primary mt-4"
      >
        Update Profile
      </button>
    </form>
  );
};

export default UserGeneralInfo;
