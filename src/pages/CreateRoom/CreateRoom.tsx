import { z } from "zod";
import { Room } from "@/types";
import { createRoom } from "@/api";
import { useNavigate } from "react-router-dom";
import { getFormattedDate } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSessionState } from "@/stores/SessionContext";
import CustomController from "@/components/Form/CustomController";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CustomFormContainer from "@/components/Form/CustomFormContainer";

const schema = z.object({
  roomName: z.string().min(5),
});

type IFormInput = z.infer<typeof schema>;

const CreateRoom = () => {
  const navigate = useNavigate();
  const { user } = useSessionState();
  const queryClient = useQueryClient();

  const { mutateAsync: createRoomMutation } = useMutation({
    mutationFn: (payload: Room) => {
      return createRoom(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });

  const { control, handleSubmit, formState } = useForm({
    defaultValues: {
      roomName: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<IFormInput> = async (inputData) => {
    if (!user?.id) {
      return console.error("Error: User ID is not valid");
    }

    const newRoom = {
      name: inputData.roomName,
      userId: user.id,
      createdAt: getFormattedDate(),
    };

    await createRoomMutation(newRoom as Room);
    navigate("/");
  };

  return (
    <CustomFormContainer
      title="Create Room"
      btnText="Save"
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      control={control}
      formState={formState}
    >
      <CustomController label={"Room Name"} placeholder={"Your room name"} />
    </CustomFormContainer>
  );
};

export default CreateRoom;
