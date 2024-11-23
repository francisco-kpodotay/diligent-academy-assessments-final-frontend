import { z } from "zod";
import { Story } from "@/types";
import { createStory } from "@/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm,  SubmitHandler } from "react-hook-form";
import CustomController from "../Form/CustomController";
import CustomFormContainer from "../Form/CustomFormContainer";

const schema = z.object({
  storyName: z.string().min(2),
});

type IFormInput = z.infer<typeof schema>;

const CreateStoryModal = ({ roomId }: { roomId: number }) => {
  //const navigate = useNavigate();
  //const {user} = useSessionState();
  const queryClient = useQueryClient();

  const { mutateAsync: createStoryMutation } = useMutation({
    mutationFn: (payload: Story) => {
      return createStory(payload);
    },
  });

  const { control, handleSubmit, formState } = useForm({
    defaultValues: {
      storyName: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<IFormInput> = async (inputData) => {
    const newStory = {
      name: inputData.storyName,
      roomId: roomId,
    };

    await createStoryMutation({ ...newStory } as unknown as Story);
    queryClient.invalidateQueries({ queryKey: ["stories"] });

    //close the modal
  };

  return (
    <CustomFormContainer
      title="Create Story"
      btnText="Save"
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      control={control}
      formState={formState}
    >
      <CustomController label={"Story Name"} placeholder={"Your story name"} />
    </CustomFormContainer>
  );
};

export default CreateStoryModal;
