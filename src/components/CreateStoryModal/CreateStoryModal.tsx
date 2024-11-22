import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  FormLabel,
  Stack,
  styled,
  Card as MuiCard,
} from "@mui/material";
import { z } from "zod";
import {  Story } from "@/types";
import {  createStory } from "@/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller, SubmitHandler } from "react-hook-form";

const schema = z.object({
  storyName: z.string().min(2),
});

type IFormInput = z.infer<typeof schema>;

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const CreateStoryModalContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  backgroundImage:
    "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
  backgroundRepeat: "no-repeat",
  ...theme.applyStyles("dark", {
    backgroundImage:
      "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
  }),
}));

const CreateStoryModal = ({roomId}:{roomId: number}) => {
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
    queryClient.invalidateQueries({ queryKey: ["stories"] })

    //close the modal
  };

  return (
    <CreateStoryModalContainer direction="column" justifyContent="space-between">
      <Card variant="outlined">
        <Typography
          component="h1"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          Create Story
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Controller
            name="storyName"
            control={control}
            render={({ field }) => (
              <FormControl>
                <FormLabel htmlFor="storyName">Story Name</FormLabel>
                <TextField
                  {...field}
                  required
                  fullWidth
                  placeholder="Your story name"
                  error={!!formState.errors.storyName}
                  helperText={formState.errors.storyName?.message?.toString()}
                  color={!!formState.errors.storyName ? "error" : "primary"}
                />
              </FormControl>
            )}
          />
          <Button variant="contained" type="submit">
            Save
          </Button>
        </Box>
      </Card>
    </CreateStoryModalContainer>
  );
};

export default CreateStoryModal;
