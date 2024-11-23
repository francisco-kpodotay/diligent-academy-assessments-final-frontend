import { z } from "zod";
import { Room } from "@/types";
import { createRoom } from "@/api";
import { useNavigate } from "react-router-dom";
import { getFormattedDate } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSessionState } from "@/stores/SessionContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, SubmitHandler } from "react-hook-form";
import CustomFormContainer from "@/components/Form/CustomFormContainer";
import CustomController from "@/components/Form/CustomController";

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

    await createRoomMutation({ ...newRoom } as unknown as Room);
    queryClient.invalidateQueries({ queryKey: ["rooms"] });
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
