import { z } from "zod";
import { Story } from "@/types";
import { createStory } from "@/api";
import { Card, Modal } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomController from "../Form/CustomController";
import { useForm, SubmitHandler } from "react-hook-form";
import CustomFormContainer from "../Form/CustomFormContainer";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const schema = z.object({
  storyName: z.string().min(2),
});

type IFormInput = z.infer<typeof schema>;

interface CreateStoryModalProps {
  roomId: string | undefined;
  open: boolean;
  doClose: () => void;
}

const CreateStoryModal: React.FC<CreateStoryModalProps> = ({
  roomId,
  open,
  doClose,
}) => {
    const queryClient = useQueryClient();

  const { mutateAsync: createStoryMutation } = useMutation({
    mutationFn: (payload: Story) => {
      return createStory(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories", "byRoomId", roomId] });
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

    try {
      await createStoryMutation(newStory as Story);
      doClose();
    } catch (error) {
      console.error("Error creating story:", error);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={doClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ width: 1 / 2, ml: 50, height: "auto", mt: 25 }}
      >
        <Card>
          <CustomFormContainer
            title="Create Story"
            btnText="Save"
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            control={control}
            formState={formState}
          >
            <CustomController
              label={"Story Name"}
              placeholder={"Your story name"}
            />
          </CustomFormContainer>
        </Card>
      </Modal>
    </>
  );
};

export default CreateStoryModal;
