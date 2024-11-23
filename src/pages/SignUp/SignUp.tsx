import { useSessionDispatch } from "@/stores/SessionContext";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { User } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { createUser } from "@/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomController from "@/components/Form/CustomController";
import CustomFormContainer from "@/components/Form/CustomFormContainer";

const schema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
});

type IFormInput = z.infer<typeof schema>;

const SignUp = () => {
  const { login } = useSessionDispatch();
  const navigate = useNavigate();

  const { mutateAsync: createUserMutation } = useMutation({
    mutationFn: (payload: User) => {
      return createUser(payload);
    },
  });

  const { control, handleSubmit, formState } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<IFormInput> = async (inputData) => {
    try {
      const respons = await createUserMutation({
        ...inputData,
      } as unknown as User);
      const data = await respons.json();
      login({ ...data.user } as unknown as User);
      return navigate("/");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <CustomFormContainer
      title="Sign Up"
      btnText="Sign Up"
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      control={control}
      formState={formState}
    >
      <CustomController label={"First Name"} placeholder={"Your first name"} />
      <CustomController label={"Last Name"} placeholder={"Your last name"} />
      <CustomController label={"Email"} placeholder={"Your email address"} />
    </CustomFormContainer>
  );
};

export default SignUp;
