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
import { Room } from "@/types";
import { createRoom } from "@/api";
import { useNavigate } from "react-router-dom";
import { getFormattedDate } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSessionState } from "@/stores/SessionContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller, SubmitHandler } from "react-hook-form";

const schema = z.object({
  roomName: z.string().min(5),
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

const CreateRoomContainer = styled(Stack)(({ theme }) => ({
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

const CreateRoom = () => {
  const navigate = useNavigate();
  const {user} = useSessionState();
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
    queryClient.invalidateQueries({ queryKey: ["rooms"] })
    navigate('/')
  };

  return (
    <CreateRoomContainer direction="column" justifyContent="space-between">
      <Card variant="outlined">
        <Typography
          component="h1"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          Create Room
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Controller
            name="roomName"
            control={control}
            render={({ field }) => (
              <FormControl>
                <FormLabel htmlFor="roomName">Room Name</FormLabel>
                <TextField
                  {...field}
                  required
                  fullWidth
                  placeholder="Your room name"
                  error={!!formState.errors.roomName}
                  helperText={formState.errors.roomName?.message?.toString()}
                  color={!!formState.errors.roomName ? "error" : "primary"}
                />
              </FormControl>
            )}
          />
          <Button variant="contained" type="submit">
            Save
          </Button>
        </Box>
      </Card>
    </CreateRoomContainer>
  );
};

export default CreateRoom;
