import type { NextPage } from "next";
import React, { useCallback, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import contactSchema, { ContactInput } from "@/lib/validation/contact";
import { useNotification } from "@/lib/contexts/notification";
import { yupResolver } from "@hookform/resolvers/yup";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact Bound In Wickedry",
};

const Contact: NextPage = () => {
  const { toast } = useNotification();
  const [sent, setSent] = useState<boolean>(false);

  const { handleSubmit, control, reset, register } = useForm<ContactInput>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      message: "",
    },
    resolver: yupResolver(contactSchema),
  });

  const onSubmit = useCallback(async (data: any) => {
    try {
      const request = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await request.json();

      if (result.status == 201) {
        setSent(true);
      } else {
        toast("error", "Something went wrong: " + result.message);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <div className="border border-secondary p-4">
      <h2 className="font-bold  text-2xl">Send us a message</h2>
      <div className="mt-8 mb-6 flex justify-center">
        {sent ? (
          <p>
            Thank you for your message. We will get back to you as soon as
            possible!
          </p>
        ) : (
          <form
            className="p-4 bg-neutral text-neutral-content shadow-lg rounded-lg border-2 border-primary"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid grid-cols-1 gap-2">
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <label className="block">
                    <input
                      type="text"
                      placeholder="First Name"
                      className="input input-bordered w-full max-w-xs my-2 bg-base-300 text-base-content placeholder-base-content"
                      {...field}
                    />
                  </label>
                )}
              />
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <label className="block">
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="input input-bordered w-full max-w-xs my-2 bg-base-300 text-base-content placeholder-base-content"
                      {...field}
                    />
                  </label>
                )}
              />
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <label className="block">
                    <input
                      type="text"
                      placeholder="Email"
                      className="input input-bordered w-full max-w-xs my-2 bg-base-300 text-base-content placeholder-base-content"
                      {...field}
                    />
                  </label>
                )}
              />
            </div>
            <div className="my-4">
              <Controller
                name="message"
                control={control}
                render={({ field }) => (
                  <label className="block">
                    <textarea
                      placeholder="Message..."
                      className="textarea textarea-bordered w-full max-w-xs my-2 bg-base-300 text-base-content placeholder-base-content"
                      {...field}
                    ></textarea>
                  </label>
                )}
              />
            </div>
            <div className="my-2 w-1/2 lg:w-1/4">
              <button className="btn btn-secondary">Send Message</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Contact;
